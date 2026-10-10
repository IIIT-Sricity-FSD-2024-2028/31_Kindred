import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateReplacementDto {
  @ApiProperty({ description: 'Original order ID' })
  @IsString()
  orderId!: string;

  @ApiProperty({ description: 'Reason for replacement', example: 'Defective item' })
  @IsString()
  reason!: string;

  @ApiProperty({ description: 'Detailed description of the issue' })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ description: 'Image URL showing the issue' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Buyer email' })
  @IsString()
  buyerEmail!: string;

  @ApiProperty({ description: 'Buyer name' })
  @IsString()
  buyerName!: string;
}
