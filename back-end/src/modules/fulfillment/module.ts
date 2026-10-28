import { Global, Module } from '@nestjs/common';
import { ResourceDonationsModule } from '../resource-donations/module';
import { OrdersModule } from '../orders/module';
import { ProgramsModule } from '../programs/module';
import { OrganizationsModule } from '../organizations/module';
import { VolunteersModule } from '../volunteers/module';
import { SellersModule } from '../sellers/module';
import { NotificationsModule } from '../notifications/module';
import { FulfillmentService } from './service';
import { FulfillmentController } from './controller';
@Global()
@Module({imports:[ResourceDonationsModule,OrdersModule,ProgramsModule,OrganizationsModule,VolunteersModule,SellersModule,NotificationsModule],providers:[FulfillmentService],controllers:[FulfillmentController],exports:[FulfillmentService]})
export class FulfillmentModule {}
