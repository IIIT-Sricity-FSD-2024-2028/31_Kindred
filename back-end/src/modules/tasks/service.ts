import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private counter = 100;

  private generateId(): string {
    return `task_${Date.now()}_${this.counter++}`;
  }

  findAll(): Task[] {
    return this.tasks.slice();
  }

  findById(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException(`Task with id '${id}' not found`);
    return { ...task };
  }

  findByVolunteer(email: string): Task[] {
    return this.tasks.filter(
      (t) => t.assignedToEmail && t.assignedToEmail.toLowerCase() === email.toLowerCase(),
    );
  }

  create(dto: CreateTaskDto): Task {
    const newTask: Task = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      assignedToEmail: dto.assignedToEmail,
      assignedToName: dto.assignedToName,
      priority: dto.priority,
      dueDate: dto.dueDate,
      programId: dto.programId,
      programName: dto.programName,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  update(id: string, dto: UpdateTaskDto): Task {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new NotFoundException(`Task with id '${id}' not found`);
    this.tasks[idx] = { ...this.tasks[idx], ...dto };
    return { ...this.tasks[idx] };
  }

  delete(id: string): boolean {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new NotFoundException(`Task with id '${id}' not found`);
    this.tasks.splice(idx, 1);
    return true;
  }
}
