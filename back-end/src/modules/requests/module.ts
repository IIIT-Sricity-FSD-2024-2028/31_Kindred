import { Module } from '@nestjs/common';
import { RequestsController } from './controller';
import { RequestsService } from './service';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
