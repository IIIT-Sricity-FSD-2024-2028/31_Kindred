import { SubtasksModule } from '../subtasks/module';
import { Module } from '@nestjs/common';
import { ProgramAssignmentsModule } from '../program-assignments/module';
import { ProgramsModule } from '../programs/module';
import { TasksController } from './controller';
import { TasksService } from './service';
import { NotificationsModule } from '../notifications/module';
import { UsersModule } from '../users/module';

@Module({
  imports: [ProgramAssignmentsModule, ProgramsModule, SubtasksModule, NotificationsModule, UsersModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
