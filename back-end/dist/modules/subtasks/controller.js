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
exports.SubtasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_subtask_dto_1 = require("./dto/create-subtask.dto");
const update_subtask_dto_1 = require("./dto/update-subtask.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let SubtasksController = class SubtasksController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Subtasks retrieved' };
    }
    findByProgram(programId) {
        return { success: true, data: this.service.findByProgram(programId), message: 'Subtasks retrieved' };
    }
    findByVolunteer(email) {
        return { success: true, data: this.service.findByVolunteer(email), message: 'Subtasks retrieved' };
    }
    findByProgramAndVolunteer(programId, email) {
        return { success: true, data: this.service.findByProgramAndVolunteer(programId, email), message: 'Subtasks retrieved' };
    }
    getProgramProgress(programId) {
        return { success: true, data: this.service.getProgramProgress(programId), message: 'Progress calculated' };
    }
    findOne(id) {
        return { success: true, data: this.service.findById(id), message: 'Subtask retrieved' };
    }
    create(dto) {
        return { success: true, data: this.service.create(dto), message: 'Subtask created successfully' };
    }
    update(id, dto) {
        return { success: true, data: this.service.update(id, dto), message: 'Subtask updated' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Subtask deleted' };
    }
};
exports.SubtasksController = SubtasksController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subtasks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subtasks retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-program/:programId'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subtasks for a program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subtasks retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('programId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "findByProgram", null);
__decorate([
    (0, common_1.Get)('by-volunteer/:email'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subtasks assigned to a volunteer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subtasks retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "findByVolunteer", null);
__decorate([
    (0, common_1.Get)('by-program-and-volunteer/:programId/:email'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subtasks by program and volunteer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subtasks retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('programId')),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "findByProgramAndVolunteer", null);
__decorate([
    (0, common_1.Get)('program-progress/:programId'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall program progress percentage' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress calculated' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('programId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "getProgramProgress", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subtask by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subtask retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subtask not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new subtask', description: 'Assign a subtask within a program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subtask created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subtask_dto_1.CreateSubtaskDto]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a subtask', description: 'Update subtask details or mark as completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subtask updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subtask not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subtask_dto_1.UpdateSubtaskDto]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a subtask' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subtask deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subtask not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "remove", null);
exports.SubtasksController = SubtasksController = __decorate([
    (0, swagger_1.ApiTags)('Subtasks'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('subtasks'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.SubtasksService])
], SubtasksController);
//# sourceMappingURL=controller.js.map