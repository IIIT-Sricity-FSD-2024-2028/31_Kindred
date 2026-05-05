import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
export declare class ProgramsService {
    private programs;
    private counter;
    private generateId;
    findAll(): Program[];
    findById(id: string): Program;
    findByOrg(org: string): Program[];
    create(dto: CreateProgramDto): Program;
    update(id: string, dto: UpdateProgramDto): Program;
    delete(id: string): boolean;
}
