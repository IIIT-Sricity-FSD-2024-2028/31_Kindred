import { UsersModule } from '../users/module';
import { ProductsModule } from '../products/module';
import { VolunteersModule } from '../volunteers/module';
import { NotificationsModule } from '../notifications/module';
import { Module } from '@nestjs/common';
import { ReplacementsController } from './controller';
import { ReplacementsService } from './service';
import { OrdersModule } from '../orders/module';
import { SellersModule } from '../sellers/module';

@Module({
  imports: [UsersModule,OrdersModule, SellersModule, ProductsModule, VolunteersModule, NotificationsModule],
  controllers: [ReplacementsController],
  providers: [ReplacementsService],
  exports: [ReplacementsService],
})
export class ReplacementsModule {}
