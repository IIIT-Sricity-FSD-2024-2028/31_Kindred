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
exports.ResourceDonationsService = void 0;
const store_1 = require("../proofs/store");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const service_1 = require("../organizations/service");
const service_2 = require("../programs/service");
let ResourceDonationsService = class ResourceDonationsService {
    organizations;
    programs;
    proofs;
    donations = [
        {
            id: 'rdon_001', donorName: 'Rajesh Gupta', donorEmail: 'donor@kindred.org', donorPhone: '9876543210',
            category: 'Food', items: [
                { name: 'Rice Bags (25kg)', quantity: 10, condition: 'New' },
                { name: 'Cooking Oil (5L)', quantity: 20, condition: 'New' },
            ],
            description: 'Bulk food supplies for the cyclone relief program.',
            pickupAddress: '42, MG Road, Sector 18, Noida, UP 201301',
            pickupDate: '2024-12-28', pickupTimeSlot: 'Morning (9AM-12PM)',
            programId: 'prog_001', programName: 'Cyclone Relief Fund',
            status: 'pending_pickup',
            assignedVolunteerEmail: 'volunteer@kindred.org', assignedVolunteerName: 'Priya Singh',
            assignedAt: '2024-12-22T10:30:00', pickedUpAt: null, deliveredAt: null,
            notes: '', createdAt: '2024-12-20T09:15:00',
        },
        {
            id: 'rdon_002', donorName: 'Anita Mehta', donorEmail: 'anita.donor@email.com', donorPhone: '8765432109',
            category: 'Blankets & Bedding', items: [
                { name: 'Warm Blankets', quantity: 50, condition: 'New' },
                { name: 'Pillows', quantity: 30, condition: 'Good' },
            ],
            description: 'Winter relief blankets and pillows.',
            pickupAddress: '15, Lajpat Nagar, South Delhi, 110024',
            pickupDate: '2024-12-25', pickupTimeSlot: 'Afternoon (12PM-4PM)',
            programId: 'prog_001', programName: 'Cyclone Relief Fund',
            status: 'delivered',
            assignedVolunteerEmail: 'deepak.kumar@email.com', assignedVolunteerName: 'Deepak Kumar',
            assignedAt: '2024-12-23T11:00:00', pickedUpAt: '2024-12-25T13:20:00', deliveredAt: '2024-12-25T16:45:00',
            notes: 'All items delivered to warehouse.', createdAt: '2024-12-21T14:30:00',
        },
        {
            id: 'rdon_003', donorName: 'Rajesh Gupta', donorEmail: 'donor@kindred.org', donorPhone: '9876543210',
            category: 'Medical Supplies', items: [
                { name: 'First Aid Kits', quantity: 25, condition: 'New' },
                { name: 'Bandages (Boxes)', quantity: 100, condition: 'New' },
                { name: 'ORS Packets', quantity: 500, condition: 'New' },
            ],
            description: 'Essential medical supplies for rural healthcare camps.',
            pickupAddress: '42, MG Road, Sector 18, Noida, UP 201301',
            pickupDate: '2025-01-05', pickupTimeSlot: 'Morning (9AM-12PM)',
            programId: '', programName: '',
            status: 'submitted',
            assignedVolunteerEmail: '', assignedVolunteerName: '',
            assignedAt: null, pickedUpAt: null, deliveredAt: null,
            notes: '', createdAt: '2024-12-24T08:00:00',
        },
    ];
    counter = 100;
    constructor(organizations, programs) {
        this.organizations = organizations;
        this.programs = programs;
        for (const donation of this.donations)
            donation.orgName = 'HopeConnect';
    }
    releaseDelivery(id) {
        const donation = this.donations.find(d => d.id === id);
        if (!donation)
            throw new common_2.NotFoundException('Donation not found');
        donation.assignedVolunteerEmail = '';
        donation.assignedVolunteerName = '';
        donation.status = 'submitted';
        donation.assignedAt = null;
        donation.pickedUpAt = null;
    }
    completeSharedDelivery(id) {
        const donation = this.donations.find(d => d.id === id);
        if (!donation)
            throw new common_2.NotFoundException('Donation not found');
        donation.status = 'completed';
        donation.deliveredAt = new Date().toISOString();
    }
    recordReceipt(id) {
        const donation = this.donations.find(d => d.id === id);
        if (!donation)
            throw new common_2.NotFoundException('Donation not found');
        donation.status = 'received';
    }
    generateId() {
        return `rdon_${Date.now()}_${this.counter++}`;
    }
    findAll() {
        return this.donations.slice();
    }
    findById(id) {
        const don = this.donations.find((d) => d.id === id);
        if (!don)
            throw new common_2.NotFoundException(`Resource donation with id '${id}' not found`);
        return { ...don };
    }
    findByDonor(email) {
        return this.donations.filter((d) => d.donorEmail && d.donorEmail.toLowerCase() === email.toLowerCase());
    }
    findByVolunteer(email) {
        return this.donations.filter((d) => d.assignedVolunteerEmail && d.assignedVolunteerEmail.toLowerCase() === email.toLowerCase());
    }
    findByOrg(orgName) { return this.donations.filter((d) => (d.orgName || '').toLowerCase() === orgName.toLowerCase()); }
    findByProgram(programId) {
        return this.donations.filter((d) => d.programId === programId);
    }
    findByStatus(status) {
        return this.donations.filter((d) => d.status === status);
    }
    getPending() {
        return this.donations.filter((d) => d.status === 'submitted');
    }
    getActivePickups() {
        return this.donations.filter((d) => d.status === 'pending_pickup' || d.status === 'in_transit');
    }
    create(dto) {
        if (dto.category !== 'Shop Delivery') {
            const program = dto.programId ? this.programs.findById(dto.programId) : undefined;
            const org = this.organizations.findAll().find(o => o.name === (dto.orgName || program?.org));
            if (!org || org.status !== 'active' || (program && program.org !== org.name))
                throw new common_2.BadRequestException('Select an active recipient organization and a matching program');
            dto = { ...dto, orgName: org.name, orgId: org.id, programName: program?.name || '' };
        }
        const newDon = {
            id: dto.id || this.generateId(),
            donorName: dto.donorName,
            image: dto.image,
            donorEmail: dto.donorEmail,
            donorPhone: dto.donorPhone,
            category: dto.category,
            items: dto.items,
            description: dto.description,
            pickupAddress: dto.pickupAddress,
            pickupDate: dto.pickupDate,
            pickupTimeSlot: dto.pickupTimeSlot,
            programId: dto.programId || '',
            programName: dto.programName || '',
            orgId: dto.orgId || '', orgName: dto.orgName || '',
            status: 'submitted',
            assignedVolunteerEmail: '',
            assignedVolunteerName: '',
            assignedAt: null,
            pickedUpAt: null,
            deliveredAt: null,
            notes: dto.notes || '',
            createdAt: new Date().toISOString(),
        };
        this.donations.push(newDon);
        return { ...newDon };
    }
    update(id, dto) {
        const idx = this.donations.findIndex((d) => d.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Resource donation with id '${id}' not found`);
        if (['delivered', 'completed'].includes(dto.status || ''))
            this.proofs.assertVerified('resource-donations', id);
        this.donations[idx] = { ...this.donations[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
        return { ...this.donations[idx] };
    }
    assignVolunteer(id, volName, volEmail) {
        const idx = this.donations.findIndex((d) => d.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Resource donation with id '${id}' not found`);
        this.donations[idx].assignedVolunteerEmail = volEmail;
        this.donations[idx].assignedVolunteerName = volName;
        this.donations[idx].assignedAt = new Date().toISOString();
        this.donations[idx].status = 'pending_pickup';
        return { ...this.donations[idx] };
    }
    startPickup(id) {
        const idx = this.donations.findIndex((d) => d.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Resource donation with id '${id}' not found`);
        this.donations[idx].status = 'in_transit';
        this.donations[idx].pickedUpAt = new Date().toISOString();
        return { ...this.donations[idx] };
    }
    markDelivered(id) {
        const idx = this.donations.findIndex((d) => d.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Resource donation with id '${id}' not found`);
        this.proofs.assertVerified('resource-donations', id);
        this.donations[idx].status = 'delivered';
        this.donations[idx].deliveredAt = new Date().toISOString();
        return { ...this.donations[idx] };
    }
    markCompleted(id) {
        const idx = this.donations.findIndex((d) => d.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Resource donation with id '${id}' not found`);
        this.proofs.assertVerified('resource-donations', id);
        this.donations[idx].status = 'completed';
        return { ...this.donations[idx] };
    }
    allocateToProgram(id, programId, programName) {
        const idx = this.donations.findIndex((d) => d.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Resource donation with id '${id}' not found`);
        this.donations[idx].programId = programId;
        this.donations[idx].programName = programName;
        return { ...this.donations[idx] };
    }
    delete(id) {
        const idx = this.donations.findIndex((d) => d.id === id);
        if (idx === -1)
            throw new common_2.NotFoundException(`Resource donation with id '${id}' not found`);
        this.donations.splice(idx, 1);
        return true;
    }
};
exports.ResourceDonationsService = ResourceDonationsService;
__decorate([
    (0, common_1.Inject)(store_1.ProofStore),
    __metadata("design:type", store_1.ProofStore)
], ResourceDonationsService.prototype, "proofs", void 0);
exports.ResourceDonationsService = ResourceDonationsService = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [service_1.OrganizationsService, service_2.ProgramsService])
], ResourceDonationsService);
//# sourceMappingURL=service.js.map