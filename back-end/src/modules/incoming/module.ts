import { Module } from '@nestjs/common';
import { IncomingController } from './controller';
import { IncomingService } from './service';

@Module({
  controllers: [IncomingController],
  providers: [IncomingService],
  exports: [IncomingService],
})
export class IncomingModule {}
