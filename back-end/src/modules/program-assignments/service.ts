import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { SchedulingService, indiaDate } from '../../common/scheduling';
import { UsersService } from '../users/service';
import { VolunteersService } from '../volunteers/service';
import { NotificationsService } from '../notifications/service';
import { ProgramsService } from '../programs/service';
import { ProgramAssignment } from './entities/program-assignment.entity';
import { CreateProgramAssignmentDto } from './dto/create-program-assignment.dto';
import { UpdateProgramAssignmentDto } from './dto/update-program-assignment.dto';

@Injectable()
export class ProgramAssignmentsService {
  constructor(private readonly programs: ProgramsService) {}
  @Inject(UsersService) private users: UsersService;
  @Inject(SchedulingService) private scheduling: SchedulingService;
  @Inject(VolunteersService) private volunteers: VolunteersService;
  @Inject(NotificationsService) private notifications: NotificationsService;
  onModuleInit() {
    this.programs.findAll().forEach(p => this.syncCount(p.id));
    this.programs.onStatusChange(p=>{for(const a of this.assignments.filter(a=>a.programId===p.id&&['active','pending','withdrawal_requested'].includes(a.status)))this.event(a,`program_${p.status}`,p.org,`Program status is now ${p.status}. ${p.status==='active'?'Program is active.':'The program is not accepting new work or applications.'}`);});
    this.programs.onMaterialChange(p => {
      for (const a of this.assignments.filter(a => a.programId === p.id && ['active','pending','withdrawal_requested'].includes(a.status))) {
        if (a.status === 'active') a.needsReconfirmation = true;
        this.event(a,'program_changed',p.org,'Review the revised program brief and reconfirm attendance');
      }
    });
    for (const a of this.assignments.filter(a => ['active','withdrawal_requested'].includes(a.status))) {
      const p = this.programs.findAll().find(p => p.id === a.programId);
      if (p && p.endDate >= indiaDate()) { try { this.scheduling.reserve(a.id,a.volunteerEmail,p.name,p); } catch { a.needsReconfirmation = true; } }
    }
  }
  private event(a: ProgramAssignment, action: string, by: string, note?: string) {
    (a.history ||= []).push({at:new Date().toISOString(),action,by,note});
    this.notifications?.create({targetEmail:a.volunteerEmail,title:`Program: ${action.replaceAll('_',' ')}`,message:`${a.programName}. ${note || ''}`,link:this.users?.findByEmail(a.volunteerEmail)?.dashboard || '/volunteer-portal',type:'info'});
  }
  setWithdrawal(id: string, status: 'withdrawal_requested'|'withdrawn', email: string, reason: string, note?: string) {
    const a = this.assignments.find(a => a.id === id); if (!a) throw new NotFoundException();
    a.status=status; a.withdrawalReason=reason; a.handoverNote=note;
    if (status === 'withdrawn') this.scheduling.release(id);
    this.event(a,status,email,note || reason); this.syncCount(a.programId); return {...a};
  }
  private syncCount(programId: string) { this.programs.setVolunteerCount(programId, new Set(this.assignments.filter((a) => a.programId === programId && ['active','withdrawal_requested'].includes(a.status)).map((a) => a.volunteerEmail.toLowerCase())).size); }
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

  memberPrograms(email: string) { return this.programs.findAll().filter((p) => this.findByVolunteer(email || '').some((a) => a.programId === p.id && ['active','pending','withdrawal_requested','withdrawn'].includes(a.status))); }

  exists(programId: string, email: string): boolean {
    return this.assignments.some(
      (a) => a.programId === programId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase(),
    );
  }

  assertActive(programId: string, email: string): void {
    this.programs.findById(programId);
    if (!this.findByProgram(programId).some((a) => ['active','withdrawal_requested'].includes(a.status) && a.volunteerEmail.toLowerCase() === email.toLowerCase())) {
      throw new BadRequestException('The volunteer must accept a program invitation before tasks or subtasks can be assigned.');
    }
  }

