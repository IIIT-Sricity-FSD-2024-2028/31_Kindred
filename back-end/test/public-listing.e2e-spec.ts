import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

describe('Bank prerequisites and public organization donation totals', () => {
  let app: INestApplication;
  const admin = { role:'admin', organization:'New Community NGO', 'user-email':'admin@hopeconnect.org' };
  const platform = { role:'superuser' };
  const bank = { bankAccountName:'New Community NGO',bankAccountNumber:'12345678901',bankIfsc:'SBIN0001234' };
  const data = (r: any) => r.body.data;
  beforeEach(async () => {
    const module = await Test.createTestingModule({imports:[AppModule]}).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });
  afterEach(async () => { await app.close(); });

  it('starts with approved static organizations and active programs while new registrations remain private', async () => {
    const server = app.getHttpServer();
    const organizations = data(await request(server).get('/organizations').expect(200));
    const programs = data(await request(server).get('/programs').expect(200));
    expect(organizations).toHaveLength(10);
    expect(organizations.find((o: any) => o.id === 'org_001')).toMatchObject({ name:'HopeConnect',listingStatus:'approved',bankIfsc:'DEMO0000001' });
    expect(organizations.every((o: any) => o.status === 'active')).toBe(true);
    expect(programs.map((p: any) => p.name)).toEqual(['Cyclone Relief Fund','Clean Water Initiative']);
  });

  it('requires saved banking details, platform approval and exact recipient allocation before public display', async () => {
    const server = app.getHttpServer();
    await request(server).post('/organizations').set(platform).send({ id:'org_banktest',name:'New Community NGO',focus:'Education',city:'Pune',email:'new@example.test',phone:'9812345678',status:'active' }).expect(201);
    const program = { name:'Bank-gated program',org:'New Community NGO',startDate:'2026-10-16',budget:1000,description:'Community support',requestListing:true };
    expect(data(await request(server).get('/organizations')).some((o: any) => o.id === 'org_banktest')).toBe(false);
    const privateProgram = data(await request(server).post('/programs').set(admin).send({...program,requestListing:false}).expect(201));
    await request(server).get(`/programs/${privateProgram.id}`).expect(403);
    await request(server).patch('/organizations/org_banktest/request-listing').set(admin).send(bank).expect(400);
    await request(server).post('/programs').set(admin).send(program).expect(400);
    await request(server).patch(`/programs/${privateProgram.id}`).set(admin).send({requestListing:true}).expect(400);
    await request(server).patch('/organizations/org_banktest').set(admin).send(bank).expect(200);
    await request(server).patch('/organizations/org_banktest/request-listing').set(admin).send(bank).expect(200);
    expect(data(await request(server).get('/organizations')).some((o: any) => o.id === 'org_banktest')).toBe(false);
    const created = data(await request(server).post('/programs').set(admin).send(program).expect(201));
    await request(server).patch(`/programs/${created.id}/approve-listing`).set(platform).send({}).expect(200);
    expect(data(await request(server).get('/programs')).some((p: any) => p.id === created.id)).toBe(false);
    await request(server).patch('/organizations/org_banktest/approve-listing').set(platform).send({}).expect(200);
    expect(data(await request(server).get('/organizations/org_banktest')).name).toBe('New Community NGO');
    expect(data(await request(server).get('/programs')).some((p: any) => p.id === created.id)).toBe(true);
    await request(server).post('/donations').set({role:'donor','user-email':'donor@kindred.org'}).send({ org:'New Community NGO',programId:created.id,amount:750,donor:'Donor',email:'donor@kindred.org',cardLast4:'1111',cardType:'Visa' }).expect(201);
    const totals = data(await request(server).get('/donations/public/organizations').expect(200));
    expect(totals.filter((o: any) => o.orgId === 'org_banktest')).toEqual([{orgId:'org_banktest',org:'New Community NGO',total:750,count:1,paymentMode:'card_demo'}]);
    expect(JSON.stringify(totals)).not.toMatch(/donor@|12345678901/);
    expect(data(await request(server).get('/donations/by-org/MyTrust%20Foundation').set(platform))).toEqual([]);
    await request(server).patch('/organizations/org_banktest').set(admin).send({bankAccountNumber:''}).expect(200);
    expect(data(await request(server).get('/organizations')).some((o: any) => o.id === 'org_banktest')).toBe(false);
    expect(data(await request(server).get('/programs')).some((p: any) => p.id === created.id)).toBe(false);
    await request(server).patch('/organizations/org_banktest/request-listing').set(admin).send(bank).expect(400);
  });

  it('distinguishes pending registration from missing bank details and enables listing after approval', async () => {
    const server = app.getHttpServer();
    await request(server).post('/organizations/register').send({ id:'org_pendingbank',name:admin.organization,focus:'Education',city:'Pune',email:'pending@example.test',phone:'9812345678' }).expect(201);
    await request(server).patch('/organizations/org_pendingbank').set(admin).send(bank).expect(200);
    const denied = await request(server).patch('/organizations/org_pendingbank/request-listing').set(admin).send(bank).expect(400);
    expect(denied.body.message).toContain('registration must be approved');
    const saved = data(await request(server).get('/organizations/manage').set(admin).expect(200));
    expect(saved[0]).toMatchObject({...bank,status:'pending'});
    await request(server).patch('/organizations/org_pendingbank/approve').set(platform).send({}).expect(200);
    const submitted = data(await request(server).patch('/organizations/org_pendingbank/request-listing').set(admin).send(bank).expect(200));
    expect(submitted.listingStatus).toBe('pending');
  });
});
