"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramAssignmentsModule = void 0;
const common_1 = require("@nestjs/common");
const controller_1 = require("./controller");
const service_1 = require("./service");
let ProgramAssignmentsModule = class ProgramAssignmentsModule {
};
exports.ProgramAssignmentsModule = ProgramAssignmentsModule;
exports.ProgramAssignmentsModule = ProgramAssignmentsModule = __decorate([
    (0, common_1.Module)({
        controllers: [controller_1.ProgramAssignmentsController],
        providers: [service_1.ProgramAssignmentsService],
        exports: [service_1.ProgramAssignmentsService],
    })
], ProgramAssignmentsModule);
//# sourceMappingURL=module.js.map