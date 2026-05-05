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
exports.CreateProgramApplicationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProgramApplicationDto {
    programId;
    programName;
    volunteerEmail;
    volunteerName;
    message;
}
exports.CreateProgramApplicationDto = CreateProgramApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Program ID to apply for', example: 'prog_002' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramApplicationDto.prototype, "programId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Program name', example: 'Rural Literacy Drive 2025' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramApplicationDto.prototype, "programName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant volunteer email', example: 'neha.kapoor@gmail.com' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramApplicationDto.prototype, "volunteerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant volunteer name', example: 'Neha Kapoor' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramApplicationDto.prototype, "volunteerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cover message from volunteer', example: 'I have 3 years of teaching experience in rural schools and would love to contribute to this program.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramApplicationDto.prototype, "message", void 0);
//# sourceMappingURL=create-program-application.dto.js.map