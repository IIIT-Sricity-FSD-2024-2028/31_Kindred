import { UsersService } from './service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CompleteVerificationDto, StartVerificationDto } from './dto/verification.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    private publicUser;
    findAll(authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>[];
        message: string;
    };
    search(q: string, authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>[];
        message: string;
    };
    getPending(authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>[];
        message: string;
    };
    getApproved(authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>[];
        message: string;
    };
    getRejected(authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>[];
        message: string;
    };
    findOne(id: string, authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>;
        message: string;
    };
    create(dto: CreateUserDto, authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>;
        message: string;
    };
    register(dto: CreateUserDto): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>;
        message: string;
    };
    startVerification(dto: StartVerificationDto): {
        success: boolean;
        data: {
            challengeId: string;
            expiresAt: string;
            maskedReference: string;
            provider: string;
            developmentCode: string;
        };
        message: string;
    };
    completeVerification(dto: CompleteVerificationDto): {
        success: boolean;
        data: {
            verificationToken: string;
            status: string;
            method: string;
        };
        message: string;
    };
    signIn(body: {
        email: string;
        password: string;
        role: string;
    }): {
        success: boolean;
        data: null;
        message: string;
    } | {
        success: boolean;
        data: {
            authToken: string;
            id?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            password?: string | undefined;
            role?: string | undefined;
            status?: string | undefined;
            initials?: string | undefined;
            avatar?: string | undefined;
            dashboard?: string | undefined;
            org?: string | undefined;
            phone?: string | undefined;
            bio?: string | undefined;
            registeredAt?: string | undefined;
            skills?: string[] | undefined;
            dateOfBirth?: string | undefined;
            age?: number | undefined;
            location?: string | undefined;
            presentAddress?: string | undefined;
            permanentAddress?: string | undefined;
            availabilityDays?: string[] | undefined;
            businessName?: string | undefined;
            businessDescription?: string | undefined;
            verificationStatus?: "not_required" | "pending" | "verified" | "failed" | undefined;
            verificationMethod?: string | undefined;
            verificationReference?: string | undefined;
            approvalStatus?: "pending" | "approved" | "rejected" | undefined;
            team?: string | undefined;
            securityQuestion1?: string | undefined;
            securityAnswerHash1?: string | undefined;
            securityQuestion2?: string | undefined;
            securityAnswerHash2?: string | undefined;
        };
        message: string;
    };
    recoverPassword(body: {
        email: string;
        role: string;
        securityAnswer1: string;
        securityAnswer2: string;
        newPassword: string;
    }): {
        success: boolean;
        data: null;
        message: string;
    };
    recoveryQuestions(body: {
        email: string;
        role: string;
    }): {
        success: boolean;
        data: string[];
        message: string;
    };
    update(id: string, dto: UpdateUserDto, authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>;
        message: string;
    };
    setRecoveryQuestions(id: string, authorization: string, body: {
        securityQuestion1: string;
        securityAnswer1: string;
        securityQuestion2: string;
        securityAnswer2: string;
    }): {
        success: boolean;
        data: null;
        message: string;
    };
    approve(id: string, authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>;
        message: string;
    };
    reject(id: string, authorization?: string): {
        success: boolean;
        data: Partial<import("./entities/user.entity").User>;
        message: string;
    };
    remove(id: string, authorization?: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
