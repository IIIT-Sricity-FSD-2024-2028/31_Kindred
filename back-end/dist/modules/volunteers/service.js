"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteersService = void 0;
const common_1 = require("@nestjs/common");
let VolunteersService = class VolunteersService {
    volunteers = [
        { id: 'vol_001', name: 'Priya Singh', email: 'volunteer@kindred.org', phone: '+91 99887 76655', role: 'Field Coordinator', org: 'HopeConnect', status: 'active', joined: '2024-01-15', hours: 320, rating: 4.9, skills: ['Field Work', 'Community Outreach', 'Logistics'] },
        { id: 'vol_002', name: 'Amit Sharma', email: 'amit.sharma@email.com', phone: '+91 99887 76656', role: 'Medical Volunteer', org: 'HopeConnect', status: 'active', joined: '2024-02-10', hours: 210, rating: 4.7, skills: ['Medical Aid', 'Counseling', 'Field Work'] },
        { id: 'vol_003', name: 'Sunita Rao', email: 'sunita.rao@email.com', phone: '+91 99887 76657', role: 'Education Specialist', org: 'HopeConnect', status: 'active', joined: '2024-01-20', hours: 180, rating: 4.8, skills: ['Teaching', 'Administration', 'Community Outreach'] },
        { id: 'vol_004', name: 'Kiran Patel', email: 'kiran.patel@email.com', phone: '+91 99887 76658', role: 'Logistics Officer', org: 'HopeConnect', status: 'inactive', joined: '2024-03-05', hours: 90, rating: 4.2, skills: ['Logistics', 'Construction', 'Technology'] },
        { id: 'vol_005', name: 'Deepak Kumar', email: 'deepak.kumar@email.com', phone: '+91 99887 76659', role: 'Community Outreach', org: 'HopeConnect', status: 'active', joined: '2024-01-08', hours: 450, rating: 4.9, skills: ['Community Outreach', 'Cooking', 'Field Work', 'Environment'] },
        { id: 'vol_006', name: 'Anjali Mehta', email: 'anjali.mehta@email.com', phone: '+91 99887 76660', role: 'Field Coordinator', org: 'HopeConnect', status: 'active', joined: '2024-04-01', hours: 130, rating: 4.5, skills: ['Field Work', 'Translation', 'Teaching'] },
    ];
    counter = 100;
    generateId() {
        return `vol_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.volunteers.slice();
    }
    findById(id) {
        const vol = this.volunteers.find((v) => v.id === id);
        if (!vol)
            throw new common_1.NotFoundException(`Volunteer with id '${id}' not found`);
        return { ...vol };
    }
    findByEmail(email) {
        return this.volunteers.find((v) => v.email.toLowerCase() === email.toLowerCase()) || null;
    }
    findByOrg(org) {
        return this.volunteers.filter((v) => v.org === org);
    }
    create(dto) {
        const newVol = {
            id: this.generateId(),
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            role: dto.role,
            org: dto.org,
            skills: dto.skills || [],
            status: 'active',
            joined: new Date().toISOString().split('T')[0],
            hours: 0,
            rating: '—',
        };
        this.volunteers.push(newVol);
        return { ...newVol };
    }
    update(id, dto) {
        const idx = this.volunteers.findIndex((v) => v.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Volunteer with id '${id}' not found`);
        this.volunteers[idx] = { ...this.volunteers[idx], ...dto };
        return { ...this.volunteers[idx] };
    }
    delete(id) {
        const idx = this.volunteers.findIndex((v) => v.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Volunteer with id '${id}' not found`);
        this.volunteers.splice(idx, 1);
        return true;
    }
};
exports.VolunteersService = VolunteersService;
exports.VolunteersService = VolunteersService = __decorate([
    (0, common_1.Injectable)()
], VolunteersService);
//# sourceMappingURL=service.js.map