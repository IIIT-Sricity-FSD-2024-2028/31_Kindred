import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/module';
import { SellersModule } from '../sellers/module';
import { ResourceDonationsModule } from '../resource-donations/module';
import { OrdersController } from './controller';
import { OrdersService } from './service';

@Module({
  imports: [ProductsModule, SellersModule, ResourceDonationsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
