"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const ROLE_DASHBOARDS = {
    superuser: 'overview.html',
    admin: 'org-admin-overview.html',
    volunteer: 'volunteer-dashboard.html',
    donor: 'donor-dashboard.html',
    beneficiary: 'beneficiary-dashboard.html',
};
const ROLE_AVATARS = {
    superuser: '#6366f1',
    admin: '#0f1a2e',
    volunteer: '#10b981',
    donor: '#f59e0b',
    beneficiary: '#8b5cf6',
};
const IMMEDIATE_ACCESS_ROLES = ['donor', 'beneficiary', 'superuser'];
let UsersService = class UsersService {
    users = [
        {
            id: 'su_001', name: 'Kavita Sharma', email: 'super@kindred.org', password: 'Super@123',
            role: 'superuser', status: 'approved', initials: 'KS', avatar: '#6366f1', dashboard: 'overview.html', registeredAt: '2024-01-01T00:00:00Z',
        },
        {
            id: 'adm_001', name: 'Rajesh Verma', email: 'admin@hopeconnect.org', password: 'Admin@123',
            role: 'admin', org: 'HopeConnect', status: 'approved', initials: 'RV', avatar: '#0f1a2e', dashboard: 'org-admin-overview.html', registeredAt: '2024-01-01T00:00:00Z',
        },
        {
            id: 'vol_001', name: 'Priya Singh', email: 'volunteer@kindred.org', password: 'Vol@123',
            role: 'volunteer', status: 'approved', initials: 'PS', avatar: '#10b981', dashboard: 'volunteer-dashboard.html', registeredAt: '2024-01-01T00:00:00Z',
        },
        {
            id: 'don_001', name: 'Arun Patel', email: 'donor@kindred.org', password: 'Donor@123',
            role: 'donor', status: 'approved', initials: 'AP', avatar: '#f59e0b', dashboard: 'donor-dashboard.html', registeredAt: '2024-01-01T00:00:00Z',
        },
        {
            id: 'ben_001', name: 'Meena Devi', email: 'beneficiary@kindred.org', password: 'Ben@123',
            role: 'beneficiary', status: 'approved', initials: 'MD', avatar: '#8b5cf6', dashboard: 'beneficiary-dashboard.html', registeredAt: '2024-01-01T00:00:00Z',
        },
    ];
    counter = 100;
    generateId() {
        return `usr_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.users.slice();
    }
    findById(id) {
        const user = this.users.find((u) => u.id === id);
        if (!user)
            throw new common_1.NotFoundException(`User with id '${id}' not found`);
        return { ...user };
    }
    findByEmail(email) {
        return this.users.find((u) => u.email === email) || null;
    }
    search(q) {
        if (!q)
            return this.users.slice();
        const lq = q.toLowerCase();
        return this.users.filter((u) => (u.name && u.name.toLowerCase().includes(lq)) ||
            (u.email && u.email.toLowerCase().includes(lq)) ||
            (u.role && u.role.toLowerCase().includes(lq)));
    }
    getPending() {
        return this.users.filter((u) => u.status === 'pending');
    }
    getApproved() {
        return this.users.filter((u) => u.status === 'approved');
    }
    getRejected() {
        return this.users.filter((u) => u.status === 'rejected');
    }
    create(dto) {
        const existing = this.users.find((u) => u.email === dto.email);
        if (existing)
            throw new common_1.BadRequestException(`User with email '${dto.email}' already exists`);
        const initials = (dto.name || '')
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);
        const newUser = {
            id: this.generateId(),
            name: dto.name,
            email: dto.email,
            password: dto.password,
            role: dto.role,
            status: IMMEDIATE_ACCESS_ROLES.includes(dto.role) ? 'approved' : 'pending',
            initials,
            avatar: ROLE_AVATARS[dto.role] || '#6366f1',
            dashboard: ROLE_DASHBOARDS[dto.role] || 'beneficiary-dashboard.html',
            org: dto.org,
            phone: dto.phone,
            bio: dto.bio,
            skills: dto.skills,
            registeredAt: new Date().toISOString(),
        };
        this.users.push(newUser);
        return { ...newUser };
    }
    update(id, dto) {
        const idx = this.users.findIndex((u) => u.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`User with id '${id}' not found`);
        this.users[idx] = { ...this.users[idx], ...dto };
        return { ...this.users[idx] };
    }
    approve(id) {
        return this.update(id, { status: 'approved' });
    }
    reject(id) {
        return this.update(id, { status: 'rejected' });
    }
    delete(id) {
        const idx = this.users.findIndex((u) => u.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`User with id '${id}' not found`);
        this.users.splice(idx, 1);
        return true;
    }
    signIn(email, password, role) {
        return this.users.find((u) => u.email === email && u.password === password && u.role === role) || null;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=service.js.map