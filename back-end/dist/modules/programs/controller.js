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
exports.ProgramsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_program_dto_1 = require("./dto/create-program.dto");
const update_program_dto_1 = require("./dto/update-program.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let ProgramsController = class ProgramsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Programs retrieved successfully' };
    }
    findByOrg(org) {
        return { success: true, data: this.service.findByOrg(org), message: 'Programs retrieved' };
    }
    findOne(id) {
        return { success: true, data: this.service.findById(id), message: 'Program retrieved successfully' };
    }
    create(dto) {
        return { success: true, data: this.service.create(dto), message: 'Program created successfully' };
    }
    update(id, dto) {
        return { success: true, data: this.service.update(id, dto), message: 'Program updated successfully' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Program deleted successfully' };
    }
};
exports.ProgramsController = ProgramsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all programs', description: 'Public — returns all active programs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Programs retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-org/:org'),
    (0, swagger_1.ApiOperation)({ summary: 'Get programs by organization name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Programs retrieved' }),
    __param(0, (0, common_1.Param)('org')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "findByOrg", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get program by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Program retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Program not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new program', description: 'Org admins and superusers can create programs' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Program created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_program_dto_1.CreateProgramDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Program updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Program not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_program_dto_1.UpdateProgramDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Program deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Program not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "remove", null);
exports.ProgramsController = ProgramsController = __decorate([
    (0, swagger_1.ApiTags)('Programs'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('programs'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.ProgramsService])
], ProgramsController);
//# sourceMappingURL=controller.js.map