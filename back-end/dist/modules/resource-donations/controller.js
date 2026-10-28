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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceDonationsController = void 0;
const service_1 = require("../fulfillment/service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_2 = require("./service");
const create_resource_donation_dto_1 = require("./dto/create-resource-donation.dto");
const update_resource_donation_dto_1 = require("./dto/update-resource-donation.dto");
const platform_express_1 = require("@nestjs/platform-express");
const image_upload_1 = require("../../common/utils/image-upload");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let ResourceDonationsController = class ResourceDonationsController {
    service;
    fulfillment;
    constructor(service, fulfillment) {
        this.service = service;
        this.fulfillment = fulfillment;
    }
    uploadImage(file) { return { success: true, data: { url: (0, image_upload_1.saveImage)(file, 'resource-donation') } }; }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Resource donations retrieved' };
    }
    getPending() {
        return { success: true, data: this.service.getPending(), message: 'Pending donations retrieved' };
    }
    getActivePickups(h) {
        return { success: true, data: this.fulfillment.visibleDonations(this.service.getActivePickups(), { role: h.role, email: h['user-email'], org: h.organization }), message: 'Active pickups retrieved' };
    }
    findByDonor(email) {
        return { success: true, data: this.service.findByDonor(email).map(d => ({ ...d, inventory: this.fulfillment.donationProgress(d.id) })), message: 'Donations retrieved' };
    }
    findByVolunteer(email, h) {
        return { success: true, data: this.fulfillment.visibleDonations(this.service.findByVolunteer(email), { role: h.role, email: h['user-email'], org: h.organization }), message: 'Donations retrieved' };
    }
    findByOrg(orgName) { return { success: true, data: this.service.findByOrg(orgName), message: 'Organization resource donations retrieved' }; }
    findByProgram(programId) {
        return { success: true, data: this.service.findByProgram(programId), message: 'Donations retrieved' };
    }
    findByStatus(status) {
        return { success: true, data: this.service.findByStatus(status), message: 'Donations retrieved' };
    }
    findOne(id, h) {
        if (!this.fulfillment.visibleDonations([this.service.findById(id)], { role: h.role, email: h['user-email'], org: h.organization }).length)
            throw new common_1.ForbiddenException('This donation is not assigned to you');
        return { success: true, data: this.service.findById(id), message: 'Donation retrieved' };
    }
    create(dto) {
        return { success: true, data: this.service.create(dto), message: 'Resource donation submitted successfully' };
    }
    update(id, dto, h) {
        this.fulfillment.assertDonationEditable(id, { role: h.role, email: h['user-email'], org: h.organization });
        return { success: true, data: this.service.update(id, dto), message: 'Donation updated' };
    }
    assignVolunteer(id, body, h) {
        return { success: true, data: this.fulfillment.offer({ kind: 'collection', sourceId: id, mode: 'direct', volunteerEmail: body.volunteerEmail }, { role: h.role, email: h['user-email'], org: h.organization }), message: 'Volunteer assigned for pickup' };
    }
    startPickup(id, h) {
        this.fulfillment.assertLegacyAvailable('collection', id, { role: h.role, email: h['user-email'], org: h.organization });
        return { success: true, data: this.service.startPickup(id), message: 'Pickup started' };
    }
    markDelivered(id, h) {
        this.fulfillment.assertLegacyAvailable('collection', id, { role: h.role, email: h['user-email'], org: h.organization });
        return { success: true, data: this.service.markDelivered(id), message: 'Marked as delivered' };
    }
    markCompleted(id, h) {
        this.fulfillment.assertLegacyAvailable('collection', id, { role: h.role, email: h['user-email'], org: h.organization });
        return { success: true, data: this.service.markCompleted(id), message: 'Marked as completed' };
    }
    allocateToProgram(id, body, h) {
        return { success: true, data: this.fulfillment.allocateDonation(id, body.programId, { role: h.role, email: h['user-email'], org: h.organization }), message: 'Allocated to program' };
    }
    remove(id, h) {
        this.fulfillment.assertDonationEditable(id, { role: h.role, email: h['user-email'], org: h.organization });
        this.service.delete(id);
        return { success: true, data: null, message: 'Donation deleted' };
    }
};
exports.ResourceDonationsController = ResourceDonationsController;
__decorate([
    (0, common_1.Post)('upload-image'),
    (0, roles_decorator_1.Roles)('donor', 'admin', 'superuser'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 5 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all resource donations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resource donations retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending (submitted) donations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending donations retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('active-pickups'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active pickups assigned to volunteers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active pickups retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "getActivePickups", null);
__decorate([
    (0, common_1.Get)('by-donor/:email'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'donor'),
    (0, swagger_1.ApiOperation)({ summary: 'Get donations by donor email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Donations retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "findByDonor", null);
__decorate([
    (0, common_1.Get)('by-volunteer/:email'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get donations assigned to volunteer for pickup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Donations retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "findByVolunteer", null);
__decorate([
    (0, common_1.Get)('by-org/:orgName'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    __param(0, (0, common_1.Param)('orgName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "findByOrg", null);
__decorate([
    (0, common_1.Get)('by-program/:programId'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get donations allocated to a program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Donations retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('programId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "findByProgram", null);
__decorate([
    (0, common_1.Get)('by-status/:status'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get donations by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Donations retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'donor', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get resource donation by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Donation retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Donation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('donor', 'admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new resource donation', description: 'Donor submits a resource donation with pickup details' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Resource donation submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires donor, admin, or superuser role' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_resource_donation_dto_1.CreateResourceDonationDto]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a resource donation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Donation updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Donation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_resource_donation_dto_1.UpdateResourceDonationDto, Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/assign-volunteer'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a volunteer for pickup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Volunteer assigned for pickup' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Donation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "assignVolunteer", null);
__decorate([
    (0, common_1.Patch)(':id/start-pickup'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Start pickup process' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pickup started' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Donation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "startPickup", null);
__decorate([
    (0, common_1.Patch)(':id/mark-delivered'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark donation as delivered' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Marked as delivered' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Donation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "markDelivered", null);
__decorate([
    (0, common_1.Patch)(':id/mark-completed'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark donation as completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Marked as completed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Donation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "markCompleted", null);
__decorate([
    (0, common_1.Patch)(':id/allocate-program'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Allocate donation to a program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allocated to program' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Donation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "allocateToProgram", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a resource donation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Donation deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Donation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourceDonationsController.prototype, "remove", null);
exports.ResourceDonationsController = ResourceDonationsController = __decorate([
    (0, swagger_1.ApiTags)('Resource Donations'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('resource-donations'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_2.ResourceDonationsService, service_1.FulfillmentService])
], ResourceDonationsController);
//# sourceMappingURL=controller.js.map