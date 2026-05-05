"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
let RequestsService = class RequestsService {
    requests = [
        { id: 'REQ-001', org: 'ShelterHope', type: 'Organization Registration', description: 'New NGO registration request for housing assistance programs.', date: '2024-12-15', status: 'pending', priority: 'high', contact: 'info@shelterhope.org', phone: '9876543210', city: 'Pune' },
        { id: 'REQ-002', org: 'PathFinders', type: 'Budget Increase', description: 'Request to increase approved budget for youth empowerment campaign.', date: '2024-12-18', status: 'pending', priority: 'medium', contact: 'reach@pathfinders.org', phone: '8765432109', city: 'Jaipur' },
        { id: 'REQ-003', org: 'EcoTrust Foundation', type: 'Account Reinstatement', description: 'Request to reinstate suspended account after compliance review.', date: '2024-12-20', status: 'pending', priority: 'high', contact: 'eco@ecotrust.org', phone: '7654321098', city: 'Chandigarh' },
    ];
    counter = 100;
    findAll() {
        return this.requests.slice();
    }
    findById(id) {
        const req = this.requests.find((r) => r.id === id);
        if (!req)
            throw new common_1.NotFoundException(`Request with id '${id}' not found`);
        return { ...req };
    }
    getPending() {
        return this.requests.filter((r) => r.status === 'pending');
    }
    create(dto) {
        const newReq = {
            id: `REQ-${String(Date.now()).slice(-4)}`,
            org: dto.org,
            type: dto.type,
            description: dto.description,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            priority: dto.priority || 'medium',
            contact: dto.contact || '',
            phone: dto.phone || '',
            city: dto.city || '',
        };
        this.requests.push(newReq);
        return { ...newReq };
    }
    update(id, dto) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Request with id '${id}' not found`);
        this.requests[idx] = { ...this.requests[idx], ...dto };
        return { ...this.requests[idx] };
    }
    approve(id) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Request with id '${id}' not found`);
        this.requests[idx].status = 'approved';
        return { ...this.requests[idx] };
    }
    reject(id) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Request with id '${id}' not found`);
        this.requests[idx].status = 'rejected';
        return { ...this.requests[idx] };
    }
    delete(id) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Request with id '${id}' not found`);
        this.requests.splice(idx, 1);
        return true;
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)()
], RequestsService);
//# sourceMappingURL=service.js.map