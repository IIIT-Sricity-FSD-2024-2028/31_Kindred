"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const verification_dto_1 = require("./dto/verification.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    publicUser(user) {
        const safe = { ...user };
        delete safe.password;
        delete safe.securityAnswerHash1;
        delete safe.securityAnswerHash2;
        return safe;
    }
    findAll(authorization) {
        this.usersService.assertSession(authorization, ['admin', 'superuser']);
        return {
            success: true,
            data: this.usersService.findAll().map((user) => this.publicUser(user)),
            message: 'Users retrieved successfully',
        };
    }
    search(q, authorization) {
        this.usersService.assertSession(authorization, ['admin', 'superuser']);
        return {
            success: true,
            data: this.usersService.search(q).map((user) => this.publicUser(user)),
            message: 'Search completed',
        };
    }
    getPending(authorization) {
        this.usersService.assertSession(authorization, ['admin', 'superuser']);
        return {
            success: true,
            data: this.usersService.getPending().map((user) => this.publicUser(user)),
            message: 'Pending users retrieved',
        };
    }
    getApproved(authorization) {
        this.usersService.assertSession(authorization, ['admin', 'superuser']);
        return {
            success: true,
            data: this.usersService
                .getApproved()
                .map((user) => this.publicUser(user)),
            message: 'Approved users retrieved',
        };
    }
    getRejected(authorization) {
        this.usersService.assertSession(authorization, ['admin', 'superuser']);
        return {
            success: true,
            data: this.usersService
                .getRejected()
                .map((user) => this.publicUser(user)),
            message: 'Rejected users retrieved',
        };
    }
    findOne(id, authorization) {
        this.usersService.assertSession(authorization, ['admin', 'superuser']);
        return {
            success: true,
            data: this.publicUser(this.usersService.findById(id)),
            message: 'User retrieved successfully',
        };
    }
    create(dto, authorization) {
        const actor = this.usersService.assertSession(authorization, [
            'admin',
            'superuser',
        ]);
        if (actor.role !== 'superuser' && dto.role === 'superuser')
            throw new common_1.ForbiddenException('Only a Platform Admin can create another Platform Admin.');
        return {
            success: true,
            data: this.publicUser(this.usersService.create(dto)),
            message: 'User created successfully',
        };
    }
    register(dto) {
        return {
            success: true,
            data: this.publicUser(this.usersService.create(dto, true)),
            message: 'User registered successfully',
        };
    }
    startVerification(dto) {
        return {
            success: true,
            data: this.usersService.startVerification(dto),
            message: 'Development verification challenge created. No payment or government identity check was performed.',
        };
    }
    completeVerification(dto) {
        return {
            success: true,
            data: this.usersService.completeVerification(dto.challengeId, dto.code),
            message: 'Development verification challenge confirmed.',
        };
    }
    signIn(body) {
        const user = this.usersService.signIn(body.email, body.password, body.role);
        if (!user) {
            return {
                success: false,
                data: null,
                message: 'Invalid email, password, or role',
            };
        }
        if (user.status === 'pending') {
            return {
                success: false,
                data: null,
                message: 'Your account is under review by the Platform Administrator.',
            };
        }
        if (user.status === 'rejected') {
            return {
                success: false,
                data: null,
                message: 'Your registration was not approved. Please contact support.',
            };
        }
        return {
            success: true,
            data: {
                ...this.publicUser(user),
                authToken: this.usersService.issueSession(user),
            },
            message: 'Signed in successfully',
        };
    }
    recoverPassword(body) {
        this.usersService.recoverPassword(body);
        return {
            success: true,
            data: null,
            message: 'Password updated. You can now sign in.',
        };
    }
    recoveryQuestions(body) {
        return {
            success: true,
            data: this.usersService.recoveryQuestions(body.email, body.role),
            message: 'Recovery questions retrieved',
        };
    }
    update(id, dto, authorization) {
        const actor = this.usersService.assertSession(authorization, [
            'admin',
            'superuser',
        ]);
        const existing = this.usersService.findById(id);
        if (actor.role !== 'superuser' && dto.role && dto.role !== existing.role)
            throw new common_1.ForbiddenException('Only a Platform Admin can change account roles.');
        return {
            success: true,
            data: this.publicUser(this.usersService.update(id, dto)),
            message: 'User updated successfully',
        };
    }
    setRecoveryQuestions(id, authorization, body) {
        const actor = this.usersService.assertSession(authorization, [
            'admin',
            'superuser',
            'volunteer',
            'donor',
            'beneficiary',
            'seller',
        ]);
        this.usersService.setRecoveryQuestions(id, actor.email, actor.role, body);
        return { success: true, data: null, message: 'Recovery questions saved.' };
    }
    approve(id, authorization) {
        this.usersService.assertSession(authorization, ['superuser']);
        return {
            success: true,
            data: this.publicUser(this.usersService.approve(id)),
            message: 'User approved successfully',
        };
    }
    reject(id, authorization) {
        this.usersService.assertSession(authorization, ['superuser']);
        return {
            success: true,
            data: this.publicUser(this.usersService.reject(id)),
            message: 'User rejected',
        };
    }
    remove(id, authorization) {
        this.usersService.assertSession(authorization, ['superuser']);
        this.usersService.delete(id);
        return { success: true, data: null, message: 'User deleted successfully' };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all users',
        description: 'Returns the complete list of registered users. Requires admin or superuser role.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users retrieved successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Access denied — requires admin or superuser role',
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Search users by name, email, or role' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, description: 'Search query string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search completed successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Access denied — requires admin or superuser role',
    }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get pending users',
        description: 'Returns users awaiting approval (status=pending)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending users retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('approved'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get approved users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Approved users retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getApproved", null);
__decorate([
    (0, common_1.Get)('rejected'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rejected users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rejected users retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getRejected", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new user (admin-only)',
        description: 'Admin/superuser creates a user directly. For public registration, use POST /users/register instead.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation failed or duplicate email',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Access denied — requires admin or superuser role',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Public registration (no role header required)',
        description: 'Anyone can register. Donors and beneficiaries get instant approval. Volunteers and admins go to pending status.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation failed or duplicate email',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verification/start'),
    (0, swagger_1.ApiOperation)({
        summary: 'Start a development-only signup verification challenge',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verification_dto_1.StartVerificationDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "startVerification", null);
__decorate([
    (0, common_1.Post)('verification/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a signup verification challenge' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verification_dto_1.CompleteVerificationDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "completeVerification", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Sign in a user',
        description: 'Authenticates a user with email, password, and role. Returns user data on success.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Signed in successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sign-in failed — invalid credentials or account not approved',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('recover-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset password after matching both registered security answers',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "recoverPassword", null);
__decorate([
    (0, common_1.Post)('recovery-questions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get registered recovery question prompts for an email and role',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "recoveryQuestions", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/security-questions'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer', 'donor', 'beneficiary', 'seller'),
    (0, swagger_1.ApiOperation)({ summary: 'Set or replace your account recovery questions' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "setRecoveryQuestions", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve a user',
        description: 'Changes user status from pending to approved. Superuser only.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User approved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Access denied — requires superuser role',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reject a user',
        description: 'Changes user status to rejected. Superuser only.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User rejected' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Access denied — requires superuser role',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a user',
        description: 'Permanently removes a user from the system. Superuser only.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Access denied — requires superuser role',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiHeader)({
        name: 'role',
        required: true,
        description: 'User role for RBAC (superuser, admin, volunteer, donor, beneficiary)',
        enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'],
    }),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.UsersService])
], UsersController);
//# sourceMappingURL=controller.js.map