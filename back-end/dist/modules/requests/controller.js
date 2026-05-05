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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_request_dto_1 = require("./dto/create-request.dto");
const update_request_dto_1 = require("./dto/update-request.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let RequestsController = class RequestsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Requests retrieved successfully' };
    }
    getPending() {
        return { success: true, data: this.service.getPending(), message: 'Pending requests retrieved' };
    }
    findOne(id) {
        return { success: true, data: this.service.findById(id), message: 'Request retrieved successfully' };
    }
    create(dto) {
        return { success: true, data: this.service.create(dto), message: 'Request created successfully' };
    }
    update(id, dto) {
        return { success: true, data: this.service.update(id, dto), message: 'Request updated successfully' };
    }
    approve(id) {
        return { success: true, data: this.service.approve(id), message: 'Request approved successfully' };
    }
    reject(id) {
        return { success: true, data: this.service.reject(id), message: 'Request rejected' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Request deleted successfully' };
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all platform requests', description: 'Returns all org registration, budget increase, and other requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Requests retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending requests retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new platform request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Request created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires superuser role' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_request_dto_1.UpdateRequestDto]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request approved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires superuser role' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request rejected' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires superuser role' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires superuser role' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "remove", null);
exports.RequestsController = RequestsController = __decorate([
    (0, swagger_1.ApiTags)('Requests'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('requests'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=controller.js.map