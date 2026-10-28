import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Headers, ForbiddenException, UseGuards, UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OrganizationsService } from './service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ListingRequestDto } from './dto/listing-request.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

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
    return { success: true, data: this.service.findPublic(), message: 'Organizations retrieved successfully' };
  }

  @Get('manage')
  @Roles('admin', 'superuser')
  manage(@Headers('role') role: string, @Headers('organization') org: string) {
    const records = this.service.findAll();
    return { success: true, data: role === 'superuser' ? records : records.filter((record) => record.name === org) };
  }

  @Patch(':id/request-listing')
  @Roles('admin')
  requestListing(@Param('id') id: string, @Body() dto: ListingRequestDto, @Headers('organization') org: string) {
    if (!org || this.service.findById(id).name !== org) throw new ForbiddenException('You can only submit your own organization.');
    return { success: true, data: this.service.requestListing(id, dto), message: 'Listing submitted for platform approval' };
  }

  @Patch(':id/approve-listing')
  @Roles('superuser')
  approveListing(@Param('id') id: string) {
    return { success: true, data: this.service.reviewListing(id, true), message: 'Public listing approved' };
  }

  @Patch(':id/reject-listing')
  @Roles('superuser')
  rejectListing(@Param('id') id: string) {
    return { success: true, data: this.service.reviewListing(id, false), message: 'Public listing rejected' };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search organizations by name, city, or focus' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query string' })
  @ApiResponse({ status: 200, description: 'Search completed' })
  search(@Query('q') q: string) {
    return { success: true, data: this.service.findPublic().filter((org) => !q || [org.name, org.city, org.focus].join(' ').toLowerCase().includes(q.toLowerCase())), message: 'Search completed' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization retrieved' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findOne(@Param('id') id: string) {
    const org = this.service.findPublic().find((item) => item.id === id);
    if (!org) throw new BadRequestException('Organization is not publicly listed.');
    return { success: true, data: org, message: 'Organization retrieved successfully' };
  }

  @Post('register')
  @ApiOperation({ summary: 'Public organization registration; starts pending for platform approval' })
  register(@Body() dto: CreateOrganizationDto) { return { success: true, data: this.service.create({ ...dto, status: 'pending' }), message: 'Organization submitted for approval' }; }

  @Post('upload-certificate')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Upload an organization registration certificate before public registration' })
  uploadCertificate(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Please attach a certificate using field name "file"');
    const allowedTypes = new Set(['application/pdf', 'image/png', 'image/jpeg']);
    if (!allowedTypes.has(String(file.mimetype || '').toLowerCase())) {
      throw new BadRequestException('Only PDF, PNG, and JPG certificate files are allowed');
    }
    const fallbackExt = file.mimetype === 'application/pdf' ? '.pdf' : file.mimetype === 'image/png' ? '.png' : '.jpg';
    const ext = path.extname(file.originalname || '').replace(/[^.a-zA-Z0-9]/g, '') || fallbackExt;
    const filename = `organization-certificate-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    const uploadsDir = path.join(process.cwd(), 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);
    return {
      success: true,
      data: { url: `http://localhost:3000/uploads/${filename}`, filename, originalName: file.originalname },
      message: 'Organization certificate uploaded successfully',
    };
  }

  @Patch(':id/approve')
  @Roles('superuser')
  approve(@Param('id') id: string) { return { success: true, data: this.service.update(id, { status: 'active' }), message: 'Organization approved' }; }

  @Patch(':id/reject')
  @Roles('superuser')
  reject(@Param('id') id: string) { return { success: true, data: this.service.update(id, { status: 'suspended' }), message: 'Organization rejected' }; }

  @Post('upload-image')
  @Roles('admin', 'superuser')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 4 * 1024 * 1024 } }))
  uploadImage(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Please attach an image file using field name "file"');
    if (!String(file.mimetype || '').startsWith('image/')) throw new BadRequestException('Only image files are allowed');
    const ext = path.extname(file.originalname || '').replace(/[^.a-zA-Z0-9]/g, '') || '.jpg';
    const filename = `organization-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    const uploadsDir = path.join(process.cwd(), 'uploads'); fs.mkdirSync(uploadsDir, { recursive: true }); fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);
    return { success: true, data: { url: `http://localhost:3000/uploads/${filename}`, filename }, message: 'Organization image uploaded successfully' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new organization', description: 'Register a new NGO on the platform' })
  @ApiResponse({ status: 201, description: 'Organization created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  create(@Body() dto: CreateOrganizationDto, @Headers('role') role: string) {
    return { success: true, data: this.service.create(role === 'admin' ? { ...dto, status: 'pending' } : dto), message: 'Organization created successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({ status: 200, description: 'Organization updated' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto, @Headers('role') role: string, @Headers('organization') org: string) {
    if (role === 'admin' && (!org || this.service.findById(id).name !== org || (dto.name !== undefined && dto.name !== org) || dto.status !== undefined)) throw new ForbiddenException('You can only edit your own organization profile; platform approval is required for status changes.');
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
