import { UsersModule } from '../users/module';
import { VolunteersModule } from '../volunteers/module';
import { Module } from '@nestjs/common';
import { ProgramAssignmentsModule } from '../program-assignments/module';
import { ProgramsModule } from '../programs/module';
import { NotificationsModule } from '../notifications/module';
import { ProgramApplicationsController } from './controller';
import { ProgramApplicationsService } from './service';

@Module({
  imports: [UsersModule, VolunteersModule, ProgramAssignmentsModule, ProgramsModule, NotificationsModule],
  controllers: [ProgramApplicationsController],
  providers: [ProgramApplicationsService],
  exports: [ProgramApplicationsService],
})
export class ProgramApplicationsModule {}
