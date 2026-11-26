import { API_BASE } from '../apiBase.js';
import { login, scheduledProgram, readyVolunteer } from '../fixtures/liveWorkflow.js';
/* global window */
import {test,expect} from '@playwright/test';
async function as(page,role,path,extra={}) {
  const session=await login(page.request,role);
  await page.goto('/'); await page.evaluate(value=>sessionStorage.setItem('kindred_session',JSON.stringify(value)),{...session,...extra});
  await page.goto(path); await expect(page.locator('main[data-react-page]')).toBeVisible();
}
test('seller replacements resolve the distinct seller profile ID',async ({page})=>{
  await page.route('**/sellers',route=>route.fulfill({json:{success:true,data:[{id:'profile-distinct',email:'seller@kindred.org',name:'Seller'}]}}));
  let resolved=false;
  await page.route('**/replacements/by-seller/*',route=>{resolved=route.request().url().endsWith('/profile-distinct');return route.fulfill({json:{success:true,data:[{id:'replacement-test',orderId:'Visible replacement',productTitle:'Visible replacement',reason:'Damaged',description:'Test',status:'requested'}]}});});
  await as(page,'seller','/seller-dashboard.html',{id:'login-distinct'});
  await expect(page.locator('main')).toContainText('Visible replacement'); expect(resolved).toBe(true);
});
test('dashboard focus refreshes records changed by another role',async ({page})=>{
  let title='Initial product';
  await page.route('**/products?*',route=>route.fulfill({json:{success:true,data:[{id:'test-product',sellerId:'seller_001',title,description:'Test',category:'Art',price:10,quantity:2,status:'approved'}]}}));
  await as(page,'seller','/seller-dashboard.html'); await expect(page.locator('#sellerProductsGrid')).toContainText(title);
  title='Updated product'; await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await expect(page.locator('#sellerProductsGrid')).toContainText(title);
});
test('real product image upload persists and its returned URL loads',async ({page,request})=>{
  const title=`Phase5 upload ${Date.now()}`; let product;
  await as(page,'seller','/seller-dashboard.html'); await page.getByRole('button',{name:/Add (?:New )?Product/}).first().click();
  await page.locator('#prod-title').fill(title); await page.locator('#prod-desc').fill('Integration upload test'); await page.locator('#prod-price').fill('20'); await page.locator('#prod-quantity').fill('2');
  await page.locator('#prodPhotoInput').setInputFiles({name:'phase5.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=','base64')});
  const saved=page.waitForResponse(r=>r.url()===`${API_BASE}/products`&&r.request().method()==='POST');
  await page.getByRole('dialog').getByRole('button',{name:/Save|Submit/}).click(); product=(await (await saved).json()).data;
  try { expect(product.photos).toHaveLength(1); expect((await request.get(product.photos[0])).ok()).toBe(true); await expect(page.locator('#sellerProductsGrid')).toContainText(title); }
  finally {if(product) await request.delete(`${API_BASE}/products/${product.id}`,{headers:{role:'seller'}});}
});

test('program editing restores, cancels, and reactivates assignments without duplication',async ({page,request})=>{
  const headers={role:'admin',organization:'HopeConnect'},base=API_BASE;
  await readyVolunteer(request);
  const schedule={...scheduledProgram(),shiftStart:'17:00',shiftEnd:'18:00',reportingTime:'16:45'};
  const program=(await (await request.post(base+'/programs',{headers,data:{name:`Phase5 edit ${Date.now()}`,org:'HopeConnect',focus:['Education'],...schedule,budget:100,description:'Assignment integration',location:'Pune',volunteerGoal:2}})).json()).data;
  const assignment=(await (await request.post(base+'/program-assignments',{headers,data:{programId:program.id,programName:program.name,volunteerEmail:'volunteer@kindred.org',volunteerName:'Priya Singh',status:'active'}})).json()).data;
  try {
    await as(page,'admin','/org-admin.html#programs');
    await page.locator(`[data-program-id="${program.id}"]`).getByRole('button',{name:'Edit',exact:true}).click();
    const volunteer=page.locator('#progVolsContainer').getByLabel('Priya Singh'); await expect(volunteer).toBeChecked(); await expect(volunteer).toBeEnabled();
    await volunteer.uncheck(); await page.locator('#createProgramBtn').click(); await expect(page).toHaveURL(/program-success/);
    let records=(await (await request.get(`${base}/program-assignments/by-program/${program.id}`,{headers})).json()).data;
    expect(records).toHaveLength(1); expect(records[0].status).toBe('cancelled');
    await as(page,'admin','/org-admin.html#programs'); await page.locator(`[data-program-id="${program.id}"]`).getByRole('button',{name:'Edit',exact:true}).click();
    await expect(volunteer).toBeEnabled(); await expect(volunteer).not.toBeChecked(); await volunteer.check(); await page.locator('#createProgramBtn').click(); await expect(page).toHaveURL(/program-success/);
    records=(await (await request.get(`${base}/program-assignments/by-program/${program.id}`,{headers})).json()).data;
    expect(records).toHaveLength(1); expect(records[0]).toMatchObject({id:assignment.id,status:'pending'});
    const saved=(await (await request.get(`${base}/programs/manage`,{headers})).json()).data.find(record=>record.id===program.id); expect(saved.startDate).toBe(schedule.startDate);
  } finally {if(assignment)await request.delete(`${base}/program-assignments/${assignment.id}`,{headers});await request.delete(`${base}/programs/${program.id}`,{headers});}
});

test('collection errors retry the real loader and show returned records',async ({page})=>{
  let outage=true;
  await page.route('**/organizations',route=>outage?route.fulfill({status:503,json:{success:false,message:'Temporary directory outage'}}):route.fulfill({json:{success:true,data:[{id:'retry-org',name:'Recovered Organization',focus:'Education',status:'active',listingStatus:'approved'}]}}));
  await page.goto('/organizations.html'); await expect(page.locator('main')).toContainText('Temporary directory outage');
  outage=false; await page.locator('main').getByRole('button',{name:'Retry',exact:true}).click(); await expect(page.locator('main')).toContainText('Recovered Organization');
});
