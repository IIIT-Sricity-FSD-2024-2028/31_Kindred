"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomingService = void 0;
const common_1 = require("@nestjs/common");
let IncomingService = class IncomingService {
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
            throw new common_1.NotFoundException(`Incoming request with id '${id}' not found`);
        return { ...req };
    }
    getPending() {
        return this.requests.filter((r) => r.status === 'pending');
    }
    create(dto) {
        const newReq = {
            id: `INC-${Date.now()}_${this.counter++}`,
            name: dto.name,
            type: dto.type,
            desc: dto.desc,
            urgency: dto.urgency || 'medium',
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            location: dto.location || '',
        };
        this.requests.push(newReq);
        return { ...newReq };
    }
    accept(id) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Incoming request with id '${id}' not found`);
        this.requests[idx].status = 'accepted';
        return { ...this.requests[idx] };
    }
    decline(id) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Incoming request with id '${id}' not found`);
        this.requests[idx].status = 'declined';
        return { ...this.requests[idx] };
    }
    delete(id) {
        const idx = this.requests.findIndex((r) => r.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Incoming request with id '${id}' not found`);
        this.requests.splice(idx, 1);
        return true;
    }
};
exports.IncomingService = IncomingService;
exports.IncomingService = IncomingService = __decorate([
    (0, common_1.Injectable)()
], IncomingService);
//# sourceMappingURL=service.js.map