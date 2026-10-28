import { Module } from '@nestjs/common';
import { ReplacementsController } from './controller';
import { ReplacementsService } from './service';
import { OrdersModule } from '../orders/module';
import { SellersModule } from '../sellers/module';

@Module({
  imports: [OrdersModule, SellersModule],
  controllers: [ReplacementsController],
  providers: [ReplacementsService],
  exports: [ReplacementsService],
})
export class ReplacementsModule {}
