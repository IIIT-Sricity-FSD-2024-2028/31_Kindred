import { Module } from '@nestjs/common';
import { OrganizationsModule } from '../organizations/module';
import { ProgramsController } from './controller';
import { ProgramsService } from './service';

@Module({
  imports: [OrganizationsModule],
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}
