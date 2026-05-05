import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'approved', enum: ['pending', 'approved', 'rejected'] })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: string;
}
