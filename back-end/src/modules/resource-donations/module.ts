import { Module } from '@nestjs/common';
import { ResourceDonationsController } from './controller';
import { ResourceDonationsService } from './service';

@Module({
  controllers: [ResourceDonationsController],
  providers: [ResourceDonationsService],
  exports: [ResourceDonationsService],
})
export class ResourceDonationsModule {}
