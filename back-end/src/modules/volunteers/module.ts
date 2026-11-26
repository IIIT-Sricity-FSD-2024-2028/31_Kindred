import { UsersModule } from '../users/module';
import { Module } from '@nestjs/common';
import { VolunteersController } from './controller';
import { VolunteersService } from './service';

@Module({
  imports: [UsersModule],
  controllers: [VolunteersController],
  providers: [VolunteersService],
  exports: [VolunteersService],
})
export class VolunteersModule {}
