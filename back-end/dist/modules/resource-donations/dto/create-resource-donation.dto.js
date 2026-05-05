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
exports.CreateResourceDonationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class DonationItemDto {
    name;
    quantity;
    condition;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item name', example: 'Rice Bags (25kg)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DonationItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity', example: 10 }),
    __metadata("design:type", Number)
], DonationItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Condition of items', example: 'New' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DonationItemDto.prototype, "condition", void 0);
class CreateResourceDonationDto {
    donorName;
    donorEmail;
    donorPhone;
    category;
    items;
    description;
    pickupAddress;
    pickupDate;
    pickupTimeSlot;
    programId;
    programName;
}
exports.CreateResourceDonationDto = CreateResourceDonationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Donor full name', example: 'Vikram Malhotra' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "donorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Donor email', example: 'vikram.malhotra@gmail.com' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "donorEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Donor phone', example: '9812345678' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "donorPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category of donation', example: 'Food & Essentials' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of donated items', type: [DonationItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DonationItemDto),
    __metadata("design:type", Array)
], CreateResourceDonationDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Brief description', example: 'Bulk food supplies for flood relief camps in Bihar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pickup address', example: '42, MG Road, Sector 18, Noida, UP' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "pickupAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pickup date (YYYY-MM-DD)', example: '2025-05-10' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "pickupDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preferred time slot', example: 'Morning (9AM-12PM)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "pickupTimeSlot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target program ID', example: 'prog_001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "programId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target program name', example: 'Cyclone Relief Fund' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDonationDto.prototype, "programName", void 0);
//# sourceMappingURL=create-resource-donation.dto.js.map