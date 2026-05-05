import { Module } from '@nestjs/common';
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
  ],
})
export class AppModule {}
