import { PartialType } from '@nestjs/swagger';
import { CreateProgramApplicationDto } from './create-program-application.dto';

export class UpdateProgramApplicationDto extends PartialType(CreateProgramApplicationDto) {}
