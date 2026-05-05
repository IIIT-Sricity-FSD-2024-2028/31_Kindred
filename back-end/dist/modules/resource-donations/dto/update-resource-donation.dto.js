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
exports.UpdateResourceDonationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_resource_donation_dto_1 = require("./create-resource-donation.dto");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateResourceDonationDto extends (0, swagger_1.PartialType)(create_resource_donation_dto_1.CreateResourceDonationDto) {
    status;
    assignedVolunteerEmail;
    assignedVolunteerName;
    notes;
}
exports.UpdateResourceDonationDto = UpdateResourceDonationDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'pending_pickup' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateResourceDonationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'volunteer@kindred.org' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateResourceDonationDto.prototype, "assignedVolunteerEmail", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'Priya Singh' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateResourceDonationDto.prototype, "assignedVolunteerName", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'Notes about delivery' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateResourceDonationDto.prototype, "notes", void 0);
//# sourceMappingURL=update-resource-donation.dto.js.map