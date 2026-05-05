import { Subtask } from './entities/subtask.entity';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
export declare class SubtasksService {
    private subtasks;
    private counter;
    private generateId;
    findAll(): Subtask[];
    findById(id: string): Subtask;
    findByProgram(programId: string): Subtask[];
    findByVolunteer(email: string): Subtask[];
    findByProgramAndVolunteer(programId: string, email: string): Subtask[];
    getProgramProgress(programId: string): number;
    create(dto: CreateSubtaskDto): Subtask;
    update(id: string, dto: UpdateSubtaskDto): Subtask;
    delete(id: string): boolean;
}
