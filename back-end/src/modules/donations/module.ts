import { Module } from '@nestjs/common';
import { DonationsController } from './controller';
import { DonationsService } from './service';

@Module({ controllers: [DonationsController], providers: [DonationsService], exports: [DonationsService] })
export class DonationsModule {}
