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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const store_1 = require("../proofs/store");
const common_1 = require("@nestjs/common");
const service_1 = require("../program-assignments/service");
const service_2 = require("../programs/service");
const common_2 = require("@nestjs/common");
const VALID_STATUSES = ['pending', 'in-progress', 'pending_review', 'completed', 'cancelled'];
const VALID_TRANSITIONS = {
    'pending': ['in-progress', 'cancelled'],
    'in-progress': ['pending_review', 'completed', 'cancelled'],
    'pending_review': ['completed', 'in-progress'],
    'completed': [],
    'cancelled': [],
};
let TasksService = class TasksService {
    assignments;
    programs;
    proofs;
    constructor(assignments, programs) {
        this.assignments = assignments;
        this.programs = programs;
    }
    tasks = [];
    counter = 100;
    syncProgramProgress(programId) {
        if (!programId)
            return;
        const activeTasks = this.tasks.filter((task) => task.programId === programId && task.status !== 'cancelled');
        const completed = activeTasks.filter((task) => task.status === 'completed').length;
        this.programs.setTaskProgress(programId, activeTasks.length, completed);
    }
    rebuildProgramProgress() {
        for (const programId of new Set(this.tasks.map((task) => task.programId).filter((id) => Boolean(id)))) {
            this.syncProgramProgress(programId);
        }
    }
    generateId() {
        return `task_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.tasks.slice();
    }
    findById(id) {
        const task = this.tasks.find((t) => t.id === id);
        if (!task)
            throw new common_2.NotFoundException(`Task with id '${id}' not found`);
        return { ...task };
    }
    findByVolunteer(email) {
        return this.tasks.filter((t) => t.assignedToEmail && t.assignedToEmail.toLowerCase() === email.toLowerCase());
    }
    findByProgram(programId) {
        return this.tasks.filter((t) => t.programId === programId);
    }
    create(dto) {
        if (dto.programId)
            this.assignments.assertActive(dto.programId, dto.assignedToEmail);
        const newTask = {
            id: dto.id || this.generateId(),
            title: dto.title,
            description: dto.description,
            assignedToEmail: dto.assignedToEmail,
            assignedToName: dto.assignedToName,
            priority: dto.priority || 'normal',
            dueDate: dto.dueDate,
            programId: dto.programId,
            programName: dto.programName,
            location: dto.location,
            notes: dto.notes || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.tasks.push(newTask);
        this.syncProgramProgress(newTask.programId);
        return { ...newTask };
    }
    update(id, dto) {
        const idx = this.tasks.findIndex((t) => t.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Task with id '${id}' not found`);
        const programId = dto.programId ?? this.tasks[idx].programId;
        if (this.tasks[idx].programId && !programId)
            throw new common_2.BadRequestException('A program task cannot be detached from its program.');
        if (programId)
            this.assignments.assertActive(programId, dto.assignedToEmail ?? this.tasks[idx].assignedToEmail);
        if (dto.status === 'completed' || dto.status === 'pending_review')
            this.proofs.assertVerified('tasks', id);
        if (dto.status) {
            const currentStatus = this.tasks[idx].status;
            if (!VALID_STATUSES.includes(dto.status)) {
                throw new common_2.BadRequestException(`Invalid status '${dto.status}'. Valid: ${VALID_STATUSES.join(', ')}`);
            }
            const allowed = VALID_TRANSITIONS[currentStatus] || [];
            if (!allowed.includes(dto.status)) {
                throw new common_2.BadRequestException(`Cannot transition from '${currentStatus}' to '${dto.status}'. Allowed: ${allowed.join(', ') || 'none'}`);
            }
        }
        const previousProgramId = this.tasks[idx].programId;
        this.tasks[idx] = {
            ...this.tasks[idx],
            ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)),
            updatedAt: new Date().toISOString(),
        };
        this.syncProgramProgress(previousProgramId);
        if (this.tasks[idx].programId !== previousProgramId)
            this.syncProgramProgress(this.tasks[idx].programId);
        return { ...this.tasks[idx] };
    }
    cancelByProgram(programId) {
        let count = 0;
        this.tasks.forEach((t, idx) => {
            if (t.programId === programId && t.status !== 'completed' && t.status !== 'cancelled') {
                this.tasks[idx].status = 'cancelled';
                this.tasks[idx].updatedAt = new Date().toISOString();
                count++;
            }
        });
        this.syncProgramProgress(programId);
        return count;
    }
    delete(id) {
        const idx = this.tasks.findIndex((t) => t.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Task with id '${id}' not found`);
        const programId = this.tasks[idx].programId;
        this.tasks.splice(idx, 1);
        this.syncProgramProgress(programId);
        return true;
    }
};
exports.TasksService = TasksService;
__decorate([
    (0, common_1.Inject)(store_1.ProofStore),
    __metadata("design:type", store_1.ProofStore)
], TasksService.prototype, "proofs", void 0);
exports.TasksService = TasksService = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [service_1.ProgramAssignmentsService, service_2.ProgramsService])
], TasksService);
//# sourceMappingURL=service.js.map