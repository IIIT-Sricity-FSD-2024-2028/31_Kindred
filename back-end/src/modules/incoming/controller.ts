import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { IncomingService } from './service';
import { CreateIncomingDto } from './dto/create-incoming.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

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

  @Get('by-beneficiary/:email')
  @Roles('beneficiary', 'admin', 'superuser')
  @ApiOperation({ summary: 'Get assistance requests submitted by a beneficiary' })
  @ApiResponse({ status: 200, description: 'Beneficiary requests retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByBeneficiary(@Param('email') email: string) {
    return { success: true, data: this.service.findByBeneficiaryEmail(email), message: 'Beneficiary requests retrieved' };
  }

  @Get('by-volunteer/:email')
  @Roles('volunteer')
  byVolunteer(@Param('email') email: string) { return { success: true, data: this.service.findAll().filter((r) => r.assignedVolunteerEmail?.toLowerCase() === email.toLowerCase()) }; }

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
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Create a new incoming request', description: 'Used by Contact Us, Emergency Help, and Feedback forms' })
  @ApiResponse({ status: 201, description: 'Incoming request created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  create(@Body() dto: CreateIncomingDto, @UploadedFile() file?: any) {
    let photoUrl = dto.photoUrl;
    if (file) {
      if (!String(file.mimetype || '').startsWith('image/')) throw new BadRequestException('Only image files are allowed');
      const ext = path.extname(file.originalname || '').replace(/[^.a-zA-Z0-9]/g, '') || '.jpg';
      const filename = `emergency-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      const uploadsDir = path.join(process.cwd(), 'uploads');
      fs.mkdirSync(uploadsDir, { recursive: true });
      fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);
      photoUrl = `http://localhost:3000/uploads/${filename}`;
    }
    return { success: true, data: this.service.create({ ...dto, photoUrl }), message: 'Incoming request created successfully' };
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

  @Patch(':id/assign-volunteer')
  @Roles('admin', 'superuser')
  assignVolunteer(@Param('id') id: string, @Body() body: { volunteerName: string; volunteerEmail: string }) { return { success: true, data: this.service.assign(id, body.volunteerName, body.volunteerEmail), message: 'Volunteer assigned to beneficiary request' }; }

  @Patch(':id/resolve')
  @Roles('admin', 'superuser', 'volunteer')
  resolve(@Param('id') id: string) { return { success: true, data: this.service.resolve(id), message: 'Beneficiary request resolved' }; }

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
