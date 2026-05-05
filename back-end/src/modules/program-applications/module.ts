import { Module } from '@nestjs/common';
import { ProgramApplicationsController } from './controller';
import { ProgramApplicationsService } from './service';

@Module({
  controllers: [ProgramApplicationsController],
  providers: [ProgramApplicationsService],
  exports: [ProgramApplicationsService],
})
export class ProgramApplicationsModule {}
