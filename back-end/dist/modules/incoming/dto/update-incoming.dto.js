"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIncomingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_incoming_dto_1 = require("./create-incoming.dto");
class UpdateIncomingDto extends (0, swagger_1.PartialType)(create_incoming_dto_1.CreateIncomingDto) {
}
exports.UpdateIncomingDto = UpdateIncomingDto;
//# sourceMappingURL=update-incoming.dto.js.map