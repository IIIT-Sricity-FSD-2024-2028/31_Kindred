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
exports.IncomingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_1 = require("./service");
const create_incoming_dto_1 = require("./dto/create-incoming.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const platform_express_1 = require("@nestjs/platform-express");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let IncomingController = class IncomingController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return { success: true, data: this.service.findAll(), message: 'Incoming requests retrieved' };
    }
    getPending() {
        return { success: true, data: this.service.getPending(), message: 'Pending requests retrieved' };
    }
    findByBeneficiary(email) {
        return { success: true, data: this.service.findByBeneficiaryEmail(email), message: 'Beneficiary requests retrieved' };
    }
    byVolunteer(email) { return { success: true, data: this.service.findAll().filter((r) => r.assignedVolunteerEmail?.toLowerCase() === email.toLowerCase()) }; }
    findOne(id) {
        return { success: true, data: this.service.findById(id), message: 'Incoming request retrieved' };
    }
    create(dto, file) {
        let photoUrl = dto.photoUrl;
        if (file) {
            if (!String(file.mimetype || '').startsWith('image/'))
                throw new common_1.BadRequestException('Only image files are allowed');
            const ext = path.extname(file.originalname || '').replace(/[^.a-zA-Z0-9]/g, '') || '.jpg';
            const filename = `emergency-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
            const uploadsDir = path.join(process.cwd(), 'uploads');
            fs.mkdirSync(uploadsDir, { recursive: true });
            fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);
            photoUrl = `http://localhost:3000/uploads/${filename}`;
        }
        return { success: true, data: this.service.create({ ...dto, photoUrl }), message: 'Incoming request created successfully' };
    }
    accept(id) {
        return { success: true, data: this.service.accept(id), message: 'Request accepted' };
    }
    assignVolunteer(id, body) { return { success: true, data: this.service.assign(id, body.volunteerName, body.volunteerEmail), message: 'Volunteer assigned to beneficiary request' }; }
    resolve(id) { return { success: true, data: this.service.resolve(id), message: 'Beneficiary request resolved' }; }
    decline(id) {
        return { success: true, data: this.service.decline(id), message: 'Request declined' };
    }
    remove(id) {
        this.service.delete(id);
        return { success: true, data: null, message: 'Incoming request deleted' };
    }
};
exports.IncomingController = IncomingController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all incoming requests', description: 'Returns all submissions — emergency requests, contact forms, and feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incoming requests retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied — requires admin or superuser role' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending incoming requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending requests retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('by-beneficiary/:email'),
    (0, roles_decorator_1.Roles)('beneficiary', 'admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assistance requests submitted by a beneficiary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Beneficiary requests retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "findByBeneficiary", null);
__decorate([
    (0, common_1.Get)('by-volunteer/:email'),
    (0, roles_decorator_1.Roles)('volunteer'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "byVolunteer", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incoming request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incoming request retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 5 * 1024 * 1024 } })),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new incoming request', description: 'Used by Contact Us, Emergency Help, and Feedback forms' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Incoming request created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_incoming_dto_1.CreateIncomingDto, Object]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept an incoming request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request accepted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)(':id/assign-volunteer'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "assignVolunteer", null);
__decorate([
    (0, common_1.Patch)(':id/resolve'),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'volunteer'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "resolve", null);
__decorate([
    (0, common_1.Patch)(':id/decline'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Decline an incoming request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request declined' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "decline", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an incoming request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncomingController.prototype, "remove", null);
exports.IncomingController = IncomingController = __decorate([
    (0, swagger_1.ApiTags)('Incoming Requests'),
    (0, swagger_1.ApiHeader)({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] }),
    (0, common_1.Controller)('incoming'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_1.IncomingService])
], IncomingController);
//# sourceMappingURL=controller.js.map