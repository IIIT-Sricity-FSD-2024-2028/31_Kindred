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
exports.IncomingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_incoming_dto_1 = require("./dto/create-incoming.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let IncomingController = class IncomingController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Incoming requests retrieved' };
    }
    getPending() {
        return { success: true, data: this.service.getPending(), message: 'Pending requests retrieved' };
    }
    findOne(id) {
        return { success: true, data: this.service.findById(id), message: 'Incoming request retrieved' };
    }
    create(dto) {
        return { success: true, data: this.service.create(dto), message: 'Incoming request created successfully' };
    }
    accept(id) {
        return { success: true, data: this.service.accept(id), message: 'Request accepted' };
    }
    decline(id) {
        return { success: true, data: this.service.decline(id), message: 'Request declined' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Incoming request deleted' };
    }
};
exports.IncomingController = IncomingController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all incoming requests', description: 'Returns all submissions — emergency requests, contact forms, and feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incoming requests retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending incoming requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending requests retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incoming request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incoming request retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('beneficiary', 'admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new incoming request', description: 'Used by Contact Us, Emergency Help, and Feedback forms' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Incoming request created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_incoming_dto_1.CreateIncomingDto]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept an incoming request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request accepted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)(':id/decline'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Decline an incoming request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request declined' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "decline", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an incoming request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "remove", null);
exports.IncomingController = IncomingController = __decorate([
    (0, swagger_1.ApiTags)('Incoming Requests'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('incoming'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.IncomingService])
], IncomingController);
//# sourceMappingURL=controller.js.map