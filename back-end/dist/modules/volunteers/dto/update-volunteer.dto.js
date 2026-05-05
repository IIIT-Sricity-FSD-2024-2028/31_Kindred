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
exports.UpdateVolunteerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_volunteer_dto_1 = require("./create-volunteer.dto");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateVolunteerDto extends (0, swagger_1.PartialType)(create_volunteer_dto_1.CreateVolunteerDto) {
    status;
    hours;
}
exports.UpdateVolunteerDto = UpdateVolunteerDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVolunteerDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 120 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateVolunteerDto.prototype, "hours", void 0);
//# sourceMappingURL=update-volunteer.dto.js.map