import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateDonationDto } from './dto/create-donation.dto';
import { DonationsService } from './service';

@ApiTags('Monetary Donations')
@ApiHeader({ name: 'role', required: false })
@Controller('donations')
@UseGuards(RolesGuard)
export class DonationsController {
  constructor(private readonly service: DonationsService) {}

  @Post()
  @ApiOperation({ summary: 'Record a successful donation payment' })
  create(@Body() dto: CreateDonationDto) {
    return { success: true, data: this.service.create(dto), message: 'Donation recorded successfully' };
  }

  @Get()
  @Roles('superuser')
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Donations retrieved' };
  }

  @Get('by-org/:org')
  @Roles('admin', 'superuser')
  byOrg(@Param('org') org: string) { return { success: true, data: this.service.findByOrg(org), message: 'Organization donations retrieved' }; }

  @Get('today-total')
  @Roles('superuser')
  todayTotal() {
    return { success: true, data: this.service.todayTotal(), message: "Today's donation total retrieved" };
  }
}
