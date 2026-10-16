/* global window */
import { test,expect } from '@playwright/test';
const org={id:'org_001',name:'HopeConnect',status:'active',listingStatus:'approved',bankAccountName:'HopeConnect',bankAccountNumber:'12345678901',bankIfsc:'SBIN0001234'};
const resourceRequest={id:'resource-request',orgName:org.name,resource:'Blankets',quantity:3,name:'Meena',beneficiaryEmail:'beneficiary@kindred.org',reason:'Winter support',address:'Pune address',phone:'9812345678',status:'pending',message:'Awaiting response',approvedQuantity:0,allocations:[],history:[]};
const stock={id:'donation:0',donationId:'donation',orgName:org.name,name:'Blankets',condition:'New',received:5,available:5,reserved:0,distributed:0};
const delivery={id:'delivery',kind:'resource',sourceId:resourceRequest.id,title:'Deliver Blankets (3)',orgName:org.name,mode:'broadcast',status:'awaiting_acceptance',pickupAddress:'Details shared after acceptance',address:'Details shared after acceptance',contact:'',history:[]};
async function setup(page,role,overrides={}) {
 const data={organizations:[org],resourceRequests:[structuredClone(resourceRequest)],inventory:[structuredClone(stock)],deliveries:[],proofs:[],orders:[],deliveryVolunteers:[{id:'vol',name:'Priya',email:'volunteer@kindred.org'}],...overrides},writes=[];
 await page.route('http://localhost:3000/**',async route=>{
  const req=route.request(),url=new URL(req.url()),parts=url.pathname.split('/');
  if(req.method()!=='GET') {
   const body=req.postDataJSON();writes.push({path:url.pathname,body});
   if(url.pathname==='/fulfillment/requests')data.resourceRequests.push({...resourceRequest,...body,id:'created-request'});
   if(url.pathname.endsWith('/respond')){Object.assign(data.resourceRequests[0],{status:'approved',message:body.message,allocations:body.allocations,approvedQuantity:3});Object.assign(data.inventory[0],{available:2,reserved:3});}
   if(url.pathname==='/fulfillment/deliveries')data.deliveries.push({...delivery,...body});
   if(url.pathname.endsWith('/action')) {
    if(body.action==='accept')Object.assign(data.deliveries[0],{status:'accepted',volunteerEmail:'volunteer@kindred.org',volunteerName:'Priya',pickupAddress:'HopeConnect collection point',address:'Pune address',contact:'9812345678'});
    if(body.action==='picked_up')data.deliveries[0].status='picked_up';
    if(body.action==='in_transit')data.deliveries[0].status='in_transit';
   }
   return route.fulfill({json:{success:true,data:{}}});
  }
  const map={requests:'resourceRequests',deliveries:'deliveries',inventory:'inventory',volunteers:'deliveryVolunteers'};
  let rows=parts[1]==='fulfillment'?data[map[parts[2]]]:data[parts[1]];
  if(url.pathname==='/donations/balance/HopeConnect')rows={verifiedTotal:0};
  return route.fulfill({json:{success:true,data:rows||[]}});
 });
 await page.goto('/');
 await page.evaluate(session=>window.sessionStorage.setItem('kindred_session',JSON.stringify(session)),{id:'user',name:'Tester',role,email:`${role}@kindred.org`,org:org.name,status:'approved'});
 await page.goto(role==='admin'?'/org-admin#resources':`/${role}-dashboard`);
 return {data,writes};
}

test('beneficiary requests resources from an organization and sees the submitted request',async({page})=>{
 const {writes}=await setup(page,'beneficiary',{resourceRequests:[]});
 await page.getByRole('button',{name:'Request Resources',exact:true}).click();
 const modal=page.getByRole('dialog');
 await modal.getByLabel('Organization',{exact:true}).selectOption(org.name);
 await modal.getByLabel('Resource Needed',{exact:true}).fill('Blankets');
 await modal.getByLabel('Quantity Needed',{exact:true}).fill('3');
 await modal.getByLabel('Reason for Request',{exact:true}).fill('Winter support');
 await modal.getByLabel('Delivery Address',{exact:true}).fill('Pune address');
 await modal.getByLabel('Contact Phone',{exact:true}).fill('9812345678');
 await modal.getByRole('button',{name:'Submit',exact:true}).click();
 await expect(modal).toHaveCount(0);
 await expect(page.locator('[data-resource-request-id="created-request"]')).toContainText('Blankets');
 expect(writes[0].body).toMatchObject({orgName:'HopeConnect',quantity:3,resource:'Blankets'});
});

