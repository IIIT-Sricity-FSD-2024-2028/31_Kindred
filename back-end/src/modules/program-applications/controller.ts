import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ProgramApplicationsService } from './service';
import { CreateProgramApplicationDto } from './dto/create-program-application.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Program Applications')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('program-applications')
@UseGuards(RolesGuard)
export class ProgramApplicationsController {
  constructor(private readonly service: ProgramApplicationsService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all program applications' })
  @ApiResponse({ status: 200, description: 'Applications retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Applications retrieved' };
  }

  @Get('pending')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get pending applications awaiting review' })
  @ApiResponse({ status: 200, description: 'Pending applications retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getPending() {
    return { success: true, data: this.service.getPending(), message: 'Pending applications retrieved' };
  }

  @Get('by-program/:programId')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get applications for a specific program' })
  @ApiResponse({ status: 200, description: 'Applications retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByProgram(@Param('programId') programId: string) {
    return { success: true, data: this.service.findByProgram(programId), message: 'Applications retrieved' };
  }

  @Get('by-volunteer/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get applications submitted by a volunteer' })
  @ApiResponse({ status: 200, description: 'Applications retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByVolunteer(@Param('email') email: string) {
    return { success: true, data: this.service.findByVolunteer(email), message: 'Applications retrieved' };
  }

  @Get('has-applied/:programId/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Check if volunteer has already applied to a program' })
  @ApiResponse({ status: 200, description: 'Check completed — returns true/false' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  hasApplied(@Param('programId') programId: string, @Param('email') email: string) {
    return { success: true, data: this.service.hasApplied(programId, email), message: 'Check completed' };
  }

  @Get(':id')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, description: 'Application retrieved' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Application retrieved' };
  }

  @Post()
  @Roles('volunteer', 'admin', 'superuser')
  @ApiOperation({ summary: 'Submit a program application', description: 'Volunteer applies to join a program' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied — requires volunteer, admin, or superuser role' })
  create(@Body() dto: CreateProgramApplicationDto) {
    return { success: true, data: this.service.create(dto), message: 'Application submitted successfully' };
  }

  @Patch(':id/approve')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Approve a program application' })
  @ApiResponse({ status: 200, description: 'Application approved' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  approve(@Param('id') id: string) {
    return { success: true, data: this.service.approve(id), message: 'Application approved' };
  }

  @Patch(':id/reject')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Reject a program application' })
  @ApiResponse({ status: 200, description: 'Application rejected' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  reject(@Param('id') id: string) {
    return { success: true, data: this.service.reject(id), message: 'Application rejected' };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete a program application' })
  @ApiResponse({ status: 200, description: 'Application deleted' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Application deleted' };
  }
}
