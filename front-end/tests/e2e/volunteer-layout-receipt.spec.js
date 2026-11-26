import { API_BASE } from '../apiBase.js';
import {test,expect} from '@playwright/test';

async function setupVolunteer(page){
 const volunteer={id:'vol_001',name:'Priya',email:'volunteer@kindred.org',status:'active',availableNow:true,currentLocation:'Andheri East, Mumbai',availableFrom:'2099-01-01',availableUntil:'2099-12-31',availabilityDays:['Monday','Wednesday','Friday'],serviceAreas:'Mumbai, Thane',willingToTravel:true};
 const program={id:'program-one',name:'Community health and education support',org:'HopeConnect',status:'active'};
 const tasks=[{id:'task-one',title:'Coordinate community supplies and report the completed handover',status:'pending'},{id:'task-two',title:'Prepare learning materials',status:'in-progress'}].map(task=>({...task,programId:program.id,programName:program.name,assignedToEmail:volunteer.email,assignedToName:volunteer.name,description:'Coordinate with the program team and report progress.'}));
 await page.route(`${API_BASE}/**`,route=>{
  const req=route.request(),url=new URL(req.url()),key=url.pathname.split('/')[1];
  if(req.method()!=='GET'){Object.assign(volunteer,req.postDataJSON());return route.fulfill({json:{success:true,data:volunteer}});}
  const data=key==='volunteers'?volunteer:key==='programs'||url.pathname==='/program-assignments/my-programs'?[program]:key==='program-assignments'?[{id:'assignment-one',programId:program.id,programName:program.name,volunteerEmail:volunteer.email,volunteerName:volunteer.name,status:'active',history:[]}]:key==='tasks'?tasks:[];
  return route.fulfill({json:{success:true,data}});
 });
 await page.goto('/');await page.evaluate(()=>sessionStorage.setItem('kindred_session',JSON.stringify({id:'vol',name:'Priya',role:'volunteer',email:'volunteer@kindred.org',org:'HopeConnect',status:'approved'})));await page.goto('/volunteer-dashboard');
}

for(const width of [1440,390])test(`availability and volunteer progress fit at ${width}px`,async({page})=>{
 await setupVolunteer(page);await page.setViewportSize({width,height:1000});
 const presence=page.getByRole('region',{name:'Availability & current location',exact:true}),progress=page.getByRole('region',{name:'Volunteer Progress',exact:true});
 await expect(presence.getByRole('textbox',{name:'Current location',exact:true})).toHaveValue('Andheri East, Mumbai');await expect(progress).toContainText('Coordinate community supplies');
 for(const section of [presence,progress]){const box=await section.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width+1);}
 const button=presence.getByRole('button',{name:'Save location',exact:true}),box=await button.boundingBox();expect(box.height).toBeGreaterThanOrEqual(42);
 await expect(presence.getByRole('checkbox',{name:'Monday',exact:true})).toBeChecked();await expect(presence.getByRole('checkbox',{name:'Tuesday',exact:true})).not.toBeChecked();
 await page.setViewportSize({width,height:2400});
 await presence.screenshot({path:`test-results/volunteer-availability-${width}.png`});await progress.screenshot({path:`test-results/volunteer-progress-${width}.png`});
 await presence.getByRole('textbox',{name:'Current location',exact:true}).fill('Thane');await button.click();await expect(presence.getByRole('status')).toContainText('Saved');
});

test('buyer confirms original and replacement receipt and sees the recorded status',async({page})=>{
 const writes=[],order={id:'order-one',productTitle:'Handmade bowl',quantity:1,total:100,buyerEmail:'donor@kindred.org',address:'Buyer address',deliveryStatus:'in_transit',paymentStatus:'paid'},replacement={id:'replacement-one',orderId:order.id,productTitle:order.productTitle,quantity:1,buyerEmail:order.buyerEmail,status:'replacement_in_transit',history:[]};
 await page.route(`${API_BASE}/**`,route=>{
  const req=route.request(),url=new URL(req.url());
  if(req.method()!=='GET'){writes.push(url.pathname);(url.pathname.startsWith('/orders/')?order:replacement).buyerReceivedAt='2026-11-02T12:00:00Z';return route.fulfill({json:{success:true,data:{}}});}
  const data=url.pathname.startsWith('/orders/by-buyer/')?[order]:url.pathname.startsWith('/replacements/by-buyer/')?[replacement]:[];return route.fulfill({json:{success:true,data}});
 });
 await page.goto('/');await page.evaluate(()=>sessionStorage.setItem('kindred_session',JSON.stringify({id:'donor',name:'Buyer',role:'donor',email:'donor@kindred.org',status:'approved'})));await page.goto('/donor-dashboard');
 const panel=page.getByRole('region',{name:'Purchases and replacements',exact:true});
 const orderCard=panel.locator('article').filter({has:page.getByRole('heading',{name:'Handmade bowl',exact:true})}).filter({hasText:'Payment:'});
 await orderCard.getByRole('button',{name:'Received',exact:true}).click();await expect(orderCard.locator('.buyer-received-status')).toContainText('Received');await expect(orderCard.getByRole('button',{name:'Received',exact:true})).toHaveCount(0);
 const replacementCard=page.locator('[data-replacement-id="replacement-one"]');await replacementCard.getByRole('button',{name:'Received',exact:true}).click();await expect(replacementCard.locator('.buyer-received-status')).toContainText('Replacement received');
 expect(writes).toEqual(['/orders/order-one/received','/replacements/replacement-one/received']);
});
