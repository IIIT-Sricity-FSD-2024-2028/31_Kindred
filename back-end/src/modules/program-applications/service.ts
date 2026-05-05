import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProgramApplication } from './entities/program-application.entity';
import { CreateProgramApplicationDto } from './dto/create-program-application.dto';

@Injectable()
export class ProgramApplicationsService {
  private applications: ProgramApplication[] = [];
  private counter = 100;

  private generateId(): string {
    return `papp_${Date.now()}_${this.counter++}`;
  }

  findAll(): ProgramApplication[] {
    return this.applications.slice();
  }

  findById(id: string): ProgramApplication {
    const app = this.applications.find((a) => a.id === id);
    if (!app) throw new NotFoundException(`Program application with id '${id}' not found`);
    return { ...app };
  }

  findByProgram(programId: string): ProgramApplication[] {
    return this.applications.filter((a) => a.programId === programId);
  }

  findByVolunteer(email: string): ProgramApplication[] {
    return this.applications.filter((a) => a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase());
  }

  getPending(): ProgramApplication[] {
    return this.applications.filter((a) => a.status === 'pending');
  }

  hasApplied(programId: string, email: string): boolean {
    return this.applications.some(
      (a) => a.programId === programId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase(),
    );
  }

  create(dto: CreateProgramApplicationDto): ProgramApplication {
    if (this.hasApplied(dto.programId, dto.volunteerEmail)) {
      throw new BadRequestException('Volunteer has already applied to this program');
    }
    const newApp: ProgramApplication = {
      id: this.generateId(),
      programId: dto.programId,
      programName: dto.programName,
      volunteerEmail: dto.volunteerEmail,
      volunteerName: dto.volunteerName,
      message: dto.message,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
    };
    this.applications.push(newApp);
    return { ...newApp };
  }

  approve(id: string): ProgramApplication {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program application with id '${id}' not found`);
    this.applications[idx].status = 'approved';
    return { ...this.applications[idx] };
  }

  reject(id: string): ProgramApplication {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program application with id '${id}' not found`);
    this.applications[idx].status = 'rejected';
    return { ...this.applications[idx] };
  }

  delete(id: string): boolean {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program application with id '${id}' not found`);
    this.applications.splice(idx, 1);
    return true;
  }
}
