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
exports.IncomingService = void 0;
const store_1 = require("../proofs/store");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
let IncomingService = class IncomingService {
    proofs;
    requests = [
        { id: 'INC-001', name: 'Ravi Kumar', type: 'Medical Assistance', desc: 'Requires urgent medical supplies for flood-affected village.', urgency: 'high', date: '2024-12-20', status: 'pending', location: 'Patna, Bihar' },
        { id: 'INC-002', name: 'Sita Devi', type: 'Food Aid', desc: 'Family of 6 requires food ration for the next month.', urgency: 'high', date: '2024-12-19', status: 'pending', location: 'Varanasi, UP' },
        { id: 'INC-003', name: 'Local School Board', type: 'Educational Material', desc: 'Requesting notebooks and stationery for 200 students.', urgency: 'medium', date: '2024-12-18', status: 'pending', location: 'Gaya, Bihar' },
        { id: 'INC-004', name: 'Village Panchayat', type: 'Infrastructure', desc: 'Request for temporary shelter materials post-flooding.', urgency: 'medium', date: '2024-12-17', status: 'pending', location: 'Darbhanga, Bihar' },
    ];
    counter = 100;
    findAll() {
        return this.requests.slice();
    }
    findById(id) {
        const req = this.requests.find((r) => r.id === id);
        if (!req)
            throw new common_2.NotFoundException(`Incoming request with id '${id}' not found`);
        return { ...req };
    }
    getPending() {
        return this.requests.filter((r) => r.status === 'pending');
    }
    findByBeneficiaryEmail(email) {
        const normalizedEmail = String(email || '').trim().toLowerCase();
        return this.requests
            .filter((request) => String(request.beneficiaryEmail || '').trim().toLowerCase() === normalizedEmail)
            .map((request) => ({ ...request }));
    }
    create(dto) {
        const newReq = {
            id: dto.id || `INC-${Date.now()}_${this.counter++}`,
            name: dto.name,
            type: dto.type,
            desc: dto.desc,
            urgency: dto.urgency || 'medium',
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            location: dto.location || '',
            phone: dto.phone || '', beneficiaryEmail: dto.beneficiaryEmail || '', photoUrl: dto.photoUrl || '',
        };
        this.requests.push(newReq);
        return { ...newReq };
    }
    accept(id) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Incoming request with id '${id}' not found`);
        this.requests[idx].status = 'accepted';
        return { ...this.requests[idx] };
    }
    assign(id, volunteerName, volunteerEmail) { const idx = this.requests.findIndex(r => r.id === id); if (idx === -1)
        throw new common_2.NotFoundException(`Incoming request with id '${id}' not found`); this.requests[idx].status = 'assigned'; this.requests[idx].assignedVolunteerName = volunteerName; this.requests[idx].assignedVolunteerEmail = volunteerEmail; return { ...this.requests[idx] }; }
    resolve(id) { const idx = this.requests.findIndex(r => r.id === id); if (idx === -1)
        throw new common_2.NotFoundException(`Incoming request with id '${id}' not found`); if (this.requests[idx].assignedVolunteerEmail)
        this.proofs.assertVerified('incoming', id); this.requests[idx].status = 'resolved'; this.requests[idx].resolvedAt = new Date().toISOString(); return { ...this.requests[idx] }; }
    decline(id) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Incoming request with id '${id}' not found`);
        this.requests[idx].status = 'declined';
        return { ...this.requests[idx] };
    }
    delete(id) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Incoming request with id '${id}' not found`);
        this.requests.splice(idx, 1);
        return true;
    }
};
exports.IncomingService = IncomingService;
__decorate([
    (0, common_1.Inject)(store_1.ProofStore),
    __metadata("design:type", store_1.ProofStore)
], IncomingService.prototype, "proofs", void 0);
exports.IncomingService = IncomingService = __decorate([
    (0, common_2.Injectable)()
], IncomingService);
//# sourceMappingURL=service.js.map