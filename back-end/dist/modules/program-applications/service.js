"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramApplicationsService = void 0;
const common_1 = require("@nestjs/common");
let ProgramApplicationsService = class ProgramApplicationsService {
    applications = [];
    counter = 100;
    generateId() {
        return `papp_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.applications.slice();
    }
    findById(id) {
        const app = this.applications.find((a) => a.id === id);
        if (!app)
            throw new common_1.NotFoundException(`Program application with id '${id}' not found`);
        return { ...app };
    }
    findByProgram(programId) {
        return this.applications.filter((a) => a.programId === programId);
    }
    findByVolunteer(email) {
        return this.applications.filter((a) => a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase());
    }
    getPending() {
        return this.applications.filter((a) => a.status === 'pending');
    }
    hasApplied(programId, email) {
        return this.applications.some((a) => a.programId === programId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase());
    }
    create(dto) {
        if (this.hasApplied(dto.programId, dto.volunteerEmail)) {
            throw new common_1.BadRequestException('Volunteer has already applied to this program');
        }
        const newApp = {
            id: this.generateId(),
            programId: dto.programId,
            programName: dto.programName,
            volunteerEmail: dto.volunteerEmail,
            volunteerName: dto.volunteerName,
            message: dto.message,
            status: 'pending',
            appliedAt: new Date().toISOString().split('T')[0],
        };
        this.applications.push(newApp);
        return { ...newApp };
    }
    approve(id) {
        const idx = this.applications.findIndex((a) => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Program application with id '${id}' not found`);
        this.applications[idx].status = 'approved';
        return { ...this.applications[idx] };
    }
    reject(id) {
        const idx = this.applications.findIndex((a) => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Program application with id '${id}' not found`);
        this.applications[idx].status = 'rejected';
        return { ...this.applications[idx] };
    }
    delete(id) {
        const idx = this.applications.findIndex((a) => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Program application with id '${id}' not found`);
        this.applications.splice(idx, 1);
        return true;
    }
};
exports.ProgramApplicationsService = ProgramApplicationsService;
exports.ProgramApplicationsService = ProgramApplicationsService = __decorate([
    (0, common_1.Injectable)()
], ProgramApplicationsService);
//# sourceMappingURL=service.js.map