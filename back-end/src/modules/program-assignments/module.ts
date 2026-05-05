import { Module } from '@nestjs/common';
import { ProgramAssignmentsController } from './controller';
import { ProgramAssignmentsService } from './service';

@Module({
  controllers: [ProgramAssignmentsController],
  providers: [ProgramAssignmentsService],
  exports: [ProgramAssignmentsService],
})
export class ProgramAssignmentsModule {}
