import { ProgramAssignmentsService } from '../program-assignments/service';
import { ProgramsService } from '../programs/service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private readonly assignments;
    private readonly programs;
    private readonly proofs;
    constructor(assignments: ProgramAssignmentsService, programs: ProgramsService);
    private tasks;
    private counter;
    private syncProgramProgress;
    rebuildProgramProgress(): void;
    private generateId;
    findAll(): Task[];
    findById(id: string): Task;
    findByVolunteer(email: string): Task[];
    findByProgram(programId: string): Task[];
    create(dto: CreateTaskDto): Task;
    update(id: string, dto: UpdateTaskDto): Task;
    cancelByProgram(programId: string): number;
    delete(id: string): boolean;
}
