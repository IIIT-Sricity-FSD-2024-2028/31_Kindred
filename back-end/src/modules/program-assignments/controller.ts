import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ProgramAssignmentsService } from './service';
import { CreateProgramAssignmentDto } from './dto/create-program-assignment.dto';
import { UpdateProgramAssignmentDto } from './dto/update-program-assignment.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Program Assignments')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('program-assignments')
@UseGuards(RolesGuard)
export class ProgramAssignmentsController {
  constructor(private readonly service: ProgramAssignmentsService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all program assignments' })
  @ApiResponse({ status: 200, description: 'Assignments retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Assignments retrieved' };
  }

  @Get('by-program/:programId')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get assignments by program ID' })
  @ApiResponse({ status: 200, description: 'Assignments retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByProgram(@Param('programId') programId: string) {
    return { success: true, data: this.service.findByProgram(programId), message: 'Assignments retrieved' };
  }

  @Get('by-volunteer/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get assignments by volunteer email' })
  @ApiResponse({ status: 200, description: 'Assignments retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByVolunteer(@Param('email') email: string) {
    return { success: true, data: this.service.findByVolunteer(email), message: 'Assignments retrieved' };
  }

  @Get(':id')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment retrieved' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Assignment retrieved' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a program assignment', description: 'Assign a volunteer to a program' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  create(@Body() dto: CreateProgramAssignmentDto) {
    return { success: true, data: this.service.create(dto), message: 'Assignment created successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update a program assignment' })
  @ApiResponse({ status: 200, description: 'Assignment updated' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateProgramAssignmentDto) {
    return { success: true, data: this.service.update(id, dto), message: 'Assignment updated' };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete a program assignment' })
  @ApiResponse({ status: 200, description: 'Assignment deleted' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Assignment deleted' };
  }
}
