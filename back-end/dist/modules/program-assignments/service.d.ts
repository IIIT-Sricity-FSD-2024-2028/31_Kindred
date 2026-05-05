import { ProgramAssignment } from './entities/program-assignment.entity';
import { CreateProgramAssignmentDto } from './dto/create-program-assignment.dto';
import { UpdateProgramAssignmentDto } from './dto/update-program-assignment.dto';
export declare class ProgramAssignmentsService {
    private assignments;
    private counter;
    private generateId;
    findAll(): ProgramAssignment[];
    findById(id: string): ProgramAssignment;
    findByProgram(programId: string): ProgramAssignment[];
    findByVolunteer(email: string): ProgramAssignment[];
    exists(programId: string, email: string): boolean;
    create(dto: CreateProgramAssignmentDto): ProgramAssignment;
    update(id: string, dto: UpdateProgramAssignmentDto): ProgramAssignment;
    delete(id: string): boolean;
}
