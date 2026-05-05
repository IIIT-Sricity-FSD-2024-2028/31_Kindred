import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { HourLogsService } from './service';
import { CreateHourLogDto } from './dto/create-hour-log.dto';
import { UpdateHourLogDto } from './dto/update-hour-log.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Hour Logs')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('hour-logs')
@UseGuards(RolesGuard)
export class HourLogsController {
  constructor(private readonly service: HourLogsService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all hour logs' })
  @ApiResponse({ status: 200, description: 'Hour logs retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Hour logs retrieved' };
  }

  @Get('pending')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get pending hour logs awaiting approval' })
  @ApiResponse({ status: 200, description: 'Pending hour logs retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getPending() {
    return { success: true, data: this.service.getPending(), message: 'Pending hour logs retrieved' };
  }

  @Get('by-volunteer/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get hour logs by volunteer email' })
  @ApiResponse({ status: 200, description: 'Hour logs retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByVolunteer(@Param('email') email: string) {
    return { success: true, data: this.service.findByVolunteer(email), message: 'Hour logs retrieved' };
  }

  @Get(':id')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get hour log by ID' })
  @ApiResponse({ status: 200, description: 'Hour log retrieved' })
  @ApiResponse({ status: 404, description: 'Hour log not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Hour log retrieved' };
  }

  @Post()
  @Roles('volunteer', 'admin', 'superuser')
  @ApiOperation({ summary: 'Submit a new hour log', description: 'Volunteer submits hours for approval' })
  @ApiResponse({ status: 201, description: 'Hour log submitted successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  create(@Body() dto: CreateHourLogDto) {
    return { success: true, data: this.service.create(dto), message: 'Hour log submitted successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update an hour log' })
  @ApiResponse({ status: 200, description: 'Hour log updated' })
  @ApiResponse({ status: 404, description: 'Hour log not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateHourLogDto) {
    return { success: true, data: this.service.update(id, dto), message: 'Hour log updated' };
  }

  @Patch(':id/approve')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Approve an hour log' })
  @ApiResponse({ status: 200, description: 'Hour log approved' })
  @ApiResponse({ status: 404, description: 'Hour log not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  approve(@Param('id') id: string) {
    return { success: true, data: this.service.approve(id), message: 'Hour log approved' };
  }

  @Patch(':id/reject')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Reject an hour log' })
  @ApiResponse({ status: 200, description: 'Hour log rejected' })
  @ApiResponse({ status: 404, description: 'Hour log not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  reject(@Param('id') id: string) {
    return { success: true, data: this.service.reject(id), message: 'Hour log rejected' };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete an hour log' })
  @ApiResponse({ status: 200, description: 'Hour log deleted' })
  @ApiResponse({ status: 404, description: 'Hour log not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Hour log deleted' };
  }
}
