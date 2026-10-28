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
exports.HourLogsService = void 0;
const store_1 = require("../proofs/store");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
let HourLogsService = class HourLogsService {
    proofs;
    hourLogs = [];
    counter = 100;
    generateId() {
        return `hlog_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.hourLogs.slice();
    }
    findById(id) {
        const log = this.hourLogs.find((l) => l.id === id);
        if (!log)
            throw new common_2.NotFoundException(`Hour log with id '${id}' not found`);
        return { ...log };
    }
    findByVolunteer(email) {
        return this.hourLogs.filter((l) => l.volunteerEmail && l.volunteerEmail.toLowerCase() === email.toLowerCase());
    }
    getPending() {
        return this.hourLogs.filter((l) => l.status === 'pending');
    }
    create(dto) {
        const newLog = {
            id: dto.id || this.generateId(),
            volunteerEmail: dto.volunteerEmail,
            volunteerName: dto.volunteerName,
            hours: dto.hours,
            date: dto.date,
            description: dto.description,
            programId: dto.programId,
            programName: dto.programName,
            status: 'pending',
            submittedAt: new Date().toISOString(),
        };
        this.hourLogs.push(newLog);
        return { ...newLog };
    }
    update(id, dto) {
        const idx = this.hourLogs.findIndex((l) => l.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Hour log with id '${id}' not found`);
        if (dto.status === 'approved')
            this.proofs.assertVerified('hour-logs', id);
        this.hourLogs[idx] = { ...this.hourLogs[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
        return { ...this.hourLogs[idx] };
    }
    approve(id) {
        const idx = this.hourLogs.findIndex((l) => l.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Hour log with id '${id}' not found`);
        this.proofs.assertVerified('hour-logs', id);
        this.hourLogs[idx].status = 'approved';
        this.hourLogs[idx].reviewedAt = new Date().toISOString();
        return { ...this.hourLogs[idx] };
    }
    reject(id) {
        const idx = this.hourLogs.findIndex((l) => l.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Hour log with id '${id}' not found`);
        this.hourLogs[idx].status = 'rejected';
        this.hourLogs[idx].reviewedAt = new Date().toISOString();
        return { ...this.hourLogs[idx] };
    }
    delete(id) {
        const idx = this.hourLogs.findIndex((l) => l.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Hour log with id '${id}' not found`);
        this.hourLogs.splice(idx, 1);
        return true;
    }
};
exports.HourLogsService = HourLogsService;
__decorate([
    (0, common_1.Inject)(store_1.ProofStore),
    __metadata("design:type", store_1.ProofStore)
], HourLogsService.prototype, "proofs", void 0);
exports.HourLogsService = HourLogsService = __decorate([
    (0, common_2.Injectable)()
], HourLogsService);
//# sourceMappingURL=service.js.map