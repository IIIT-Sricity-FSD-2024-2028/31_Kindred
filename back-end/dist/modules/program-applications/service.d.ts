import { ProgramApplication } from './entities/program-application.entity';
import { CreateProgramApplicationDto } from './dto/create-program-application.dto';
export declare class ProgramApplicationsService {
    private applications;
    private counter;
    private generateId;
    findAll(): ProgramApplication[];
    findById(id: string): ProgramApplication;
    findByProgram(programId: string): ProgramApplication[];
    findByVolunteer(email: string): ProgramApplication[];
    getPending(): ProgramApplication[];
    hasApplied(programId: string, email: string): boolean;
    create(dto: CreateProgramApplicationDto): ProgramApplication;
    approve(id: string): ProgramApplication;
    reject(id: string): ProgramApplication;
    delete(id: string): boolean;
}
