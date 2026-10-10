import { Module } from '@nestjs/common';
import { ReplacementsController } from './controller';
import { ReplacementsService } from './service';
import { OrdersModule } from '../orders/module';

@Module({
  imports: [OrdersModule],
  controllers: [ReplacementsController],
  providers: [ReplacementsService],
  exports: [ReplacementsService],
})
export class ReplacementsModule {}
