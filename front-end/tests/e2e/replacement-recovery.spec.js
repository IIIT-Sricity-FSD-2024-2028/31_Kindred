import { test, expect } from '@playwright/test';

const volunteer={id:'v1',name:'Priya',email:'volunteer@kindred.org',status:'active',eligible:true,availableNow:true,currentLocation:'Mumbai',willingToTravel:true,reasons:[],warnings:[]};
async function session(page,role){await page.evaluate(s=>sessionStorage.setItem('kindred_session',JSON.stringify(s)),{id:role,role,name:'Tester',email:`${role}@kindred.org`,org:'HopeConnect',status:'approved'});await page.goto(`/${role}-dashboard`,{waitUntil:'domcontentloaded'});}
async function setup(page,status='requested'){
 const claim={id:'claim',orderId:'order',productTitle:'Handmade bag',sellerId:'seller_001',buyerEmail:'donor@kindred.org',buyerName:'Buyer',organizationName:'HopeConnect',reason:'Damaged',description:'Stitching is torn',status,quantity:1,stockReserved:status!=='requested',history:[]},writes=[];
 await page.route('http://localhost:3000/**',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(req.method()!=='GET'){
    const body=req.postDataJSON();writes.push({path:url.pathname,body});
    if(url.pathname.endsWith('/approve')){claim.status='approved';claim.stockReserved=true;}
    if(url.pathname.endsWith('/assign-volunteer'))Object.assign(claim,{status:'volunteer_invited',schedule:body.schedule,destinationArea:body.destinationArea,requirements:body.requirements,assignedVolunteerEmail:body.volunteerEmail,assignedVolunteerName:'Priya'});
    if(url.pathname.endsWith('/action')){if(body.action==='accept')claim.status='volunteer_assigned';if(body.action==='failed')claim.status='failed';if(['return','withdraw','decline'].includes(body.action))claim.status='approved';}
    if(url.pathname.endsWith('/status'))claim.status=body.status;
    return route.fulfill({json:{success:true,data:{...claim}}});
  }
  let data=[];
  if(url.pathname==='/participation/candidates')data=[volunteer];
  if(url.pathname==='/sellers')data=[{id:'seller_001',email:'seller@kindred.org',name:'Seller',status:'approved'}];
  if(url.pathname.startsWith('/replacements/by-seller/')||url.pathname.startsWith('/replacements/by-volunteer/'))data=[claim];
  if(url.pathname==='/fulfillment/volunteers')data=[volunteer];
  return route.fulfill({json:{success:true,data}});
 });
 await page.goto('/');await session(page,'seller');return {claim,writes};
}

test('replacement needs approval and scheduling before volunteer consent; failures return for a safe retry',async({page})=>{
 test.setTimeout(60000);
 const {writes}=await setup(page);
 const card=page.locator('[data-replacement-id="claim"]');
 await expect(card.getByRole('button',{name:'Invite pickup volunteer'})).toHaveCount(0);
 await card.getByRole('button',{name:'Approve & reserve stock'}).click();await card.getByRole('button',{name:'Invite pickup volunteer'}).click();
 const modal=page.getByRole('dialog');await modal.getByLabel('Delivery date',{exact:true}).fill('2099-01-01');await modal.getByLabel('Window starts').fill('10:00');await modal.getByLabel('Window ends').fill('12:00');await modal.getByLabel('Pickup area / city').fill('Mumbai');await modal.getByLabel('Destination area / city').fill('Mumbai');await modal.getByLabel('Load, transport and work instructions').fill('Collect damaged bag, exchange at seller, deliver replacement');await modal.getByLabel('Volunteer',{exact:true}).selectOption(volunteer.email);await modal.getByRole('button',{name:'Confirm',exact:true}).click();
 expect(writes.find(w=>w.path.endsWith('/assign-volunteer')).body.schedule).toMatchObject({startDate:'2099-01-01',shiftStart:'10:00',location:'Mumbai'});
 await session(page,'volunteer');await expect(card).toContainText('Collect damaged bag');await expect(card.getByRole('button',{name:'Confirm return pickup'})).toHaveCount(0);await card.getByRole('button',{name:'Accept replacement pickup'}).click();await card.getByRole('button',{name:'Confirm return pickup'}).click();await card.getByRole('button',{name:'Report replacement failure'}).click();await page.getByRole('dialog').getByLabel('Reason',{exact:true}).fill('Unable to reach recipient');await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();await expect(card).toContainText('failed');
 await session(page,'seller');await expect(card.getByRole('button',{name:'Invite pickup volunteer'})).toHaveCount(0);await card.getByRole('button',{name:'Confirm all goods returned / retry'}).click();await page.getByRole('dialog').getByLabel('Reason',{exact:true}).fill('Both original and reserved replacement checked into stock');await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();await expect(card.getByRole('button',{name:'Invite pickup volunteer'})).toBeVisible();
 await page.setViewportSize({width:390,height:844});await card.screenshot({path:'test-results/replacement-recovery-mobile.png'});
});
