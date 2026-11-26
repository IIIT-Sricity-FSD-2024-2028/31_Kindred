import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { AppModule } from '../../app.module';
import { AllExceptionsFilter } from '../filters/http-exception.filter';
import { enableDatabaseRepositories } from './database';
import { repositoryDefinitions } from './definitions';
import { OrganizationsService } from '../../modules/organizations/service';
import { VolunteersService } from '../../modules/volunteers/service';
jest.setTimeout(30000);

describe('real HTTP controllers and SQLite repositories', () => {
  let app: INestApplication;
  let directory: string;
  let file: string;
  let persistence: ReturnType<typeof enableDatabaseRepositories>;
  const headers = { role: 'superuser' };
  async function open() {
    app = await NestFactory.create(AppModule, { logger: false });
    persistence = enableDatabaseRepositories(app, file);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(0, '127.0.0.1');
  }
  beforeEach(async () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kindred-repositories-'));
    file = path.join(directory, 'records.sqlite');
    await open();
  });
  afterEach(async () => {
    await app.close();
    if (!path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep) || !path.basename(directory).startsWith('kindred-repositories-')) throw new Error('Unexpected test directory');
    fs.rmSync(directory, { recursive: true, force: true });
  });
  it('registers exactly one repository per domain and persists CRUD through an application restart', async () => {
    expect([...persistence.repositories.keys()].sort()).toEqual(Object.keys(repositoryDefinitions).sort());
    const org = app.get(OrganizationsService).findAll()[0].name;
    const created = await request(app.getHttpServer()).post('/requests').set(headers).send({ org, type: 'Architecture verification', description: randomUUID() }).expect(201);
    const id = created.body.data.id;
    expect(Number(created.headers['x-kindred-revision'])).toBeGreaterThan(0);
    await app.close();
    await open();
    const loaded = await request(app.getHttpServer()).get(`/requests/${id}`).set(headers).expect(200);
    expect(loaded.body.data.description).toBe(created.body.data.description);
    const description = randomUUID();
    await request(app.getHttpServer()).patch(`/requests/${id}`).set(headers).send({ description }).expect(200);
    expect((await request(app.getHttpServer()).get(`/requests/${id}`).set(headers)).body.data.description).toBe(description);
    await request(app.getHttpServer()).delete(`/requests/${id}`).set(headers).expect(200);
    await request(app.getHttpServer()).get(`/requests/${id}`).set(headers).expect(404);
  });
  it('rolls back both the database and service records when a real database write fails', async () => {
    const org = app.get(OrganizationsService).findAll()[0].name;
    const created = await request(app.getHttpServer()).post('/requests').set(headers).send({ org, type: 'Transaction verification', description: randomUUID() }).expect(201);
    const id = created.body.data.id;
    const before = persistence.repositories.get('requests')!.read();
    persistence.database.exec("CREATE TRIGGER reject_request_write BEFORE UPDATE ON repository_records WHEN NEW.repository='requests' BEGIN SELECT RAISE(FAIL,'Intentional transaction failure'); END");
    await request(app.getHttpServer()).patch(`/requests/${id}`).set(headers).send({ description: randomUUID() }).expect(500);
    persistence.database.exec('DROP TRIGGER reject_request_write');
    expect(persistence.repositories.get('requests')!.read()).toEqual(before);
    expect((await request(app.getHttpServer()).get(`/requests/${id}`).set(headers)).body.data.description).toBe(created.body.data.description);
  });
  it('rolls back related notifications and tasks together instead of partially committing a workflow', async () => {
    const beforeTasks = persistence.repositories.get('tasks')!.read();
    const beforeNotifications = persistence.repositories.get('notifications')!.read();
    const volunteer = app.get(VolunteersService).findAll()[0];
    persistence.database.exec("CREATE TRIGGER reject_notification_write BEFORE INSERT ON repository_records WHEN NEW.repository='notifications' BEGIN SELECT RAISE(FAIL,'Intentional notification failure'); END");
    await request(app.getHttpServer()).post('/tasks').set(headers).send({ title: randomUUID(), assignedToEmail: volunteer.email, assignedToName: volunteer.name }).expect(500);
    persistence.database.exec('DROP TRIGGER reject_notification_write');
    expect(persistence.repositories.get('tasks')!.read()).toEqual(beforeTasks);
    expect(persistence.repositories.get('notifications')!.read()).toEqual(beforeNotifications);
  });
  it('retains rejected verification attempts and their lockout without changing user records', async () => {
    const users = persistence.repositories.get('users')!.read()!.users;
    const started = await request(app.getHttpServer()).post('/users/verification/start').send({ role: 'donor', method: 'card_simulation', reference: '1111', email: `${randomUUID()}@example.test` }).expect(201);
    const { challengeId, developmentCode } = started.body.data;
    const code = developmentCode === '000000' ? '111111' : '000000';
    let response;
    for (let attempt = 0; attempt < 6; attempt++) response = await request(app.getHttpServer()).post('/users/verification/complete').send({ challengeId, code }).expect(400);
    expect(response!.body.message).toContain('Too many incorrect attempts');
    expect(persistence.repositories.get('users')!.read()!.users).toEqual(users);
    const challenges = persistence.repositories.get('users')!.read()!.verificationChallenges as { id: string; attempts: number }[];
    expect(challenges.find(item => item.id === challengeId)!.attempts).toBe(6);
    await app.close(); await open();
    response = await request(app.getHttpServer()).post('/users/verification/complete').send({ challengeId, code: developmentCode }).expect(400);
    expect(response.body.message).toContain('Too many incorrect attempts');
  });
});
