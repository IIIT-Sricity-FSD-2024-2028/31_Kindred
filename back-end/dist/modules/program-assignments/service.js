"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramAssignmentsService = void 0;
const common_1 = require("@nestjs/common");
let ProgramAssignmentsService = class ProgramAssignmentsService {
    assignments = [
        { id: 'pa_001', programId: 'prog_001', programName: 'Cyclone Relief Fund', volunteerEmail: 'volunteer@kindred.org', volunteerName: 'Priya Singh', role: 'Field Coordinator', assignedAt: '2024-01-15', status: 'active' },
        { id: 'pa_002', programId: 'prog_001', programName: 'Cyclone Relief Fund', volunteerEmail: 'amit.sharma@email.com', volunteerName: 'Amit Sharma', role: 'Medical Volunteer', assignedAt: '2024-01-20', status: 'active' },
        { id: 'pa_003', programId: 'prog_002', programName: 'Clean Water Initiative', volunteerEmail: 'volunteer@kindred.org', volunteerName: 'Priya Singh', role: 'Field Coordinator', assignedAt: '2024-02-05', status: 'active' },
        { id: 'pa_004', programId: 'prog_002', programName: 'Clean Water Initiative', volunteerEmail: 'deepak.kumar@email.com', volunteerName: 'Deepak Kumar', role: 'Community Outreach', assignedAt: '2024-02-10', status: 'active' },
    ];
    counter = 100;
    generateId() {
        return `pa_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.assignments.slice();
    }
    findById(id) {
        const a = this.assignments.find((x) => x.id === id);
        if (!a)
            throw new common_1.NotFoundException(`Program assignment with id '${id}' not found`);
        return { ...a };
    }
    findByProgram(programId) {
        return this.assignments.filter((a) => a.programId === programId);
    }
    findByVolunteer(email) {
        return this.assignments.filter((a) => a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase());
    }
    exists(programId, email) {
        return this.assignments.some((a) => a.programId === programId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase());
    }
    create(dto) {
        if (this.exists(dto.programId, dto.volunteerEmail)) {
            throw new common_1.BadRequestException('Volunteer is already assigned to this program');
        }
        const newA = {
            id: this.generateId(),
            programId: dto.programId,
            programName: dto.programName,
            volunteerEmail: dto.volunteerEmail,
            volunteerName: dto.volunteerName,
            role: dto.role || 'Volunteer',
            assignedAt: new Date().toISOString().split('T')[0],
            status: 'active',
        };
        this.assignments.push(newA);
        return { ...newA };
    }
    update(id, dto) {
        const idx = this.assignments.findIndex((a) => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Program assignment with id '${id}' not found`);
        this.assignments[idx] = { ...this.assignments[idx], ...dto };
        return { ...this.assignments[idx] };
    }
    delete(id) {
        const idx = this.assignments.findIndex((a) => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Program assignment with id '${id}' not found`);
        this.assignments.splice(idx, 1);
        return true;
    }
};
exports.ProgramAssignmentsService = ProgramAssignmentsService;
exports.ProgramAssignmentsService = ProgramAssignmentsService = __decorate([
    (0, common_1.Injectable)()
], ProgramAssignmentsService);
//# sourceMappingURL=service.js.map