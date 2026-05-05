import { PartialType } from '@nestjs/swagger';
import { CreateProgramDto } from './create-program.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProgramDto extends PartialType(CreateProgramDto) {
  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 850000 })
  @IsOptional()
  @IsNumber()
  raised?: number;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsNumber()
  beneficiaries?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  volunteers?: number;
}
