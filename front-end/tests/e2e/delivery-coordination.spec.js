import { API_BASE } from '../apiBase.js';
import {test,expect} from '@playwright/test';

const org={id:'org_001',name:'HopeConnect',status:'active'};
const seller={id:'seller_001',name:'Artisan',email:'seller@kindred.org',businessName:'Artisan Shop',status:'approved',pickupAddress:'Shop 12, Mumbai 400001'};
const order={id:'order-one',sellerId:seller.id,productTitle:'Handmade bowl',quantity:1,organizationName:org.name,address:'Flat 8, Pune 411001',deliveryStatus:'awaiting_admin_assignment',total:100};
const claim={id:'claim-one',orderId:order.id,sellerId:seller.id,sellerName:seller.businessName,productTitle:order.productTitle,quantity:1,organizationName:org.name,status:'approved',reason:'Damaged',description:'Broken bowl',pickupAddress:order.address,returnAddress:seller.pickupAddress,history:[]};
const schedule={scheduledDate:'2099-01-05',shiftStart:'10:00',shiftEnd:'11:00',pickupArea:'Mumbai',destinationArea:'Pune'};
const delivery={id:'delivery-one',kind:'order',sourceId:order.id,title:'Deliver Handmade bowl (1)',orgName:org.name,status:'awaiting_acceptance',mode:'broadcast',pickupAddress:'Details shared after acceptance',address:'Details shared after acceptance',...schedule,history:[]};
async function setup(page,role,{portal=false,resource=false,replacement=false}={}){
 const data={orders:[structuredClone(order)],deliveries:portal?[structuredClone(delivery)]:[],claims:replacement?[{...claim,...(portal?{status:'portal_open',mode:'broadcast',schedule:{startDate:schedule.scheduledDate,endDate:schedule.scheduledDate,shiftStart:schedule.shiftStart,shiftEnd:schedule.shiftEnd,location:'Pune -> Mumbai'},destinationArea:'Mumbai'}:{})}]:[]},writes=[],reads=[];
 await page.route(`${API_BASE}/**`,route=>{
  const req=route.request(),url=new URL(req.url()),key=url.pathname.split('/')[1];
  if(req.method()!=='GET'){
   const body=req.postDataJSON();writes.push({path:url.pathname,body});
   if(url.pathname==='/fulfillment/deliveries')data.deliveries.push({...delivery,...body});
   if(url.pathname===`/fulfillment/deliveries/${delivery.id}/action`)data.deliveries=[];
   if(url.pathname===`/replacements/${claim.id}/offer`)Object.assign(data.claims[0],{status:'portal_open',mode:body.mode});
   if(url.pathname===`/replacements/${claim.id}/action`)Object.assign(data.claims[0],{status:'volunteer_assigned',assignedVolunteerEmail:'volunteer@kindred.org'});
   return route.fulfill({json:{success:true,data:{}}});
  }
  reads.push(url.pathname);
  let rows=key==='organizations'?[org]:key==='sellers'?[seller]:key==='orders'?(url.pathname.includes('by-buyer')?[]:data.orders):key==='replacements'?(url.pathname.includes('by-buyer')?[]:data.claims):[];
  if(key==='volunteers')rows={id:'vol_001',name:'Priya',email:'volunteer@kindred.org',status:'active',availableNow:true,currentLocation:'Mumbai'};
  if(url.pathname.endsWith('/brief'))rows={...delivery,id:key==='replacements'?claim.id:delivery.id,kind:key==='replacements'?'replacement':'order',title:key==='replacements'?'Replacement: Handmade bowl':delivery.title,pickupAddress:key==='replacements'?order.address:seller.pickupAddress,address:key==='replacements'?seller.pickupAddress:order.address,finalAddress:key==='replacements'?order.address:undefined,sellerName:seller.businessName,items:[{name:order.productTitle,quantity:1}],available:true,eligibility:{eligible:true,reasons:[]},blockers:[],reviewedVersion:'version-one'};
  if(url.pathname.endsWith('/addresses'))rows=url.pathname.startsWith('/replacements/')?{sellerPickupAddress:seller.pickupAddress,buyerAddress:order.address}:{pickupAddress:seller.pickupAddress,address:order.address};
  if(['/fulfillment/deliveries','/fulfillment/portal'].includes(url.pathname))rows=data.deliveries;
  if(url.pathname==='/fulfillment/candidates')rows=[{id:'vol_001',name:'Priya',email:'volunteer@kindred.org',eligible:true,availableNow:true,currentLocation:'Mumbai',reasons:[],warnings:[]},{id:'vol_002',name:'Unavailable person',email:'other@volunteer.com',eligible:false,availableNow:false,currentLocation:'Mumbai',reasons:['Volunteer must switch Available now on'],warnings:[]}];
  if(url.pathname==='/fulfillment/requests'&&resource)rows=[{id:'request-one',orgName:org.name,resource:'Rice',unit:'kg',quantity:4,approvedQuantity:4,status:'approved',name:'Recipient',address:'Pune recipient address',reason:'Food assistance',message:'Stock reserved',allocations:[],history:[]}];
  return route.fulfill({json:{success:true,data:rows}});
 });
 await page.goto('/');await page.evaluate(session=>sessionStorage.setItem('kindred_session',JSON.stringify(session)),{id:'actor-test',name:'Tester',role,email:`${role}@kindred.org`,org:org.name,status:'approved'});
 await page.goto(portal?'/volunteer-portal':role==='admin'?'/org-admin#resources':`/${role}-dashboard`);
 return {writes,reads};
}
async function fillSchedule(dialog){
 await expect(dialog).toBeVisible();
 if(await dialog.getByLabel('Pickup date',{exact:true}).count()){await dialog.getByLabel('Pickup date',{exact:true}).fill(schedule.scheduledDate);await dialog.getByLabel('Pickup window starts',{exact:true}).fill(schedule.shiftStart);await dialog.getByLabel('Pickup window ends',{exact:true}).fill(schedule.shiftEnd);return;}
 await dialog.getByLabel('Delivery date',{exact:true}).fill(schedule.scheduledDate);
 await dialog.getByLabel('Window starts',{exact:true}).fill(schedule.shiftStart);
 await dialog.getByLabel('Window ends',{exact:true}).fill(schedule.shiftEnd);
 await dialog.getByLabel('Pickup area / city',{exact:true}).fill(schedule.pickupArea);
 await dialog.getByLabel('Destination area / city',{exact:true}).fill(schedule.destinationArea);
}

