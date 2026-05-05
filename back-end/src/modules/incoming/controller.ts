import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { IncomingService } from './service';
import { CreateIncomingDto } from './dto/create-incoming.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Incoming Requests')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('incoming')
@UseGuards(RolesGuard)
export class IncomingController {
  constructor(private readonly service: IncomingService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all incoming requests', description: 'Returns all submissions — emergency requests, contact forms, and feedback' })
  @ApiResponse({ status: 200, description: 'Incoming requests retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Incoming requests retrieved' };
  }

  @Get('pending')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get pending incoming requests' })
  @ApiResponse({ status: 200, description: 'Pending requests retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getPending() {
    return { success: true, data: this.service.getPending(), message: 'Pending requests retrieved' };
  }

  @Get(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get incoming request by ID' })
  @ApiResponse({ status: 200, description: 'Incoming request retrieved' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Incoming request retrieved' };
  }

  @Post()
  @Roles('beneficiary', 'admin', 'superuser')
  @ApiOperation({ summary: 'Create a new incoming request', description: 'Used by Contact Us, Emergency Help, and Feedback forms' })
  @ApiResponse({ status: 201, description: 'Incoming request created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  create(@Body() dto: CreateIncomingDto) {
    return { success: true, data: this.service.create(dto), message: 'Incoming request created successfully' };
  }

  @Patch(':id/accept')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Accept an incoming request' })
  @ApiResponse({ status: 200, description: 'Request accepted' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  accept(@Param('id') id: string) {
    return { success: true, data: this.service.accept(id), message: 'Request accepted' };
  }

  @Patch(':id/decline')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Decline an incoming request' })
  @ApiResponse({ status: 200, description: 'Request declined' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  decline(@Param('id') id: string) {
    return { success: true, data: this.service.decline(id), message: 'Request declined' };
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Delete an incoming request' })
  @ApiResponse({ status: 200, description: 'Request deleted' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(@Param('id') id: string) {
    this.service.delete(id);
    return { success: true, data: null, message: 'Incoming request deleted' };
  }
}
