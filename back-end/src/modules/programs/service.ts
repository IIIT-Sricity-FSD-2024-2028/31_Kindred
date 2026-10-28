import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrganizationsService } from '../organizations/service';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
  private programs: Program[] = [
    { id: 'prog_001', name: 'Cyclone Relief Fund', org: 'HopeConnect', focus: 'Disaster Relief', status: 'active', startDate: '2024-01-10', endDate: '2024-06-30', budget: 1200000, raised: 850000, taskProgress: 0, totalTasks: 0, completedTasks: 0, beneficiaries: 1500, volunteers: 120, description: 'Emergency shelter, food and medical aid for cyclone victims in coastal Odisha.', requiredSkills: ['Field Work', 'Medical Aid', 'Logistics', 'Construction'], volunteerGoal: 150, openForApplications: true, location: 'Coastal Odisha' },
    { id: 'prog_002', name: 'Clean Water Initiative', org: 'HopeConnect', focus: 'Healthcare', status: 'active', startDate: '2024-02-01', endDate: '2024-12-31', budget: 800000, raised: 650000, taskProgress: 0, totalTasks: 0, completedTasks: 0, beneficiaries: 3200, volunteers: 80, description: 'Installing water purification units in 50 villages across rural Maharashtra.', requiredSkills: ['Technology', 'Construction', 'Community Outreach', 'Environment'], volunteerGoal: 100, openForApplications: true, location: 'Rural Maharashtra' },
    { id: 'prog_003', name: 'Skill Development Workshop', org: 'HopeConnect', focus: 'Education', status: 'completed', startDate: '2023-09-01', endDate: '2024-01-31', budget: 500000, raised: 500000, taskProgress: 0, totalTasks: 0, completedTasks: 0, beneficiaries: 800, volunteers: 40, description: 'Vocational training for unemployed youth in digital skills and entrepreneurship.', requiredSkills: ['Teaching', 'Technology', 'Administration'], volunteerGoal: 50, openForApplications: false, location: 'Delhi NCR' },
  ];
  constructor(private readonly organizations: OrganizationsService) { this.programs.forEach((p) => { p.listingStatus = 'approved'; }); }
  findPublic(): Program[] { return this.findAll().filter((p) => p.status === 'active' && p.listingStatus === 'approved' && this.organizations.findPublic().some((o) => o.name === p.org)); }
  setVolunteerCount(id: string, count: number): void { const p = this.programs.find((p) => p.id === id); if (p) p.volunteers = count; }
  creditDonation(id: string, amount: number): void { const p = this.programs.find((p) => p.id === id); if (p) p.raised += amount; }
  setTaskProgress(id: string, totalTasks: number, completedTasks: number): void {
    const program = this.programs.find((p) => p.id === id);
    if (!program) return;
    program.totalTasks = totalTasks;
    program.completedTasks = completedTasks;
    program.taskProgress = totalTasks ? Math.round(completedTasks / totalTasks * 100) : 0;
  }
  reviewListing(id: string, approved: boolean): Program {
    const p = this.programs.find((p) => p.id === id);
    if (!p) throw new NotFoundException('Program not found');
    if (approved) this.organizations.requireBankDetails(p.org);
    if (p.listingStatus !== 'pending') throw new BadRequestException('Only pending public listing requests can be reviewed');
    p.listingStatus = approved ? 'approved' : 'rejected'; return { ...p };
  }
  private counter = 100;

  private generateId(): string {
    return `prog_${Date.now()}_${this.counter++}`;
  }

  findAll(): Program[] {
    return this.programs.slice();
  }

  findById(id: string): Program {
    const prog = this.programs.find((p) => p.id === id);
    if (!prog) throw new NotFoundException(`Program with id '${id}' not found`);
    return { ...prog };
  }

  findByOrg(org: string): Program[] {
    return this.programs.filter((p) => p.org === org);
  }

  create(dto: CreateProgramDto): Program {
    if (dto.requestListing) this.organizations.requireBankDetails(dto.org);
    const newProg: Program = {
      id: dto.id || this.generateId(),
      name: dto.name,
      org: dto.org,
      focus: dto.focus,
      startDate: dto.startDate,
      endDate: dto.endDate || '',
      budget: dto.budget,
      description: dto.description,
      requiredSkills: dto.requiredSkills || [],
      volunteerGoal: dto.volunteerGoal || 0,
      openForApplications: dto.openForApplications !== undefined ? dto.openForApplications : true,
      location: dto.location || '',
      status: dto.status || 'active',
      raised: 0,
      taskProgress: 0,
      totalTasks: 0,
      completedTasks: 0,
      beneficiaries: 0,
      volunteers: 0,
      image: dto.image || '', listingStatus: dto.requestListing ? 'pending' : 'unlisted',
    };
    this.programs.push(newProg);
    return { ...newProg };
  }

  update(id: string, dto: UpdateProgramDto): Program {
    const idx = this.programs.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Program with id '${id}' not found`);
    const { requestListing, volunteers, ...changes } = dto;
    if (requestListing || dto.image !== undefined && this.programs[idx].listingStatus === 'approved') this.organizations.requireBankDetails(dto.org || this.programs[idx].org);
    if (requestListing || (dto.image !== undefined && dto.image !== this.programs[idx].image && this.programs[idx].listingStatus === 'approved')) this.programs[idx].listingStatus = 'pending';
    this.programs[idx] = { ...this.programs[idx], ...Object.fromEntries(Object.entries(changes).filter(([, value]) => value !== undefined)) };
    return { ...this.programs[idx] };
  }

  delete(id: string): boolean {
    const idx = this.programs.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Program with id '${id}' not found`);
    this.programs.splice(idx, 1);
    return true;
  }
}
