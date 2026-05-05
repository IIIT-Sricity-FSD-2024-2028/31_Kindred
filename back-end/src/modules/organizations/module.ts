import { Module } from '@nestjs/common';
import { OrganizationsController } from './controller';
import { OrganizationsService } from './service';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
