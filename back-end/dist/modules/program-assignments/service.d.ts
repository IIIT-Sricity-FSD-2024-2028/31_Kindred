import { ProgramsService } from '../programs/service';
import { ProgramAssignment } from './entities/program-assignment.entity';
import { CreateProgramAssignmentDto } from './dto/create-program-assignment.dto';
import { UpdateProgramAssignmentDto } from './dto/update-program-assignment.dto';
export declare class ProgramAssignmentsService {
    private readonly programs;
    constructor(programs: ProgramsService);
    onModuleInit(): void;
    private syncCount;
    private assignments;
    private counter;
    private generateId;
    findAll(): ProgramAssignment[];
    findById(id: string): ProgramAssignment;
    findByProgram(programId: string): ProgramAssignment[];
    findByVolunteer(email: string): ProgramAssignment[];
    memberPrograms(email: string): import("../programs/entities/program.entity").Program[];
    exists(programId: string, email: string): boolean;
    assertActive(programId: string, email: string): void;
    respond(id: string, email: string, action: 'accepted' | 'declined'): ProgramAssignment;
    activateApprovedMembership(id: string): ProgramAssignment;
    create(dto: CreateProgramAssignmentDto): ProgramAssignment;
    update(id: string, dto: UpdateProgramAssignmentDto): ProgramAssignment;
    delete(id: string): boolean;
}
