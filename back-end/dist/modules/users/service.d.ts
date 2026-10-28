import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StartVerificationDto } from './dto/verification.dto';
export declare class UsersService {
    private users;
    private counter;
    private verificationChallenges;
    private verifiedRegistrations;
    private sessions;
    private generateId;
    findAll(): User[];
    findById(id: string): User;
    findByEmail(email: string): User | null;
    search(q: string): User[];
    getPending(): User[];
    getApproved(): User[];
    getRejected(): User[];
    startVerification(dto: StartVerificationDto): {
        challengeId: string;
        expiresAt: string;
        maskedReference: string;
        provider: string;
        developmentCode: string;
    };
    completeVerification(challengeId: string, code: string): {
        verificationToken: string;
        status: string;
        method: string;
    };
    private consumeVerification;
    create(dto: CreateUserDto, publicRegistration?: boolean): User;
    update(id: string, dto: UpdateUserDto): User;
    approve(id: string): User;
    reject(id: string): User;
    delete(id: string): boolean;
    signIn(email: string, password: string, role: string): User | null;
    issueSession(user: User): string;
    assertSession(authorization: string | undefined, allowedRoles: string[]): User;
    recoverPassword(input: {
        email: string;
        role: string;
        securityAnswer1: string;
        securityAnswer2: string;
        newPassword: string;
    }): void;
    recoveryQuestions(email: string, role: string): string[];
    setRecoveryQuestions(id: string, email: string, role: string, input: {
        securityQuestion1: string;
        securityAnswer1: string;
        securityQuestion2: string;
        securityAnswer2: string;
    }): void;
}
