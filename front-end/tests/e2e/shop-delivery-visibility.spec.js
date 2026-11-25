import {test,expect} from '@playwright/test';

for(const role of ['donor','beneficiary','volunteer'])test(`${role} sees purchased shop delivery in purchases and only resource work in delivery operations`,async({page})=>{
  const email=`${role}@kindred.org`;
  const order={id:'own-purchase',productTitle:'Purchased bowl',quantity:1,total:100,deliveryStatus:'assigned',paymentStatus:'paid',address:'Buyer address'};
  const deliveries=[{id:'shop-delivery',kind:'order',sourceId:order.id,title:'Deliver purchased bowl',status:'accepted',mode:'broadcast',recipientEmail:email,orgName:'HopeConnect',history:[]},{id:'resource-delivery',kind:role==='donor'?'collection':'resource',sourceId:'resource-one',title:'Resource assistance',status:'accepted',mode:'broadcast',recipientEmail:email,orgName:'HopeConnect',history:[]}];
  await page.route('http://localhost:3000/**',route=>{
    const url=new URL(route.request().url());
    const data=url.pathname.startsWith('/orders/by-buyer/')?[order]:url.pathname==='/fulfillment/deliveries'?deliveries:[];
    return route.fulfill({json:{success:true,data}});
  });
  await page.goto('/');await page.evaluate(session=>sessionStorage.setItem('kindred_session',JSON.stringify(session)),{id:role,name:'Buyer',role,email,status:'approved'});await page.goto(`/${role}-dashboard`);
  const operations=page.getByRole('region',{name:'Resources and deliveries',exact:true});
  await expect(operations.locator('[data-delivery-id="resource-delivery"]')).toBeVisible();
  await expect(operations.locator('[data-delivery-id="shop-delivery"]')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Shop Orders Awaiting Delivery',exact:true})).toHaveCount(0);
  await expect(page.locator('.shop-orders-section')).toHaveCount(0);
  await expect(page.getByRole('region',{name:'Purchases and replacements',exact:true})).toContainText('Purchased bowl');
});

test('admin without shop orders has no empty shop assignment section',async({page})=>{
  await page.route('http://localhost:3000/**',route=>route.fulfill({json:{success:true,data:[]}}));
  await page.goto('/');await page.evaluate(()=>sessionStorage.setItem('kindred_session',JSON.stringify({id:'admin',name:'Admin',role:'admin',email:'admin@kindred.org',org:'HopeConnect',status:'approved'})));await page.goto('/org-admin#resources');
  await expect(page.getByRole('heading',{name:'Organization Inventory',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Shop Orders Awaiting Delivery',exact:true})).toHaveCount(0);
});

test('buyer cancellation controls appear only for purchases less than one hour old',async({page})=>{
 const base={quantity:1,total:100,deliveryStatus:'awaiting_admin_assignment',paymentStatus:'paid',address:'Buyer address'};
 const orders=[{...base,id:'recent',productTitle:'Recent purchase',createdAt:new Date(Date.now()-300000).toISOString()},{...base,id:'expired',productTitle:'Old purchase',createdAt:new Date(Date.now()-3600001).toISOString()}];
 await page.route('http://localhost:3000/**',route=>route.fulfill({json:{success:true,data:new URL(route.request().url()).pathname.startsWith('/orders/by-buyer/')?orders:[]}}));
 await page.goto('/');await page.evaluate(()=>sessionStorage.setItem('kindred_session',JSON.stringify({id:'donor',name:'Buyer',role:'donor',email:'donor@kindred.org',status:'approved'})));await page.goto('/donor-dashboard');
 const panel=page.getByRole('region',{name:'Purchases and replacements',exact:true});
 await expect(panel.locator('article').filter({has:page.getByRole('heading',{name:'Recent purchase',exact:true})}).getByRole('button',{name:'Cancel purchase',exact:true})).toBeVisible();
 await expect(panel.locator('article').filter({has:page.getByRole('heading',{name:'Old purchase',exact:true})}).getByRole('button',{name:'Cancel purchase',exact:true})).toHaveCount(0);
});
