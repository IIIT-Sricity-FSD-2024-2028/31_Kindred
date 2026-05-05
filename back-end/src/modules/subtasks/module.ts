import { Module } from '@nestjs/common';
import { SubtasksController } from './controller';
import { SubtasksService } from './service';

@Module({
  controllers: [SubtasksController],
  providers: [SubtasksService],
  exports: [SubtasksService],
})
export class SubtasksModule {}
