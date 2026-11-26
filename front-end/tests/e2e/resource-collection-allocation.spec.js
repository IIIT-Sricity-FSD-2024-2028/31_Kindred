import { API_BASE } from '../apiBase.js';
import {test,expect} from '@playwright/test';

for(const mode of ['direct'])test(`resource collection ${mode} allocation needs no admin pickup date, time or address`,async({page})=>{
 const writes=[];
 const donation={id:'donation-one',category:'Food',donorName:'Donor',orgName:'HopeConnect',status:'submitted',items:[{name:'Rice',quantity:10,unit:'kg'}],pickupAddress:'House 12, Mumbai',pickupDate:'2099-01-06',pickupTimeSlot:'Afternoon (12PM-4PM)'};
 const plan={pickupAddress:donation.pickupAddress,pickupDate:donation.pickupDate,pickupTimeSlot:donation.pickupTimeSlot,address:'HopeConnect, Mumbai',candidates:[{id:'vol_001',name:'Priya',email:'volunteer@kindred.org',currentLocation:'Mumbai',eligible:true,reasons:[]}]};
 await page.route(`${API_BASE}/**`,route=>{
  const req=route.request(),url=new URL(req.url());
  if(req.method()!=='GET'){writes.push({path:url.pathname,body:req.postDataJSON()});return route.fulfill({json:{success:true,data:{}}});}
  const data=url.pathname.endsWith('/plan')?plan:url.pathname.startsWith('/resource-donations/by-org/')?[donation]:[];
  return route.fulfill({json:{success:true,data}});
 });
 await page.goto('/');await page.evaluate(()=>sessionStorage.setItem('kindred_session',JSON.stringify({id:'admin',name:'Admin',role:'admin',email:'admin@kindred.org',org:'HopeConnect',status:'approved'})));await page.goto('/org-admin#resources');
 await page.getByRole('button',{name:'Allocate Volunteer',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Allocate Resource Collection',exact:true});
 await expect(dialog).toContainText(donation.pickupAddress);await expect(dialog).toContainText(donation.pickupTimeSlot);await expect(dialog).toContainText(donation.pickupDate);
 await expect(dialog.locator('input[type="date"],input[type="time"]')).toHaveCount(0);
 await expect(dialog.getByLabel('Exact Organization Collection Address')).toHaveCount(0);
 await expect(dialog.getByRole('combobox',{name:'Allocation method',exact:true})).toHaveCount(0);
 if(mode==='direct')await dialog.getByRole('combobox',{name:'Volunteer',exact:true}).selectOption('volunteer@kindred.org');
 else await expect(dialog.getByRole('combobox',{name:'Volunteer',exact:true})).toHaveCount(0);
 await dialog.getByRole('button',{name:'Allocate Volunteer',exact:true}).click();await expect.poll(()=>writes.length).toBe(1);
 expect(writes[0]).toMatchObject({path:'/fulfillment/deliveries',body:{kind:'collection',sourceId:donation.id,mode}});
 expect(writes[0].body).not.toHaveProperty('scheduledDate');expect(writes[0].body).not.toHaveProperty('collectionAddress');
});

test('assigned volunteer reports a resource collection',async({page})=>{
 const writes=[];
 await page.route(`${API_BASE}/**`,route=>{
  const req=route.request(),url=new URL(req.url());
  if(req.method()!=='GET'){writes.push({path:url.pathname,body:req.postDataJSON()});return route.fulfill({json:{success:true,data:{}}});}
  const data=url.pathname==='/fulfillment/deliveries'?[{id:'collection-one',kind:'collection',sourceId:'donation-one',title:'Collect Food',orgName:'HopeConnect',status:'picked_up',mode:'direct',volunteerEmail:'volunteer@kindred.org',history:[]}]:[];
  return route.fulfill({json:{success:true,data}});
 });
 await page.goto('/');await page.evaluate(()=>sessionStorage.setItem('kindred_session',JSON.stringify({id:'vol',name:'Priya',role:'volunteer',email:'volunteer@kindred.org',status:'approved'})));await page.goto('/volunteer-dashboard');
 await page.getByRole('button',{name:'Report Collection',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.getByRole('textbox',{name:'Collection report',exact:true}).fill('Collected 10 kg rice in good condition.');await dialog.getByRole('button',{name:'Submit',exact:true}).click();
 await expect.poll(()=>writes.length).toBe(1);expect(writes[0]).toEqual({path:'/fulfillment/deliveries/collection-one/action',body:{action:'report',reason:'Collected 10 kg rice in good condition.'}});
});