test('seller posts shop delivery to portal without volunteer selection or directory requests',async({page})=>{
 const {writes,reads}=await setup(page,'seller');
 await page.getByRole('button',{name:'Post Delivery to Portal',exact:true}).click();const dialog=page.getByRole('dialog');
 await fillSchedule(dialog);await expect(dialog.getByRole('combobox',{name:'Volunteer',exact:true})).toHaveCount(0);
 await expect(dialog).toContainText('The first eligible volunteer');
 await dialog.getByRole('button',{name:'Post to Portal',exact:true}).click();await expect.poll(()=>writes.length).toBe(1);
 expect(writes[0]).toMatchObject({path:'/fulfillment/deliveries',body:{kind:'order',sourceId:order.id,mode:'broadcast',scheduledDate:schedule.scheduledDate,shiftStart:schedule.shiftStart,shiftEnd:schedule.shiftEnd,pickupAddress:seller.pickupAddress}});
 expect(reads).not.toContain('/fulfillment/candidates');expect(reads).not.toContain('/fulfillment/volunteers');
});

test('admin assigns a particular available volunteer for resource delivery with a full schedule',async({page})=>{
 const {writes}=await setup(page,'admin',{resource:true});await page.getByRole('button',{name:'Arrange Resource Delivery',exact:true}).click();
 const dialog=page.getByRole('dialog');await fillSchedule(dialog);await dialog.getByRole('combobox',{name:'Assignment method',exact:true}).selectOption('direct');
 await expect(dialog.getByRole('combobox',{name:'Volunteer',exact:true}).locator('option')).toHaveCount(3);
 await expect(dialog.getByRole('combobox',{name:'Volunteer',exact:true}).locator('option[value="other@volunteer.com"]')).toHaveAttribute('disabled','');
 await dialog.getByRole('combobox',{name:'Volunteer',exact:true}).selectOption('volunteer@kindred.org');
 await dialog.getByLabel('Exact Organization Collection Address',{exact:true}).fill('HopeConnect warehouse, Mumbai');
 await dialog.getByRole('button',{name:'Submit',exact:true}).click();await expect.poll(()=>writes.length).toBe(1);
 expect(writes[0]).toMatchObject({path:'/fulfillment/deliveries',body:{kind:'resource',sourceId:'request-one',mode:'direct',volunteerEmail:'volunteer@kindred.org',collectionAddress:'HopeConnect warehouse, Mumbai',...schedule}});
});

