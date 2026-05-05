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
exports.VolunteersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_volunteer_dto_1 = require("./dto/create-volunteer.dto");
const update_volunteer_dto_1 = require("./dto/update-volunteer.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let VolunteersController = class VolunteersController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Volunteers retrieved successfully' };
    }
    findByEmail(email) {
        const vol = this.service.findByEmail(email);
        if (!vol)
            return { success: false, data: null, message: 'Volunteer not found' };
        return { success: true, data: vol, message: 'Volunteer retrieved successfully' };
    }
    findByOrg(org) {
        return { success: true, data: this.service.findByOrg(org), message: 'Volunteers retrieved' };
    }
    findOne(id) {
        return { success: true, data: this.service.findById(id), message: 'Volunteer retrieved successfully' };
    }
    create(dto) {
        return { success: true, data: this.service.create(dto), message: 'Volunteer created successfully' };
    }
    update(id, dto) {
        return { success: true, data: this.service.update(id, dto), message: 'Volunteer updated successfully' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Volunteer deleted successfully' };
    }
};
exports.VolunteersController = VolunteersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all volunteers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Volunteers retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VolunteersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-email/:email'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get volunteer by email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Volunteer retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Volunteer not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VolunteersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('by-org/:org'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get volunteers by organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Volunteers retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('org')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VolunteersController.prototype, "findByOrg", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get volunteer by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Volunteer retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Volunteer not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VolunteersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new volunteer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Volunteer created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_volunteer_dto_1.CreateVolunteerDto]),
    __metadata("design:returntype", void 0)
], VolunteersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a volunteer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Volunteer updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Volunteer not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_volunteer_dto_1.UpdateVolunteerDto]),
    __metadata("design:returntype", void 0)
], VolunteersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a volunteer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Volunteer deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Volunteer not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VolunteersController.prototype, "remove", null);
exports.VolunteersController = VolunteersController = __decorate([
    (0, swagger_1.ApiTags)('Volunteers'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('volunteers'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.VolunteersService])
], VolunteersController);
//# sourceMappingURL=controller.js.map