import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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

  @ApiProperty({ description: 'Uploaded photo URL showing the issue' })
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Buyer email' })
  @IsString()
  buyerEmail!: string;

  @ApiProperty({ description: 'Buyer name' })
  @IsString()
  buyerName!: string;
}
