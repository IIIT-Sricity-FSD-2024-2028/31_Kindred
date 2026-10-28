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
exports.ProgramAssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("../programs/service");
let ProgramAssignmentsService = class ProgramAssignmentsService {
    programs;
    constructor(programs) {
        this.programs = programs;
    }
    onModuleInit() { this.programs.findAll().forEach((p) => this.syncCount(p.id)); }
    syncCount(programId) { this.programs.setVolunteerCount(programId, new Set(this.assignments.filter((a) => a.programId === programId && a.status === 'active').map((a) => a.volunteerEmail.toLowerCase())).size); }
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
    memberPrograms(email) { return this.programs.findAll().filter((p) => this.findByVolunteer(email || '').some((a) => a.programId === p.id && ['active', 'pending'].includes(a.status))); }
    exists(programId, email) {
        return this.assignments.some((a) => a.programId === programId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase());
    }
    assertActive(programId, email) {
        this.programs.findById(programId);
        if (!this.findByProgram(programId).some((a) => a.status === 'active' && a.volunteerEmail.toLowerCase() === email.toLowerCase())) {
            throw new common_1.BadRequestException('The volunteer must accept a program invitation before tasks or subtasks can be assigned.');
        }
    }
    respond(id, email, action) {
        const assignment = this.findById(id);
        if (!email || assignment.volunteerEmail.toLowerCase() !== email.toLowerCase())
            throw new common_1.ForbiddenException('Only the invited volunteer can respond.');
        if (assignment.status !== 'pending')
            throw new common_1.BadRequestException('This invitation is no longer pending.');
        const idx = this.assignments.findIndex((a) => a.id === id);
        this.assignments[idx].status = action === 'accepted' ? 'active' : 'declined';
        this.syncCount(assignment.programId);
        return this.findById(id);
    }
    activateApprovedMembership(id) {
        const assignment = this.findById(id);
        const idx = this.assignments.findIndex((a) => a.id === id);
        this.assignments[idx].status = 'active';
        this.syncCount(assignment.programId);
        return this.findById(id);
    }
    create(dto) {
        this.programs.findById(dto.programId);
        if (this.exists(dto.programId, dto.volunteerEmail)) {
            throw new common_1.BadRequestException('Volunteer is already assigned to this program');
        }
        const newA = {
            id: dto.id || this.generateId(),
            programId: dto.programId,
            programName: dto.programName,
            volunteerEmail: dto.volunteerEmail,
            volunteerName: dto.volunteerName,
            role: dto.role || 'Volunteer',
            assignedAt: new Date().toISOString().split('T')[0],
            status: 'pending',
        };
        this.assignments.push(newA);
        return { ...newA };
    }
    update(id, dto) {
        const idx = this.assignments.findIndex((a) => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Program assignment with id '${id}' not found`);
        if (dto.status && !['pending', 'cancelled'].includes(dto.status))
            throw new common_1.BadRequestException('Only the volunteer can activate an invitation.');
        if (dto.programId || dto.volunteerEmail)
            throw new common_1.BadRequestException('Create a new invitation to change the program or volunteer.');
        if (dto.status === 'pending' && this.assignments[idx].status === 'active')
            throw new common_1.BadRequestException('An accepted member is already active.');
        this.assignments[idx] = { ...this.assignments[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
        this.syncCount(this.assignments[idx].programId);
        return { ...this.assignments[idx] };
    }
    delete(id) {
        const idx = this.assignments.findIndex((a) => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Program assignment with id '${id}' not found`);
        const programId = this.assignments[idx].programId;
        this.assignments.splice(idx, 1);
        this.syncCount(programId);
        return true;
    }
};
exports.ProgramAssignmentsService = ProgramAssignmentsService;
exports.ProgramAssignmentsService = ProgramAssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_1.ProgramsService])
], ProgramAssignmentsService);
//# sourceMappingURL=service.js.map