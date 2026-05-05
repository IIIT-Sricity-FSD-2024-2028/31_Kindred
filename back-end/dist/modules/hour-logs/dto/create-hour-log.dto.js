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
exports.CreateHourLogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateHourLogDto {
    volunteerEmail;
    volunteerName;
    hours;
    date;
    description;
    programId;
    programName;
}
exports.CreateHourLogDto = CreateHourLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email of the volunteer', example: 'neha.kapoor@gmail.com' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHourLogDto.prototype, "volunteerEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Name of the volunteer', example: 'Neha Kapoor' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHourLogDto.prototype, "volunteerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of hours worked', example: 6 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHourLogDto.prototype, "hours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of the work (YYYY-MM-DD)', example: '2025-05-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHourLogDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description of work performed', example: 'Conducted health checkup camp for 120 beneficiaries in Zone C' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHourLogDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated program ID', example: 'prog_002' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHourLogDto.prototype, "programId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated program name', example: 'Rural Literacy Drive 2025' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHourLogDto.prototype, "programName", void 0);
//# sourceMappingURL=create-hour-log.dto.js.map