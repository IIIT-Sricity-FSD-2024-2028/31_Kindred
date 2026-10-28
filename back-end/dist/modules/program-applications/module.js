"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramApplicationsModule = void 0;
const common_1 = require("@nestjs/common");
const module_1 = require("../program-assignments/module");
const module_2 = require("../programs/module");
const module_3 = require("../notifications/module");
const controller_1 = require("./controller");
const service_1 = require("./service");
let ProgramApplicationsModule = class ProgramApplicationsModule {
};
exports.ProgramApplicationsModule = ProgramApplicationsModule;
exports.ProgramApplicationsModule = ProgramApplicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [module_1.ProgramAssignmentsModule, module_2.ProgramsModule, module_3.NotificationsModule],
        controllers: [controller_1.ProgramApplicationsController],
        providers: [service_1.ProgramApplicationsService],
        exports: [service_1.ProgramApplicationsService],
    })
], ProgramApplicationsModule);
//# sourceMappingURL=module.js.map