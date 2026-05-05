"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrganizationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_organization_dto_1 = require("./create-organization.dto");
class UpdateOrganizationDto extends (0, swagger_1.PartialType)(create_organization_dto_1.CreateOrganizationDto) {
}
exports.UpdateOrganizationDto = UpdateOrganizationDto;
//# sourceMappingURL=update-organization.dto.js.map