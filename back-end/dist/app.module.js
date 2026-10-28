"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const module_1 = require("./modules/fulfillment/module");
const store_1 = require("./modules/proofs/store");
const module_2 = require("./modules/proofs/module");
const common_1 = require("@nestjs/common");
const module_3 = require("./modules/users/module");
const module_4 = require("./modules/organizations/module");
const module_5 = require("./modules/volunteers/module");
const module_6 = require("./modules/programs/module");
const module_7 = require("./modules/requests/module");
const module_8 = require("./modules/incoming/module");
const module_9 = require("./modules/tasks/module");
const module_10 = require("./modules/hour-logs/module");
const module_11 = require("./modules/resource-donations/module");
const module_12 = require("./modules/program-assignments/module");
const module_13 = require("./modules/program-applications/module");
const module_14 = require("./modules/subtasks/module");
const module_15 = require("./modules/sellers/module");
const module_16 = require("./modules/products/module");
const module_17 = require("./modules/orders/module");
const module_18 = require("./modules/donations/module");
const module_19 = require("./modules/notifications/module");
const module_20 = require("./modules/replacements/module");
const module_21 = require("./modules/volunteer-requests/module");
const request_logger_middleware_1 = require("./common/middleware/request-logger.middleware");
const security_middleware_1 = require("./common/middleware/security.middleware");
const router_audit_middleware_1 = require("./common/middleware/router-audit.middleware");
const controller_1 = require("./modules/users/controller");
const controller_2 = require("./modules/programs/controller");
const controller_3 = require("./modules/resource-donations/controller");
const controller_4 = require("./modules/orders/controller");
const controller_5 = require("./modules/notifications/controller");
const controller_6 = require("./modules/products/controller");
const controller_7 = require("./modules/tasks/controller");
const controller_8 = require("./modules/program-assignments/controller");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(security_middleware_1.SecurityMiddleware, request_logger_middleware_1.RequestLoggerMiddleware).forRoutes('*');
        consumer.apply(router_audit_middleware_1.RouterAuditMiddleware).forRoutes(controller_1.UsersController, controller_2.ProgramsController, controller_3.ResourceDonationsController, controller_4.OrdersController, controller_5.NotificationsController, controller_6.ProductsController, controller_7.TasksController, controller_8.ProgramAssignmentsController);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            store_1.ProofStoreModule, module_1.FulfillmentModule, module_2.ProofsModule,
            module_3.UsersModule,
            module_4.OrganizationsModule,
            module_5.VolunteersModule,
            module_6.ProgramsModule,
            module_7.RequestsModule,
            module_8.IncomingModule,
            module_9.TasksModule,
            module_10.HourLogsModule,
            module_11.ResourceDonationsModule,
            module_12.ProgramAssignmentsModule,
            module_13.ProgramApplicationsModule,
            module_14.SubtasksModule,
            module_15.SellersModule,
            module_16.ProductsModule,
            module_17.OrdersModule,
            module_18.DonationsModule,
            module_19.NotificationsModule,
            module_20.ReplacementsModule,
            module_21.VolunteerRequestsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map