import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OrganizationsService } from './service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Organizations')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('organizations')
@UseGuards(RolesGuard)
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all organizations', description: 'Public endpoint — returns all registered NGOs' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved successfully' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Organizations retrieved successfully' };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search organizations by name, city, or focus' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query string' })
  @ApiResponse({ status: 200, description: 'Search completed' })
  search(@Query('q') q: string) {
    return { success: true, data: this.service.search(q), message: 'Search completed' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization retrieved' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Organization retrieved successfully' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new organization', description: 'Register a new NGO on the platform' })
  @ApiResponse({ status: 201, description: 'Organization created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  create(@Body() dto: CreateOrganizationDto) {
    return { success: true, data: this.service.create(dto), message: 'Organization created successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({ status: 200, description: 'Organization updated' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return { success: true, data: this.service.update(id, dto), message: 'Organization updated successfully' };
  }

  @Delete(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 403, description: 'Access denied — requires superuser role' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Organization deleted successfully' };
  }
}
