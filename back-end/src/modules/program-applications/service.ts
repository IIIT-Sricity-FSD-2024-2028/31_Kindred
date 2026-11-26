import { UsersService } from '../users/service';
import { VolunteersService } from '../volunteers/service';
import { reviewProfile } from '../../common/review-profile';
import { ProgramAssignmentsService } from '../program-assignments/service';
import { ProgramsService } from '../programs/service';
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ProgramApplication } from './entities/program-application.entity';
import { CreateProgramApplicationDto } from './dto/create-program-application.dto';
import { NotificationsService } from '../notifications/service';

@Injectable()
export class ProgramApplicationsService {
  constructor(private readonly assignments: ProgramAssignmentsService, private readonly programs: ProgramsService, private readonly notifications: NotificationsService, private readonly users: UsersService, private readonly volunteers: VolunteersService) {}
  private applications: ProgramApplication[] = [];
  private counter = 100;

  private generateId(): string {
    return `papp_${Date.now()}_${this.counter++}`;
  }

  private ensureApprovedMembership(application: ProgramApplication): void {
    if (application.status !== 'approved') return;
    const existing = this.assignments.findByProgram(application.programId).find((a) => a.volunteerEmail.toLowerCase() === application.volunteerEmail.toLowerCase());
    if(existing){
      if(existing.status==='withdrawal_requested')throw new BadRequestException('Complete the existing handover before reviewing a new application');
      if(['declined','cancelled','withdrawn'].includes(existing.status))this.assignments.update(existing.id,{status:'pending'});
      return;
    }
    if(!this.volunteers.findByEmail(application.volunteerEmail)) {
      const user=this.users.findByEmail(application.volunteerEmail);
      if(!user||user.status!=='approved'||!['volunteer','donor','beneficiary','seller'].includes(user.role))throw new BadRequestException('An approved community account is required');
      this.volunteers.create({name:user.name,email:user.email,phone:user.phone||'',role:'Volunteer',org:user.org||'',skills:user.skills||[]});
      if(user.availabilityDays)this.volunteers.updatePresence(user.email,{availabilityDays:user.availabilityDays});
    }
    this.assignments.create({ ...application, id: undefined, role: 'Volunteer' });
    // Applicant reviews the final work brief before accepting this invitation.
  }

  applicantDetails(id: string, role: string, org: string) {
    const application = this.findById(id);
    const program = this.programs.findById(application.programId);
    if (role !== 'superuser' && (role !== 'admin' || !org || program.org !== org)) throw new ForbiddenException('Review applicants for your own organization only');
    const profile = reviewProfile(this.users.findByEmail(application.volunteerEmail), this.volunteers.findByEmail(application.volunteerEmail));
    return { application, program, profile: { name: application.volunteerName, email: application.volunteerEmail, ...profile } };
  }

  findAll(): ProgramApplication[] {
    // Reads never reactivate cancelled or withdrawn memberships.
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
    // Membership is changed only by explicit decisions.
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
      (a) => !['withdrawn','rejected'].includes(a.status) && a.programId === programId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase(),
    );
  }

  create(dto: CreateProgramApplicationDto): ProgramApplication {
    const program = this.programs.findById(dto.programId);
    if (!this.programs.findPortal().some(p => p.id === program.id)) throw new BadRequestException('This program is not accepting public applications');
    if (this.assignments.findByProgram(dto.programId).some((a) => a.volunteerEmail.toLowerCase() === dto.volunteerEmail.toLowerCase() && ['active','pending'].includes(a.status))) throw new BadRequestException('You already have a membership or invitation for this program');
    if (this.hasApplied(dto.programId, dto.volunteerEmail)) {
      throw new BadRequestException('Volunteer has already applied to this program');
    }
    const newApp: ProgramApplication = {
      id: dto.id || this.generateId(),
      programId: dto.programId,
      programName: program.name,
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
    if(application.status==='approved')return {...application};
    if (application.status !== 'pending') throw new BadRequestException('Only pending applications can be approved');
    this.ensureApprovedMembership({...application,status:'approved'});
    this.applications[idx].status = 'approved';
    this.notifications.create({targetEmail:application.volunteerEmail,title:'Application approved: review your invitation',message:`Your application to ${application.programName} was approved. Open your programs, review the invitation and confirm attendance so the organization can assign tasks.`,link:this.users.findByEmail(application.volunteerEmail)?.dashboard || '/volunteer-portal',type:'info'});
    return { ...this.applications[idx] };
  }

  reject(id: string): ProgramApplication {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program application with id '${id}' not found`);
    if (this.applications[idx].status !== 'pending') throw new BadRequestException('Only pending applications can be rejected');
    this.applications[idx].status = 'rejected';
    const application=this.applications[idx];
    this.notifications.create({targetEmail:application.volunteerEmail,title:'Application rejected',message:`Your application to ${application.programName} was rejected by the organization.`,link:this.users.findByEmail(application.volunteerEmail)?.dashboard || '/volunteer-portal',type:'info'});
    return { ...this.applications[idx] };
  }

  withdraw(id: string, email: string, reason: string) {
    const app=this.applications.find(a=>a.id===id); if(!app)throw new NotFoundException();
    if(!email || app.volunteerEmail.toLowerCase()!==email.toLowerCase())throw new ForbiddenException();
    if(app.status!=='pending' || !reason?.trim())throw new BadRequestException('Only pending applications can be withdrawn; provide a reason');
    app.status='withdrawn'; app.message=`${app.message || ''} Withdrawal: ${reason}`;
    this.notifications.create({targetOrg:this.programs.findById(app.programId).org,title:'Application withdrawn',message:`${app.volunteerName}: ${reason}`,link:'/org-admin#programs',type:'info'});
    return {...app};
  }
  delete(id: string): boolean {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program application with id '${id}' not found`);
    this.applications.splice(idx, 1);
    return true;
  }
}
