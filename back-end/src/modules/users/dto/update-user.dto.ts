import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'securityQuestion1',
    'securityAnswer1',
    'securityQuestion2',
    'securityAnswer2',
    'verificationToken',
    'verificationReference',
  ] as const),
) {}
