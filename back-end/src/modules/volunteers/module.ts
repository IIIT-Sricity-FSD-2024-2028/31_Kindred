import { Module } from '@nestjs/common';
import { VolunteersController } from './controller';
import { VolunteersService } from './service';

@Module({
  controllers: [VolunteersController],
  providers: [VolunteersService],
  exports: [VolunteersService],
})
export class VolunteersModule {}
