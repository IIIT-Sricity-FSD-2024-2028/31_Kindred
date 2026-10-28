import { Module } from '@nestjs/common';
import { ProgramAssignmentsModule } from '../program-assignments/module';
import { SubtasksController } from './controller';
import { SubtasksService } from './service';

@Module({
  imports: [ProgramAssignmentsModule],
  controllers: [SubtasksController],
  providers: [SubtasksService],
  exports: [SubtasksService],
})
export class SubtasksModule {}
