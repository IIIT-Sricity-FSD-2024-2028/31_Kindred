import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty() @IsString() productId!: string;
  @ApiProperty({ example: 2 }) @IsInt() @Min(1) quantity!: number;
  @ApiProperty() @IsString() buyerName!: string;
  @ApiProperty() @IsEmail() buyerEmail!: string;
  @ApiProperty() @IsString() buyerPhone!: string;
  @ApiProperty() @IsString() address!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cardLast4?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cardType?: string;
}
