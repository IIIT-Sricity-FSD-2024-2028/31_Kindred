import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProgramAssignment } from './entities/program-assignment.entity';
import { CreateProgramAssignmentDto } from './dto/create-program-assignment.dto';
import { UpdateProgramAssignmentDto } from './dto/update-program-assignment.dto';

@Injectable()
export class ProgramAssignmentsService {
  private assignments: ProgramAssignment[] = [
    { id: 'pa_001', programId: 'prog_001', programName: 'Cyclone Relief Fund', volunteerEmail: 'volunteer@kindred.org', volunteerName: 'Priya Singh', role: 'Field Coordinator', assignedAt: '2024-01-15', status: 'active' },
    { id: 'pa_002', programId: 'prog_001', programName: 'Cyclone Relief Fund', volunteerEmail: 'amit.sharma@email.com', volunteerName: 'Amit Sharma', role: 'Medical Volunteer', assignedAt: '2024-01-20', status: 'active' },
    { id: 'pa_003', programId: 'prog_002', programName: 'Clean Water Initiative', volunteerEmail: 'volunteer@kindred.org', volunteerName: 'Priya Singh', role: 'Field Coordinator', assignedAt: '2024-02-05', status: 'active' },
    { id: 'pa_004', programId: 'prog_002', programName: 'Clean Water Initiative', volunteerEmail: 'deepak.kumar@email.com', volunteerName: 'Deepak Kumar', role: 'Community Outreach', assignedAt: '2024-02-10', status: 'active' },
  ];
  private counter = 100;

  private generateId(): string {
    return `pa_${Date.now()}_${this.counter++}`;
  }

  findAll(): ProgramAssignment[] {
    return this.assignments.slice();
  }

  findById(id: string): ProgramAssignment {
    const a = this.assignments.find((x) => x.id === id);
    if (!a) throw new NotFoundException(`Program assignment with id '${id}' not found`);
    return { ...a };
  }

  findByProgram(programId: string): ProgramAssignment[] {
    return this.assignments.filter((a) => a.programId === programId);
  }

  findByVolunteer(email: string): ProgramAssignment[] {
    return this.assignments.filter((a) => a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase());
  }

  exists(programId: string, email: string): boolean {
    return this.assignments.some(
      (a) => a.programId === programId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase(),
    );
  }

  create(dto: CreateProgramAssignmentDto): ProgramAssignment {
    if (this.exists(dto.programId, dto.volunteerEmail)) {
      throw new BadRequestException('Volunteer is already assigned to this program');
    }
    const newA: ProgramAssignment = {
      id: this.generateId(),
      programId: dto.programId,
      programName: dto.programName,
      volunteerEmail: dto.volunteerEmail,
      volunteerName: dto.volunteerName,
      role: dto.role || 'Volunteer',
      assignedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    this.assignments.push(newA);
    return { ...newA };
  }

  update(id: string, dto: UpdateProgramAssignmentDto): ProgramAssignment {
    const idx = this.assignments.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program assignment with id '${id}' not found`);
    this.assignments[idx] = { ...this.assignments[idx], ...dto };
    return { ...this.assignments[idx] };
  }

  delete(id: string): boolean {
    const idx = this.assignments.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program assignment with id '${id}' not found`);
    this.assignments.splice(idx, 1);
    return true;
  }
}
