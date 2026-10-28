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
exports.SubtasksService = void 0;
const store_1 = require("../proofs/store");
const common_1 = require("@nestjs/common");
const service_1 = require("../program-assignments/service");
const common_2 = require("@nestjs/common");
let SubtasksService = class SubtasksService {
    assignments;
    proofs;
    constructor(assignments) {
        this.assignments = assignments;
    }
    subtasks = [
        { id: 'st_001', programId: 'prog_001', title: 'Set up emergency shelters', description: 'Erect 50 temporary shelters in affected zones', assignedToEmail: 'volunteer@kindred.org', assignedToName: 'Priya Singh', status: 'in-progress', progress: 65, createdAt: '2024-01-15' },
        { id: 'st_002', programId: 'prog_001', title: 'Distribute medical kits', description: 'Deliver 200 medical kits to flood-affected villages', assignedToEmail: 'amit.sharma@email.com', assignedToName: 'Amit Sharma', status: 'in-progress', progress: 40, createdAt: '2024-01-18' },
        { id: 'st_003', programId: 'prog_001', title: 'Food distribution drive', description: 'Organize and distribute food packages to 500 families', assignedToEmail: 'volunteer@kindred.org', assignedToName: 'Priya Singh', status: 'pending', progress: 0, createdAt: '2024-01-20' },
        { id: 'st_004', programId: 'prog_002', title: 'Site survey for borewells', description: 'Survey 25 villages for suitable borewell locations', assignedToEmail: 'volunteer@kindred.org', assignedToName: 'Priya Singh', status: 'completed', progress: 100, createdAt: '2024-02-05' },
        { id: 'st_005', programId: 'prog_002', title: 'Community awareness campaign', description: 'Conduct water hygiene workshops in 15 villages', assignedToEmail: 'deepak.kumar@email.com', assignedToName: 'Deepak Kumar', status: 'in-progress', progress: 55, createdAt: '2024-02-12' },
        { id: 'st_006', programId: 'prog_002', title: 'Install purification units', description: 'Install 50 water purification systems', assignedToEmail: 'deepak.kumar@email.com', assignedToName: 'Deepak Kumar', status: 'pending', progress: 10, createdAt: '2024-03-01' },
    ];
    counter = 100;
    generateId() {
        return `st_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.subtasks.slice();
    }
    findById(id) {
        const st = this.subtasks.find((s) => s.id === id);
        if (!st)
            throw new common_2.NotFoundException(`Subtask with id '${id}' not found`);
        return { ...st };
    }
    findByProgram(programId) {
        return this.subtasks.filter((s) => s.programId === programId);
    }
    findByVolunteer(email) {
        return this.subtasks.filter((s) => s.assignedToEmail && s.assignedToEmail.toLowerCase() === email.toLowerCase());
    }
    findByProgramAndVolunteer(programId, email) {
        return this.subtasks.filter((s) => s.programId === programId && s.assignedToEmail && s.assignedToEmail.toLowerCase() === email.toLowerCase());
    }
    getProgramProgress(programId) {
        const subs = this.findByProgram(programId);
        if (subs.length === 0)
            return 0;
        const total = subs.reduce((sum, s) => sum + (s.progress || 0), 0);
        return Math.round(total / subs.length);
    }
    create(dto) {
        this.assignments.assertActive(dto.programId, dto.assignedToEmail);
        const newSt = {
            id: dto.id || this.generateId(),
            programId: dto.programId,
            title: dto.title,
            description: dto.description || '',
            assignedToEmail: dto.assignedToEmail,
            assignedToName: dto.assignedToName || '',
            status: 'pending',
            progress: 0,
            createdAt: new Date().toISOString().split('T')[0],
        };
        this.subtasks.push(newSt);
        return { ...newSt };
    }
    update(id, dto) {
        const idx = this.subtasks.findIndex((s) => s.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Subtask with id '${id}' not found`);
        const programId = dto.programId ?? this.subtasks[idx].programId;
        this.assignments.assertActive(programId, dto.assignedToEmail ?? this.subtasks[idx].assignedToEmail);
        if (dto.status === 'completed' || (dto.progress ?? 0) >= 100)
            this.proofs.assertVerified('subtasks', id);
        this.subtasks[idx] = { ...this.subtasks[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
        return { ...this.subtasks[idx] };
    }
    delete(id) {
        const idx = this.subtasks.findIndex((s) => s.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Subtask with id '${id}' not found`);
        this.subtasks.splice(idx, 1);
        return true;
    }
};
exports.SubtasksService = SubtasksService;
__decorate([
    (0, common_1.Inject)(store_1.ProofStore),
    __metadata("design:type", store_1.ProofStore)
], SubtasksService.prototype, "proofs", void 0);
exports.SubtasksService = SubtasksService = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [service_1.ProgramAssignmentsService])
], SubtasksService);
//# sourceMappingURL=service.js.map