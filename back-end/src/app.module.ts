import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/module';
import { OrganizationsModule } from './modules/organizations/module';
import { VolunteersModule } from './modules/volunteers/module';
import { ProgramsModule } from './modules/programs/module';
import { RequestsModule } from './modules/requests/module';
import { IncomingModule } from './modules/incoming/module';
import { TasksModule } from './modules/tasks/module';
import { HourLogsModule } from './modules/hour-logs/module';
import { ResourceDonationsModule } from './modules/resource-donations/module';
import { ProgramAssignmentsModule } from './modules/program-assignments/module';
import { ProgramApplicationsModule } from './modules/program-applications/module';
import { SubtasksModule } from './modules/subtasks/module';
import { SellersModule } from './modules/sellers/module';
import { ProductsModule } from './modules/products/module';
import { OrdersModule } from './modules/orders/module';
import { DonationsModule } from './modules/donations/module';
import { NotificationsModule } from './modules/notifications/module';
import { ReplacementsModule } from './modules/replacements/module';
import { VolunteerRequestsModule } from './modules/volunteer-requests/module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { RouterAuditMiddleware } from './common/middleware/router-audit.middleware';
import { UsersController } from './modules/users/controller';
import { ProgramsController } from './modules/programs/controller';
import { ResourceDonationsController } from './modules/resource-donations/controller';
import { OrdersController } from './modules/orders/controller';
import { NotificationsController } from './modules/notifications/controller';
import { ProductsController } from './modules/products/controller';
import { TasksController } from './modules/tasks/controller';
import { ProgramAssignmentsController } from './modules/program-assignments/controller';

@Module({
  imports: [
    UsersModule,
    OrganizationsModule,
    VolunteersModule,
    ProgramsModule,
    RequestsModule,
    IncomingModule,
    TasksModule,
    HourLogsModule,
    ResourceDonationsModule,
    ProgramAssignmentsModule,
    ProgramApplicationsModule,
    SubtasksModule,
    SellersModule,
    ProductsModule,
    OrdersModule,
    DonationsModule,
    NotificationsModule,
    ReplacementsModule,
    VolunteerRequestsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware, RequestLoggerMiddleware).forRoutes('*');
    // Router-level middleware: runs only for core workflow controllers.
    consumer.apply(RouterAuditMiddleware).forRoutes(
      UsersController,
      ProgramsController,
      ResourceDonationsController,
      OrdersController,
      NotificationsController,
      ProductsController,
      TasksController,
      ProgramAssignmentsController,
    );
  }
}

