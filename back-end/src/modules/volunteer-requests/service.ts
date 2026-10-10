import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { VolunteerRequest, VolunteerResponse } from './entities/volunteer-request.entity';
import { CreateVolunteerRequestDto } from './dto/create-volunteer-request.dto';

@Injectable()
export class VolunteerRequestsService {
  private requests: VolunteerRequest[] = [];
  private counter = 100;

  private generateId(): string {
    return `volreq_${Date.now()}_${this.counter++}`;
  }

  findAll(): VolunteerRequest[] {
    return this.requests.slice();
  }

  findById(id: string): VolunteerRequest {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new NotFoundException(`Volunteer request with id '${id}' not found`);
    return { ...req };
  }

  findByOrg(orgId: string): VolunteerRequest[] {
    return this.requests.filter((r) => r.organizationId === orgId);
  }

  findByStatus(status: string): VolunteerRequest[] {
    return this.requests.filter((r) => r.status === status);
  }

  create(dto: CreateVolunteerRequestDto): VolunteerRequest {
    const newReq: VolunteerRequest = {
      id: this.generateId(),
      ...dto,
      slotsAvailable: dto.volunteersRequired,
      status: 'open',
      responses: [],
      createdAt: new Date().toISOString(),
    };
    this.requests.push(newReq);
    return { ...newReq };
  }

  updateStatus(id: string, status: string): VolunteerRequest {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Volunteer request with id '${id}' not found`);
    this.requests[idx].status = status;
    return { ...this.requests[idx] };
  }

  respond(id: string, email: string, name: string, action: 'accepted' | 'rejected'): VolunteerRequest {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Volunteer request with id '${id}' not found`);
    const req = this.requests[idx];

    if (req.status !== 'open' && req.status !== 'filled') {
      throw new BadRequestException(`Cannot respond to a request with status '${req.status}'`);
    }

    const existingResponse = req.responses.find((r) => r.volunteerEmail === email);
    if (existingResponse) {
      if (existingResponse.action === action) {
        throw new BadRequestException(`You have already ${action} this request.`);
      }
      // If changing response from accepted to rejected
      if (existingResponse.action === 'accepted' && action === 'rejected') {
        req.slotsAvailable++;
        if (req.status === 'filled') req.status = 'open'; // Re-open if it was full
      }
      // If changing from rejected to accepted
      else if (existingResponse.action === 'rejected' && action === 'accepted') {
        if (req.slotsAvailable <= 0) {
          throw new BadRequestException('No slots available for this request.');
        }
        req.slotsAvailable--;
      }
      existingResponse.action = action;
      existingResponse.respondedAt = new Date().toISOString();
    } else {
      if (action === 'accepted') {
        if (req.slotsAvailable <= 0) {
          throw new BadRequestException('No slots available for this request.');
        }
        req.slotsAvailable--;
      }
      req.responses.push({
        volunteerEmail: email,
        volunteerName: name,
        action,
        respondedAt: new Date().toISOString(),
      });
    }

    if (req.slotsAvailable === 0 && action === 'accepted') {
      req.status = 'filled';
    }

    return { ...this.requests[idx] };
  }

  delete(id: string): boolean {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Volunteer request with id '${id}' not found`);
    this.requests.splice(idx, 1);
    return true;
  }
}
