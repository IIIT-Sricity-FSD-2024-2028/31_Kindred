import { Injectable, NotFoundException } from '@nestjs/common';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
  private programs: Program[] = [
    { id: 'prog_001', name: 'Cyclone Relief Fund', org: 'HopeConnect', focus: 'Disaster Relief', status: 'active', startDate: '2024-01-10', endDate: '2024-06-30', budget: 1200000, raised: 850000, beneficiaries: 1500, volunteers: 120, description: 'Emergency shelter, food and medical aid for cyclone victims in coastal Odisha.', requiredSkills: ['Field Work', 'Medical Aid', 'Logistics', 'Construction'], volunteerGoal: 150, openForApplications: true, location: 'Coastal Odisha' },
    { id: 'prog_002', name: 'Clean Water Initiative', org: 'HopeConnect', focus: 'Healthcare', status: 'active', startDate: '2024-02-01', endDate: '2024-12-31', budget: 800000, raised: 650000, beneficiaries: 3200, volunteers: 80, description: 'Installing water purification units in 50 villages across rural Maharashtra.', requiredSkills: ['Technology', 'Construction', 'Community Outreach', 'Environment'], volunteerGoal: 100, openForApplications: true, location: 'Rural Maharashtra' },
    { id: 'prog_003', name: 'Skill Development Workshop', org: 'HopeConnect', focus: 'Education', status: 'completed', startDate: '2023-09-01', endDate: '2024-01-31', budget: 500000, raised: 500000, beneficiaries: 800, volunteers: 40, description: 'Vocational training for unemployed youth in digital skills and entrepreneurship.', requiredSkills: ['Teaching', 'Technology', 'Administration'], volunteerGoal: 50, openForApplications: false, location: 'Delhi NCR' },
  ];
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
    const newProg: Program = {
      id: this.generateId(),
      name: dto.name,
      org: dto.org,
      focus: dto.focus,
      startDate: dto.startDate,
      endDate: dto.endDate,
      budget: dto.budget,
      description: dto.description,
      requiredSkills: dto.requiredSkills || [],
      volunteerGoal: dto.volunteerGoal || 0,
      openForApplications: dto.openForApplications !== undefined ? dto.openForApplications : true,
      location: dto.location || '',
      status: 'active',
      raised: 0,
      beneficiaries: 0,
      volunteers: 0,
    };
    this.programs.push(newProg);
    return { ...newProg };
  }

  update(id: string, dto: UpdateProgramDto): Program {
    const idx = this.programs.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Program with id '${id}' not found`);
    this.programs[idx] = { ...this.programs[idx], ...dto };
    return { ...this.programs[idx] };
  }

  delete(id: string): boolean {
    const idx = this.programs.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Program with id '${id}' not found`);
    this.programs.splice(idx, 1);
    return true;
  }
}
