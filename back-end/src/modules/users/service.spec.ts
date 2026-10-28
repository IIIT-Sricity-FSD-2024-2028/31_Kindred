import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './service';

const recovery = {
  securityQuestion1: 'first_school',
  securityAnswer1: 'School',
  securityQuestion2: 'first_pet',
  securityAnswer2: 'Pet',
};

describe('UsersService role registration verification', () => {
  let service: UsersService;
  beforeEach(() => {
    service = new UsersService();
  });

  it('requires a confirmed, matching verification token', () => {
    expect(() =>
      service.create(
        {
          name: 'Seller',
          email: 'seller@test.dev',
          password: 'Valid@123',
          role: 'seller',
          phone: '9812345678',
          location: 'Pune',
          businessName: 'Shop',
          ...recovery,
        },
        true,
      ),
    ).toThrow(BadRequestException);
  });

  it('verifies a seller but keeps approval pending', () => {
    const challenge = service.startVerification({
      role: 'seller',
      method: 'phone_otp_simulation',
      reference: '9812345678',
      email: 'seller@test.dev',
    });
    const verified = service.completeVerification(
      challenge.challengeId,
      challenge.developmentCode,
    );
    const user = service.create(
      {
        name: 'Seller',
        email: 'seller@test.dev',
        password: 'Valid@123',
        role: 'seller',
        phone: '9812345678',
        location: 'Pune',
        businessName: 'Shop',
        verificationToken: verified.verificationToken,
        ...recovery,
      },
      true,
    );
    expect(user.verificationStatus).toBe('verified');
    expect(user.status).toBe('pending');
    expect(user.verificationReference).toBe('phone ending 5678');
  });

  it('enforces the donor minimum age', () => {
    const challenge = service.startVerification({
      role: 'donor',
      method: 'card_simulation',
      reference: '4242',
      email: 'young@test.dev',
    });
    const verified = service.completeVerification(
      challenge.challengeId,
      challenge.developmentCode,
    );
    const date = new Date();
    date.setFullYear(date.getFullYear() - 14);
    expect(() =>
      service.create(
        {
          name: 'Young Donor',
          email: 'young@test.dev',
          password: 'Valid@123',
          role: 'donor',
          phone: '9812345678',
          location: 'Pune',
          dateOfBirth: date.toISOString().slice(0, 10),
          verificationToken: verified.verificationToken,
          ...recovery,
        },
        true,
      ),
    ).toThrow('at least 15');
  });

  it('requires a real signed-in superuser session for applicant access', () => {
    expect(() => service.assertSession(undefined, ['superuser'])).toThrow(
      ForbiddenException,
    );
    const admin = service.signIn(
      'super@kindred.org',
      'Super@123',
      'superuser',
    )!;
    const token = service.issueSession(admin);
    expect(service.assertSession(`Bearer ${token}`, ['superuser']).id).toBe(
      admin.id,
    );
  });
});
