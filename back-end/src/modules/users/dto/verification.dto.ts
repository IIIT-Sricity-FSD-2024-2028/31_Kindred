import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class StartVerificationDto {
  @ApiProperty({ enum: ['volunteer', 'donor', 'beneficiary', 'seller'] })
  @IsIn(['volunteer', 'donor', 'beneficiary', 'seller'])
  role!: string;

  @ApiProperty({
    enum: [
      'aadhaar_otp_simulation',
      'upi_simulation',
      'card_simulation',
      'phone_otp_simulation',
    ],
  })
  @IsIn([
    'aadhaar_otp_simulation',
    'upi_simulation',
    'card_simulation',
    'phone_otp_simulation',
  ])
  method!: string;

  @ApiProperty({
    description:
      'Phone number for OTP simulations, UPI ID, or card last four digits',
  })
  @IsString()
  reference!: string;

  @ApiPropertyOptional({
    description: 'Email used to bind the challenge to a registration',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Required consent for Aadhaar-linked OTP simulation' })
  @IsOptional()
  @IsBoolean()
  consent?: boolean;
}

export class CompleteVerificationDto {
  @ApiProperty()
  @IsString()
  challengeId!: string;

  @ApiProperty({ example: '123456' })
  @Matches(/^\d{6}$/, { message: 'Verification code must contain 6 digits.' })
  code!: string;
}
