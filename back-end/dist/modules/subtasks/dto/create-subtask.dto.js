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
exports.CreateSubtaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSubtaskDto {
    programId;
    title;
    description;
    assignedToEmail;
    assignedToName;
}
exports.CreateSubtaskDto = CreateSubtaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Parent program ID', example: 'prog_001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubtaskDto.prototype, "programId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subtask title', example: 'Set up emergency medical camp' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubtaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detailed description', example: 'Coordinate with local hospitals to set up a 3-day medical camp for 200 beneficiaries' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubtaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email of assigned volunteer', example: 'neha.kapoor@gmail.com' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubtaskDto.prototype, "assignedToEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Name of assigned volunteer', example: 'Neha Kapoor' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubtaskDto.prototype, "assignedToName", void 0);
//# sourceMappingURL=create-subtask.dto.js.map