test('volunteer portal displays delivery jobs and applying accepts the delivery',async({page})=>{
 const {writes}=await setup(page,'volunteer',{portal:true});const panel=page.getByRole('region',{name:'Delivery and replacement opportunities',exact:true});
 await expect(panel).toContainText('Mumbai');await expect(panel).toContainText('Pune');await expect(panel).not.toContainText(seller.pickupAddress);
 await panel.getByRole('button',{name:'Apply & Accept Delivery',exact:true}).click();const review=page.getByRole('dialog',{name:'Review delivery details',exact:true});await review.getByRole('checkbox').check();await review.getByRole('button',{name:'Accept Delivery',exact:true}).click();await expect(review.getByRole('status')).toContainText('You are assigned');
 expect(writes[0]).toMatchObject({path:'/fulfillment/deliveries/delivery-one/action',body:{action:'accept',confirmAvailability:true}});
 await expect(panel.getByRole('button',{name:'Apply & Accept Delivery',exact:true})).toHaveCount(0);
});

test('org admin has no shop posting or seller coordination controls',async({page})=>{
 await setup(page,'admin');await expect(page.getByRole('button',{name:'Post Delivery to Portal',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Request Volunteer from Org Admin',exact:true})).toHaveCount(0);
});

test('seller replacement scheduling posts directly to portal',async({page})=>{
 const {writes,reads}=await setup(page,'seller',{replacement:true});const card=page.locator('[data-replacement-id="claim-one"]');
 await card.getByRole('button',{name:'Post Replacement to Portal',exact:true}).click();const dialog=page.getByRole('dialog');await fillSchedule(dialog);
 await expect(dialog.getByRole('combobox',{name:'Volunteer',exact:true})).toHaveCount(0);await dialog.getByRole('button',{name:'Confirm',exact:true}).click();
 await expect.poll(()=>writes.length).toBe(1);expect(writes[0]).toMatchObject({path:'/replacements/claim-one/offer',body:{mode:'broadcast',scheduledDate:schedule.scheduledDate,shiftStart:schedule.shiftStart,shiftEnd:schedule.shiftEnd,pickupAddress:seller.pickupAddress}});
 await expect(card.getByRole('button',{name:'Request Volunteer from Org Admin',exact:true})).toHaveCount(0);expect(reads).not.toContain('/fulfillment/candidates');
});

test('volunteer can accept a replacement through the portal on a mobile screen',async({page})=>{
 const {writes}=await setup(page,'volunteer',{portal:true,replacement:true});await page.setViewportSize({width:390,height:844});
 const card=page.locator('[data-portal-replacement-id="claim-one"]');await expect(card).toContainText('Pune -> Mumbai');
 await card.getByRole('button',{name:'Apply & Accept Replacement',exact:true}).click();const review=page.getByRole('dialog',{name:'Review delivery details',exact:true});await review.getByRole('checkbox').check();await review.getByRole('button',{name:'Accept Replacement',exact:true}).click();await expect.poll(()=>writes.length).toBe(1);expect(writes[0]).toMatchObject({path:'/replacements/claim-one/action',body:{action:'accept',confirmAvailability:true}});
 await expect(card).toHaveCount(0);await expect(review.getByRole('status')).toContainText('has been notified');
});
