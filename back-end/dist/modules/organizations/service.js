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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
let OrganizationsService = class OrganizationsService {
    organizations = [
        { id: 'org_001', name: 'HopeConnect', joined: 'Jan 2024', focus: 'Disaster Relief', status: 'active', volunteers: 1240, beneficiaries: 15400, rating: 4.8, color: '#6366f1', email: 'contact@hopeconnect.org', phone: '+91 98765 43210', city: 'Mumbai' },
        { id: 'org_002', name: 'MyTrust Foundation', joined: 'Feb 2024', focus: 'Community Development', status: 'active', volunteers: 1850, beneficiaries: 12800, rating: 4.7, color: '#ec4899', email: 'info@mytrust.org', phone: '+91 98765 43211', city: 'Delhi' },
        { id: 'org_003', name: 'GreenEarth Initiative', joined: 'Mar 2024', focus: 'Environment', status: 'active', volunteers: 990, beneficiaries: 8200, rating: 4.6, color: '#22c55e', email: 'hello@greenearth.org', phone: '+91 98765 43212', city: 'Bengaluru' },
        { id: 'org_004', name: 'EduBridge', joined: 'Feb 2024', focus: 'Education', status: 'active', volunteers: 2130, beneficiaries: 32000, rating: 4.9, color: '#f59e0b', email: 'info@edubridge.org', phone: '+91 98765 43213', city: 'Chennai' },
        { id: 'org_005', name: 'MedReach', joined: 'Nov 2024', focus: 'Healthcare', status: 'active', volunteers: 760, beneficiaries: 6800, rating: 4.5, color: '#ef4444', email: 'support@medreach.org', phone: '+91 98765 43214', city: 'Hyderabad' },
        { id: 'org_006', name: 'FoodFirst Alliance', joined: 'Apr 2024', focus: 'Food Security', status: 'active', volunteers: 1580, beneficiaries: 22000, rating: 4.7, color: '#14b8a6', email: 'help@foodfirst.org', phone: '+91 98765 43215', city: 'Kolkata' },
        { id: 'org_007', name: 'ShelterHope', joined: 'Jul 2024', focus: 'Housing', status: 'pending', volunteers: 430, beneficiaries: 3200, rating: 3.9, color: '#8b5cf6', email: 'info@shelterhope.org', phone: '+91 98765 43216', city: 'Pune' },
        { id: 'org_008', name: 'CareBridge', joined: 'Aug 2024', focus: 'Elder Care', status: 'active', volunteers: 520, beneficiaries: 4100, rating: 4.3, color: '#06b6d4', email: 'care@carebridge.org', phone: '+91 98765 43217', city: 'Ahmedabad' },
        { id: 'org_009', name: 'GlobalAid Network', joined: 'Jan 2024', focus: 'International Aid', status: 'active', volunteers: 3200, beneficiaries: 45000, rating: 4.8, color: '#84cc16', email: 'global@globalaid.org', phone: '+91 98765 43218', city: 'New Delhi' },
        { id: 'org_010', name: 'PathFinders', joined: 'Sep 2024', focus: 'Youth Empowerment', status: 'active', volunteers: 980, beneficiaries: 7600, rating: 4.4, color: '#f97316', email: 'reach@pathfinders.org', phone: '+91 98765 43219', city: 'Jaipur' },
        { id: 'org_011', name: 'EcoTrust Foundation', joined: 'Oct 2024', focus: 'Sustainability', status: 'suspended', volunteers: 870, beneficiaries: 5200, rating: 4.2, color: '#10b981', email: 'eco@ecotrust.org', phone: '+91 98765 43220', city: 'Chandigarh' },
        { id: 'org_012', name: 'BrightFutures', joined: 'Jan 2024', focus: 'Child Welfare', status: 'active', volunteers: 1120, beneficiaries: 9800, rating: 4.6, color: '#a855f7', email: 'bright@brightfutures.org', phone: '+91 98765 43221', city: 'Lucknow' },
    ];
    constructor() {
        const photos = {
            'Disaster Relief': 'org-disaster.png', 'Community Development': 'org-education.png',
            Environment: 'org-environment.png', Education: 'org-education.png',
            Healthcare: 'org-healthcare.png', 'Food Security': 'org-food.png',
            'Elder Care': 'org-eldercare.png', 'International Aid': 'org-globalaid.png',
            'Youth Empowerment': 'org-youth.png', 'Child Welfare': 'org-education.png',
        };
        this.organizations.forEach((org, index) => {
            org.listingStatus = org.status === 'active' ? 'approved' : 'unlisted';
            if (org.status === 'active') {
                org.bankAccountName = `${org.name} (Demo)`;
                org.bankAccountNumber = String(900000000001 + index);
                org.bankIfsc = 'DEMO0000001';
                org.image = photos[org.focus] ? `/images/${photos[org.focus]}` : undefined;
            }
        });
    }
    hasBankDetails(org) {
        return Boolean(org.bankAccountName?.trim() && /^\d{9,18}$/.test(org.bankAccountNumber || '') && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(org.bankIfsc || ''));
    }
    requireBankDetails(name) {
        const org = this.organizations.find((o) => o.name === name);
        if (!org)
            throw new common_1.BadRequestException('Organization profile not found. Check the organization linked to your account.');
        if (!this.hasBankDetails(org))
            throw new common_1.BadRequestException('Update and save your organization bank account holder, account number and IFSC before requesting public display.');
        if (org.status !== 'active')
            throw new common_1.BadRequestException('Your bank details are saved, but your organization registration must be approved by the platform admin before requesting public display.');
        return { ...org };
    }
    findPublic() {
        return this.findAll().filter((org) => org.status === 'active' && org.listingStatus === 'approved' && this.hasBankDetails(org));
    }
    requestListing(id, dto) {
        const org = this.findById(id);
        this.requireBankDetails(org.name);
        if (org.status !== 'active')
            throw new common_1.BadRequestException('Organization registration must be approved first.');
        if (['pending', 'approved'].includes(org.listingStatus || ''))
            throw new common_1.BadRequestException('A listing is already pending or approved.');
        if (!dto.bankAccountName.trim() || !/^\d{9,18}$/.test(dto.bankAccountNumber) || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(dto.bankIfsc))
            throw new common_1.BadRequestException('Valid bank account name, number and IFSC are required.');
        const idx = this.organizations.findIndex((item) => item.id === id);
        this.organizations[idx] = { ...org, ...dto, listingStatus: 'pending', listingRequestedAt: new Date().toISOString() };
        return this.findById(id);
    }
    reviewListing(id, approved) {
        const org = this.findById(id);
        if (approved)
            this.requireBankDetails(org.name);
        if (org.listingStatus !== 'pending')
            throw new common_1.BadRequestException('Only pending listing requests can be reviewed.');
        const idx = this.organizations.findIndex((item) => item.id === id);
        this.organizations[idx].listingStatus = approved ? 'approved' : 'rejected';
        return this.findById(id);
    }
    counter = 100;
    generateId() {
        return `org_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.organizations.slice();
    }
    findById(id) {
        const org = this.organizations.find((o) => o.id === id);
        if (!org)
            throw new common_1.NotFoundException(`Organization with id '${id}' not found`);
        return { ...org };
    }
    search(q) {
        if (!q)
            return this.organizations.slice();
        const lq = q.toLowerCase();
        return this.organizations.filter((o) => o.name.toLowerCase().includes(lq) ||
            o.focus.toLowerCase().includes(lq) ||
            (o.city || '').toLowerCase().includes(lq));
    }
    create(dto) {
        const colors = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#ef4444', '#14b8a6', '#8b5cf6', '#06b6d4'];
        const newOrg = {
            id: dto.id || this.generateId(),
            name: dto.name,
            focus: dto.focus,
            email: dto.email,
            phone: dto.phone,
            city: dto.city,
            joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
            volunteers: 0,
            beneficiaries: 0,
            rating: '—',
            color: colors[Math.floor(Math.random() * colors.length)],
            status: dto.status || 'pending',
            listingStatus: 'unlisted',
            adminEmail: dto.adminEmail, image: dto.image, certificateUrl: dto.certificateUrl, certificateName: dto.certificateName,
            bankAccountName: dto.bankAccountName, bankAccountNumber: dto.bankAccountNumber, bankIfsc: dto.bankIfsc, upiId: dto.upiId, neededResources: dto.neededResources,
        };
        this.organizations.push(newOrg);
        return { ...newOrg };
    }
    update(id, dto) {
        const idx = this.organizations.findIndex((o) => o.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Organization with id '${id}' not found`);
        const bankKeys = ['bankAccountName', 'bankAccountNumber', 'bankIfsc'];
        const bankChanged = bankKeys.some((key) => dto[key] !== undefined && dto[key] !== this.organizations[idx][key]);
        this.organizations[idx] = { ...this.organizations[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
        if (bankChanged && this.organizations[idx].listingStatus === 'approved')
            this.organizations[idx].listingStatus = 'unlisted';
        return { ...this.organizations[idx] };
    }
    delete(id) {
        const idx = this.organizations.findIndex((o) => o.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Organization with id '${id}' not found`);
        this.organizations.splice(idx, 1);
        return true;
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OrganizationsService);
//# sourceMappingURL=service.js.map