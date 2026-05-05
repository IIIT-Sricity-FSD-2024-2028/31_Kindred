import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsArray, IsIn } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'Aarav Mehta' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Valid email address', example: 'aarav.mehta@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Account password (min 6 chars)', example: 'Secure@456' })
  @IsString()
  password!: string;

  @ApiProperty({ description: 'User role on the platform', example: 'volunteer', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
  @IsString()
  @IsIn(['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'])
  role!: string;

  @ApiPropertyOptional({ description: 'Organization name (required for admin role)', example: 'GreenFuture Foundation' })
  @IsOptional()
  @IsString()
  org?: string;

  @ApiPropertyOptional({ description: 'Phone number with country code', example: '+91 98765 43210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Short bio or introduction', example: 'Passionate about rural education and healthcare access' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'List of skills', example: ['Teaching', 'First Aid', 'Logistics'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
