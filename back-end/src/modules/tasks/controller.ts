import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Tasks')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('tasks')
@UseGuards(RolesGuard)
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Tasks retrieved successfully' };
  }

  @Get('by-volunteer/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get tasks assigned to a volunteer' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByVolunteer(@Param('email') email: string) {
    return { success: true, data: this.service.findByVolunteer(email), message: 'Tasks retrieved' };
  }

  @Get(':id')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Task retrieved successfully' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new task', description: 'Assign a task to a volunteer' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  create(@Body() dto: CreateTaskDto) {
    return { success: true, data: this.service.create(dto), message: 'Task created successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Update a task', description: 'Update task details or mark as completed' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return { success: true, data: this.service.update(id, dto), message: 'Task updated successfully' };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Task deleted successfully' };
  }
}
