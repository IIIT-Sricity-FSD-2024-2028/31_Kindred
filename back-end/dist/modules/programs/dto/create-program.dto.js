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
exports.CreateProgramDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProgramDto {
    name;
    org;
    focus;
    startDate;
    endDate;
    budget;
    description;
    requiredSkills;
    volunteerGoal;
    openForApplications;
    location;
}
exports.CreateProgramDto = CreateProgramDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Program name', example: 'Rural Literacy Drive 2025' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organizing NGO', example: 'GreenFuture Foundation' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "org", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Focus area', example: 'Education' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "focus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date (YYYY-MM-DD)', example: '2025-02-01' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date (YYYY-MM-DD)', example: '2025-08-31' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total budget in INR', example: 850000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProgramDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed description of the program', example: 'Providing free education materials and tutoring to 500 children in remote villages of Jharkhand' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skills needed from volunteers', example: ['Teaching', 'Hindi Translation', 'Logistics'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateProgramDto.prototype, "requiredSkills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target number of volunteers', example: 80 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProgramDto.prototype, "volunteerGoal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether volunteers can apply', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProgramDto.prototype, "openForApplications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Geographic location', example: 'Ranchi, Jharkhand' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "location", void 0);
//# sourceMappingURL=create-program.dto.js.map