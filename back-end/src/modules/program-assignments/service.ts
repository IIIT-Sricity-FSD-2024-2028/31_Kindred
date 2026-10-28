import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ProgramsService } from '../programs/service';
import { ProgramAssignment } from './entities/program-assignment.entity';
import { CreateProgramAssignmentDto } from './dto/create-program-assignment.dto';
import { UpdateProgramAssignmentDto } from './dto/update-program-assignment.dto';

@Injectable()
export class ProgramAssignmentsService {
  constructor(private readonly programs: ProgramsService) {}
  onModuleInit() { this.programs.findAll().forEach((p) => this.syncCount(p.id)); }
  private syncCount(programId: string) { this.programs.setVolunteerCount(programId, new Set(this.assignments.filter((a) => a.programId === programId && a.status === 'active').map((a) => a.volunteerEmail.toLowerCase())).size); }
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

  memberPrograms(email: string) { return this.programs.findAll().filter((p) => this.findByVolunteer(email || '').some((a) => a.programId === p.id && ['active','pending'].includes(a.status))); }

  exists(programId: string, email: string): boolean {
    return this.assignments.some(
      (a) => a.programId === programId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase(),
    );
  }

  assertActive(programId: string, email: string): void {
    this.programs.findById(programId);
    if (!this.findByProgram(programId).some((a) => a.status === 'active' && a.volunteerEmail.toLowerCase() === email.toLowerCase())) {
      throw new BadRequestException('The volunteer must accept a program invitation before tasks or subtasks can be assigned.');
    }
  }

  respond(id: string, email: string, action: 'accepted' | 'declined'): ProgramAssignment {
    const assignment = this.findById(id);
    if (!email || assignment.volunteerEmail.toLowerCase() !== email.toLowerCase()) throw new ForbiddenException('Only the invited volunteer can respond.');
    if (assignment.status !== 'pending') throw new BadRequestException('This invitation is no longer pending.');
    const idx = this.assignments.findIndex((a) => a.id === id);
    this.assignments[idx].status = action === 'accepted' ? 'active' : 'declined';
    this.syncCount(assignment.programId);
    return this.findById(id);
  }

  activateApprovedMembership(id: string): ProgramAssignment {
    const assignment = this.findById(id);
    const idx = this.assignments.findIndex((a) => a.id === id);
    this.assignments[idx].status = 'active';
    this.syncCount(assignment.programId);
    return this.findById(id);
  }

  create(dto: CreateProgramAssignmentDto): ProgramAssignment {
    this.programs.findById(dto.programId);
    if (this.exists(dto.programId, dto.volunteerEmail)) {
      throw new BadRequestException('Volunteer is already assigned to this program');
    }
    const newA: ProgramAssignment = {
      id: dto.id || this.generateId(),
      programId: dto.programId,
      programName: dto.programName,
      volunteerEmail: dto.volunteerEmail,
      volunteerName: dto.volunteerName,
      role: dto.role || 'Volunteer',
      assignedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    this.assignments.push(newA);
    return { ...newA };
  }

  update(id: string, dto: UpdateProgramAssignmentDto): ProgramAssignment {
    const idx = this.assignments.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program assignment with id '${id}' not found`);
    if (dto.status && !['pending', 'cancelled'].includes(dto.status)) throw new BadRequestException('Only the volunteer can activate an invitation.');
    if (dto.programId || dto.volunteerEmail) throw new BadRequestException('Create a new invitation to change the program or volunteer.');
    if (dto.status === 'pending' && this.assignments[idx].status === 'active') throw new BadRequestException('An accepted member is already active.');
    this.assignments[idx] = { ...this.assignments[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
    this.syncCount(this.assignments[idx].programId);
    return { ...this.assignments[idx] };
  }

  delete(id: string): boolean {
    const idx = this.assignments.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program assignment with id '${id}' not found`);
    const programId = this.assignments[idx].programId;
    this.assignments.splice(idx, 1);
    this.syncCount(programId);
    return true;
  }
}
