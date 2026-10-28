import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { ProofStore } from '../src/modules/proofs/store';
import { enableLocalState } from '../src/common/local-state';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('Resource inventory, beneficiary requests and shared delivery acceptance',()=>{
 let app:INestApplication;
 const admin={role:'admin',organization:'HopeConnect','user-email':'admin@hopeconnect.org'};
 const otherAdmin={...admin,organization:'MyTrust Foundation'};
 const beneficiary={role:'beneficiary','user-email':'beneficiary@kindred.org'};
 const volunteer={role:'volunteer','user-email':'volunteer@kindred.org'};
 const secondVolunteer={role:'volunteer','user-email':'amit.sharma@email.com'};
 const seller={role:'seller','user-email':'seller@kindred.org'};
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jN1sAAAAASUVORK5CYII=','base64');
 const data=(response:any)=>response.body.data;
 const newRequest=(quantity=3)=>request(app.getHttpServer()).post('/fulfillment/requests').set(beneficiary).send({orgName:'HopeConnect',resource:'Blankets',quantity,reason:'Winter supplies',address:'Recipient address, Pune',phone:'9812345678',name:'Beneficiary'});
 beforeEach(async()=>{
  const module=await Test.createTestingModule({imports:[AppModule]}).compile();app=module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));app.useGlobalInterceptors(new ResponseInterceptor());await app.init();
 });
 afterEach(async()=>{await app.close();});
 async function receiveStock(){return data(await request(app.getHttpServer()).post('/fulfillment/receipts/rdon_002').set(admin).send({items:[{index:0,quantity:4},{index:1,quantity:0}]}).expect(201))[0];}
 function approve(id:string,stockId:string,quantity=3){return request(app.getHttpServer()).patch(`/fulfillment/requests/${id}/respond`).set(admin).send({decision:'approve',message:'Supplies reserved for you',allocations:[{stockId,quantity}]});}
 async function offer(kind:string,sourceId:string,mode='broadcast',manager=admin){return data(await request(app.getHttpServer()).post('/fulfillment/deliveries').set(manager).send({kind,sourceId,mode,volunteerEmail:mode==='direct'?volunteer['user-email']:undefined}).expect(201));}
 function act(id:string,action:string,actor=volunteer,reason?:string){return request(app.getHttpServer()).patch(`/fulfillment/deliveries/${id}/action`).set(actor).send({action,reason});}
 async function upload(id:string){return data(await request(app.getHttpServer()).post('/proofs').set(volunteer).field('collection','deliveries').field('recordId',id).attach('file',png,'proof.png').expect(201));}

 it('reserves stock atomically, prevents duplicate receipts and isolates organizations and beneficiaries',async()=>{
  const server=app.getHttpServer(),stock=await receiveStock();
  await request(server).post('/fulfillment/receipts/rdon_002').set(admin).send({items:[{index:0,quantity:4},{index:1,quantity:0}]}).expect(409);
  const first=data(await newRequest().expect(201)),second=data(await newRequest(2).expect(201));
  await approve(first.id,stock.id).expect(200);
  await approve(second.id,stock.id,2).expect(409);
  expect(data(await request(server).get('/fulfillment/inventory').set(admin))[0]).toMatchObject({available:1,reserved:3,distributed:0});
  expect(data(await request(server).get('/fulfillment/inventory').set(otherAdmin))).toEqual([]);
  expect(data(await request(server).get('/fulfillment/requests').set({...beneficiary,'user-email':'stranger@test.org'}))).toEqual([]);
  await request(server).patch(`/fulfillment/requests/${first.id}/respond`).set(otherAdmin).send({decision:'reject',message:'Wrong org'}).expect(403);
  await request(server).patch('/resource-donations/rdon_002').set(admin).send({items:[]}).expect(409);
  await request(server).patch(`/fulfillment/requests/${first.id}/respond`).set(admin).send({decision:'cancel',message:'Request cancelled'}).expect(200);
  expect(data(await request(server).get('/fulfillment/inventory').set(admin))[0]).toMatchObject({available:4,reserved:0});
 });

 it('awards broadcast to exactly one volunteer, requires proof and verification before distribution',async()=>{
  const server=app.getHttpServer(),stock=await receiveStock(),r=data(await newRequest(5).expect(201));
  const approved=data(await approve(r.id,stock.id,3).expect(200));expect(approved.status).toBe('partially_approved');
  const delivery=await offer('resource',r.id);
  const preview=data(await request(server).get('/fulfillment/deliveries').set(volunteer))[0];
  expect(preview.address).toBe('Details shared after acceptance');expect(preview.contact).toBe('');
  const results=await Promise.all([act(delivery.id,'accept',volunteer),act(delivery.id,'accept',secondVolunteer)]);
  expect(results.map(r=>r.status).sort()).toEqual([200,409]);
  const winner=results[0].status===200?volunteer:secondVolunteer,loser=results[0].status===200?secondVolunteer:volunteer;
  await act(delivery.id,'picked_up',loser).expect(403);
  await act(delivery.id,'picked_up',winner).expect(200);await act(delivery.id,'in_transit',winner).expect(200);
  await request(server).post('/proofs').set(winner).field('collection','deliveries').field('recordId',delivery.id).expect(400);
  const proof=data(await request(server).post('/proofs').set(winner).field('collection','deliveries').field('recordId',delivery.id).attach('file',png,'proof.png').expect(201));
  expect(data(await request(server).get('/fulfillment/inventory').set(admin))[0].reserved).toBe(3);
  await request(server).patch(`/proofs/${proof.id}/approve`).set(otherAdmin).send({}).expect(403);
  await request(server).patch(`/proofs/${proof.id}/reject`).set(admin).send({}).expect(400);
  await request(server).patch(`/proofs/${proof.id}/reject`).set(admin).send({reason:'Photo unclear'}).expect(200);
  const replacement=data(await request(server).post('/proofs').set(winner).field('collection','deliveries').field('recordId',delivery.id).attach('file',png,'proof.png').expect(201));
  await request(server).patch(`/proofs/${replacement.id}/approve`).set(admin).send({}).expect(200);
  expect(data(await request(server).get('/fulfillment/inventory').set(admin))[0]).toMatchObject({available:1,reserved:0,distributed:3});
  expect(data(await request(server).get('/fulfillment/requests').set(beneficiary))[0].status).toBe('delivered');
  await request(server).patch(`/fulfillment/requests/${r.id}/receipt`).set(beneficiary).send({message:'Received safely'}).expect(200);
 });

 it('supports information requests, program linking, withdrawals, returns and cancellation without losing stock',async()=>{
  const server=app.getHttpServer(),stock=await receiveStock(),r=data(await newRequest().expect(201));
  await request(server).patch(`/fulfillment/requests/${r.id}/respond`).set(admin).send({decision:'information',message:'Please explain the quantity'}).expect(200);
  await request(server).patch(`/fulfillment/requests/${r.id}/message`).set(beneficiary).send({message:'For three family members'}).expect(200);
  await request(server).patch(`/fulfillment/requests/${r.id}/message`).set(admin).send({message:'Linked relief program',programId:'prog_001'}).expect(200);
  await approve(r.id,stock.id).expect(200);
  const d=await offer('resource',r.id,'direct');
  await act(d.id,'accept',secondVolunteer).expect(403);await act(d.id,'accept').expect(200);
  await act(d.id,'withdraw',volunteer,'Cannot attend').expect(200);
  await request(server).patch(`/fulfillment/deliveries/${d.id}/offer`).set(admin).send({kind:'resource',sourceId:r.id,mode:'broadcast'}).expect(200);
  await act(d.id,'accept').expect(200);await act(d.id,'picked_up').expect(200);await act(d.id,'failed',volunteer,'Recipient unavailable').expect(200);
  await act(d.id,'cancel',admin,'Cancel now').expect(400);
  await act(d.id,'return',admin,'All reserved items returned to warehouse').expect(200);
  await act(d.id,'cancel',admin,'Request cancelled after return').expect(200);
  expect(data(await request(server).get('/fulfillment/inventory').set(admin))[0]).toMatchObject({available:4,reserved:0,distributed:0});
 });

 it('uses the same acceptance flow for shop orders with seller verification and legacy-route protection',async()=>{
  const server=app.getHttpServer();
  const order=data(await request(server).post('/orders').send({productId:'prod_001',quantity:1,buyerName:'Buyer',buyerEmail:'buyer@test.org',buyerPhone:'9812345678',address:'Buyer address'}).expect(201));
  const d=await offer('order',order.id,'direct',seller);
  await request(server).patch(`/orders/${order.id}/assign-volunteer`).set(admin).send({volunteerEmail:secondVolunteer['user-email'],volunteerName:'Amit'}).expect(409);
  await act(d.id,'accept',secondVolunteer).expect(403);await act(d.id,'accept').expect(200);
  await request(server).patch(`/orders/${order.id}/delivery-status`).set(volunteer).send({status:'picked_up'}).expect(409);
  await act(d.id,'picked_up').expect(200);await act(d.id,'in_transit').expect(200);
  const proof=await upload(d.id);
  expect(data(await request(server).get('/proofs').set(seller)).some((p:any)=>p.id===proof.id)).toBe(true);
  await request(server).patch(`/proofs/${proof.id}/approve`).set(admin).send({}).expect(403);
  await request(server).patch(`/proofs/${proof.id}/approve`).set(seller).send({}).expect(200);
  expect(data(await request(server).get(`/orders/${order.id}`).set(admin)).deliveryStatus).toBe('delivered');
  expect(data(await request(server).get('/fulfillment/inventory').set(admin))).toEqual([]);
 });

 it('requires collection proof before receipt and blocks delivery changes while proof is pending',async()=>{
  const server=app.getHttpServer(),d=await offer('collection','rdon_003');
  await request(server).get('/resource-donations/rdon_003').set(volunteer).expect(403);
  await request(server).post('/fulfillment/receipts/rdon_003').set(admin).send({items:[{index:0,quantity:25},{index:1,quantity:100},{index:2,quantity:500}]}).expect(400);
  await act(d.id,'accept').expect(200);await act(d.id,'picked_up').expect(200);await act(d.id,'in_transit').expect(200);
  await request(server).get('/resource-donations/rdon_003').set(volunteer).expect(200);
  const proof=await upload(d.id);
  await act(d.id,'failed',volunteer,'Try to bypass review').expect(400);
  await request(server).patch(`/proofs/${proof.id}/approve`).set(admin).send({}).expect(200);
  await request(server).post('/fulfillment/receipts/rdon_003').set(admin).send({items:[{index:0,quantity:24},{index:1,quantity:100},{index:2,quantity:500}]}).expect(201);
  expect(app.get(ProofStore).all().find(p=>p.id===proof.id)?.status).toBe('approved');
 });

 it('preserves reservations, account records and pending delivery offers across a local server restart',async()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'kindred-fulfillment-'));
  const file=path.join(directory,'state.json');
  try {
   await app.close();
   const initialModule=await Test.createTestingModule({imports:[AppModule]}).compile();app=initialModule.createNestApplication();
   enableLocalState(app,file);
   app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));app.useGlobalInterceptors(new ResponseInterceptor());await app.init();
   const stock=await receiveStock(),r=data(await newRequest().expect(201));await approve(r.id,stock.id).expect(200);await offer('resource',r.id);
   expect(fs.readFileSync(file).includes(Buffer.from('Winter supplies'))).toBe(false);
   expect(fs.readFileSync(file).subarray(0,4).toString()).toBe('KND1');
   await app.close();
   const module=await Test.createTestingModule({imports:[AppModule]}).compile();app=module.createNestApplication();
   enableLocalState(app,file);app.useGlobalInterceptors(new ResponseInterceptor());await app.init();
   expect(data(await request(app.getHttpServer()).get('/fulfillment/inventory').set(admin))[0]).toMatchObject({available:1,reserved:3});
   expect(data(await request(app.getHttpServer()).get('/fulfillment/deliveries').set(volunteer))[0].status).toBe('awaiting_acceptance');
   expect(data(await request(app.getHttpServer()).get('/users').set({role:'superuser'})).length).toBeGreaterThan(0);
  } finally {if(!path.resolve(directory).startsWith(path.resolve(os.tmpdir())+path.sep))throw new Error('Unexpected test directory');fs.rmSync(directory,{recursive:true,force:true});}
 });
});
