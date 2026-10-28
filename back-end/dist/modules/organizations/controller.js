"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_organization_dto_1 = require("./dto/create-organization.dto");
const listing_request_dto_1 = require("./dto/listing-request.dto");
const update_organization_dto_1 = require("./dto/update-organization.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const platform_express_1 = require("@nestjs/platform-express");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let OrganizationsController = class OrganizationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findPublic(), message: 'Organizations retrieved successfully' };
    }
    manage(role, org) {
        const records = this.service.findAll();
        return { success: true, data: role === 'superuser' ? records : records.filter((record) => record.name === org) };
    }
    requestListing(id, dto, org) {
        if (!org || this.service.findById(id).name !== org)
            throw new common_1.ForbiddenException('You can only submit your own organization.');
        return { success: true, data: this.service.requestListing(id, dto), message: 'Listing submitted for platform approval' };
    }
    approveListing(id) {
        return { success: true, data: this.service.reviewListing(id, true), message: 'Public listing approved' };
    }
    rejectListing(id) {
        return { success: true, data: this.service.reviewListing(id, false), message: 'Public listing rejected' };
    }
    search(q) {
        return { success: true, data: this.service.findPublic().filter((org) => !q || [org.name, org.city, org.focus].join(' ').toLowerCase().includes(q.toLowerCase())), message: 'Search completed' };
    }
    findOne(id) {
        const org = this.service.findPublic().find((item) => item.id === id);
        if (!org)
            throw new common_1.BadRequestException('Organization is not publicly listed.');
        return { success: true, data: org, message: 'Organization retrieved successfully' };
    }
    register(dto) { return { success: true, data: this.service.create({ ...dto, status: 'pending' }), message: 'Organization submitted for approval' }; }
    uploadCertificate(file) {
        if (!file)
            throw new common_1.BadRequestException('Please attach a certificate using field name "file"');
        const allowedTypes = new Set(['application/pdf', 'image/png', 'image/jpeg']);
        if (!allowedTypes.has(String(file.mimetype || '').toLowerCase())) {
            throw new common_1.BadRequestException('Only PDF, PNG, and JPG certificate files are allowed');
        }
        const fallbackExt = file.mimetype === 'application/pdf' ? '.pdf' : file.mimetype === 'image/png' ? '.png' : '.jpg';
        const ext = path.extname(file.originalname || '').replace(/[^.a-zA-Z0-9]/g, '') || fallbackExt;
        const filename = `organization-certificate-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        const uploadsDir = path.join(process.cwd(), 'uploads');
        fs.mkdirSync(uploadsDir, { recursive: true });
        fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);
        return {
            success: true,
            data: { url: `http://localhost:3000/uploads/${filename}`, filename, originalName: file.originalname },
            message: 'Organization certificate uploaded successfully',
        };
    }
    approve(id) { return { success: true, data: this.service.update(id, { status: 'active' }), message: 'Organization approved' }; }
    reject(id) { return { success: true, data: this.service.update(id, { status: 'suspended' }), message: 'Organization rejected' }; }
    uploadImage(file) {
        if (!file)
            throw new common_1.BadRequestException('Please attach an image file using field name "file"');
        if (!String(file.mimetype || '').startsWith('image/'))
            throw new common_1.BadRequestException('Only image files are allowed');
        const ext = path.extname(file.originalname || '').replace(/[^.a-zA-Z0-9]/g, '') || '.jpg';
        const filename = `organization-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        const uploadsDir = path.join(process.cwd(), 'uploads');
        fs.mkdirSync(uploadsDir, { recursive: true });
        fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);
        return { success: true, data: { url: `http://localhost:3000/uploads/${filename}`, filename }, message: 'Organization image uploaded successfully' };
    }
    create(dto, role) {
        return { success: true, data: this.service.create(role === 'admin' ? { ...dto, status: 'pending' } : dto), message: 'Organization created successfully' };
    }
    update(id, dto, role, org) {
        if (role === 'admin' && (!org || this.service.findById(id).name !== org || (dto.name !== undefined && dto.name !== org) || dto.status !== undefined))
            throw new common_1.ForbiddenException('You can only edit your own organization profile; platform approval is required for status changes.');
        return { success: true, data: this.service.update(id, dto), message: 'Organization updated successfully' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Organization deleted successfully' };
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all organizations', description: 'Public endpoint — returns all registered NGOs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organizations retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('manage'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    __param(0, (0, common_1.Headers)('role')),
    __param(1, (0, common_1.Headers)('organization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "manage", null);
__decorate([
    (0, common_1.Patch)(':id/request-listing'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('organization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, listing_request_dto_1.ListingRequestDto, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "requestListing", null);
__decorate([
    (0, common_1.Patch)(':id/approve-listing'),
    (0, roles_decorator_1.Roles)('superuser'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "approveListing", null);
__decorate([
    (0, common_1.Patch)(':id/reject-listing'),
    (0, roles_decorator_1.Roles)('superuser'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "rejectListing", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search organizations by name, city, or focus' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, description: 'Search query string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search completed' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Organization not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Public organization registration; starts pending for platform approval' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('upload-certificate'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 5 * 1024 * 1024 } })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload an organization registration certificate before public registration' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "uploadCertificate", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)('superuser'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)('superuser'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)('upload-image'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 4 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new organization', description: 'Register a new NGO on the platform' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Organization created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Organization not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('role')),
    __param(3, (0, common_1.Headers)('organization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_organization_dto_1.UpdateOrganizationDto, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Organization not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires superuser role' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "remove", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, swagger_1.ApiTags)('Organizations'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('organizations'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.OrganizationsService])
], OrganizationsController);
//# sourceMappingURL=controller.js.map