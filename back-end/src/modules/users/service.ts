import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { StartVerificationDto } from './dto/verification.dto';

const SECURITY_QUESTIONS = [
  'first_school',
  'childhood_friend',
  'first_pet',
  'birth_city',
];
const normalizeAnswer = (answer: string) =>
  answer
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('en-US')
    .replace(/\s+/g, ' ');
const hashAnswer = (answer: string) => {
  const salt = randomBytes(16);
  return `${salt.toString('hex')}:${scryptSync(normalizeAnswer(answer), salt, 32).toString('hex')}`;
};
const answerMatches = (answer: string, stored?: string) => {
  if (!stored) return false;
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(
    normalizeAnswer(answer),
    Buffer.from(saltHex, 'hex'),
    expected.length,
  );
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};

const ROLE_DASHBOARDS: Record<string, string> = {
  superuser: 'platform-admin.html',
  admin: 'org-admin.html',
  volunteer: 'volunteer-dashboard.html',
  donor: 'donor-dashboard.html',
  beneficiary: 'beneficiary-dashboard.html',
  seller: 'seller-dashboard.html',
};

const ROLE_AVATARS: Record<string, string> = {
  superuser: '#6366f1',
  admin: '#0f1a2e',
  volunteer: '#10b981',
  donor: '#f59e0b',
  beneficiary: '#8b5cf6',
  seller: '#14b8a6',
};

const IMMEDIATE_ACCESS_ROLES = ['donor', 'beneficiary', 'superuser'];
const VERIFIED_REGISTRATION_ROLES = [
  'volunteer',
  'donor',
  'beneficiary',
  'seller',
];
const methodForRole: Record<string, string[]> = {
  volunteer: ['aadhaar_otp_simulation'],
  donor: ['upi_simulation', 'card_simulation'],
  beneficiary: ['aadhaar_otp_simulation', 'phone_otp_simulation'],
  seller: ['phone_otp_simulation'],
};
const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex');
const calculateAge = (dateOfBirth: string) => {
  const dob = new Date(`${dateOfBirth}T00:00:00.000Z`);
  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  if (
    now.getUTCMonth() < dob.getUTCMonth() ||
    (now.getUTCMonth() === dob.getUTCMonth() &&
      now.getUTCDate() < dob.getUTCDate())
  )
    age -= 1;
  return age;
};
const maskReference = (method: string, reference: string) => {
  if (method === 'upi_simulation') {
    const [name, provider] = reference.split('@');
    return `${name.slice(0, 2)}***@${provider}`;
  }
  const digits = reference.replace(/\D/g, '');
  return method === 'card_simulation'
    ? `card ending ${digits.slice(-4)}`
    : `phone ending ${digits.slice(-4)}`;
};

