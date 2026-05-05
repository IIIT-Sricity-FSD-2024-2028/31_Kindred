import { Injectable, NotFoundException } from '@nestjs/common';
import { IncomingRequest } from './entities/incoming.entity';
import { CreateIncomingDto } from './dto/create-incoming.dto';

@Injectable()
export class IncomingService {
  private requests: IncomingRequest[] = [
    { id: 'INC-001', name: 'Ravi Kumar', type: 'Medical Assistance', desc: 'Requires urgent medical supplies for flood-affected village.', urgency: 'high', date: '2024-12-20', status: 'pending', location: 'Patna, Bihar' },
    { id: 'INC-002', name: 'Sita Devi', type: 'Food Aid', desc: 'Family of 6 requires food ration for the next month.', urgency: 'high', date: '2024-12-19', status: 'pending', location: 'Varanasi, UP' },
    { id: 'INC-003', name: 'Local School Board', type: 'Educational Material', desc: 'Requesting notebooks and stationery for 200 students.', urgency: 'medium', date: '2024-12-18', status: 'pending', location: 'Gaya, Bihar' },
    { id: 'INC-004', name: 'Village Panchayat', type: 'Infrastructure', desc: 'Request for temporary shelter materials post-flooding.', urgency: 'medium', date: '2024-12-17', status: 'pending', location: 'Darbhanga, Bihar' },
  ];
  private counter = 100;

  findAll(): IncomingRequest[] {
    return this.requests.slice();
  }

  findById(id: string): IncomingRequest {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new NotFoundException(`Incoming request with id '${id}' not found`);
    return { ...req };
  }

  getPending(): IncomingRequest[] {
    return this.requests.filter((r) => r.status === 'pending');
  }

  create(dto: CreateIncomingDto): IncomingRequest {
    const newReq: IncomingRequest = {
      id: `INC-${Date.now()}_${this.counter++}`,
      name: dto.name,
      type: dto.type,
      desc: dto.desc,
      urgency: dto.urgency || 'medium',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      location: dto.location || '',
    };
    this.requests.push(newReq);
    return { ...newReq };
  }

  accept(id: string): IncomingRequest {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Incoming request with id '${id}' not found`);
    this.requests[idx].status = 'accepted';
    return { ...this.requests[idx] };
  }

  decline(id: string): IncomingRequest {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Incoming request with id '${id}' not found`);
    this.requests[idx].status = 'declined';
    return { ...this.requests[idx] };
  }

  delete(id: string): boolean {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Incoming request with id '${id}' not found`);
    this.requests.splice(idx, 1);
    return true;
  }
}
