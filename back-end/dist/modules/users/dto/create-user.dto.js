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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
    name;
    email;
    password;
    role;
    org;
    phone;
    bio;
    skills;
    dateOfBirth;
    location;
    presentAddress;
    permanentAddress;
    availabilityDays;
    verificationToken;
    verificationReference;
    businessName;
    businessDescription;
    securityQuestion1;
    securityAnswer1;
    securityQuestion2;
    securityAnswer2;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name of the user', example: 'Aarav Mehta' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valid email address',
        example: 'aarav.mehta@gmail.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account password (min 6 chars)',
        example: 'Secure@456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User role on the platform',
        example: 'volunteer',
        enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary', 'seller'],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['superuser', 'admin', 'volunteer', 'donor', 'beneficiary', 'seller']),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Organization name (required for admin role)',
        example: 'GreenFuture Foundation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "org", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone number with country code',
        example: '+91 98765 43210',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Short bio or introduction',
        example: 'Passionate about rural education and healthcare access',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of skills',
        example: ['Teaching', 'First Aid', 'Logistics'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of birth in ISO date format',
        example: '2000-05-20',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pune, Maharashtra' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateUserDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12 Park Road, Pune' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], CreateUserDto.prototype, "presentAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '42 Lake Road, Nashik' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], CreateUserDto.prototype, "permanentAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Monday', 'Wednesday', 'Saturday'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsIn)([
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ], { each: true }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "availabilityDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Short-lived token returned by the verification endpoint',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "verificationToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reference used for donor verification; checked against the challenge and never stored on the user record',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "verificationReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Seller business or shop name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Seller business description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "businessDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'first_school' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "securityQuestion1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'My first school' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "securityAnswer1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'childhood_friend' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "securityQuestion2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Alex' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "securityAnswer2", void 0);
//# sourceMappingURL=create-user.dto.js.map