interface VerificationChallenge {
  id: string;
  role: string;
  method: string;
  reference: string;
  referenceHash: string;
  email: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  used: boolean;
}
interface VerifiedRegistration {
  tokenHash: string;
  role: string;
  email: string;
  method: string;
  reference: string;
  referenceHash: string;
  expiresAt: number;
  used: boolean;
}
interface SessionRecord {
  tokenHash: string;
  userId: string;
  expiresAt: number;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 'su_001',
      name: 'Kavita Sharma',
      email: 'super@kindred.org',
      password: 'Super@123',
      role: 'superuser',
      status: 'approved',
      initials: 'KS',
      avatar: '#6366f1',
      dashboard: 'platform-admin.html',
      registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'su_team1',
      name: 'Kavita Sharma (Team 1 Admin)',
      email: 'admin1@kindred.org',
      password: 'Admin1@123',
      role: 'superuser',
      team: 'team1',
      status: 'approved',
      initials: 'T1',
      avatar: '#6366f1',
      dashboard: 'platform-admin.html',
      registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'su_team2',
      name: 'Neha Gupta (Team 2 Admin)',
      email: 'admin2@kindred.org',
      password: 'Admin2@123',
      role: 'superuser',
      team: 'team2',
      status: 'approved',
      initials: 'T2',
      avatar: '#0d9488',
      dashboard: 'platform-admin.html',
      registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'adm_001',
      name: 'Rajesh Verma',
      email: 'admin@hopeconnect.org',
      password: 'Admin@123',
      role: 'admin',
      org: 'HopeConnect',
      status: 'approved',
      initials: 'RV',
      avatar: '#0f1a2e',
      dashboard: 'org-admin.html',
      registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'vol_001',
      name: 'Priya Singh',
      email: 'volunteer@kindred.org',
      password: 'Vol@123',
      role: 'volunteer',
      status: 'approved',
      initials: 'PS',
      avatar: '#10b981',
      dashboard: 'volunteer-dashboard.html',
      registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'don_001',
      name: 'Arun Patel',
      email: 'donor@kindred.org',
      password: 'Donor@123',
      role: 'donor',
      status: 'approved',
      initials: 'AP',
      avatar: '#f59e0b',
      dashboard: 'donor-dashboard.html',
      registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'ben_001',
      name: 'Meena Devi',
      email: 'beneficiary@kindred.org',
      password: 'Ben@123',
      role: 'beneficiary',
      status: 'approved',
      initials: 'MD',
      avatar: '#8b5cf6',
      dashboard: 'beneficiary-dashboard.html',
      registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'seller_001',
      name: 'Ravi Kumar',
      email: 'seller@kindred.org',
      password: 'Seller@123',
      role: 'seller',
      status: 'approved',
      initials: 'RK',
      avatar: '#14b8a6',
      dashboard: 'seller-dashboard.html',
      registeredAt: '2024-01-01T00:00:00Z',
    },
  ];
  private counter = 100;
  private verificationChallenges: VerificationChallenge[] = [];
  private verifiedRegistrations: VerifiedRegistration[] = [];
  private sessions: SessionRecord[] = [];

  private generateId(): string {
    return `usr_${Date.now()}_${this.counter++}`;
  }

  findAll(): User[] {
    return this.users.slice();
  }

  findById(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User with id '${id}' not found`);
    return { ...user };
  }

  findByEmail(email: string): User | null {
    return this.users.find((u) => u.email === email) || null;
  }

  search(q: string): User[] {
    if (!q) return this.users.slice();
    const lq = q.toLowerCase();
    return this.users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(lq)) ||
        (u.email && u.email.toLowerCase().includes(lq)) ||
        (u.role && u.role.toLowerCase().includes(lq)),
    );
  }

  getPending(): User[] {
    return this.users.filter((u) => u.status === 'pending');
  }

  getApproved(): User[] {
    return this.users.filter((u) => u.status === 'approved');
  }

  getRejected(): User[] {
    return this.users.filter((u) => u.status === 'rejected');
  }

  startVerification(dto: StartVerificationDto) {
    if (process.env.NODE_ENV === 'production')
      throw new ServiceUnavailableException(
        'Signup verification provider is not configured. Registration verification cannot be completed at this time.',
      );
    if (!methodForRole[dto.role]?.includes(dto.method))
      throw new BadRequestException(
        'This verification method is not valid for the selected role.',
      );
    if (dto.method === 'aadhaar_otp_simulation' && dto.consent !== true)
      throw new BadRequestException(
        'Consent is required for the Aadhaar-linked mobile OTP simulation.',
      );
    const reference = dto.reference.trim();
    if (
      dto.method === 'upi_simulation' &&
      !/^[A-Za-z0-9._-]{2,}@[A-Za-z0-9.-]{2,}$/.test(reference)
    )
      throw new BadRequestException(
        'Enter a valid UPI ID. No UPI PIN or payment will be requested.',
      );
    if (dto.method === 'card_simulation' && !/^\d{4}$/.test(reference))
      throw new BadRequestException(
        'Enter only the last four card digits. Never enter a full card number, CVV, or PIN.',
      );
    if (
      ['aadhaar_otp_simulation', 'phone_otp_simulation'].includes(
        dto.method,
      ) &&
      !/^\+?[\d\s-]{10,18}$/.test(reference)
    )
      throw new BadRequestException(
        'Enter a valid phone number for the development OTP simulation.',
      );
    const code = String(100000 + (randomBytes(4).readUInt32BE(0) % 900000));
    const challenge: VerificationChallenge = {
      id: `vfy_${randomBytes(10).toString('hex')}`,
      role: dto.role,
      method: dto.method,
      reference: maskReference(dto.method, reference),
      referenceHash: digest(reference),
      email: (dto.email || '').trim().toLowerCase(),
      codeHash: digest(code),
      expiresAt: Date.now() + 5 * 60_000,
      attempts: 0,
      used: false,
    };
    this.verificationChallenges.push(challenge);
    return {
      challengeId: challenge.id,
      expiresAt: new Date(challenge.expiresAt).toISOString(),
      maskedReference: challenge.reference,
      provider: 'development_simulation',
      developmentCode: code,
    };
  }

  completeVerification(challengeId: string, code: string) {
    const challenge = this.verificationChallenges.find(
      (item) => item.id === challengeId,
    );
    if (!challenge || challenge.used)
      throw new BadRequestException(
        'This verification challenge is unavailable. Request a new code.',
      );
    if (challenge.expiresAt < Date.now())
      throw new BadRequestException(
        'This verification code has expired. Request a new code.',
      );
    challenge.attempts += 1;
    if (challenge.attempts > 5)
      throw new BadRequestException(
        'Too many incorrect attempts. Request a new code.',
      );
    if (digest(code) !== challenge.codeHash)
      throw new BadRequestException('The verification code is incorrect.');
    challenge.used = true;
    const token = randomBytes(32).toString('hex');
    this.verifiedRegistrations.push({
      tokenHash: digest(token),
      role: challenge.role,
      email: challenge.email,
      method: challenge.method,
      reference: challenge.reference,
      referenceHash: challenge.referenceHash,
      expiresAt: Date.now() + 10 * 60_000,
      used: false,
    });
    return {
      verificationToken: token,
      status: 'verified',
      method: challenge.method,
    };
  }

  private consumeVerification(dto: CreateUserDto) {
    if (!dto.verificationToken)
      throw new BadRequestException(
        'Complete verification before registering.',
      );
    const record = this.verifiedRegistrations.find(
      (item) => item.tokenHash === digest(dto.verificationToken!),
    );
    if (
      !record ||
      record.used ||
      record.expiresAt < Date.now() ||
      record.role !== dto.role ||
      record.email !== dto.email.trim().toLowerCase()
    ) {
      throw new BadRequestException(
        'Verification is missing, expired, or does not match this registration.',
      );
    }
    const submittedReference =
      dto.role === 'donor' ? dto.verificationReference : dto.phone;
    if (
      !submittedReference ||
      digest(submittedReference.trim()) !== record.referenceHash
    ) {
      throw new BadRequestException(
        'The verified phone or payment reference changed. Request a new verification code.',
      );
    }
    record.used = true;
    return record;
  }

  create(dto: CreateUserDto, publicRegistration = false): User {
    // Check for duplicate email
    const existing = this.users.find((u) => u.email === dto.email);
    if (existing)
      throw new BadRequestException(
        `User with email '${dto.email}' already exists`,
      );
    const hasRecoveryDetails =
      dto.securityQuestion1 ||
      dto.securityQuestion2 ||
      dto.securityAnswer1 ||
      dto.securityAnswer2;
    if (
      hasRecoveryDetails &&
      (!SECURITY_QUESTIONS.includes(dto.securityQuestion1 || '') ||
        !SECURITY_QUESTIONS.includes(dto.securityQuestion2 || '') ||
        dto.securityQuestion1 === dto.securityQuestion2 ||
        !dto.securityAnswer1?.trim() ||
        !dto.securityAnswer2?.trim())
    ) {
      throw new BadRequestException(
        'Choose two different security questions and provide both answers.',
      );
    }
    let verification: VerifiedRegistration | undefined;
    if (publicRegistration && VERIFIED_REGISTRATION_ROLES.includes(dto.role)) {
      if (!dto.location?.trim())
        throw new BadRequestException('Location is required.');
      if (['volunteer', 'donor'].includes(dto.role) && !dto.dateOfBirth)
        throw new BadRequestException('Date of birth is required.');
      const age = dto.dateOfBirth ? calculateAge(dto.dateOfBirth) : undefined;
      if (age !== undefined && (age < 0 || age > 120))
        throw new BadRequestException('Enter a valid date of birth.');
      if (dto.role === 'donor' && age! < 15)
        throw new BadRequestException('Donors must be at least 15 years old.');
      if (
        dto.role === 'volunteer' &&
        (!dto.presentAddress?.trim() ||
          !dto.permanentAddress?.trim() ||
          !dto.availabilityDays?.length)
      )
        throw new BadRequestException(
          'Volunteer addresses and at least one availability day are required.',
        );
      if (dto.role === 'seller' && !dto.businessName?.trim())
        throw new BadRequestException(
          'Business or shop name is required for sellers.',
        );
      verification = this.consumeVerification(dto);
    }

    const initials = (dto.name || '')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

    const newUser: User = {
      id: this.generateId(),
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
      status: IMMEDIATE_ACCESS_ROLES.includes(dto.role)
        ? 'approved'
        : 'pending',
      approvalStatus: IMMEDIATE_ACCESS_ROLES.includes(dto.role)
        ? 'approved'
        : 'pending',
      initials,
      avatar: ROLE_AVATARS[dto.role] || '#6366f1',
      dashboard: ROLE_DASHBOARDS[dto.role] || 'beneficiary-dashboard.html',
      org: dto.org,
      phone: dto.phone,
      bio: dto.bio,
      skills: dto.skills,
      dateOfBirth: dto.dateOfBirth,
      age: dto.dateOfBirth ? calculateAge(dto.dateOfBirth) : undefined,
      location: dto.location,
      presentAddress: dto.presentAddress,
      permanentAddress: dto.permanentAddress,
      availabilityDays: dto.availabilityDays,
      businessName: dto.businessName,
      businessDescription: dto.businessDescription,
      verificationStatus: verification ? 'verified' : 'not_required',
      verificationMethod: verification?.method,
      verificationReference: verification?.reference,
      registeredAt: new Date().toISOString(),
      ...(hasRecoveryDetails
        ? {
            securityQuestion1: dto.securityQuestion1,
            securityAnswerHash1: hashAnswer(dto.securityAnswer1!),
            securityQuestion2: dto.securityQuestion2,
            securityAnswerHash2: hashAnswer(dto.securityAnswer2!),
          }
        : {}),
    };

    this.users.push(newUser);
    return { ...newUser };
  }

  update(id: string, dto: UpdateUserDto): User {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1)
      throw new NotFoundException(`User with id '${id}' not found`);

    this.users[idx] = {
      ...this.users[idx],
      ...Object.fromEntries(
        Object.entries(dto).filter(([, value]) => value !== undefined),
      ),
    };
    return { ...this.users[idx] };
  }

  approve(id: string): User {
    const user = this.users.find((candidate) => candidate.id === id);
    if (!user) throw new NotFoundException(`User with id '${id}' not found`);
    if (
      VERIFIED_REGISTRATION_ROLES.includes(user.role) &&
      user.verificationStatus !== 'verified'
    )
      throw new BadRequestException(
        'This registration cannot be approved until verification is complete.',
      );
    user.status = 'approved';
    user.approvalStatus = 'approved';
    return { ...user };
  }

  reject(id: string): User {
    const user = this.users.find((candidate) => candidate.id === id);
    if (!user) throw new NotFoundException(`User with id '${id}' not found`);
    user.status = 'rejected';
    user.approvalStatus = 'rejected';
    return { ...user };
  }

  delete(id: string): boolean {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1)
      throw new NotFoundException(`User with id '${id}' not found`);
    this.users.splice(idx, 1);
    return true;
  }

  // Sign-in logic
  signIn(email: string, password: string, role: string): User | null {
    return (
      this.users.find(
        (u) => u.email === email && u.password === password && u.role === role,
      ) || null
    );
  }

  issueSession(user: User) {
    const token = randomBytes(32).toString('hex');
    this.sessions.push({
      tokenHash: digest(token),
      userId: user.id,
      expiresAt: Date.now() + 12 * 60 * 60_000,
    });
    return token;
  }

  assertSession(
    authorization: string | undefined,
    allowedRoles: string[],
  ): User {
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    const session =
      token &&
      this.sessions.find(
        (item) =>
          item.tokenHash === digest(token) && item.expiresAt > Date.now(),
      );
    const user =
      session &&
      this.users.find((candidate) => candidate.id === session.userId);
    if (
      !user ||
      user.status !== 'approved' ||
      !allowedRoles.includes(user.role)
    )
      throw new ForbiddenException(
        'A valid approved administrator session is required.',
      );
    return user;
  }

  recoverPassword(input: {
    email: string;
    role: string;
    securityAnswer1: string;
    securityAnswer2: string;
    newPassword: string;
  }): void {
    const user = this.users.find(
      (candidate) =>
        candidate.email.toLowerCase() === input.email.trim().toLowerCase() &&
        candidate.role === input.role,
    );
    if (
      !user ||
      !answerMatches(input.securityAnswer1, user.securityAnswerHash1) ||
      !answerMatches(input.securityAnswer2, user.securityAnswerHash2)
    ) {
      throw new BadRequestException(
        'Account details or security answers do not match. Your password has not changed.',
      );
    }
    if (input.newPassword.length < 8)
      throw new BadRequestException('Password must be at least 8 characters.');
    user.password = input.newPassword;
  }

  recoveryQuestions(email: string, role: string): string[] {
    const user = this.users.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.role === role &&
        candidate.securityQuestion1 &&
        candidate.securityQuestion2,
    );
    if (!user)
      throw new BadRequestException(
        'No recovery questions are available for those account details. Check your email and role, or contact support.',
      );
    return [user.securityQuestion1!, user.securityQuestion2!];
  }

  setRecoveryQuestions(
    id: string,
    email: string,
    role: string,
    input: {
      securityQuestion1: string;
      securityAnswer1: string;
      securityQuestion2: string;
      securityAnswer2: string;
    },
  ): void {
    const user = this.users.find(
      (candidate) =>
        candidate.id === id &&
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.role === role,
    );
    if (!user)
      throw new BadRequestException(
        'You can only update recovery questions for your signed-in account.',
      );
    if (
      !SECURITY_QUESTIONS.includes(input.securityQuestion1) ||
      !SECURITY_QUESTIONS.includes(input.securityQuestion2) ||
      input.securityQuestion1 === input.securityQuestion2 ||
      !input.securityAnswer1?.trim() ||
      !input.securityAnswer2?.trim()
    ) {
      throw new BadRequestException(
        'Choose two different security questions and provide both answers.',
      );
    }
    user.securityQuestion1 = input.securityQuestion1;
    user.securityAnswerHash1 = hashAnswer(input.securityAnswer1);
    user.securityQuestion2 = input.securityQuestion2;
    user.securityAnswerHash2 = hashAnswer(input.securityAnswer2);
  }
}
