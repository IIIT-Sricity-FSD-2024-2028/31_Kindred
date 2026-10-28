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
exports.ProgramApplicationsService = void 0;
const service_1 = require("../program-assignments/service");
const service_2 = require("../programs/service");
const common_1 = require("@nestjs/common");
const service_3 = require("../notifications/service");
let ProgramApplicationsService = class ProgramApplicationsService {
    assignments;
    programs;
    notifications;
    constructor(assignments, programs, notifications) {
        this.assignments = assignments;
        this.programs = programs;
        this.notifications = notifications;
    }
    applications = [];
    counter = 100;
    generateId() {
        return `papp_${Date.now()}_${this.counter++}`;
    }
    ensureApprovedMembership(application) {
        if (application.status !== 'approved')
            return;
        const existing = this.assignments.findByProgram(application.programId).find((a) => a.volunteerEmail.toLowerCase() === application.volunteerEmail.toLowerCase());
        if (existing)
            this.assignments.activateApprovedMembership(existing.id);
        else {
            const membership = this.assignments.create({ ...application, id: undefined, role: 'Volunteer' });
            this.assignments.activateApprovedMembership(membership.id);
        }
    }
    findAll() {
        this.applications.forEach((application) => this.ensureApprovedMembership(application));
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
    findByOrg(org) {
        const programIds = new Set(this.programs.findByOrg(org).map((program) => program.id));
        const applications = this.applications.filter((application) => programIds.has(application.programId));
        applications.forEach((application) => this.ensureApprovedMembership(application));
        return applications;
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
        const program = this.programs.findById(dto.programId);
        if (program.status !== 'active' || program.listingStatus !== 'approved' || !program.openForApplications)
            throw new common_1.BadRequestException('This program is not accepting public applications');
        if (this.assignments.findByProgram(dto.programId).some((a) => a.volunteerEmail.toLowerCase() === dto.volunteerEmail.toLowerCase() && ['active', 'pending'].includes(a.status)))
            throw new common_1.BadRequestException('You already have a membership or invitation for this program');
        if (this.hasApplied(dto.programId, dto.volunteerEmail)) {
            throw new common_1.BadRequestException('Volunteer has already applied to this program');
        }
        const newApp = {
            id: dto.id || this.generateId(),
            programId: dto.programId,
            programName: dto.programName,
            volunteerEmail: dto.volunteerEmail,
            volunteerName: dto.volunteerName,
            message: dto.message,
            status: 'pending',
            appliedAt: new Date().toISOString().split('T')[0],
        };
        this.applications.push(newApp);
        this.notifications.create({
            targetOrg: program.org,
            title: 'New volunteer request',
            message: `${newApp.volunteerName} requested to join ${program.name}.`,
            type: 'info',
            link: '/org-admin.html#programs',
        });
        return { ...newApp };
    }
    approve(id) {
        const idx = this.applications.findIndex((a) => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Program application with id '${id}' not found`);
        const application = this.applications[idx];
        this.applications[idx].status = 'approved';
        this.ensureApprovedMembership(this.applications[idx]);
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
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_1.ProgramAssignmentsService, service_2.ProgramsService, service_3.NotificationsService])
], ProgramApplicationsService);
//# sourceMappingURL=service.js.map