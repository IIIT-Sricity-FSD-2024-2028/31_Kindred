import { Module } from '@nestjs/common';
import { VolunteerRequestsController } from './controller';
import { VolunteerRequestsService } from './service';

@Module({
  controllers: [VolunteerRequestsController],
  providers: [VolunteerRequestsService],
  exports: [VolunteerRequestsService],
})
export class VolunteerRequestsModule {}
