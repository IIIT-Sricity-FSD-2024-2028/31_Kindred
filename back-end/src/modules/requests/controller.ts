import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { RequestsService } from './service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Requests')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('requests')
@UseGuards(RolesGuard)
export class RequestsController {
  constructor(private readonly service: RequestsService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all platform requests', description: 'Returns all org registration, budget increase, and other requests' })
  @ApiResponse({ status: 200, description: 'Requests retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Requests retrieved successfully' };
  }

  @Get('pending')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get pending requests' })
  @ApiResponse({ status: 200, description: 'Pending requests retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getPending() {
    return { success: true, data: this.service.getPending(), message: 'Pending requests retrieved' };
  }

  @Get(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get request by ID' })
  @ApiResponse({ status: 200, description: 'Request retrieved' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Request retrieved successfully' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new platform request' })
  @ApiResponse({ status: 201, description: 'Request created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  create(@Body() dto: CreateRequestDto) {
    return { success: true, data: this.service.create(dto), message: 'Request created successfully' };
  }

  @Patch(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Update a request' })
  @ApiResponse({ status: 200, description: 'Request updated' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 403, description: 'Access denied — requires superuser role' })
  update(@Param('id') id: string, @Body() dto: UpdateRequestDto) {
    return { success: true, data: this.service.update(id, dto), message: 'Request updated successfully' };
  }

  @Patch(':id/approve')
  @Roles('superuser')
  @ApiOperation({ summary: 'Approve a request' })
  @ApiResponse({ status: 200, description: 'Request approved' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 403, description: 'Access denied — requires superuser role' })
  approve(@Param('id') id: string) {
    return { success: true, data: this.service.approve(id), message: 'Request approved successfully' };
  }

  @Patch(':id/reject')
  @Roles('superuser')
  @ApiOperation({ summary: 'Reject a request' })
  @ApiResponse({ status: 200, description: 'Request rejected' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 403, description: 'Access denied — requires superuser role' })
  reject(@Param('id') id: string) {
    return { success: true, data: this.service.reject(id), message: 'Request rejected' };
  }

  @Delete(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Delete a request' })
  @ApiResponse({ status: 200, description: 'Request deleted' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 403, description: 'Access denied — requires superuser role' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Request deleted successfully' };
  }
}