  assertReady(programId:string,email:string){
    this.assertActive(programId,email);
    const p=this.programs.findById(programId),a=this.findByProgram(programId).find(a=>a.volunteerEmail.toLowerCase()===email.toLowerCase());
    if(p.status!=='active'||p.endDate<indiaDate()||a?.needsReconfirmation||a?.status==='withdrawal_requested')throw new BadRequestException('New work requires a current program and confirmed, active attendance');
  }
  respond(id: string, email: string, action: 'accepted' | 'declined', confirmation?: {version?:number;attendanceConfirmed?:boolean}): ProgramAssignment {
    const assignment = this.findById(id);
    if (!email || assignment.volunteerEmail.toLowerCase() !== email.toLowerCase()) throw new ForbiddenException('Only the invited volunteer can respond.');
    if (assignment.status !== 'pending' && !(assignment.status === 'active' && assignment.needsReconfirmation)) throw new BadRequestException('This invitation is no longer pending.');
    const program = this.programs.findById(assignment.programId);
    if (action === 'accepted') {
      if(!program.shiftStart||!program.shiftEnd||!program.reportingTime||!program.meetingPoint?.trim()||!program.workBrief?.trim()||!program.contactName?.trim()||!program.contactPhone?.trim())throw new BadRequestException('The coordinator must complete the work brief, contact details and schedule before you accept');
      if (!confirmation?.attendanceConfirmed || confirmation.version !== (program.version || 1)) throw new BadRequestException('Review the latest program brief and confirm attendance first');
      if (program.status !== 'active' || program.endDate < indiaDate()) throw new BadRequestException('This program is no longer accepting attendance');
      if (program.invitationDeadline && program.invitationDeadline < indiaDate() && !assignment.needsReconfirmation) throw new BadRequestException('The invitation deadline has passed');
      const result = this.volunteers.eligibility(email,program,id);
      if (!result.eligible) throw new BadRequestException(result.reasons.join('; '));
      this.scheduling.reserve(id,email,program.name,program);
    } else {
      if (assignment.status === 'active') throw new BadRequestException('Use withdrawal and handover to decline changed commitments');
      this.scheduling.release(id);
    }
    const idx = this.assignments.findIndex((a) => a.id === id);
    this.assignments[idx].status = action === 'accepted' ? 'active' : 'declined';
    if (action === 'accepted') { this.assignments[idx].acceptedVersion=program.version||1; this.assignments[idx].acceptedBrief={...program}; this.assignments[idx].needsReconfirmation=false; }
    this.event(this.assignments[idx],action,email);
    this.notifications?.create({targetOrg:program.org,title:'Program invitation response',message:`${assignment.volunteerName}: ${action}`,link:'/org-admin#programs',type:'info'});
    this.syncCount(assignment.programId);
    return this.findById(id);
  }

  create(dto: CreateProgramAssignmentDto): ProgramAssignment {
    const program = this.programs.findById(dto.programId);
    if(program.status!=='active' || program.endDate < indiaDate()) throw new BadRequestException('Invite members to an active, current or future program');
    const eligibility=this.volunteers?.eligibility(dto.volunteerEmail,program);
    if(eligibility && !eligibility.eligible)throw new BadRequestException(eligibility.reasons.join('; '));
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
    this.event(newA,'invited',program.org,'Review all program details before accepting');
    return { ...newA };
  }

  update(id: string, dto: UpdateProgramAssignmentDto): ProgramAssignment {
    const idx = this.assignments.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program assignment with id '${id}' not found`);
    if (dto.status && !['pending', 'cancelled'].includes(dto.status)) throw new BadRequestException('Only the volunteer can activate an invitation.');
    if (dto.programId || dto.volunteerEmail) throw new BadRequestException('Create a new invitation to change the program or volunteer.');
    if (dto.status === 'cancelled' && ['active','withdrawal_requested'].includes(this.assignments[idx].status)) throw new BadRequestException('Use the withdrawal/handover workflow for accepted members');
    if (dto.status === 'pending' && this.assignments[idx].status === 'active') throw new BadRequestException('An accepted member is already active.');
    this.assignments[idx] = { ...this.assignments[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
    if(dto.status === 'cancelled') this.scheduling?.release(id);
    this.syncCount(this.assignments[idx].programId);
    return { ...this.assignments[idx] };
  }

  delete(id: string): boolean {
    const idx = this.assignments.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Program assignment with id '${id}' not found`);
    if(['active','withdrawal_requested'].includes(this.assignments[idx].status))throw new BadRequestException('Use withdrawal and handover to close an accepted membership');
    const programId = this.assignments[idx].programId;
    this.scheduling.release(id);
    this.assignments.splice(idx, 1);
    this.syncCount(programId);
    return true;
  }
}
