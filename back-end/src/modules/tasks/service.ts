import { ProofStore } from '../proofs/store';
import { Inject } from '@nestjs/common';
import { ProgramAssignmentsService } from '../program-assignments/service';
import { ProgramsService } from '../programs/service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const VALID_STATUSES = ['pending', 'in-progress', 'pending_review', 'completed', 'cancelled'];
const VALID_TRANSITIONS: Record<string, string[]> = {
  'pending': ['in-progress', 'cancelled'],
  'in-progress': ['pending_review', 'completed', 'cancelled'],
  'pending_review': ['completed', 'in-progress'],
  'completed': [],
  'cancelled': [],
};

@Injectable()
export class TasksService {
  @Inject(ProofStore) private readonly proofs!: ProofStore;
  constructor(private readonly assignments: ProgramAssignmentsService, private readonly programs: ProgramsService) {}
  private tasks: Task[] = [];
  private counter = 100;

  private syncProgramProgress(programId?: string): void {
    if (!programId) return;
    const activeTasks = this.tasks.filter((task) => task.programId === programId && task.status !== 'cancelled');
    const completed = activeTasks.filter((task) => task.status === 'completed').length;
    this.programs.setTaskProgress(programId, activeTasks.length, completed);
  }

  rebuildProgramProgress(): void {
    for (const programId of new Set(this.tasks.map((task) => task.programId).filter((id): id is string => Boolean(id)))) {
      this.syncProgramProgress(programId);
    }
  }

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

  findByProgram(programId: string): Task[] {
    return this.tasks.filter((t) => t.programId === programId);
  }

  create(dto: CreateTaskDto): Task {
    if (dto.programId) this.assignments.assertActive(dto.programId, dto.assignedToEmail);
    const newTask: Task = {
      id: dto.id || this.generateId(),
      title: dto.title,
      description: dto.description,
      assignedToEmail: dto.assignedToEmail,
      assignedToName: dto.assignedToName,
      priority: dto.priority || 'normal',
      dueDate: dto.dueDate,
      programId: dto.programId,
      programName: dto.programName,
      location: dto.location,
      notes: dto.notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    this.syncProgramProgress(newTask.programId);
    return { ...newTask };
  }

  update(id: string, dto: UpdateTaskDto): Task {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new NotFoundException(`Task with id '${id}' not found`);

    const programId = dto.programId ?? this.tasks[idx].programId;
    if (this.tasks[idx].programId && !programId) throw new BadRequestException('A program task cannot be detached from its program.');
    if (programId) this.assignments.assertActive(programId, dto.assignedToEmail ?? this.tasks[idx].assignedToEmail);
    if (dto.status === 'completed' || dto.status === 'pending_review') this.proofs.assertVerified('tasks', id);
    // Enforce valid status transitions
    if (dto.status) {
      const currentStatus = this.tasks[idx].status;
      if (!VALID_STATUSES.includes(dto.status)) {
        throw new BadRequestException(`Invalid status '${dto.status}'. Valid: ${VALID_STATUSES.join(', ')}`);
      }
      const allowed = VALID_TRANSITIONS[currentStatus] || [];
      if (!allowed.includes(dto.status)) {
        throw new BadRequestException(`Cannot transition from '${currentStatus}' to '${dto.status}'. Allowed: ${allowed.join(', ') || 'none'}`);
      }
    }

    const previousProgramId = this.tasks[idx].programId;
    this.tasks[idx] = {
      ...this.tasks[idx],
      ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)),
      updatedAt: new Date().toISOString(),
    };
    this.syncProgramProgress(previousProgramId);
    if (this.tasks[idx].programId !== previousProgramId) this.syncProgramProgress(this.tasks[idx].programId);
    return { ...this.tasks[idx] };
  }

  /** Archive/cancel tasks for a program instead of deleting them */
  cancelByProgram(programId: string): number {
    let count = 0;
    this.tasks.forEach((t, idx) => {
      if (t.programId === programId && t.status !== 'completed' && t.status !== 'cancelled') {
        this.tasks[idx].status = 'cancelled';
        this.tasks[idx].updatedAt = new Date().toISOString();
        count++;
      }
    });
    this.syncProgramProgress(programId);
    return count;
  }

  delete(id: string): boolean {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new NotFoundException(`Task with id '${id}' not found`);
    const programId = this.tasks[idx].programId;
    this.tasks.splice(idx, 1);
    this.syncProgramProgress(programId);
    return true;
  }
}
