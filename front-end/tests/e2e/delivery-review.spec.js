import {test,expect} from '@playwright/test';

async function setup(page,{preferences=false,conflict=false,race=false}={}){
 let open=true,claimed=false;const writes=[];
 const brief={id:'review-job',kind:'order',title:'Deliver bowls (2)',mode:'broadcast',status:'awaiting_acceptance',sellerName:'Artisan Shop',orgName:'HopeConnect',pickupAddress:'Shop 12, Market Road, Mumbai 400001',address:'Flat 8, Lake View, Pune 411001',contact:'9812345678',scheduledDate:'2099-01-05',shiftStart:'10:00',shiftEnd:'11:00',requirements:'Fragile parcel. Carry upright.',items:[{name:'Handmade bowl',quantity:2}],reviewedVersion:'review-v1',available:true,conflicts:conflict?['another accepted shift']:[],eligibility:{eligible:!preferences&&!conflict,reasons:conflict?['Conflicts with another accepted shift']:preferences?['Shift includes unavailable weekdays']:[]},blockers:[]};
 await page.route('http://localhost:3000/**',route=>{
  const req=route.request(),url=new URL(req.url());
  if(req.method()!=='GET'){
   writes.push({path:url.pathname,body:req.postDataJSON()});
   if(race){claimed=true;return route.fulfill({status:409,json:{success:false,message:'Already assigned or no longer available. Refresh delivery offers.'}});}
   open=false;return route.fulfill({json:{success:true,data:{id:brief.id,status:'accepted',volunteerEmail:'volunteer@kindred.org'}}});
  }
  if(url.pathname.endsWith('/brief'))return claimed?route.fulfill({status:403,json:{success:false,message:'This delivery is no longer offered to you'}}):route.fulfill({json:{success:true,data:brief}});
  const data=url.pathname==='/fulfillment/portal'&&open?[{id:brief.id,kind:'order',title:brief.title,mode:'broadcast',status:'awaiting_acceptance',pickupArea:'Mumbai',destinationArea:'Pune',scheduledDate:brief.scheduledDate,shiftStart:brief.shiftStart,shiftEnd:brief.shiftEnd,pickupAddress:'Details shared after acceptance',address:'Details shared after acceptance'}]:[];
  return route.fulfill({json:{success:true,data}});
 });
 await page.goto('/');await page.evaluate(()=>sessionStorage.setItem('kindred_session',JSON.stringify({id:'vol',name:'Priya',role:'volunteer',email:'volunteer@kindred.org',org:'HopeConnect',status:'approved'})));await page.goto('/volunteer-portal');
 return {writes,brief};
}

test('full details appear before acceptance and consent assigns the delivery',async({page})=>{
 const {writes,brief}=await setup(page);
 await page.getByRole('button',{name:'Apply & Accept Delivery',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Review delivery details',exact:true});
 await expect(dialog).toContainText(brief.pickupAddress);await expect(dialog).toContainText(brief.address);await expect(dialog).toContainText('Handmade bowl — 2');await expect(dialog).toContainText(brief.requirements);await expect(dialog).toContainText('Asia/Kolkata');
 expect(writes).toHaveLength(0);await expect(dialog.getByRole('button',{name:'Accept Delivery',exact:true})).toBeDisabled();
 await dialog.getByRole('checkbox').check();await dialog.getByRole('button',{name:'Accept Delivery',exact:true}).click();
 await expect(dialog.getByRole('status')).toContainText('You are assigned');expect(writes).toEqual([{path:'/fulfillment/deliveries/review-job/action',body:{action:'accept',confirmAvailability:true,reviewedVersion:'review-v1'}}]);
 await expect(page.locator('[data-portal-delivery-id="review-job"]')).toHaveCount(0);
});

test('a weekday preference mismatch is explained and explicit one-job consent allows acceptance on mobile',async({page})=>{
 const {writes}=await setup(page,{preferences:true});await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'View Full Details',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Review delivery details',exact:true});
 await expect(dialog).toContainText('Shift includes unavailable weekdays');await expect(dialog).toContainText('Your saved preferences will stay unchanged');await expect(dialog.getByRole('checkbox')).toBeEnabled();
 const box=await dialog.locator('.modal-box').boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(391);
 await dialog.locator('.modal-box').screenshot({path:'test-results/delivery-review-mobile.png'});
 await dialog.getByRole('checkbox').check();await dialog.getByRole('button',{name:'Accept Delivery',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('You are assigned');expect(writes[0].body.confirmAvailability).toBe(true);
});

test('conflicting work is highlighted and the volunteer can accept after acknowledging it',async({page})=>{
 const {writes}=await setup(page,{conflict:true});await page.getByRole('button',{name:'View Full Details',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Review delivery details',exact:true});
 await expect(dialog.getByRole('note')).toContainText('another accepted shift');
 await dialog.getByRole('checkbox',{name:/I reviewed the full route/}).check();await expect(dialog.getByRole('button',{name:'Accept Delivery',exact:true})).toBeDisabled();
 await dialog.getByRole('checkbox',{name:/I understand this conflict/}).check();await dialog.getByRole('button',{name:'Accept Delivery',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('You are assigned');expect(writes[0].body).toMatchObject({confirmConflict:true,confirmAvailability:true});
});

test('a competing acceptance shows the real error and reloads the latest availability',async({page})=>{
 await setup(page,{race:true});await page.getByRole('button',{name:'Apply & Accept Delivery',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Review delivery details',exact:true});
 await dialog.getByRole('checkbox').check();await dialog.getByRole('button',{name:'Accept Delivery',exact:true}).click();await expect(dialog.getByRole('alert')).toContainText('Already assigned');
 await dialog.getByRole('button',{name:'Reload Latest Details',exact:true}).click();await expect(dialog.getByRole('alert')).toContainText('no longer offered to you');await expect(dialog.getByRole('button',{name:'Accept Delivery',exact:true})).toHaveCount(0);await expect(dialog.getByRole('status')).toHaveCount(0);
});
