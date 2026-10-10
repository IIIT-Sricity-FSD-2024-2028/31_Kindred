import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsIn, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) price?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) quantity?: number;

  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true })
  photos?: string[];

  @ApiPropertyOptional({ enum: ['pending_approval', 'approved', 'rejected'] })
  @IsOptional()
  @IsString()
  @IsIn(['pending_approval', 'approved', 'rejected'])
  status?: string;
}
