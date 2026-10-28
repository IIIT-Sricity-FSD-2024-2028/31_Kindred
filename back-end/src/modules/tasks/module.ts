import { Module } from '@nestjs/common';
import { ProgramAssignmentsModule } from '../program-assignments/module';
import { ProgramsModule } from '../programs/module';
import { TasksController } from './controller';
import { TasksService } from './service';

@Module({
  imports: [ProgramAssignmentsModule, ProgramsModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
