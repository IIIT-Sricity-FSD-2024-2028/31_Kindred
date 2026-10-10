import { Module } from '@nestjs/common';
import { ProductsController } from './controller';
import { ProductsService } from './service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
