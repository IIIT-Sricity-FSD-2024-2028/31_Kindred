import { Module } from '@nestjs/common';
import { ProgramsModule } from '../programs/module';
import { ProgramAssignmentsController } from './controller';
import { ProgramAssignmentsService } from './service';

@Module({
  imports: [ProgramsModule],
  controllers: [ProgramAssignmentsController],
  providers: [ProgramAssignmentsService],
  exports: [ProgramAssignmentsService],
})
export class ProgramAssignmentsModule {}
