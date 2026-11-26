import { UsersModule } from '../users/module';
import { VolunteersModule } from '../volunteers/module';
import { NotificationsModule } from '../notifications/module';
import { Module } from '@nestjs/common';
import { ProgramsModule } from '../programs/module';
import { ProgramAssignmentsController } from './controller';
import { ProgramAssignmentsService } from './service';

@Module({
  imports: [UsersModule, ProgramsModule, VolunteersModule, NotificationsModule],
  controllers: [ProgramAssignmentsController],
  providers: [ProgramAssignmentsService],
  exports: [ProgramAssignmentsService],
})
export class ProgramAssignmentsModule {}