test('organization approves from inventory and offers delivery to all volunteers or a named volunteer',async({page})=>{
 const {writes}=await setup(page,'admin');
 await page.getByRole('button',{name:'Respond to Request',exact:true}).click();
 let modal=page.getByRole('dialog');
 await modal.getByLabel('Blankets (available 5)',{exact:true}).fill('3');
 await modal.getByLabel('Message',{exact:true}).fill('We reserved three blankets');
 await modal.getByRole('button',{name:'Submit',exact:true}).click();
 await expect(page.locator('.inventory-table tbody tr').first()).toContainText('2');
 await page.getByRole('button',{name:'Arrange Resource Delivery',exact:true}).click();
 modal=page.getByRole('dialog');
 await modal.getByLabel('Assignment Method').selectOption('direct');
 await modal.getByLabel('Volunteer Email').selectOption('volunteer@kindred.org');
 await modal.getByLabel('Assignment Method').selectOption('broadcast');
 await modal.getByRole('button',{name:'Submit',exact:true}).click();
 await expect(page.locator('[data-delivery-id="delivery"]')).toContainText('Offered to all active volunteers');
 expect(writes.find(w=>w.path.endsWith('/respond')).body.allocations).toEqual([{stockId:stock.id,quantity:3}]);
 expect(writes.find(w=>w.path==='/fulfillment/deliveries').body).toEqual({kind:'resource',sourceId:resourceRequest.id,mode:'broadcast'});
});

test('volunteer accepts a delivery before pickup, then uploads proof after starting delivery',async({page})=>{
 await setup(page,'volunteer',{deliveries:[structuredClone(delivery)],resourceRequests:[],inventory:[]});
 const card=page.locator('[data-delivery-id="delivery"]');
 await expect(card).toContainText('Details shared after acceptance');
 await expect(card.getByRole('button',{name:'Confirm Pickup',exact:true})).toHaveCount(0);
 await card.getByRole('button',{name:'Accept Delivery',exact:true}).click();
 await expect(card).toContainText('Pune address');
 await card.getByRole('button',{name:'Confirm Pickup',exact:true}).click();
 await card.getByRole('button',{name:'Start Delivery',exact:true}).click();
 await card.getByRole('button',{name:'Upload Delivery Proof',exact:true}).click();
 await expect(page.getByRole('dialog').getByLabel('Proof Image')).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 await expect(page.getByRole('dialog')).toBeVisible();
});

test('seller can verify shop delivery proof and sees rejected-proof reason controls',async({page})=>{
 await setup(page,'seller',{resourceRequests:[],inventory:[],deliveries:[{...delivery,kind:'order',status:'in_transit',sellerEmail:'seller@kindred.org',volunteerEmail:'volunteer@kindred.org'}],proofs:[{id:'proof-delivery',collection:'deliveries',recordId:'delivery',status:'pending',image:'/images/ngo-placeholder.svg'}]});
 await expect(page.getByRole('button',{name:'Verify Delivery Proof',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Reject Delivery Proof',exact:true}).click();
 await expect(page.getByRole('dialog').getByLabel('Reason',{exact:true})).toBeVisible();
});

test('resource inventory has styled summary cards and fits mobile screens',async({page},testInfo)=>{
 await setup(page,'admin');
 const panel=page.getByRole('region',{name:'Resources and deliveries',exact:true});
 await expect(panel.locator('.fulfillment-summary')).toBeVisible();
 await expect(panel.locator('.fulfillment-metric')).toHaveCount(4);
 await expect(panel.getByRole('button',{name:'Respond to Request',exact:true})).toHaveCSS('background-color','rgb(15, 118, 110)');
 await panel.screenshot({path:testInfo.outputPath('resource-panel-desktop.png')});
 await page.setViewportSize({width:390,height:844});
 const bounds=await panel.boundingBox();
 expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(391);
 await panel.screenshot({path:testInfo.outputPath('resource-panel-mobile.png')});
});

test('missing resource routes show one helpful retry state without fake empty inventory',async({page})=>{
 await setup(page,'admin');
 let unavailable=true;
 await page.route('**/fulfillment/**',route=>{
  const key=new URL(route.request().url()).pathname.split('/').at(-1);
  if(unavailable)return route.fulfill({status:404,json:{success:false,message:`Cannot GET /fulfillment/${key}`}});
  return route.fulfill({json:{success:true,data:key==='inventory'?[stock]:key==='requests'?[resourceRequest]:[]}});
 });
 await page.reload();
 const panel=page.getByRole('region',{name:'Resources and deliveries',exact:true});
 await expect(panel.getByRole('alert')).toHaveCount(1);
 await expect(panel).not.toContainText('Cannot GET');
 await expect(panel.locator('.inventory-table')).toHaveCount(0);
 await expect(panel).not.toContainText('No confirmed donated stock');
 unavailable=false;
 await panel.getByRole('button',{name:'Retry',exact:true}).click();
 await expect(panel.locator('.inventory-table')).toBeVisible();
 await expect(panel.getByRole('alert')).toHaveCount(0);
});
