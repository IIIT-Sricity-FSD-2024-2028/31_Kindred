import { API_BASE } from '../apiBase.js';
import {test,expect} from '@playwright/test';
const organizations=[{id:'org-one',name:'HopeConnect',neededResources:'Rice: 100 kg; Blankets: 50 units'},{id:'org-two',name:'Community Care',neededResources:'Books: 200 units'}];
const programs=[{id:'program-one',name:'Food support',org:'HopeConnect',status:'active'},{id:'program-two',name:'School support',org:'Community Care',status:'active'}];
async function setup(page,role,path){
 const writes=[];let needs=organizations[0].neededResources;
 const certificate={id:'RESOURCE-THANKS-001',donationId:'donation-received',organization:'HopeConnect',donorName:'Resource Donor',donorEmail:'donor@kindred.org',programName:'Food support',issuedAt:'2026-11-01T10:00:00Z',items:[{name:'Rice',quantity:8,unit:'kg',condition:'New',offeredQuantity:10}]};
 const resource={id:certificate.donationId,donorName:certificate.donorName,donorEmail:certificate.donorEmail,orgName:'HopeConnect',category:'Food',status:'received',items:certificate.items,certificate};
 await page.route(`${API_BASE}/**`,route=>{
  const request=route.request(),url=new URL(request.url()),key=url.pathname.split('/')[1];
  if(request.method()!=='GET'){const body=request.postDataJSON();writes.push({path:url.pathname,body});if(url.pathname.startsWith('/organizations/'))needs=body.neededResources;return route.fulfill({json:{success:true,data:{id:'created-donation',...body}}});}
  const data=url.pathname==='/resource-donations/options'?{organizations:[{...organizations[0],neededResources:needs},organizations[1]],programs}:key==='organizations'?organizations.map(org=>({...org,status:'active',neededResources:org.id==='org-one'?needs:org.neededResources})):key==='programs'?programs:key==='resource-donations'?[resource]:[];
  return route.fulfill({json:{success:true,data}});
 });
 await page.goto('/');await page.evaluate(session=>sessionStorage.setItem('kindred_session',JSON.stringify(session)),{id:'actor-test',name:'Resource Donor',email:role==='admin'?'admin@hopeconnect.org':'donor@kindred.org',role,org:'HopeConnect',status:'approved'});await page.goto(path);return writes;
}
test('organization is required and program choices follow the selected organization',async({page})=>{
 await setup(page,'donor','/donor-dashboard#resources');await page.getByRole('button',{name:/Donate Resources/}).click();
 const org=page.getByRole('combobox',{name:'Recipient Organization',exact:true}),program=page.getByRole('combobox',{name:'Program',exact:true});
 await expect(org).toHaveAttribute('required','');await expect(program).toBeDisabled();
 await org.selectOption('org-one');await expect(page.locator('.resource-needs-note')).toContainText('Rice: 100 kg');
 await expect(program.locator('option')).toHaveText(['Organization-wide donation','Food support']);await program.selectOption('program-one');
 await org.selectOption('org-two');await expect(program).toHaveValue('');await expect(program.locator('option')).toHaveText(['Organization-wide donation','School support']);
 await expect(page.locator('.resource-needs-note')).toContainText('Books: 200 units');
 await page.setViewportSize({width:390,height:844});await page.getByRole('dialog').locator('.modal-box').screenshot({path:'test-results/resource-donation-mobile.png'});
});
test('public resource donation submits structured quantities to the explicitly selected organization',async({page})=>{
 const writes=await setup(page,'donor','/donate');await page.getByRole('button',{name:/Donate In-Kind/}).first().click();
 const dialog=page.getByRole('dialog');
 await dialog.locator('#res-donor-phone').fill('9812345678');await dialog.getByRole('combobox',{name:'Recipient Organization',exact:true}).selectOption('org-two');await dialog.getByRole('combobox',{name:'Program',exact:true}).selectOption('program-two');
 await dialog.getByRole('textbox',{name:'Item name',exact:true}).fill('Books');await dialog.getByRole('spinbutton',{name:'Quantity',exact:true}).fill('25');await dialog.getByRole('textbox',{name:'Item unit',exact:true}).fill('unit');
 await dialog.locator('#res-address').fill('Mumbai pickup address');await dialog.locator('#res-date').fill('2099-01-01');await dialog.locator('#res-timeslot').selectOption({index:1});
 await dialog.getByRole('button',{name:/Submit|Confirm|Schedule/}).click();
 await expect.poll(()=>writes.length).toBe(1);expect(writes[0].body).toMatchObject({orgId:'org-two',orgName:'Community Care',programId:'program-two',donorEmail:'donor@kindred.org',items:[{name:'Books',quantity:25,unit:'unit',condition:'New'}]});
});
test('org admin publishes resource needs without editing bank details',async({page})=>{
 const writes=await setup(page,'admin','/org-admin#resources');await page.getByRole('button',{name:'Publish Resource Needs',exact:true}).click();
 const dialog=page.getByRole('dialog');await dialog.getByRole('textbox',{name:'Resources needed',exact:true}).fill('Rice: 40 kg; First aid kits: 10 kits');await dialog.getByRole('button',{name:'Save',exact:true}).click();
 await expect.poll(()=>writes.length).toBe(1);expect(writes[0]).toEqual({path:'/organizations/org-one',body:{neededResources:'Rice: 40 kg; First aid kits: 10 kits'}});
});
test('received donation has an itemized certificate and notification link opens it',async({page})=>{
 await setup(page,'donor','/donor-dashboard?resourceCertificate=donation-received#resources');
 const dialog=page.getByRole('dialog',{name:'Resource donation thank-you certificate',exact:true});await expect(dialog).toContainText('Resource Donor');await expect(dialog).toContainText('8 kg');await expect(dialog).toContainText('Rice');await expect(dialog).toContainText('Food support');await expect(dialog.getByRole('button',{name:'Print / Save PDF',exact:true})).toBeVisible();
 await page.locator('.resource-certificate-dialog').screenshot({path:'test-results/resource-thank-you-certificate.png'});
 await dialog.getByRole('button',{name:'Close dialog',exact:true}).click();await page.getByRole('button',{name:'View Thank-You Certificate',exact:true}).click();await expect(dialog).toBeVisible();
});
