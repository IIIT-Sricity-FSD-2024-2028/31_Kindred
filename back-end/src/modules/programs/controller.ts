import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ProgramsService } from './service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Programs')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('programs')
@UseGuards(RolesGuard)
export class ProgramsController {
  constructor(private readonly service: ProgramsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all programs', description: 'Public — returns all active programs' })
  @ApiResponse({ status: 200, description: 'Programs retrieved successfully' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Programs retrieved successfully' };
  }

  @Get('by-org/:org')
  @ApiOperation({ summary: 'Get programs by organization name' })
  @ApiResponse({ status: 200, description: 'Programs retrieved' })
  findByOrg(@Param('org') org: string) {
    return { success: true, data: this.service.findByOrg(org), message: 'Programs retrieved' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get program by ID' })
  @ApiResponse({ status: 200, description: 'Program retrieved' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Program retrieved successfully' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new program', description: 'Org admins and superusers can create programs' })
  @ApiResponse({ status: 201, description: 'Program created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  create(@Body() dto: CreateProgramDto) {
    return { success: true, data: this.service.create(dto), message: 'Program created successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update a program' })
  @ApiResponse({ status: 200, description: 'Program updated' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
    return { success: true, data: this.service.update(id, dto), message: 'Program updated successfully' };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete a program' })
  @ApiResponse({ status: 200, description: 'Program deleted' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Program deleted successfully' };
  }
}
