import { PartialType } from '@nestjs/swagger';
import { CreateProgramAssignmentDto } from './create-program-assignment.dto';

export class UpdateProgramAssignmentDto extends PartialType(CreateProgramAssignmentDto) {}
