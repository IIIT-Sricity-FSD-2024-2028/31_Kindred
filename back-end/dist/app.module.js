"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const module_1 = require("./modules/users/module");
const module_2 = require("./modules/organizations/module");
const module_3 = require("./modules/volunteers/module");
const module_4 = require("./modules/programs/module");
const module_5 = require("./modules/requests/module");
const module_6 = require("./modules/incoming/module");
const module_7 = require("./modules/tasks/module");
const module_8 = require("./modules/hour-logs/module");
const module_9 = require("./modules/resource-donations/module");
const module_10 = require("./modules/program-assignments/module");
const module_11 = require("./modules/program-applications/module");
const module_12 = require("./modules/subtasks/module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            module_1.UsersModule,
            module_2.OrganizationsModule,
            module_3.VolunteersModule,
            module_4.ProgramsModule,
            module_5.RequestsModule,
            module_6.IncomingModule,
            module_7.TasksModule,
            module_8.HourLogsModule,
            module_9.ResourceDonationsModule,
            module_10.ProgramAssignmentsModule,
            module_11.ProgramApplicationsModule,
            module_12.SubtasksModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map