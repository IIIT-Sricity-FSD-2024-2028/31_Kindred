import { BadRequestException, Body, Controller, ForbiddenException, Get, Headers, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { saveImage } from '../../common/utils/image-upload';
import { ProofStore } from './store';
import { TasksService } from '../tasks/service';
import { SubtasksService } from '../subtasks/service';
import { ResourceDonationsService } from '../resource-donations/service';
import { OrdersService } from '../orders/service';
import { ReplacementsService } from '../replacements/service';
import { IncomingService } from '../incoming/service';
import { HourLogsService } from '../hour-logs/service';
import { ProgramsService } from '../programs/service';
import { VolunteersService } from '../volunteers/service';
import { FulfillmentService } from '../fulfillment/service';
@Controller('proofs')
@UseGuards(RolesGuard)
export class ProofsController {
  constructor(private readonly store: ProofStore, private readonly tasks: TasksService, private readonly subtasks: SubtasksService, private readonly resources: ResourceDonationsService, private readonly orders: OrdersService, private readonly replacements: ReplacementsService, private readonly incoming: IncomingService, private readonly hours: HourLogsService, private readonly programs: ProgramsService, private readonly volunteers: VolunteersService, private readonly fulfillment: FulfillmentService) {}
  private record(collection: string, id: string): any {
    const services: Record<string, { findById(id: string): any }> = { tasks: this.tasks, subtasks: this.subtasks, 'resource-donations': this.resources, orders: this.orders, replacements: this.replacements, incoming: this.incoming, 'hour-logs': this.hours };
    if (collection === 'deliveries') return this.fulfillment.findById(id);
    const service = services[collection]; if (!service) throw new BadRequestException('Unsupported proof collection'); return service.findById(id);
  }
  private organization(record: any): string {
    if (record.kind && record.sourceId) return record.orgName || '';
    if (record.programId) return this.programs.findById(record.programId).org;
    return record.organizationName || record.orgName || record.organization || this.volunteers.findAll().find((v) => v.email.toLowerCase() === String(record.volunteerEmail || record.assignedToEmail || record.assignedVolunteerEmail).toLowerCase())?.org || '';
  }
  @Get()
  @Roles('admin','superuser','volunteer','donor','beneficiary','seller')
  all(@Headers('role') role: string, @Headers('organization') org: string, @Headers('user-email') email: string) {
    return { success: true, data: this.store.all().filter((p) => role === 'superuser' || (p.collection === 'deliveries' && role === 'seller' ? this.fulfillment.findById(p.recordId).sellerEmail?.toLowerCase() === String(email).toLowerCase() : role === 'admin' ? p.organization === org : p.volunteerEmail.toLowerCase() === String(email).toLowerCase())) };
  }
  @Post()
  @Roles('volunteer','donor','beneficiary','seller')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  submit(@Body() body: any, @UploadedFile() file: any, @Headers('user-email') email: string, @Headers('role') role:string, @Headers('organization') org:string) {
    if (body.collection === 'orders' || body.collection === 'resource-donations') this.fulfillment.assertLegacyAvailable(body.collection === 'orders' ? 'order' : 'collection', body.recordId, {role,email,org});
    const record = this.record(body.collection, body.recordId);
    const assigned = record.volunteerEmail || record.assignedToEmail || record.assignedVolunteerEmail;
    if (!email || String(assigned).toLowerCase() !== email.toLowerCase()) throw new ForbiddenException('Only the assigned volunteer can upload proof');
    const organization = this.organization(record); if (!organization && !(body.collection === 'deliveries' && record.kind === 'order' && record.sellerEmail)) throw new BadRequestException('An organization must be assigned before proof submission');
    const current = record.deliveryStatus || record.status;
    const ready: Record<string, string[]> = { tasks: ['in-progress','pending_review'], subtasks: ['pending','in-progress'], orders: ['in_transit'], replacements: ['replacement_in_transit'], 'resource-donations': ['in_transit'], incoming: ['assigned'], 'hour-logs': ['pending','rejected'] };
    ready.deliveries = ['in_transit'];
    if (!ready[body.collection]?.includes(current)) throw new BadRequestException('This work is not ready for completion proof');
    this.store.assertCanSubmit(body.collection, body.recordId);
    const image = saveImage(file, 'work-proof');
    return { success: true, data: this.store.submit({ collection: body.collection, recordId: body.recordId, title: record.title || record.productTitle || record.description || record.type || record.category || 'Volunteer work', organization, volunteerEmail: email, image }), message: 'Proof submitted for organization review' };
  }
  @Patch(':id/:decision')
  @Roles('admin','superuser','seller')
  review(@Param('id') id: string, @Param('decision') decision: string, @Headers('role') role: string, @Headers('organization') org: string, @Headers('user-email') email: string, @Body() body: { reason?: string }) {
    if (!['approve','reject'].includes(decision)) throw new BadRequestException('Choose approve or reject');
    const p = this.store.get(id);
    if (p.collection === 'deliveries') {
      this.fulfillment.proofReviewer(p.recordId,{role,email,org});
      if (decision === 'reject' && !body.reason?.trim()) throw new BadRequestException('Provide a rejection reason');
    } else if (role !== 'admin' || !org || p.organization !== org) throw new ForbiddenException('Only the responsible organization admin can verify proof');
    if (p.status !== 'pending') throw new BadRequestException('Proof has already been reviewed');
    p.status = decision === 'approve' ? 'approved' : 'rejected';
    try {
      if (decision === 'approve') {
        const r = this.record(p.collection, p.recordId);
        if ((p.collection !== 'deliveries' && this.organization(r) !== org) || String(r.volunteerEmail || r.assignedToEmail || r.assignedVolunteerEmail).toLowerCase() !== p.volunteerEmail.toLowerCase()) throw new BadRequestException('Assignment changed; reject this proof and request a new submission');
        if (p.collection === 'deliveries') this.fulfillment.complete(p.recordId);
        if (p.collection === 'tasks') this.tasks.update(p.recordId, { status: 'completed' });
        if (p.collection === 'subtasks') this.subtasks.update(p.recordId, { status: 'completed', progress: 100 });
        if (p.collection === 'orders') this.orders.updateDeliveryStatus(p.recordId, 'delivered');
        if (p.collection === 'replacements') this.replacements.updateStatus(p.recordId, 'replaced');
        if (p.collection === 'resource-donations') this.resources.markCompleted(p.recordId);
        if (p.collection === 'incoming') this.incoming.resolve(p.recordId);
        if (p.collection === 'hour-logs') this.hours.approve(p.recordId);
      }
    } catch (error) { p.status = 'pending'; throw error; }
    p.reviewedAt = new Date().toISOString(); p.reviewer = email; p.rejectionReason = decision === 'reject' ? body.reason : undefined;
    return { success: true, data: { ...p }, message: decision === 'approve' ? 'Proof verified and work completed' : 'Proof rejected; volunteer can upload again' };
  }
}
