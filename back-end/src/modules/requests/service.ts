import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformRequest } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  private requests: PlatformRequest[] = [
    { id: 'REQ-001', org: 'ShelterHope', type: 'Organization Registration', description: 'New NGO registration request for housing assistance programs.', date: '2024-12-15', status: 'pending', priority: 'high', contact: 'info@shelterhope.org', phone: '9876543210', city: 'Pune' },
    { id: 'REQ-002', org: 'PathFinders', type: 'Budget Increase', description: 'Request to increase approved budget for youth empowerment campaign.', date: '2024-12-18', status: 'pending', priority: 'medium', contact: 'reach@pathfinders.org', phone: '8765432109', city: 'Jaipur' },
    { id: 'REQ-003', org: 'EcoTrust Foundation', type: 'Account Reinstatement', description: 'Request to reinstate suspended account after compliance review.', date: '2024-12-20', status: 'pending', priority: 'high', contact: 'eco@ecotrust.org', phone: '7654321098', city: 'Chandigarh' },
  ];
  private counter = 100;

  findAll(): PlatformRequest[] {
    return this.requests.slice();
  }

  findById(id: string): PlatformRequest {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new NotFoundException(`Request with id '${id}' not found`);
    return { ...req };
  }

  getPending(): PlatformRequest[] {
    return this.requests.filter((r) => r.status === 'pending');
  }

  create(dto: CreateRequestDto): PlatformRequest {
    const newReq: PlatformRequest = {
      id: `REQ-${String(Date.now()).slice(-4)}`,
      org: dto.org,
      type: dto.type,
      description: dto.description,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      priority: dto.priority || 'medium',
      contact: dto.contact || '',
      phone: dto.phone || '',
      city: dto.city || '',
    };
    this.requests.push(newReq);
    return { ...newReq };
  }

  update(id: string, dto: UpdateRequestDto): PlatformRequest {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Request with id '${id}' not found`);
    this.requests[idx] = { ...this.requests[idx], ...dto };
    return { ...this.requests[idx] };
  }

  approve(id: string): PlatformRequest {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Request with id '${id}' not found`);
    this.requests[idx].status = 'approved';
    return { ...this.requests[idx] };
  }

  reject(id: string): PlatformRequest {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Request with id '${id}' not found`);
    this.requests[idx].status = 'rejected';
    return { ...this.requests[idx] };
  }

  delete(id: string): boolean {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Request with id '${id}' not found`);
    this.requests.splice(idx, 1);
    return true;
  }
}
