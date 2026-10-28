import { Module } from '@nestjs/common';
import { OrganizationsModule } from '../organizations/module';
import { ProgramsModule } from '../programs/module';
import { DonationsController } from './controller';
import { DonationsService } from './service';

@Module({ imports: [OrganizationsModule, ProgramsModule], controllers: [DonationsController], providers: [DonationsService], exports: [DonationsService] })
export class DonationsModule {}
