import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn, IsNumber, IsObject, Min } from 'class-validator';

export class UpdateSellerDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessDescription?: string;

  @ApiPropertyOptional() @IsOptional() @IsObject() bankDetails?: { account: string; ifsc: string; bankName: string };
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) salesBalance?: number;

  @ApiPropertyOptional({ enum: ['pending', 'approved', 'rejected'] })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: string;
}
