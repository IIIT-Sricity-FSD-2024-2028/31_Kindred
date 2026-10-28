import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

describe('Listing review and program membership', () => {
  let app: INestApplication;
  const admin = { role: 'admin', organization: 'Test Organization' };
  const platform = { role: 'superuser' };
  const volunteer = { role: 'volunteer', 'user-email': 'invited@example.test' };
  const bank = { bankAccountName: 'Test Organization', bankAccountNumber: '12345678901', bankIfsc: 'SBIN0001234' };
  const data = (response: any) => response.body.data;

  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });
  afterEach(async () => { await app.close(); });

  it('requires bank details, keeps pending/rejected organizations private, and publishes only after platform approval', async () => {
    const server = app.getHttpServer();
    const org = data(await request(server).post('/organizations').set(platform).send({ name: admin.organization, focus: 'Education', city: 'Pune', email: 'org@example.test', phone: '9812345678', status: 'active' }).expect(201));
    const visible = async () => data(await request(server).get('/organizations').expect(200)).some((item: any) => item.id === org.id);
    expect(await visible()).toBe(false);
    await request(server).patch(`/organizations/${org.id}/request-listing`).set(admin).send({ bankAccountName: 'Test' }).expect(400);
    await request(server).patch(`/organizations/${org.id}/request-listing`).set({ ...admin, organization: 'Other Organization' }).send(bank).expect(403);
    await request(server).patch(`/organizations/${org.id}`).set(admin).send(bank).expect(200);
    const pending = data(await request(server).patch(`/organizations/${org.id}/request-listing`).set(admin).send(bank).expect(200));
    expect(pending.listingStatus).toBe('pending');
    expect(await visible()).toBe(false);
    await request(server).get(`/organizations/${org.id}`).expect(400);
    await request(server).patch(`/organizations/${org.id}`).set(admin).send({ listingStatus: 'approved' }).expect(400);
    await request(server).patch(`/organizations/${org.id}`).set(admin).send({ status: 'active' }).expect(403);
    await request(server).patch(`/organizations/${org.id}/approve-listing`).set(admin).send({}).expect(403);
    await request(server).patch(`/organizations/${org.id}/reject-listing`).set(platform).send({}).expect(200);
    expect(await visible()).toBe(false);
    await request(server).patch(`/organizations/${org.id}/request-listing`).set(admin).send(bank).expect(200);
    await request(server).patch(`/organizations/${org.id}/approve-listing`).set(platform).send({}).expect(200);
    expect(await visible()).toBe(true);
    await request(server).get(`/organizations/${org.id}`).expect(200);
    const own = data(await request(server).get('/organizations/manage').set(admin).expect(200));
    expect(own.map((item: any) => item.id)).toEqual([org.id]);
  });

  it('prevents assignment before volunteer acceptance, including attempts to bypass it, and checks reassignment', async () => {
    const server = app.getHttpServer();
    const assignment = data(await request(server).post('/program-assignments').set(admin).send({ programId: 'prog_001', programName: 'Cyclone Relief Fund', volunteerEmail: volunteer['user-email'], volunteerName: 'Invited', status: 'active' }).expect(201));
    expect(assignment.status).toBe('pending');
    const task = { title: 'Member task', programId: 'prog_001', assignedToEmail: volunteer['user-email'], assignedToName: 'Invited' };
    await request(server).post('/tasks').set(admin).send(task).expect(400);
    await request(server).post('/subtasks').set(admin).send(task).expect(400);
    await request(server).patch(`/program-assignments/${assignment.id}`).set(admin).send({ status: 'active' }).expect(400);
    await request(server).patch(`/program-assignments/${assignment.id}/respond`).set({ ...volunteer, 'user-email': 'other@example.test' }).send({ action: 'accepted' }).expect(403);
    await request(server).patch(`/program-assignments/${assignment.id}/respond`).set(volunteer).send({ action: 'invalid' }).expect(400);
    await request(server).patch(`/program-assignments/${assignment.id}/respond`).set(volunteer).send({ action: 'accepted' }).expect(200);
    const savedTask = data(await request(server).post('/tasks').set(admin).send(task).expect(201));
    const savedSubtask = data(await request(server).post('/subtasks').set(admin).send(task).expect(201));
    for (const [collection, id] of [['tasks', savedTask.id], ['subtasks', savedSubtask.id]]) {
      await request(server).patch(`/${collection}/${id}`).set(admin).send({ assignedToEmail: 'outsider@example.test' }).expect(400);
      await request(server).patch(`/${collection}/${id}`).set(admin).send({ programId: 'prog_002' }).expect(400);
      await request(server).patch(`/${collection}/${id}`).set(admin).send({ programId: '' }).expect(collection === 'tasks' ? 400 : 404);
    }
    await request(server).patch(`/program-assignments/${assignment.id}`).set(admin).send({ status: 'cancelled' }).expect(200);
    await request(server).post('/tasks').set(admin).send(task).expect(400);
    await request(server).patch(`/program-assignments/${assignment.id}`).set(admin).send({ status: 'pending' }).expect(200);
    await request(server).patch(`/program-assignments/${assignment.id}/respond`).set(volunteer).send({ action: 'declined' }).expect(200);
    await request(server).post('/subtasks').set(admin).send(task).expect(400);
  });
});
