import { PartialType } from '@nestjs/swagger';
import { CreateIncomingDto } from './create-incoming.dto';

export class UpdateIncomingDto extends PartialType(CreateIncomingDto) {}
