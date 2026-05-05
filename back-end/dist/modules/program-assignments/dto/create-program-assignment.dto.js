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
exports.CreateProgramAssignmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProgramAssignmentDto {
    programId;
    programName;
    volunteerEmail;
    volunteerName;
    role;
}
exports.CreateProgramAssignmentDto = CreateProgramAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Program ID', example: 'prog_001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramAssignmentDto.prototype, "programId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Program name', example: 'Cyclone Relief Fund' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramAssignmentDto.prototype, "programName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Volunteer email', example: 'neha.kapoor@gmail.com' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramAssignmentDto.prototype, "volunteerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Volunteer name', example: 'Neha Kapoor' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramAssignmentDto.prototype, "volunteerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Role in the program', example: 'Field Coordinator' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramAssignmentDto.prototype, "role", void 0);
//# sourceMappingURL=create-program-assignment.dto.js.map