/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Role registration verification (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => app.close());

  it('verifies and registers a seller, then blocks unauthenticated applicant access', async () => {
    const started = await request(app.getHttpServer())
      .post('/users/verification/start')
      .send({
        role: 'seller',
        method: 'phone_otp_simulation',
        reference: '9812345678',
        email: 'new-seller@test.dev',
      })
      .expect(201);
    const completed = await request(app.getHttpServer())
      .post('/users/verification/complete')
      .send({
        challengeId: started.body.data.challengeId,
        code: started.body.data.developmentCode,
      })
      .expect(201);
    const registration = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        name: 'New Seller',
        email: 'new-seller@test.dev',
        password: 'Valid@123',
        role: 'seller',
        phone: '9812345678',
        location: 'Pune',
        businessName: 'Kind Shop',
        verificationToken: completed.body.data.verificationToken,
        securityQuestion1: 'first_school',
        securityAnswer1: 'School',
        securityQuestion2: 'first_pet',
        securityAnswer2: 'Pet',
      })
      .expect(201);
    expect(registration.body.data).toMatchObject({
      status: 'pending',
      approvalStatus: 'pending',
      verificationStatus: 'verified',
    });

    await request(app.getHttpServer())
      .get('/users')
      .set('role', 'superuser')
      .expect(403);
    const signIn = await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email: 'super@kindred.org',
        password: 'Super@123',
        role: 'superuser',
      })
      .expect(201);
    const users = await request(app.getHttpServer())
      .get('/users')
      .set('role', 'superuser')
      .set('Authorization', `Bearer ${signIn.body.data.authToken}`)
      .expect(200);
    expect(
      users.body.data.some(
        (user: { email: string }) => user.email === 'new-seller@test.dev',
      ),
    ).toBe(true);
    await request(app.getHttpServer())
      .patch(`/users/${registration.body.data.id}`)
      .set('role', 'superuser')
      .set('Authorization', `Bearer ${signIn.body.data.authToken}`)
      .send({ status: 'approved' })
      .expect(400);
    await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email: 'new-seller@test.dev',
        password: 'Valid@123',
        role: 'seller',
      })
      .expect(201)
      .expect((response) => expect(response.body.success).toBe(false));
    await request(app.getHttpServer())
      .patch(`/users/${registration.body.data.id}/approve`)
      .set('role', 'superuser')
      .set('Authorization', `Bearer ${signIn.body.data.authToken}`)
      .send({})
      .expect(200);
    await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email: 'new-seller@test.dev',
        password: 'Valid@123',
        role: 'seller',
      })
      .expect(201)
      .expect((response) => expect(response.body.data.authToken).toBeTruthy());
  });
});
