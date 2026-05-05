import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private tasks;
    private counter;
    private generateId;
    findAll(): Task[];
    findById(id: string): Task;
    findByVolunteer(email: string): Task[];
    create(dto: CreateTaskDto): Task;
    update(id: string, dto: UpdateTaskDto): Task;
    delete(id: string): boolean;
}
