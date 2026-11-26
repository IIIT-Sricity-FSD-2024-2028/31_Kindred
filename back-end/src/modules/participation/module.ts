import { Module } from '@nestjs/common';
import { ProgramAssignmentsModule } from '../program-assignments/module';
import { ProgramsModule } from '../programs/module';
import { TasksModule } from '../tasks/module';
import { SubtasksModule } from '../subtasks/module';
import { HourLogsModule } from '../hour-logs/module';
import { OrganizationsModule } from '../organizations/module';
import { VolunteersModule } from '../volunteers/module';
import { NotificationsModule } from '../notifications/module';
import { ParticipationController } from './controller';
import { ParticipationService } from './service';
import { UsersModule } from '../users/module';
@Module({imports:[UsersModule,ProgramAssignmentsModule,ProgramsModule,TasksModule,SubtasksModule,HourLogsModule,OrganizationsModule,VolunteersModule,NotificationsModule],controllers:[ParticipationController],providers:[ParticipationService]})
export class ParticipationModule {}
