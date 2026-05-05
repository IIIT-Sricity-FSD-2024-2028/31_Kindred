import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { VolunteersService } from './service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Volunteers')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('volunteers')
@UseGuards(RolesGuard)
export class VolunteersController {
  constructor(private readonly service: VolunteersService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all volunteers' })
  @ApiResponse({ status: 200, description: 'Volunteers retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Volunteers retrieved successfully' };
  }

  @Get('by-email/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get volunteer by email' })
  @ApiResponse({ status: 200, description: 'Volunteer retrieved' })
  @ApiResponse({ status: 404, description: 'Volunteer not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByEmail(@Param('email') email: string) {
    const vol = this.service.findByEmail(email);
    if (!vol) return { success: false, data: null, message: 'Volunteer not found' };
    return { success: true, data: vol, message: 'Volunteer retrieved successfully' };
  }

  @Get('by-org/:org')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get volunteers by organization' })
  @ApiResponse({ status: 200, description: 'Volunteers retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByOrg(@Param('org') org: string) {
    return { success: true, data: this.service.findByOrg(org), message: 'Volunteers retrieved' };
  }

  @Get(':id')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get volunteer by ID' })
  @ApiResponse({ status: 200, description: 'Volunteer retrieved' })
  @ApiResponse({ status: 404, description: 'Volunteer not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Volunteer retrieved successfully' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new volunteer' })
  @ApiResponse({ status: 201, description: 'Volunteer created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  create(@Body() dto: CreateVolunteerDto) {
    return { success: true, data: this.service.create(dto), message: 'Volunteer created successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update a volunteer' })
  @ApiResponse({ status: 200, description: 'Volunteer updated' })
  @ApiResponse({ status: 404, description: 'Volunteer not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateVolunteerDto) {
    return { success: true, data: this.service.update(id, dto), message: 'Volunteer updated successfully' };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete a volunteer' })
  @ApiResponse({ status: 200, description: 'Volunteer deleted' })
  @ApiResponse({ status: 404, description: 'Volunteer not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Volunteer deleted successfully' };
  }
}
