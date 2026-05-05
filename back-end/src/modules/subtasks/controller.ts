import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { SubtasksService } from './service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Subtasks')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('subtasks')
@UseGuards(RolesGuard)
export class SubtasksController {
  constructor(private readonly service: SubtasksService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all subtasks' })
  @ApiResponse({ status: 200, description: 'Subtasks retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Subtasks retrieved' };
  }

  @Get('by-program/:programId')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get subtasks for a program' })
  @ApiResponse({ status: 200, description: 'Subtasks retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByProgram(@Param('programId') programId: string) {
    return { success: true, data: this.service.findByProgram(programId), message: 'Subtasks retrieved' };
  }

  @Get('by-volunteer/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get subtasks assigned to a volunteer' })
  @ApiResponse({ status: 200, description: 'Subtasks retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByVolunteer(@Param('email') email: string) {
    return { success: true, data: this.service.findByVolunteer(email), message: 'Subtasks retrieved' };
  }

  @Get('by-program-and-volunteer/:programId/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get subtasks by program and volunteer' })
  @ApiResponse({ status: 200, description: 'Subtasks retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByProgramAndVolunteer(@Param('programId') programId: string, @Param('email') email: string) {
    return { success: true, data: this.service.findByProgramAndVolunteer(programId, email), message: 'Subtasks retrieved' };
  }

  @Get('program-progress/:programId')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get overall program progress percentage' })
  @ApiResponse({ status: 200, description: 'Progress calculated' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getProgramProgress(@Param('programId') programId: string) {
    return { success: true, data: this.service.getProgramProgress(programId), message: 'Progress calculated' };
  }

  @Get(':id')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get subtask by ID' })
  @ApiResponse({ status: 200, description: 'Subtask retrieved' })
  @ApiResponse({ status: 404, description: 'Subtask not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Subtask retrieved' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new subtask', description: 'Assign a subtask within a program' })
  @ApiResponse({ status: 201, description: 'Subtask created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  create(@Body() dto: CreateSubtaskDto) {
    return { success: true, data: this.service.create(dto), message: 'Subtask created successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Update a subtask', description: 'Update subtask details or mark as completed' })
  @ApiResponse({ status: 200, description: 'Subtask updated' })
  @ApiResponse({ status: 404, description: 'Subtask not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateSubtaskDto) {
    return { success: true, data: this.service.update(id, dto), message: 'Subtask updated' };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete a subtask' })
  @ApiResponse({ status: 200, description: 'Subtask deleted' })
  @ApiResponse({ status: 404, description: 'Subtask not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Subtask deleted' };
  }
}
