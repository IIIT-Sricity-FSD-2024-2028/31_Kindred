import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Headers, ForbiddenException, UploadedFile, UseInterceptors, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImage } from '../../common/utils/image-upload';
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
    return { success: true, data: this.service.findPublic(), message: 'Programs retrieved successfully' };
  }

  @Get('manage')
  @Roles('admin', 'superuser')
  manage(@Headers('role') role: string, @Headers('organization') org: string) { return { success: true, data: role === 'superuser' ? this.service.findAll() : this.service.findByOrg(org) }; }

  @Post('upload-image')
  @Roles('admin', 'superuser')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  uploadImage(@UploadedFile() file: any) { return { success: true, data: { url: saveImage(file, 'program') } }; }

  @Patch(':id/approve-listing')
  @Roles('superuser')
  approveListing(@Param('id') id: string) { return { success: true, data: this.service.reviewListing(id, true) }; }
  @Patch(':id/reject-listing')
  @Roles('superuser')
  rejectListing(@Param('id') id: string) { return { success: true, data: this.service.reviewListing(id, false) }; }

  @Get('by-org/:org')
  @ApiOperation({ summary: 'Get programs by organization name' })
  @ApiResponse({ status: 200, description: 'Programs retrieved' })
  findByOrg(@Param('org') org: string) {
    return { success: true, data: this.service.findPublic().filter((p) => p.org === org), message: 'Programs retrieved' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get program by ID' })
  @ApiResponse({ status: 200, description: 'Program retrieved' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  findOne(@Param('id') id: string) {
    const p = this.service.findPublic().find((program) => program.id === id);
    if (!p) throw new ForbiddenException('Program is not publicly listed');
    return { success: true, data: p, message: 'Program retrieved successfully' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new program', description: 'Org admins and superusers can create programs' })
  @ApiResponse({ status: 201, description: 'Program created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  create(@Body() dto: CreateProgramDto, @Headers('role') role: string, @Headers('organization') org: string) {
    if (role === 'admin' && (!org || dto.org !== org)) throw new ForbiddenException('Create programs for your own organization');
    return { success: true, data: this.service.create(dto), message: 'Program created successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update a program' })
  @ApiResponse({ status: 200, description: 'Program updated' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateProgramDto, @Headers('role') role: string, @Headers('organization') org: string) {
    if (role === 'admin' && (!org || this.service.findById(id).org !== org || (dto.org && dto.org !== org))) throw new ForbiddenException('Edit only your own organization programs');
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
