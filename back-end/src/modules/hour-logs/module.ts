import { Module } from '@nestjs/common';
import { HourLogsController } from './controller';
import { HourLogsService } from './service';

@Module({
  controllers: [HourLogsController],
  providers: [HourLogsService],
  exports: [HourLogsService],
})
export class HourLogsModule {}
