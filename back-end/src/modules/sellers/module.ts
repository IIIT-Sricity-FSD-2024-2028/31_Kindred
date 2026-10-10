import { Module } from '@nestjs/common';
import { SellersController } from './controller';
import { SellersService } from './service';

@Module({
  controllers: [SellersController],
  providers: [SellersService],
  exports: [SellersService],
})
export class SellersModule {}
