import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { VolunteerRequestsService } from './service';
import { CreateVolunteerRequestDto } from './dto/create-volunteer-request.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Volunteer Requests')
@ApiHeader({ name: 'role', required: false })
@Controller('volunteer-requests')
@UseGuards(RolesGuard)
export class VolunteerRequestsController {
  constructor(private readonly service: VolunteerRequestsService) {}

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new volunteer request (Org Admin)' })
  create(@Body() dto: CreateVolunteerRequestDto) {
    return { success: true, data: this.service.create(dto), message: 'Volunteer request created' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all volunteer requests' })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) {
    const data = status ? this.service.findByStatus(status) : this.service.findAll();
    return { success: true, data, message: 'Volunteer requests retrieved' };
  }

  @Get('by-org/:orgId')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get requests by organization' })
  findByOrg(@Param('orgId') orgId: string) {
    return { success: true, data: this.service.findByOrg(orgId), message: 'Organization requests retrieved' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a volunteer request by ID' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Request retrieved' };
  }

  @Patch(':id/status')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update request status (open, filled, closed, cancelled)' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return { success: true, data: this.service.updateStatus(id, status), message: 'Status updated' };
  }

  @Patch(':id/respond')
  @Roles('volunteer', 'superuser')
  @ApiOperation({ summary: 'Volunteer accepts or rejects a request' })
  respond(@Param('id') id: string, @Body() body: { email: string; name: string; action: 'accepted' | 'rejected' }) {
    return { success: true, data: this.service.respond(id, body.email, body.name, body.action), message: `Successfully ${body.action} the request` };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete a request' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Request deleted' };
  }
}
