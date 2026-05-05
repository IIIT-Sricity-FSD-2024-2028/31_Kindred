"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
let TasksService = class TasksService {
    tasks = [];
    counter = 100;
    generateId() {
        return `task_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.tasks.slice();
    }
    findById(id) {
        const task = this.tasks.find((t) => t.id === id);
        if (!task)
            throw new common_1.NotFoundException(`Task with id '${id}' not found`);
        return { ...task };
    }
    findByVolunteer(email) {
        return this.tasks.filter((t) => t.assignedToEmail && t.assignedToEmail.toLowerCase() === email.toLowerCase());
    }
    create(dto) {
        const newTask = {
            id: this.generateId(),
            title: dto.title,
            description: dto.description,
            assignedToEmail: dto.assignedToEmail,
            assignedToName: dto.assignedToName,
            priority: dto.priority,
            dueDate: dto.dueDate,
            programId: dto.programId,
            programName: dto.programName,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        this.tasks.push(newTask);
        return { ...newTask };
    }
    update(id, dto) {
        const idx = this.tasks.findIndex((t) => t.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Task with id '${id}' not found`);
        this.tasks[idx] = { ...this.tasks[idx], ...dto };
        return { ...this.tasks[idx] };
    }
    delete(id) {
        const idx = this.tasks.findIndex((t) => t.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Task with id '${id}' not found`);
        this.tasks.splice(idx, 1);
        return true;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
//# sourceMappingURL=service.js.map