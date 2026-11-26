import {Test,TestingModule} from '@nestjs/testing';
import {INestApplication,ValidationPipe} from '@nestjs/common';
import request from 'supertest';
import {AppModule} from './app.module';
import {FulfillmentService} from './modules/fulfillment/service';
import {ReplacementsService} from './modules/replacements/service';
import {OrdersService} from './modules/orders/service';
import {SellersService} from './modules/sellers/service';
import {VolunteersService} from './modules/volunteers/service';
import {ProductsService} from './modules/products/service';
import {ResourceDonationsService} from './modules/resource-donations/service';
import {NotificationsService} from './modules/notifications/service';
import {UsersService} from './modules/users/service';
import {ProofStore} from './modules/proofs/store';

describe('Delivery coordination across actual API routes and services',()=>{
 let module:TestingModule,app:INestApplication,fulfillment:FulfillmentService,replacements:ReplacementsService,orders:OrdersService,sellers:SellersService,volunteers:VolunteersService,products:ProductsService,resources:ResourceDonationsService,notifications:NotificationsService,proofs:ProofStore;
 const admin={role:'admin',email:'admin@hopeconnect.org',org:'HopeConnect'},seller={role:'seller',email:'seller@kindred.org',org:'HopeConnect'},v={role:'volunteer',email:'volunteer@kindred.org',org:''},v2={...v,email:'amit.sharma@email.com'};
 const plan={mode:'broadcast' as const,scheduledDate:'2099-01-05',shiftStart:'10:00',shiftEnd:'11:00',pickupArea:'Mumbai',destinationArea:'Pune',requirements:'Carry one small box'};
 const headers=(actor:typeof admin)=>({role:actor.role,'user-email':actor.email,organization:actor.org});
 beforeEach(async()=>{
  module=await Test.createTestingModule({imports:[AppModule]}).compile();app=module.createNestApplication();app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));await app.init();
  fulfillment=module.get(FulfillmentService);replacements=module.get(ReplacementsService);orders=module.get(OrdersService);sellers=module.get(SellersService);volunteers=module.get(VolunteersService);products=module.get(ProductsService);resources=module.get(ResourceDonationsService);notifications=module.get(NotificationsService);proofs=module.get(ProofStore);
  sellers.update('seller_001',{pickupAddress:'Shop 12, Market Road, Mumbai 400001'});
  for(const actor of [v,v2])volunteers.updatePresence(actor.email,{availableNow:true,currentLocation:'Mumbai',willingToTravel:true});
 });
 afterEach(async()=>{await app.close();});
 function order(){return orders.create({productId:'prod_001',quantity:1,buyerName:'Buyer',buyerEmail:'donor@kindred.org',buyerPhone:'9812345678',address:'Flat 8, Lake View, Pune 411001',cardLast4:'1111',cardType:'Visa'});}
 function donation(){return resources.create({donorName:'Donor',donorEmail:'donor@kindred.org',donorPhone:'9812345678',orgName:'HopeConnect',category:'Food',items:[{name:'Rice',quantity:10,unit:'kg',condition:'New'}],description:'Rice bags',pickupAddress:'House 12, Mumbai',pickupDate:'2099-01-05',pickupTimeSlot:'Morning'});}
 function claim(){const o=order();(orders as any).orders.find((item:any)=>item.id===o.id).deliveryStatus='delivered';const r=replacements.create({orderId:o.id,buyerName:o.buyerName,buyerEmail:o.buyerEmail,reason:'Damaged',description:'Broken bowl',imageUrl:'/issue.png'});replacements.approve(r.id);return r;}
 function assertManagerNotification(title:string,sellerExpected=true,adminExpected=false){
  expect(notifications.find(seller.email,'seller','').some(n=>n.title===title)).toBe(sellerExpected);
  const admins=module.get(UsersService).findAll().filter(user=>user.role==='admin'&&user.org==='HopeConnect'&&user.status==='approved');
  expect(admins.length).toBeGreaterThan(0);for(const user of admins)expect(notifications.find(user.email,'admin','').some(n=>n.title===title)).toBe(adminExpected);
 }
 it('blocks seller volunteer-directory access and direct invitations but allows portal posting',async()=>{
  const o=order();
  await request(app.getHttpServer()).get('/fulfillment/candidates').set(headers(seller)).expect(403);
  await request(app.getHttpServer()).get('/fulfillment/volunteers').set(headers(seller)).expect(403);
  await request(app.getHttpServer()).get('/participation/candidates').set(headers(seller)).expect(403);
  await request(app.getHttpServer()).post('/fulfillment/deliveries').set(headers(seller)).send({...plan,kind:'order',sourceId:o.id,mode:'direct',volunteerEmail:v.email}).expect(403);
  const response=await request(app.getHttpServer()).post('/fulfillment/deliveries').set(headers(seller)).send({...plan,kind:'order',sourceId:o.id}).expect(201);
  expect(response.body.data.pickupAddress).toContain('Shop 12');
 });
 it('requires availability toggle and location for direct assignment and rechecks on acceptance',()=>{
  const o=donation(),body={kind:'collection' as const,sourceId:o.id,mode:'direct' as const,volunteerEmail:v.email};
  volunteers.updatePresence(v.email,{availableNow:false});expect(()=>fulfillment.offer(body,admin)).toThrow(/Available now/);
  volunteers.updatePresence(v.email,{availableNow:true,currentLocation:''});expect(()=>fulfillment.offer(body,admin)).toThrow(/current location/);
  volunteers.updatePresence(v.email,{currentLocation:'Mumbai'});const d=fulfillment.offer(body,admin);
  expect(()=>fulfillment.act(d.id,'accept',undefined,v2)).toThrow(/another volunteer/);
  volunteers.updatePresence(v.email,{availableNow:false});expect(()=>fulfillment.act(d.id,'accept',undefined,v)).toThrow(/Available now/);
  volunteers.updatePresence(v.email,{availableNow:true});expect(fulfillment.act(d.id,'accept',undefined,v).status).toBe('accepted');
  assertManagerNotification('Volunteer accepted delivery',false,true);
 });
 it('portal acceptance assigns one volunteer, masks private addresses, notifies managers and completes with verified proof',async()=>{
  const o=order(),d=fulfillment.offer({...plan,kind:'order',sourceId:o.id},seller);
  const portal=await request(app.getHttpServer()).get('/fulfillment/portal').set(headers(v)).expect(200);
  expect(portal.body.data[0]).toMatchObject({id:d.id,pickupAddress:'Details shared after acceptance',contact:'',address:'Details shared after acceptance'});
  await request(app.getHttpServer()).patch(`/fulfillment/deliveries/${d.id}/action`).set(headers(v)).send({action:'accept'}).expect(200);
  await request(app.getHttpServer()).patch(`/fulfillment/deliveries/${d.id}/action`).set(headers(v2)).send({action:'accept'}).expect(409);
  expect(fulfillment.portal(v2)).toHaveLength(0);expect(orders.findById(o.id).assignedVolunteerEmail).toBe(v.email);assertManagerNotification('Portal delivery application accepted');
  fulfillment.act(d.id,'picked_up',undefined,v);fulfillment.act(d.id,'in_transit',undefined,v);
  expect(()=>fulfillment.complete(d.id)).toThrow();
  const p=proofs.submit({collection:'deliveries',recordId:d.id,title:d.title,organization:'HopeConnect',volunteerEmail:v.email,image:'/delivery-proof.png'});
  await request(app.getHttpServer()).patch(`/proofs/${p.id}/approve`).set(headers(seller)).send({}).expect(200);
  expect(orders.findById(o.id).deliveryStatus).toBe('delivered');expect(fulfillment.findById(d.id).status).toBe('verified');
 });
 it('rejects overlapping deliveries, releases withdrawal and lets a different volunteer accept after reposting',()=>{
  const first=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller),second=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller);
  fulfillment.act(first.id,'accept',undefined,v);expect(()=>fulfillment.act(second.id,'accept',undefined,v)).toThrow(/Conflicts/);
  fulfillment.act(first.id,'withdraw','Cannot attend',v);
  fulfillment.reoffer(first.id,{...plan,kind:'order',sourceId:first.sourceId},seller);
  fulfillment.act(first.id,'accept',undefined,v2);expect(orders.findById(first.sourceId).assignedVolunteerEmail).toBe(v2.email);
  expect(fulfillment.act(second.id,'accept',undefined,v).status).toBe('accepted');
 });
 it('resource collection enters inventory once and resource portal delivery distributes only approved stock',()=>{
  const donation=resources.create({donorName:'Donor',donorEmail:'donor@kindred.org',donorPhone:'9812345678',orgName:'HopeConnect',category:'Food',items:[{name:'Rice',quantity:10,unit:'kg',condition:'New'}],description:'Rice bags',pickupAddress:'Donor home, Mumbai',pickupDate:'2099-01-01',pickupTimeSlot:'Morning'});
  const stock=fulfillment.receive(donation.id,{items:[{index:0,quantity:10}]},admin)[0];
  const beneficiary={role:'beneficiary',email:'beneficiary@kindred.org',org:''};
  const r=fulfillment.createRequest({orgName:'HopeConnect',resource:'Rice',quantity:4,unit:'kg',reason:'Food',name:'Recipient',phone:'9812345678',address:'Pune recipient home'},beneficiary);
  fulfillment.respond(r.id,{decision:'approve',message:'Reserved four kg',allocations:[{stockId:stock.id,quantity:4}]},admin);
  expect(()=>fulfillment.offer({...plan,kind:'resource',sourceId:r.id},admin)).toThrow(/exact organization/);
  const d=fulfillment.offer({...plan,kind:'resource',sourceId:r.id,collectionAddress:'HopeConnect warehouse, Mumbai'},admin);
  fulfillment.act(d.id,'accept',undefined,v);fulfillment.act(d.id,'picked_up',undefined,v);fulfillment.act(d.id,'in_transit',undefined,v);
  const proof=proofs.submit({collection:'deliveries',recordId:d.id,title:d.title,organization:'HopeConnect',volunteerEmail:v.email,image:'/proof.png'});proofs.get(proof.id).status='approved';fulfillment.complete(d.id);
  expect(fulfillment.inventory(admin)[0]).toMatchObject({available:6,reserved:0,distributed:4});expect(fulfillment.listRequests(beneficiary)[0].status).toBe('delivered');
 });
 it('shop posting is seller owned and does not require admin coordination',async()=>{
  const o=order(),r=claim();
  await request(app.getHttpServer()).post('/fulfillment/deliveries').set(headers(admin)).send({...plan,kind:'order',sourceId:o.id}).expect(403);
  await request(app.getHttpServer()).post(`/fulfillment/orders/${o.id}/request-help`).set(headers(seller)).send({message:'Please provide a volunteer'}).expect(400);
  await request(app.getHttpServer()).post(`/replacements/${r.id}/request-help`).set(headers(seller)).send({message:'Please arrange return'}).expect(400);
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/offer`).set(headers(admin)).send(plan).expect(403);
 });
 it('replacement portal supports one volunteer through return, delivery and seller proof verification',async()=>{
  const r=claim(),stock=products.findById(r.productId).quantity;
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/offer`).set(headers(seller)).send({...plan,mode:'direct',volunteerEmail:v.email}).expect(403);
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/assign-volunteer`).set(headers(seller)).send({volunteerEmail:v.email}).expect(403);
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/offer`).set(headers(seller)).send(plan).expect(200);
  const visible=replacements.visibleToVolunteer(v.email)[0];expect(visible.pickupAddress).toBe('Shared after acceptance');expect(visible).not.toHaveProperty('buyerEmail');
  await request(app.getHttpServer()).get(`/replacements/${r.id}`).set(headers(v2)).expect(403);
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/action`).set(headers(v)).send({action:'accept'}).expect(200);
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/action`).set(headers(v2)).send({action:'accept'}).expect(403);
  assertManagerNotification('Portal replacement application accepted');
  expect(replacements.findById(r.id)).toMatchObject({assignedVolunteerEmail:v.email,returnAddress:'Shop 12, Market Road, Mumbai 400001'});
  for(const status of ['return_pickup','replacement_in_transit'])await request(app.getHttpServer()).patch(`/replacements/${r.id}/status`).set(headers(v)).send({status}).expect(200);
  const proof=proofs.submit({collection:'replacements',recordId:r.id,title:r.productTitle,organization:'HopeConnect',volunteerEmail:v.email,image:'/replacement-proof.png'});
  await request(app.getHttpServer()).patch(`/proofs/${proof.id}/approve`).set(headers(seller)).send({}).expect(200);
  expect(replacements.findById(r.id)).toMatchObject({status:'replaced',stockReserved:false});expect(products.findById(r.productId).quantity).toBe(stock);
 });
 it('seller replacement portal cancellation restores reserved stock once',()=>{
  const r=claim(),stock=products.findById(r.productId).quantity;
  expect(()=>replacements.arrange(r.id,{...plan,mode:'direct',volunteerEmail:v.email},admin)).toThrow(/seller posts/);
  replacements.arrange(r.id,plan,seller);
  replacements.action(r.id,'accept',undefined,v);replacements.action(r.id,'cancel','Buyer cancelled before pickup',seller);
  expect(products.findById(r.productId).quantity).toBe(stock+1);expect(()=>replacements.action(r.id,'cancel','Repeat',seller)).toThrow();expect(products.findById(r.productId).quantity).toBe(stock+1);
 });
 it('expired portal work disappears and cannot be accepted until a manager reschedules it',()=>{
  const d=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller),r=claim();
  replacements.arrange(r.id,plan,seller);
  (fulfillment as any).deliveries.find((record:any)=>record.id===d.id).scheduledDate='2000-01-01';
  (replacements as any).replacements.find((record:any)=>record.id===r.id).schedule={startDate:'2000-01-01',endDate:'2000-01-01',shiftStart:'10:00',shiftEnd:'11:00',location:'Pune -> Mumbai'};
  expect(fulfillment.portal(v)).toHaveLength(0);expect(replacements.visibleToVolunteer(v.email)).toHaveLength(0);
  expect(()=>fulfillment.act(d.id,'accept',undefined,v)).toThrow(/expired/);
  expect(()=>replacements.action(r.id,'accept',undefined,v)).toThrow(/expired/);
  fulfillment.reoffer(d.id,{...plan,kind:'order',sourceId:d.sourceId},seller);replacements.arrange(r.id,plan,seller);
  expect(fulfillment.portal(v)).toHaveLength(1);expect(replacements.visibleToVolunteer(v.email)).toHaveLength(1);
 });
 it('declined direct invitations notify managers without assigning the volunteer',()=>{
  const d=fulfillment.offer({mode:'direct',volunteerEmail:v.email,kind:'collection',sourceId:donation().id},admin);
  fulfillment.act(d.id,'decline',undefined,v);
  expect(fulfillment.findById(d.id)).toMatchObject({status:'declined'});expect(resources.findById(d.sourceId).assignedVolunteerEmail).toBeFalsy();
  assertManagerNotification('Delivery invitation declined',false,true);
 });
 it('allocates donor collections using the donor slot and address without admin scheduling and accepts volunteer reports',async()=>{
  const donation=resources.create({donorName:'Donor',donorEmail:'donor@kindred.org',donorPhone:'9812345678',orgName:'HopeConnect',category:'Food',items:[{name:'Rice',quantity:10,unit:'kg',condition:'New'}],description:'Rice bags',pickupAddress:'House 12, Mumbai',pickupDate:'2099-01-06',pickupTimeSlot:'Afternoon (12PM-4PM)'});
  const preview=await request(app.getHttpServer()).get(`/fulfillment/collections/${donation.id}/plan`).set(headers(admin)).expect(200);
  expect(preview.body.data).toMatchObject({pickupAddress:donation.pickupAddress,pickupDate:donation.pickupDate,shiftStart:'12:00',shiftEnd:'16:00'});
  await request(app.getHttpServer()).get(`/fulfillment/collections/${donation.id}/plan`).set(headers(seller)).expect(403);
  const response=await request(app.getHttpServer()).post('/fulfillment/deliveries').set(headers(admin)).send({kind:'collection',sourceId:donation.id,mode:'direct',volunteerEmail:v.email}).expect(201);
  const d=response.body.data;expect(d).toMatchObject({scheduledDate:donation.pickupDate,shiftStart:'12:00',shiftEnd:'16:00',pickupAddress:donation.pickupAddress,address:'HopeConnect, Mumbai'});
  fulfillment.act(d.id,'accept',undefined,v);fulfillment.act(d.id,'picked_up',undefined,v);
  await request(app.getHttpServer()).patch(`/fulfillment/deliveries/${d.id}/action`).set(headers(v2)).send({action:'report',reason:'Someone else report'}).expect(403);
  await request(app.getHttpServer()).patch(`/fulfillment/deliveries/${d.id}/action`).set(headers(v)).send({action:'report',reason:'Collected 10 kg rice in good condition; handing over to HopeConnect.'}).expect(200);
  expect(fulfillment.findById(d.id)).toMatchObject({status:'picked_up',history:expect.arrayContaining([expect.objectContaining({note:expect.stringContaining('Collected 10 kg')})])});
  const adminUser=module.get(UsersService).findAll().find(user=>user.role==='admin'&&user.org==='HopeConnect')!;
  expect(notifications.find(adminUser.email,'admin','').some(note=>note.message.includes('Collected 10 kg'))).toBe(true);
 });
 it('resource collections reject portal posting and use donor details for direct allocation',()=>{
  const donation=resources.create({donorName:'Donor',donorEmail:'donor@kindred.org',donorPhone:'9812345678',orgName:'HopeConnect',category:'Food',items:[{name:'Rice',quantity:10,unit:'kg',condition:'New'}],description:'Rice bags',pickupAddress:'House 12, Mumbai',pickupDate:'2099-01-06',pickupTimeSlot:'Evening (4PM-7PM)'});
  const body={kind:'collection' as const,sourceId:donation.id,mode:'broadcast' as const,scheduledDate:'2000-01-01',shiftStart:'01:00',shiftEnd:'02:00',collectionAddress:'Incorrect admin address'};
  expect(()=>fulfillment.offer(body,admin)).toThrow(/particular available volunteer/);
  const direct={...body,mode:'direct' as const,volunteerEmail:v.email};const d=fulfillment.offer(direct,admin);expect(d).toMatchObject({scheduledDate:'2099-01-06',shiftStart:'16:00',shiftEnd:'19:00',pickupAddress:donation.pickupAddress,address:'HopeConnect, Mumbai'});
  const reassigned=fulfillment.reoffer(d.id,direct,admin);expect(reassigned).toMatchObject({scheduledDate:d.scheduledDate,shiftStart:d.shiftStart,address:d.address});
  expect(fulfillment.portal(v)).toHaveLength(0);
 });
 it('seller can use a job-specific pickup address and volunteers report progress directly to the seller',async()=>{
  const o=order();sellers.update(o.sellerId,{pickupAddress:'Saved shop address'});
  const response=await request(app.getHttpServer()).post('/fulfillment/deliveries').set(headers(seller)).send({kind:'order',sourceId:o.id,mode:'broadcast',pickupAddress:'Shop 20, New Market, Mumbai',scheduledDate:plan.scheduledDate,shiftStart:plan.shiftStart,shiftEnd:plan.shiftEnd}).expect(201);
  const d=response.body.data;expect(d).toMatchObject({pickupAddress:'Shop 20, New Market, Mumbai',address:o.address});expect(sellers.findById(o.sellerId).pickupAddress).toBe('Saved shop address');
  fulfillment.act(d.id,'accept',undefined,v);
  await request(app.getHttpServer()).patch(`/fulfillment/deliveries/${d.id}/action`).set(headers(v)).send({action:'report',reason:'At the seller shop; collecting the parcel.'}).expect(200);
  expect(fulfillment.findById(d.id).history.at(-1)?.note).toContain('At the seller shop');
  expect(notifications.find(seller.email,'seller','').some(note=>note.message.includes('At the seller shop'))).toBe(true);
 });
 it('one-hour cancellation is enforced by the API without restoring stock after expiry',async()=>{
  const o=order(),record=(orders as any).orders.find((item:any)=>item.id===o.id),stock=products.findById(o.productId).quantity;
  record.createdAt=new Date(Date.now()-3600000).toISOString();
  await request(app.getHttpServer()).patch(`/orders/${o.id}/cancel`).set({role:'donor','user-email':o.buyerEmail}).send({reason:'Cancel'}).expect(400);
  expect(products.findById(o.productId).quantity).toBe(stock);expect(orders.findById(o.id).deliveryStatus).toBe('awaiting_admin_assignment');
  record.createdAt=new Date(Date.now()-3590000).toISOString();
  await request(app.getHttpServer()).patch(`/orders/${o.id}/cancel`).set({role:'donor','user-email':o.buyerEmail}).send({reason:'Cancel within one hour'}).expect(200);
  expect(products.findById(o.productId).quantity).toBe(stock+1);
 });
 it('replacement posting accepts a seller-entered exchange address and reports progress to the seller',()=>{
  const r=claim(),posted=replacements.arrange(r.id,{...plan,pickupAddress:'Exchange shop 42, Mumbai'},seller);
  expect(posted).toMatchObject({pickupAddress:orders.findById(r.orderId).address,returnAddress:'Exchange shop 42, Mumbai',mode:'broadcast',status:'portal_open'});
  replacements.action(r.id,'accept',undefined,v);replacements.action(r.id,'report','Original item collected; travelling to the exchange shop.',v);
  expect(replacements.findById(r.id)).toMatchObject({status:'volunteer_assigned',assignedVolunteerEmail:v.email});
  expect(notifications.find(seller.email,'seller','').some(note=>note.message.includes('Original item collected'))).toBe(true);
 });
 it('old broadcast donation collections require admin allocation instead of remaining claimable on the portal',()=>{
  const d=fulfillment.offer({kind:'collection',sourceId:donation().id,mode:'direct',volunteerEmail:v.email},admin);
  (fulfillment as any).deliveries.find((record:any)=>record.id===d.id).mode='broadcast';
  expect(fulfillment.portal(v)).toHaveLength(0);expect(fulfillment.listDeliveries(v)).toHaveLength(0);
  expect(()=>fulfillment.act(d.id,'accept',undefined,v)).toThrow(/allocated by the organization admin/);
  fulfillment.reoffer(d.id,{kind:'collection',sourceId:d.sourceId,mode:'direct',volunteerEmail:v.email},admin);
  expect(fulfillment.act(d.id,'accept',undefined,v).status).toBe('accepted');
 });
 it('reviews full delivery details and permits explicit single-job availability consent without altering preferences',async()=>{
  volunteers.updatePresence(v.email,{availableFrom:'2099-02-01',availableUntil:'2099-03-01',availabilityDays:['Sunday'],willingToTravel:false});
  const o=order(),d=fulfillment.offer({...plan,kind:'order',sourceId:o.id},seller);
  const response=await request(app.getHttpServer()).get(`/fulfillment/deliveries/${d.id}/brief`).set(headers(v)).expect(200),brief=response.body.data;
  expect(brief).toMatchObject({pickupAddress:d.pickupAddress,address:o.address,sellerName:'Ravi Handicrafts',items:[{name:o.productTitle,quantity:o.quantity}],available:true});
  expect(brief.eligibility.eligible).toBe(false);expect(brief.blockers).toHaveLength(0);
  await request(app.getHttpServer()).get(`/fulfillment/deliveries/${d.id}/brief`).set(headers(seller)).expect(403);
  await request(app.getHttpServer()).patch(`/fulfillment/deliveries/${d.id}/action`).set(headers(v)).send({action:'accept',reviewedVersion:brief.reviewedVersion}).expect(400);
  await request(app.getHttpServer()).patch(`/fulfillment/deliveries/${d.id}/action`).set(headers(v)).send({action:'accept',reviewedVersion:brief.reviewedVersion,confirmAvailability:true}).expect(200);
  expect(orders.findById(o.id).assignedVolunteerEmail).toBe(v.email);
  expect(volunteers.findByEmail(v.email)).toMatchObject({availableFrom:'2099-02-01',availabilityDays:['Sunday'],willingToTravel:false});
  const count=notifications.find(seller.email,'seller','').filter(note=>note.title==='Portal delivery application accepted').length;
  fulfillment.act(d.id,'accept',undefined,v,{confirmAvailability:true,reviewedVersion:brief.reviewedVersion});
  expect(notifications.find(seller.email,'seller','').filter(note=>note.title==='Portal delivery application accepted')).toHaveLength(count);
 });
 it('conflicting deliveries require explicit acknowledgement and stale details still require a fresh review',()=>{
  const d=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller),brief=fulfillment.brief(d.id,v);
  fulfillment.reoffer(d.id,{...plan,kind:'order',sourceId:d.sourceId,requirements:'Bring a van'},seller);
  expect(()=>fulfillment.act(d.id,'accept',undefined,v,{confirmAvailability:true,reviewedVersion:brief.reviewedVersion})).toThrow(/details changed/);
  fulfillment.act(d.id,'accept',undefined,v,{confirmAvailability:true,reviewedVersion:fulfillment.brief(d.id,v).reviewedVersion});
  const other=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller),otherBrief=fulfillment.brief(other.id,v);
  expect(otherBrief.available).toBe(true);expect(otherBrief.conflicts).toHaveLength(1);
  expect(()=>fulfillment.act(other.id,'accept',undefined,v,{confirmAvailability:true})).toThrow(/Acknowledge/);
  const accepted=fulfillment.act(other.id,'accept',undefined,v,{confirmAvailability:true,confirmConflict:true});expect(accepted.scheduleConflicts).toHaveLength(1);expect(accepted.history.at(-1)?.note).toContain('conflict acknowledged');
 });
 it('approved volunteers missing a directory profile can review and accept portal work',()=>{
  const users=module.get(UsersService),user=users.create({name:'New Volunteer',email:'new.portal@example.test',password:'Secure@123',role:'volunteer'});
  (users as any).users.find((record:any)=>record.id===user.id).verificationStatus='verified';users.approve(user.id);expect(volunteers.findByEmail(user.email)).toBeNull();
  const actor={role:'volunteer',email:user.email,org:''},d=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller),brief=fulfillment.brief(d.id,actor);
  expect(brief.available).toBe(true);expect(volunteers.findByEmail(user.email)?.status).toBe('active');
  expect(fulfillment.act(d.id,'accept',undefined,actor,{confirmAvailability:true,reviewedVersion:brief.reviewedVersion}).volunteerEmail).toBe(user.email);
 });
 it('source assignment failure releases a provisional delivery reservation',()=>{
  const d=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller);
  orders.cancel(d.sourceId,'Buyer cancelled through source service');
  expect(fulfillment.brief(d.id,v).available).toBe(false);
  expect(()=>fulfillment.act(d.id,'accept',undefined,v,{confirmAvailability:true})).toThrow(/Cannot assign/);
  const other=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller);
  expect(fulfillment.act(other.id,'accept',undefined,v,{confirmAvailability:true}).status).toBe('accepted');
 });
 it('replacement details show the full exchange route and explicit consent handles saved weekday restrictions',async()=>{
  const r=claim();replacements.arrange(r.id,plan,seller);
  volunteers.updatePresence(v.email,{availableFrom:'2099-02-01',availabilityDays:['Sunday']});
  const response=await request(app.getHttpServer()).get(`/replacements/${r.id}/brief`).set(headers(v)).expect(200),brief=response.body.data;
  expect(brief).toMatchObject({pickupAddress:orders.findById(r.orderId).address,address:'Shop 12, Market Road, Mumbai 400001',finalAddress:orders.findById(r.orderId).address,available:true});
  expect(brief.eligibility.eligible).toBe(false);
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/action`).set(headers(v)).send({action:'accept',confirmAvailability:true,reviewedVersion:brief.reviewedVersion}).expect(200);
  expect(replacements.findById(r.id).assignedVolunteerEmail).toBe(v.email);
 });
 it('org admins can allocate a volunteer with overlapping work and the volunteer acknowledges the conflict',()=>{
  const first=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller);fulfillment.act(first.id,'accept',undefined,v);
  const donationRecord=donation(),candidate=fulfillment.collectionPlan(donationRecord.id,admin).candidates.find(candidate=>candidate.email===v.email)!;
  expect(candidate.eligible).toBe(true);expect(candidate.conflicts).toHaveLength(1);
  const d=fulfillment.offer({kind:'collection',sourceId:donationRecord.id,mode:'direct',volunteerEmail:v.email},admin);
  expect(fulfillment.brief(d.id,v).conflicts).toHaveLength(1);
  expect(()=>fulfillment.act(d.id,'accept',undefined,v)).toThrow(/Acknowledge/);
  expect(fulfillment.act(d.id,'accept',undefined,v,{confirmConflict:true}).scheduleConflicts).toHaveLength(1);
 });
 it('replacement volunteers may accept overlapping work after acknowledging the conflict',()=>{
  const first=fulfillment.offer({...plan,kind:'order',sourceId:order().id},seller);fulfillment.act(first.id,'accept',undefined,v);
  const r=claim();replacements.arrange(r.id,plan,seller);
  expect(replacements.brief(r.id,v).conflicts).toHaveLength(1);
  expect(()=>replacements.action(r.id,'accept',undefined,v,{confirmAvailability:true})).toThrow(/Acknowledge/);
  expect(replacements.action(r.id,'accept',undefined,v,{confirmAvailability:true,confirmConflict:true}).scheduleConflicts).toHaveLength(1);
 });
 it('only the buyer can confirm receipt, acknowledgement is idempotent and proof verification remains separate',async()=>{
  const o=order(),buyer={role:'donor','user-email':o.buyerEmail};
  await request(app.getHttpServer()).patch(`/orders/${o.id}/received`).set(buyer).send({}).expect(400);
  const d=fulfillment.offer({...plan,kind:'order',sourceId:o.id},seller);fulfillment.act(d.id,'accept',undefined,v);fulfillment.act(d.id,'picked_up',undefined,v);fulfillment.act(d.id,'in_transit',undefined,v);
  await request(app.getHttpServer()).patch(`/orders/${o.id}/received`).set({role:'donor','user-email':'someone@example.test'}).send({}).expect(403);
  const response=await request(app.getHttpServer()).patch(`/orders/${o.id}/received`).set(buyer).send({}).expect(200),timestamp=response.body.data.buyerReceivedAt;
  expect(timestamp).toBeTruthy();expect(response.body.data.deliveryStatus).toBe('in_transit');expect(fulfillment.findById(d.id).status).toBe('in_transit');
  const repeated=await request(app.getHttpServer()).patch(`/orders/${o.id}/received`).set(buyer).send({}).expect(200);expect(repeated.body.data.buyerReceivedAt).toBe(timestamp);
  expect(notifications.find(seller.email,'seller','').filter(note=>note.title==='Buyer confirmed delivery received')).toHaveLength(1);
 });
 it('buyers acknowledge replacement receipt without bypassing seller proof verification',async()=>{
  const r=claim(),buyer={role:'donor','user-email':r.buyerEmail};replacements.arrange(r.id,plan,seller);replacements.action(r.id,'accept',undefined,v);
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/received`).set(buyer).send({}).expect(400);
  replacements.updateStatus(r.id,'return_pickup');replacements.updateStatus(r.id,'replacement_in_transit');
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/received`).set(headers(v2)).send({}).expect(403);
  const response=await request(app.getHttpServer()).patch(`/replacements/${r.id}/received`).set(buyer).send({}).expect(200);
  expect(response.body.data.buyerReceivedAt).toBeTruthy();expect(response.body.data.status).toBe('replacement_in_transit');expect(response.body.data.stockReserved).toBe(true);
  await request(app.getHttpServer()).patch(`/replacements/${r.id}/received`).set(buyer).send({}).expect(200);
  expect(notifications.find(seller.email,'seller','').filter(note=>note.title==='Buyer confirmed replacement received')).toHaveLength(1);
 });
});
