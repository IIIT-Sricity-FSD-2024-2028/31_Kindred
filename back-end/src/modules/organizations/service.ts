import { Injectable, NotFoundException } from '@nestjs/common';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  private organizations: Organization[] = [
    { id: 'org_001', name: 'HopeConnect', joined: 'Jan 2024', focus: 'Disaster Relief', status: 'active', volunteers: 1240, beneficiaries: 15400, rating: 4.8, color: '#6366f1', email: 'contact@hopeconnect.org', phone: '+91 98765 43210', city: 'Mumbai' },
    { id: 'org_002', name: 'MyTrust Foundation', joined: 'Feb 2024', focus: 'Community Development', status: 'active', volunteers: 1850, beneficiaries: 12800, rating: 4.7, color: '#ec4899', email: 'info@mytrust.org', phone: '+91 98765 43211', city: 'Delhi' },
    { id: 'org_003', name: 'GreenEarth Initiative', joined: 'Mar 2024', focus: 'Environment', status: 'active', volunteers: 990, beneficiaries: 8200, rating: 4.6, color: '#22c55e', email: 'hello@greenearth.org', phone: '+91 98765 43212', city: 'Bengaluru' },
    { id: 'org_004', name: 'EduBridge', joined: 'Feb 2024', focus: 'Education', status: 'active', volunteers: 2130, beneficiaries: 32000, rating: 4.9, color: '#f59e0b', email: 'info@edubridge.org', phone: '+91 98765 43213', city: 'Chennai' },
    { id: 'org_005', name: 'MedReach', joined: 'Nov 2024', focus: 'Healthcare', status: 'active', volunteers: 760, beneficiaries: 6800, rating: 4.5, color: '#ef4444', email: 'support@medreach.org', phone: '+91 98765 43214', city: 'Hyderabad' },
    { id: 'org_006', name: 'FoodFirst Alliance', joined: 'Apr 2024', focus: 'Food Security', status: 'active', volunteers: 1580, beneficiaries: 22000, rating: 4.7, color: '#14b8a6', email: 'help@foodfirst.org', phone: '+91 98765 43215', city: 'Kolkata' },
    { id: 'org_007', name: 'ShelterHope', joined: 'Jul 2024', focus: 'Housing', status: 'pending', volunteers: 430, beneficiaries: 3200, rating: 3.9, color: '#8b5cf6', email: 'info@shelterhope.org', phone: '+91 98765 43216', city: 'Pune' },
    { id: 'org_008', name: 'CareBridge', joined: 'Aug 2024', focus: 'Elder Care', status: 'active', volunteers: 520, beneficiaries: 4100, rating: 4.3, color: '#06b6d4', email: 'care@carebridge.org', phone: '+91 98765 43217', city: 'Ahmedabad' },
    { id: 'org_009', name: 'GlobalAid Network', joined: 'Jan 2024', focus: 'International Aid', status: 'active', volunteers: 3200, beneficiaries: 45000, rating: 4.8, color: '#84cc16', email: 'global@globalaid.org', phone: '+91 98765 43218', city: 'New Delhi' },
    { id: 'org_010', name: 'PathFinders', joined: 'Sep 2024', focus: 'Youth Empowerment', status: 'active', volunteers: 980, beneficiaries: 7600, rating: 4.4, color: '#f97316', email: 'reach@pathfinders.org', phone: '+91 98765 43219', city: 'Jaipur' },
    { id: 'org_011', name: 'EcoTrust Foundation', joined: 'Oct 2024', focus: 'Sustainability', status: 'suspended', volunteers: 870, beneficiaries: 5200, rating: 4.2, color: '#10b981', email: 'eco@ecotrust.org', phone: '+91 98765 43220', city: 'Chandigarh' },
    { id: 'org_012', name: 'BrightFutures', joined: 'Jan 2024', focus: 'Child Welfare', status: 'active', volunteers: 1120, beneficiaries: 9800, rating: 4.6, color: '#a855f7', email: 'bright@brightfutures.org', phone: '+91 98765 43221', city: 'Lucknow' },
  ];
  private counter = 100;

  private generateId(): string {
    return `org_${Date.now()}_${this.counter++}`;
  }

  findAll(): Organization[] {
    return this.organizations.slice();
  }

  findById(id: string): Organization {
    const org = this.organizations.find((o) => o.id === id);
    if (!org) throw new NotFoundException(`Organization with id '${id}' not found`);
    return { ...org };
  }

  search(q: string): Organization[] {
    if (!q) return this.organizations.slice();
    const lq = q.toLowerCase();
    return this.organizations.filter(
      (o) =>
        o.name.toLowerCase().includes(lq) ||
        o.focus.toLowerCase().includes(lq) ||
        (o.city || '').toLowerCase().includes(lq),
    );
  }

  create(dto: CreateOrganizationDto): Organization {
    const colors = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#ef4444', '#14b8a6', '#8b5cf6', '#06b6d4'];
    const newOrg: Organization = {
      id: this.generateId(),
      name: dto.name,
      focus: dto.focus,
      email: dto.email,
      phone: dto.phone,
      city: dto.city,
      joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      volunteers: 0,
      beneficiaries: 0,
      rating: '—',
      color: colors[Math.floor(Math.random() * colors.length)],
      status: dto.status || 'pending',
    };
    this.organizations.push(newOrg);
    return { ...newOrg };
  }

  update(id: string, dto: UpdateOrganizationDto): Organization {
    const idx = this.organizations.findIndex((o) => o.id === id);
    if (idx === -1) throw new NotFoundException(`Organization with id '${id}' not found`);
    this.organizations[idx] = { ...this.organizations[idx], ...dto };
    return { ...this.organizations[idx] };
  }

  delete(id: string): boolean {
    const idx = this.organizations.findIndex((o) => o.id === id);
    if (idx === -1) throw new NotFoundException(`Organization with id '${id}' not found`);
    this.organizations.splice(idx, 1);
    return true;
  }
}
