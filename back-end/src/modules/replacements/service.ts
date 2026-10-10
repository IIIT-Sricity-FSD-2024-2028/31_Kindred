import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Replacement } from './entities/replacement.entity';
import { CreateReplacementDto } from './dto/create-replacement.dto';
import { OrdersService } from '../orders/service';

const VALID_STATUSES = ['requested', 'approved', 'rejected', 'volunteer_assigned', 'return_pickup', 'replacement_in_transit', 'replaced'];
const VALID_TRANSITIONS: Record<string, string[]> = {
  'requested': ['approved', 'rejected'],
  'approved': ['volunteer_assigned'],
  'rejected': [],
  'volunteer_assigned': ['return_pickup'],
  'return_pickup': ['replacement_in_transit'],
  'replacement_in_transit': ['replaced'],
  'replaced': [],
};

@Injectable()
export class ReplacementsService {
  private replacements: Replacement[] = [];
  private counter = 100;

  constructor(private readonly ordersService: OrdersService) {}

  private generateId(): string {
    return `repl_${Date.now()}_${this.counter++}`;
  }

  findAll(): Replacement[] {
    return this.replacements.slice();
  }

  findById(id: string): Replacement {
    const r = this.replacements.find((x) => x.id === id);
    if (!r) throw new NotFoundException(`Replacement with id '${id}' not found`);
    return { ...r };
  }

  findByBuyer(email: string): Replacement[] {
    return this.replacements.filter((r) => r.buyerEmail.toLowerCase() === email.toLowerCase());
  }

  findByOrg(orgId: string): Replacement[] {
    return this.replacements.filter((r) => r.organizationId === orgId);
  }

  findBySeller(sellerId: string): Replacement[] {
    return this.replacements.filter((r) => r.sellerId === sellerId);
  }

  findByVolunteer(email: string): Replacement[] {
    return this.replacements.filter((r) => r.assignedVolunteerEmail && r.assignedVolunteerEmail.toLowerCase() === email.toLowerCase());
  }

  create(dto: CreateReplacementDto): Replacement {
    // Look up the original order to get product/seller/org info
    const order = this.ordersService.findById(dto.orderId);
    if (order.deliveryStatus !== 'delivered') {
      throw new BadRequestException('Replacement can only be requested for delivered orders');
    }

    const newRepl: Replacement = {
      id: this.generateId(),
      orderId: dto.orderId,
      productId: order.productId,
      productTitle: order.productTitle,
      sellerId: order.sellerId,
      sellerName: order.sellerName,
      organizationId: order.organizationId,
      organizationName: order.organizationName,
      buyerEmail: dto.buyerEmail,
      buyerName: dto.buyerName,
      reason: dto.reason,
      description: dto.description,
      imageUrl: dto.imageUrl,
      status: 'requested',
      timestamps: { requestedAt: new Date().toISOString() },
    };
    this.replacements.push(newRepl);
    return { ...newRepl };
  }

  approve(id: string): Replacement {
    return this.updateStatus(id, 'approved');
  }

  reject(id: string): Replacement {
    return this.updateStatus(id, 'rejected');
  }

  assignVolunteer(id: string, email: string, name: string): Replacement {
    const idx = this.replacements.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Replacement with id '${id}' not found`);
    if (this.replacements[idx].status !== 'approved') {
      throw new BadRequestException('Volunteer can only be assigned to approved replacements');
    }
    this.replacements[idx].assignedVolunteerEmail = email;
    this.replacements[idx].assignedVolunteerName = name;
    this.replacements[idx].status = 'volunteer_assigned';
    this.replacements[idx].timestamps = { ...this.replacements[idx].timestamps, volunteerAssignedAt: new Date().toISOString() };
    return { ...this.replacements[idx] };
  }

  updateStatus(id: string, newStatus: string): Replacement {
    const idx = this.replacements.findIndex((r) => r.id === id);
    if (idx === -1) throw new NotFoundException(`Replacement with id '${id}' not found`);
    const current = this.replacements[idx].status;

    if (!VALID_STATUSES.includes(newStatus)) {
      throw new BadRequestException(`Invalid status '${newStatus}'`);
    }
    const allowed = VALID_TRANSITIONS[current] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(`Cannot transition from '${current}' to '${newStatus}'. Allowed: ${allowed.join(', ') || 'none'}`);
    }

    this.replacements[idx].status = newStatus;
    const now = new Date().toISOString();
    const ts = { ...this.replacements[idx].timestamps };
    if (newStatus === 'approved') ts.approvedAt = now;
    else if (newStatus === 'rejected') ts.rejectedAt = now;
    else if (newStatus === 'return_pickup') ts.returnPickupAt = now;
    else if (newStatus === 'replacement_in_transit') ts.replacementInTransitAt = now;
    else if (newStatus === 'replaced') ts.replacedAt = now;
    this.replacements[idx].timestamps = ts;

    return { ...this.replacements[idx] };
  }
}
