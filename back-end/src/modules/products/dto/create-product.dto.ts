import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';

export class CreateProductDto {
  @ApiPropertyOptional({ description: 'Client-provided ID for synchronized dashboard records' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'ID of the seller', example: 'seller_001' })
  @IsString()
  sellerId!: string;

  @ApiPropertyOptional({ description: 'Seller display name', example: 'Ravi Kumar' })
  @IsOptional()
  @IsString()
  sellerName?: string;

  @ApiProperty({ description: 'Product title', example: 'Handmade Pottery Vase' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Product description', example: 'Beautiful handcrafted clay vase with traditional Indian motifs' })
  @IsString()
  description!: string;

  @ApiProperty({ description: 'Price in INR', example: 1500 })
  @IsNumber()
  @Min(1)
  price!: number;

  @ApiProperty({ description: 'Available quantity', example: 10 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ description: 'Product category', example: 'Handicrafts' })
  @IsString()
  category!: string;

  @ApiPropertyOptional({ description: 'Array of photo URLs or base64 strings', example: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}
