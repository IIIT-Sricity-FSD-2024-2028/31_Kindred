import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsIn,
  IsDateString,
  ArrayUnique,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'Aarav Mehta' })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Valid email address',
    example: 'aarav.mehta@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Account password (min 6 chars)',
    example: 'Secure@456',
  })
  @IsString()
  password!: string;

  @ApiProperty({
    description: 'User role on the platform',
    example: 'volunteer',
    enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary', 'seller'],
  })
  @IsString()
  @IsIn(['superuser', 'admin', 'volunteer', 'donor', 'beneficiary', 'seller'])
  role!: string;

  @ApiPropertyOptional({
    description: 'Organization name (required for admin role)',
    example: 'GreenFuture Foundation',
  })
  @IsOptional()
  @IsString()
  org?: string;

  @ApiPropertyOptional({
    description: 'Phone number with country code',
    example: '+91 98765 43210',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Short bio or introduction',
    example: 'Passionate about rural education and healthcare access',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'List of skills',
    example: ['Teaching', 'First Aid', 'Logistics'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({
    description: 'Date of birth in ISO date format',
    example: '2000-05-20',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Pune, Maharashtra' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  location?: string;

  @ApiPropertyOptional({ example: '12 Park Road, Pune' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  presentAddress?: string;

  @ApiPropertyOptional({ example: '42 Lake Road, Nashik' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  permanentAddress?: string;

  @ApiPropertyOptional({ example: ['Monday', 'Wednesday', 'Saturday'] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(
    [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    { each: true },
  )
  availabilityDays?: string[];

  @ApiPropertyOptional({
    description: 'Short-lived token returned by the verification endpoint',
  })
  @IsOptional()
  @IsString()
  verificationToken?: string;

  @ApiPropertyOptional({
    description:
      'Reference used for donor verification; checked against the challenge and never stored on the user record',
  })
  @IsOptional()
  @IsString()
  verificationReference?: string;

  @ApiPropertyOptional({ description: 'Seller business or shop name' })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({ description: 'Seller business description' })
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiPropertyOptional({ example: 'first_school' })
  @IsOptional()
  @IsString()
  securityQuestion1?: string;

  @ApiPropertyOptional({ example: 'My first school' })
  @IsOptional()
  @IsString()
  securityAnswer1?: string;

  @ApiPropertyOptional({ example: 'childhood_friend' })
  @IsOptional()
  @IsString()
  securityQuestion2?: string;

  @ApiPropertyOptional({ example: 'Alex' })
  @IsOptional()
  @IsString()
  securityAnswer2?: string;
}
