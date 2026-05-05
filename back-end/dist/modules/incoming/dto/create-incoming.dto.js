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
exports.CreateIncomingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateIncomingDto {
    name;
    type;
    desc;
    urgency;
    location;
}
exports.CreateIncomingDto = CreateIncomingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the person submitting', example: 'Sunita Devi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncomingDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of request (e.g. Medical Assistance, Emergency: Flood, Contact: General Enquiry)', example: 'Emergency: Flood Rescue' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncomingDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed description of the request', example: 'Family of 5 stranded due to rising water levels in Patna east district. Need immediate rescue and temporary shelter.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncomingDto.prototype, "desc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Urgency level (low, medium, high)', example: 'high' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncomingDto.prototype, "urgency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Location or address', example: 'Kankarbagh, Patna, Bihar' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncomingDto.prototype, "location", void 0);
//# sourceMappingURL=create-incoming.dto.js.map