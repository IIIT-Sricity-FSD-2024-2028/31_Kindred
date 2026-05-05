import { Injectable, NotFoundException } from '@nestjs/common';
import { Subtask } from './entities/subtask.entity';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  private subtasks: Subtask[] = [
    { id: 'st_001', programId: 'prog_001', title: 'Set up emergency shelters', description: 'Erect 50 temporary shelters in affected zones', assignedToEmail: 'volunteer@kindred.org', assignedToName: 'Priya Singh', status: 'in-progress', progress: 65, createdAt: '2024-01-15' },
    { id: 'st_002', programId: 'prog_001', title: 'Distribute medical kits', description: 'Deliver 200 medical kits to flood-affected villages', assignedToEmail: 'amit.sharma@email.com', assignedToName: 'Amit Sharma', status: 'in-progress', progress: 40, createdAt: '2024-01-18' },
    { id: 'st_003', programId: 'prog_001', title: 'Food distribution drive', description: 'Organize and distribute food packages to 500 families', assignedToEmail: 'volunteer@kindred.org', assignedToName: 'Priya Singh', status: 'pending', progress: 0, createdAt: '2024-01-20' },
    { id: 'st_004', programId: 'prog_002', title: 'Site survey for borewells', description: 'Survey 25 villages for suitable borewell locations', assignedToEmail: 'volunteer@kindred.org', assignedToName: 'Priya Singh', status: 'completed', progress: 100, createdAt: '2024-02-05' },
    { id: 'st_005', programId: 'prog_002', title: 'Community awareness campaign', description: 'Conduct water hygiene workshops in 15 villages', assignedToEmail: 'deepak.kumar@email.com', assignedToName: 'Deepak Kumar', status: 'in-progress', progress: 55, createdAt: '2024-02-12' },
    { id: 'st_006', programId: 'prog_002', title: 'Install purification units', description: 'Install 50 water purification systems', assignedToEmail: 'deepak.kumar@email.com', assignedToName: 'Deepak Kumar', status: 'pending', progress: 10, createdAt: '2024-03-01' },
  ];
  private counter = 100;

  private generateId(): string {
    return `st_${Date.now()}_${this.counter++}`;
  }

  findAll(): Subtask[] {
    return this.subtasks.slice();
  }

  findById(id: string): Subtask {
    const st = this.subtasks.find((s) => s.id === id);
    if (!st) throw new NotFoundException(`Subtask with id '${id}' not found`);
    return { ...st };
  }

  findByProgram(programId: string): Subtask[] {
    return this.subtasks.filter((s) => s.programId === programId);
  }

  findByVolunteer(email: string): Subtask[] {
    return this.subtasks.filter((s) => s.assignedToEmail && s.assignedToEmail.toLowerCase() === email.toLowerCase());
  }

  findByProgramAndVolunteer(programId: string, email: string): Subtask[] {
    return this.subtasks.filter(
      (s) => s.programId === programId && s.assignedToEmail && s.assignedToEmail.toLowerCase() === email.toLowerCase(),
    );
  }

  getProgramProgress(programId: string): number {
    const subs = this.findByProgram(programId);
    if (subs.length === 0) return 0;
    const total = subs.reduce((sum, s) => sum + (s.progress || 0), 0);
    return Math.round(total / subs.length);
  }

  create(dto: CreateSubtaskDto): Subtask {
    const newSt: Subtask = {
      id: this.generateId(),
      programId: dto.programId,
      title: dto.title,
      description: dto.description || '',
      assignedToEmail: dto.assignedToEmail,
      assignedToName: dto.assignedToName || '',
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.subtasks.push(newSt);
    return { ...newSt };
  }

  update(id: string, dto: UpdateSubtaskDto): Subtask {
    const idx = this.subtasks.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException(`Subtask with id '${id}' not found`);
    this.subtasks[idx] = { ...this.subtasks[idx], ...dto };
    return { ...this.subtasks[idx] };
  }

  delete(id: string): boolean {
    const idx = this.subtasks.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException(`Subtask with id '${id}' not found`);
    this.subtasks.splice(idx, 1);
    return true;
  }
}
