import { Module } from '@nestjs/common';
import { ResourceDonationsController } from './controller';
import { ResourceDonationsService } from './service';
import { OrganizationsModule } from '../organizations/module';
import { ProgramsModule } from '../programs/module';
import { NotificationsModule } from '../notifications/module';

@Module({
  imports: [OrganizationsModule,ProgramsModule,NotificationsModule],
  controllers: [ResourceDonationsController],
  providers: [ResourceDonationsService],
  exports: [ResourceDonationsService],
})
export class ResourceDonationsModule {}
