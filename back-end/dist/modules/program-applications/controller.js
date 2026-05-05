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
exports.ProgramApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_program_application_dto_1 = require("./dto/create-program-application.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let ProgramApplicationsController = class ProgramApplicationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Applications retrieved' };
    }
    getPending() {
        return { success: true, data: this.service.getPending(), message: 'Pending applications retrieved' };
    }
    findByProgram(programId) {
        return { success: true, data: this.service.findByProgram(programId), message: 'Applications retrieved' };
    }
    findByVolunteer(email) {
        return { success: true, data: this.service.findByVolunteer(email), message: 'Applications retrieved' };
    }
    hasApplied(programId, email) {
        return { success: true, data: this.service.hasApplied(programId, email), message: 'Check completed' };
    }
    findOne(id) {
        return { success: true, data: this.service.findById(id), message: 'Application retrieved' };
    }
    create(dto) {
        return { success: true, data: this.service.create(dto), message: 'Application submitted successfully' };
    }
    approve(id) {
        return { success: true, data: this.service.approve(id), message: 'Application approved' };
    }
    reject(id) {
        return { success: true, data: this.service.reject(id), message: 'Application rejected' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Application deleted' };
    }
};
exports.ProgramApplicationsController = ProgramApplicationsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all program applications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Applications retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending applications awaiting review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending applications retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('by-program/:programId'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get applications for a specific program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Applications retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('programId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "findByProgram", null);
__decorate([
    (0, common_1.Get)('by-volunteer/:email'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get applications submitted by a volunteer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Applications retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "findByVolunteer", null);
__decorate([
    (0, common_1.Get)('has-applied/:programId/:email'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if volunteer has already applied to a program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Check completed — returns true/false' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('programId')),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "hasApplied", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('volunteer', 'admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a program application', description: 'Volunteer applies to join a program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Application submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires volunteer, admin, or superuser role' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_program_application_dto_1.CreateProgramApplicationDto]),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a program application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application approved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a program application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application rejected' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a program application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramApplicationsController.prototype, "remove", null);
exports.ProgramApplicationsController = ProgramApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('Program Applications'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('program-applications'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.ProgramApplicationsService])
], ProgramApplicationsController);
//# sourceMappingURL=controller.js.map