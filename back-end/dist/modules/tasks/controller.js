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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let TasksController = class TasksController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Tasks retrieved successfully' };
    }
    findByVolunteer(email) {
        return { success: true, data: this.service.findByVolunteer(email), message: 'Tasks retrieved' };
    }
    findOne(id) {
        return { success: true, data: this.service.findById(id), message: 'Task retrieved successfully' };
    }
    create(dto) {
        return { success: true, data: this.service.create(dto), message: 'Task created successfully' };
    }
    update(id, dto) {
        return { success: true, data: this.service.update(id, dto), message: 'Task updated successfully' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Task deleted successfully' };
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tasks retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-volunteer/:email'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks assigned to a volunteer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tasks retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findByVolunteer", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get task by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task', description: 'Assign a task to a volunteer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a task', description: 'Update task details or mark as completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.TasksService])
], TasksController);
//# sourceMappingURL=controller.js.map