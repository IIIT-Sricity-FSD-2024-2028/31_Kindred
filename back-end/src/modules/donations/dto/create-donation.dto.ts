import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDonationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @IsString() org!: string;
  @ApiProperty() @IsNumber() @Min(1) amount!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiProperty() @IsString() donor!: string;
  @ApiProperty() @IsEmail() email!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cardLast4?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cardType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() date?: string;
}
