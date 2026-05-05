import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ResourceDonationsService } from './service';
import { CreateResourceDonationDto } from './dto/create-resource-donation.dto';
import { UpdateResourceDonationDto } from './dto/update-resource-donation.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Resource Donations')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('resource-donations')
@UseGuards(RolesGuard)
export class ResourceDonationsController {
  constructor(private readonly service: ResourceDonationsService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all resource donations' })
  @ApiResponse({ status: 200, description: 'Resource donations retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Resource donations retrieved' };
  }

  @Get('pending')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get pending (submitted) donations' })
  @ApiResponse({ status: 200, description: 'Pending donations retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getPending() {
    return { success: true, data: this.service.getPending(), message: 'Pending donations retrieved' };
  }

  @Get('active-pickups')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get active pickups assigned to volunteers' })
  @ApiResponse({ status: 200, description: 'Active pickups retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getActivePickups() {
    return { success: true, data: this.service.getActivePickups(), message: 'Active pickups retrieved' };
  }

  @Get('by-donor/:email')
  @Roles('admin', 'superuser', 'donor')
  @ApiOperation({ summary: 'Get donations by donor email' })
  @ApiResponse({ status: 200, description: 'Donations retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByDonor(@Param('email') email: string) {
    return { success: true, data: this.service.findByDonor(email), message: 'Donations retrieved' };
  }

  @Get('by-volunteer/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get donations assigned to volunteer for pickup' })
  @ApiResponse({ status: 200, description: 'Donations retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByVolunteer(@Param('email') email: string) {
    return { success: true, data: this.service.findByVolunteer(email), message: 'Donations retrieved' };
  }

  @Get('by-program/:programId')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get donations allocated to a program' })
  @ApiResponse({ status: 200, description: 'Donations retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByProgram(@Param('programId') programId: string) {
    return { success: true, data: this.service.findByProgram(programId), message: 'Donations retrieved' };
  }

  @Get('by-status/:status')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get donations by status' })
  @ApiResponse({ status: 200, description: 'Donations retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByStatus(@Param('status') status: string) {
    return { success: true, data: this.service.findByStatus(status), message: 'Donations retrieved' };
  }

  @Get(':id')
  @Roles('admin', 'superuser', 'donor', 'volunteer')
  @ApiOperation({ summary: 'Get resource donation by ID' })
  @ApiResponse({ status: 200, description: 'Donation retrieved' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Donation retrieved' };
  }

  @Post()
  @Roles('donor', 'admin', 'superuser')
  @ApiOperation({ summary: 'Create a new resource donation', description: 'Donor submits a resource donation with pickup details' })
  @ApiResponse({ status: 201, description: 'Resource donation submitted successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied — requires donor, admin, or superuser role' })
  create(@Body() dto: CreateResourceDonationDto) {
    return { success: true, data: this.service.create(dto), message: 'Resource donation submitted successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update a resource donation' })
  @ApiResponse({ status: 200, description: 'Donation updated' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateResourceDonationDto) {
    return { success: true, data: this.service.update(id, dto), message: 'Donation updated' };
  }

  @Patch(':id/assign-volunteer')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Assign a volunteer for pickup' })
  @ApiResponse({ status: 200, description: 'Volunteer assigned for pickup' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  assignVolunteer(@Param('id') id: string, @Body() body: { volunteerName: string; volunteerEmail: string }) {
    return { success: true, data: this.service.assignVolunteer(id, body.volunteerName, body.volunteerEmail), message: 'Volunteer assigned for pickup' };
  }

  @Patch(':id/start-pickup')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Start pickup process' })
  @ApiResponse({ status: 200, description: 'Pickup started' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  startPickup(@Param('id') id: string) {
    return { success: true, data: this.service.startPickup(id), message: 'Pickup started' };
  }

  @Patch(':id/mark-delivered')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Mark donation as delivered' })
  @ApiResponse({ status: 200, description: 'Marked as delivered' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  markDelivered(@Param('id') id: string) {
    return { success: true, data: this.service.markDelivered(id), message: 'Marked as delivered' };
  }

  @Patch(':id/mark-completed')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Mark donation as completed' })
  @ApiResponse({ status: 200, description: 'Marked as completed' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  markCompleted(@Param('id') id: string) {
    return { success: true, data: this.service.markCompleted(id), message: 'Marked as completed' };
  }

  @Patch(':id/allocate-program')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Allocate donation to a program' })
  @ApiResponse({ status: 200, description: 'Allocated to program' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  allocateToProgram(@Param('id') id: string, @Body() body: { programId: string; programName: string }) {
    return { success: true, data: this.service.allocateToProgram(id, body.programId, body.programName), message: 'Allocated to program' };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete a resource donation' })
  @ApiResponse({ status: 200, description: 'Donation deleted' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Donation deleted' };
  }
}
