import { ProgramAssignmentsService } from '../program-assignments/service';
import { ProgramsService } from '../programs/service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProgramApplication } from './entities/program-application.entity';
import { CreateProgramApplicationDto } from './dto/create-program-application.dto';
import { NotificationsService } from '../notifications/service';

@Injectable()
export class ProgramApplicationsService {
  constructor(private readonly assignments: ProgramAssignmentsService, private readonly programs: ProgramsService, private readonly notifications: NotificationsService) {}
  private applications: ProgramApplication[] = [];
  private counter = 100;

  private generateId(): string {
    return `papp_${Date.now()}_${this.counter++}`;
  }

  private ensureApprovedMembership(application: ProgramApplication): void {
    if (application.status !== 'approved') return;
    const existing = this.assignments.findByProgram(application.programId).find((a) => a.volunteerEmail.toLowerCase() === application.volunteerEmail.toLowerCase());
    if (existing) this.assignments.activateApprovedMembership(existing.id);
    else {
      const membership = this.assignments.create({ ...application, id: undefined, role: 'Volunteer' });
      this.assignments.activateApprovedMembership(membership.id);
    }
  }

  findAll(): ProgramApplication[] {
    this.applications.forEach((application) => this.ensureApprovedMembership(application));
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

  findByOrg(org: string): ProgramApplication[] {
    const programIds = new Set(this.programs.findByOrg(org).map((program) => program.id));
    const applications = this.applications.filter((application) => programIds.has(application.programId));
    applications.forEach((application) => this.ensureApprovedMembership(application));
    return applications;
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
    const program = this.programs.findById(dto.programId);
    if (program.status !== 'active' || program.listingStatus !== 'approved' || !program.openForApplications) throw new BadRequestException('This program is not accepting public applications');
    if (this.assignments.findByProgram(dto.programId).some((a) => a.volunteerEmail.toLowerCase() === dto.volunteerEmail.toLowerCase() && ['active','pending'].includes(a.status))) throw new BadRequestException('You already have a membership or invitation for this program');
    if (this.hasApplied(dto.programId, dto.volunteerEmail)) {
      throw new BadRequestException('Volunteer has already applied to this program');
    }
    const newApp: ProgramApplication = {
      id: dto.id || this.generateId(),
      programId: dto.programId,
      programName: dto.programName,
      volunteerEmail: dto.volunteerEmail,
      volunteerName: dto.volunteerName,
      message: dto.message,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
    };
    this.applications.push(newApp);
    this.notifications.create({
      targetOrg: program.org,
      title: 'New volunteer request',
      message: `${newApp.volunteerName} requested to join ${program.name}.`,
      type: 'info',
      link: '/org-admin.html#programs',
    });
    return { ...newApp };
  }

  approve(id: string): ProgramApplication {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program application with id '${id}' not found`);
    const application = this.applications[idx];
    this.applications[idx].status = 'approved';
    this.ensureApprovedMembership(this.applications[idx]);
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
