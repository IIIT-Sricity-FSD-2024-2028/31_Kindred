import {test,expect} from '@playwright/test';

const pickup='Shop 12, Market Road, Mumbai, Maharashtra 400001';
const address='Flat 8, Lake View, Pune, Maharashtra 411001';
async function setup(page,role,{missing=false,reassign=false}={}) {
  const seller={id:'seller_001',email:'seller@kindred.org',businessName:'Artisan Shop',status:'approved',pickupAddress:missing?'':pickup};
  const order={id:'order-one',sellerId:seller.id,productTitle:'Handmade bowl',quantity:1,organizationName:'HopeConnect',address,deliveryStatus:'awaiting_admin_assignment'};
  const writes=[];
  await page.route('http://localhost:3000/**',route=>{
    const req=route.request(),url=new URL(req.url()),key=url.pathname.split('/')[1];
    if(req.method()!=='GET'){
      const body=req.postDataJSON();writes.push({path:url.pathname,body});
      if(key==='sellers')Object.assign(seller,body);
      return route.fulfill({json:{success:true,data:{id:'saved',...body}}});
    }
    const data=url.pathname.endsWith('/addresses')?{pickupAddress:seller.pickupAddress,address}:key==='sellers'?[seller]:key==='orders'?[order]:key==='organizations'?[{id:'org_001',name:'HopeConnect',status:'active'}]:url.pathname==='/fulfillment/deliveries'&&reassign?[{id:'delivery-one',kind:'order',sourceId:order.id,title:'Deliver Handmade bowl',orgName:'HopeConnect',sellerEmail:seller.email,status:'declined',mode:'broadcast',pickupAddress:'Old pickup',address,scheduledDate:'2099-01-01',shiftStart:'10:00',shiftEnd:'11:00',pickupArea:'Mumbai',destinationArea:'Pune',history:[]}]:[];
    return route.fulfill({json:{success:true,data}});
  });
  await page.goto('/');
  await page.evaluate(session=>sessionStorage.setItem('kindred_session',JSON.stringify(session)),{id:'actor-test',name:'Test User',role,email:role==='seller'?seller.email:'admin@hopeconnect.org',org:'HopeConnect',status:'approved'});
  await page.goto(role==='seller'?'/seller-dashboard':'/org-admin#resources');
  return writes;
}

test('seller can save the full pickup address',async({page})=>{
  const writes=await setup(page,'seller');
  await expect(page.getByRole('textbox',{name:'Full seller pickup address',exact:true})).toHaveValue(pickup);
  await page.getByRole('textbox',{name:'Full seller pickup address',exact:true}).fill('Shop 20, New Street, Mumbai 400002');
  await page.getByRole('button',{name:'Save Pickup Address',exact:true}).click();
  await expect(page.getByRole('region',{name:'Seller pickup address',exact:true}).getByRole('status')).toContainText('Pickup address saved');
  expect(writes).toContainEqual({path:'/sellers/seller_001',body:{pickupAddress:'Shop 20, New Street, Mumbai 400002'}});
});

test('arrange delivery automatically displays the exact saved addresses',async({page})=>{
  await setup(page,'seller');
  await page.getByRole('button',{name:'Post Delivery to Portal',exact:true}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog.getByRole('textbox',{name:'Seller pickup / exchange address',exact:true})).toHaveValue(pickup);
  await expect(dialog.getByRole('textbox',{name:'Buyer delivery address',exact:true})).toHaveValue(address);
  await expect(dialog.getByRole('textbox',{name:'Seller pickup / exchange address',exact:true})).not.toHaveAttribute('readonly','');
  await expect(dialog.getByRole('textbox',{name:'Buyer delivery address',exact:true})).toHaveAttribute('readonly','');
  await page.setViewportSize({width:390,height:844});
  await expect(dialog).toBeVisible();
});

test('reassign reloads the saved pickup address and preserves schedule',async({page})=>{
  await setup(page,'seller',{reassign:true});
  await page.getByRole('button',{name:'Reassign / Broadcast',exact:true}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog.getByRole('textbox',{name:'Seller pickup / exchange address',exact:true})).toHaveValue('Old pickup');
  await expect(dialog.getByLabel('Pickup date',{exact:true})).toHaveValue('2099-01-01');
  await expect(dialog.getByRole('textbox',{name:'Buyer delivery address',exact:true})).toHaveValue(address);
});

test('missing pickup address explains how the seller must set it',async({page})=>{
  await setup(page,'seller',{missing:true});
  await page.getByRole('button',{name:'Post Delivery to Portal',exact:true}).click();
  const field=page.getByRole('dialog').getByRole('textbox',{name:'Seller pickup / exchange address',exact:true});await expect(field).toHaveValue('');await field.fill('Seller entered address, Mumbai');await expect(field).toHaveValue('Seller entered address, Mumbai');
});
