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
exports.CreateVolunteerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateVolunteerDto {
    name;
    email;
    phone;
    role;
    org;
    skills;
}
exports.CreateVolunteerDto = CreateVolunteerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name of the volunteer', example: 'Neha Kapoor' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVolunteerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', example: 'neha.kapoor@gmail.com' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVolunteerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', example: '+91 87654 32109' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVolunteerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role within the organization', example: 'Field Coordinator' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVolunteerDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assigned organization', example: 'HopeConnect' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVolunteerDto.prototype, "org", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'List of skills', example: ['Medical Aid', 'Community Outreach', 'Data Entry'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateVolunteerDto.prototype, "skills", void 0);
//# sourceMappingURL=create-volunteer.dto.js.map