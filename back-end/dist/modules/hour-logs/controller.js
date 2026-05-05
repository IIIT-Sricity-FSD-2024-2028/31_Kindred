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
exports.HourLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_hour_log_dto_1 = require("./dto/create-hour-log.dto");
const update_hour_log_dto_1 = require("./dto/update-hour-log.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let HourLogsController = class HourLogsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Hour logs retrieved' };
    }
    getPending() {
        return { success: true, data: this.service.getPending(), message: 'Pending hour logs retrieved' };
    }
    findByVolunteer(email) {
        return { success: true, data: this.service.findByVolunteer(email), message: 'Hour logs retrieved' };
    }
    findOne(id) {
        return { success: true, data: this.service.findById(id), message: 'Hour log retrieved' };
    }
    create(dto) {
        return { success: true, data: this.service.create(dto), message: 'Hour log submitted successfully' };
    }
    update(id, dto) {
        return { success: true, data: this.service.update(id, dto), message: 'Hour log updated' };
    }
    approve(id) {
        return { success: true, data: this.service.approve(id), message: 'Hour log approved' };
    }
    reject(id) {
        return { success: true, data: this.service.reject(id), message: 'Hour log rejected' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Hour log deleted' };
    }
};
exports.HourLogsController = HourLogsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all hour logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hour logs retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HourLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending hour logs awaiting approval' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending hour logs retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HourLogsController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('by-volunteer/:email'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hour logs by volunteer email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hour logs retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HourLogsController.prototype, "findByVolunteer", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hour log by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hour log retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hour log not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HourLogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('volunteer', 'admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a new hour log', description: 'Volunteer submits hours for approval' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Hour log submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hour_log_dto_1.CreateHourLogDto]),
    __metadata("design:returntype", void 0)
], HourLogsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an hour log' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hour log updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hour log not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hour_log_dto_1.UpdateHourLogDto]),
    __metadata("design:returntype", void 0)
], HourLogsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve an hour log' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hour log approved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hour log not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HourLogsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject an hour log' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hour log rejected' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hour log not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HourLogsController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an hour log' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hour log deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hour log not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HourLogsController.prototype, "remove", null);
exports.HourLogsController = HourLogsController = __decorate([
    (0, swagger_1.ApiTags)('Hour Logs'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('hour-logs'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.HourLogsService])
], HourLogsController);
//# sourceMappingURL=controller.js.map