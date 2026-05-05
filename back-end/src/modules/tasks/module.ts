import { Module } from '@nestjs/common';
import { TasksController } from './controller';
import { TasksService } from './service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
