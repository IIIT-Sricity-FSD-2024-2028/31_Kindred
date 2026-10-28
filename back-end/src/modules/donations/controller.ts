import { Body, Controller, ForbiddenException, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateDonationDto } from './dto/create-donation.dto';
import { DonationsService } from './service';
@Controller('donations')
@UseGuards(RolesGuard)
export class DonationsController {
  constructor(private readonly service: DonationsService) {}
  private ownOrg(id: string, role: string, org: string) { const d = this.service.findById(id); if (role !== 'admin' || !org || d.org !== org) throw new ForbiddenException('Only the recipient organization admin can review this donation'); }
  @Post()
  @Roles('donor','beneficiary','seller','volunteer','admin','superuser')
  create(@Body() dto: CreateDonationDto, @Headers('user-email') email: string) { if (!email || email.toLowerCase() !== dto.email.toLowerCase()) throw new ForbiddenException('Submit donations using your signed-in email'); return { success: true, data: this.service.create(dto), message: 'Demo card donation recorded; no money was transferred' }; }
  @Get('public/organizations')
  publicTotals() { return { success: true, data: this.service.publicTotals() }; }
  @Get() @Roles('superuser')
  all() { return { success: true, data: this.service.findAll() }; }
  @Get('by-donor/:email') @Roles('donor','beneficiary','seller','volunteer','admin','superuser')
  byDonor(@Param('email') target: string, @Headers('user-email') email: string, @Headers('role') role: string) { if (role !== 'superuser' && target.toLowerCase() !== String(email).toLowerCase()) throw new ForbiddenException('Read only your own donation history'); return { success: true, data: this.service.findByDonor(target) }; }
  @Get('by-org/:org') @Roles('admin','superuser')
  byOrg(@Param('org') target: string, @Headers('organization') org: string, @Headers('role') role: string) { if (role !== 'superuser' && target !== org) throw new ForbiddenException('Read only your own organization donations'); return { success: true, data: this.service.findByOrg(target) }; }
  @Get('balance/:org') @Roles('admin','superuser')
  balance(@Param('org') target: string, @Headers('organization') org: string, @Headers('role') role: string) { if (role !== 'superuser' && target !== org) throw new ForbiddenException('Read only your organization balance'); return { success: true, data: this.service.balance(target) }; }
  @Get('today-total') @Roles('superuser')
  today() { return { success: true, data: this.service.todayTotal() }; }
  @Patch(':id/issue-certificate') @Roles('admin')
  certificate(@Param('id') id: string, @Headers('role') role: string, @Headers('organization') org: string) { this.ownOrg(id,role,org); return { success: true, data: this.service.issueCertificate(id) }; }
}
