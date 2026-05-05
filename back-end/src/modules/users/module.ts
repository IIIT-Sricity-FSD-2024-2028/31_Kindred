import { Module } from '@nestjs/common';
import { UsersController } from './controller';
import { UsersService } from './service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
