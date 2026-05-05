import { Module } from '@nestjs/common';
import { ProgramsController } from './controller';
import { ProgramsService } from './service';

@Module({
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}
