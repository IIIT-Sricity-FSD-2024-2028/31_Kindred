import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Headers, ForbiddenException, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../users/service';
import { reviewProfile } from '../../common/review-profile';
import { VolunteersService } from './service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';
import { UpdateVolunteerProfileDto } from './dto/update-profile.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Volunteers')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('volunteers')
@UseGuards(RolesGuard)
export class VolunteersController {
  constructor(private readonly service: VolunteersService, private readonly users: UsersService) {}

  private ensureMyVolunteer(email: string) {
    const user = this.users.findByEmail(email || '');
    if (!user || user.role !== 'volunteer' || user.status !== 'approved') throw new ForbiddenException('An approved volunteer account is required');
    const existing = this.service.findByEmail(email);
    if (existing) return existing;
    const volunteer = this.service.create({name:user.name,email:user.email,phone:user.phone || '',skills:user.skills || [],org:user.org || '',role:'Volunteer'});
    if (user.availabilityDays) this.service.updatePresence(email,{availabilityDays:user.availabilityDays});
    return volunteer;
  }

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all volunteers' })
  @ApiResponse({ status: 200, description: 'Volunteers retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Volunteers retrieved successfully' };
  }

  @Get('me/profile')
  @Roles('volunteer')
  myProfile(@Headers('user-email') email: string) {
    const user = this.users.findByEmail(email || '');
    if (!user || user.role !== 'volunteer') throw new ForbiddenException('A volunteer account is required');
    return { success: true, data: { ...reviewProfile(user, this.service.findByEmail(email)), id: user.id, name:user.name, phone:user.phone, skills:user.skills, role:user.role, status:user.status, dateOfBirth:user.dateOfBirth } };
  }

  @Patch('me/profile')
  @Roles('volunteer')
  saveMyProfile(@Headers('user-email') email: string, @Body() dto: UpdateVolunteerProfileDto) {
    const user = this.users.updateVolunteerProfile(email || '', dto);
    const volunteer = this.ensureMyVolunteer(email);
    this.service.update(volunteer.id, { name:user.name, phone:user.phone, skills:user.skills });
    return this.myProfile(email);
  }

  @Get('review/:email')
  @Roles('admin', 'superuser')
  review(@Param('email') email: string) {
    const volunteer = this.service.findByEmail(email);
    const user = this.users.findByEmail(email);
    if (!volunteer && (!user || !['volunteer','donor','beneficiary','seller'].includes(user.role))) throw new ForbiddenException('Volunteer profile is unavailable');
    return { success: true, data: reviewProfile(user, volunteer) };
  }

  @Get('by-email/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get volunteer by email' })
  @ApiResponse({ status: 200, description: 'Volunteer retrieved' })
  @ApiResponse({ status: 404, description: 'Volunteer not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findByEmail(@Param('email') email: string) {
    const vol = this.service.findByEmail(email);
    if (!vol) {
      const user = this.users.findByEmail(email);
      if (user?.role === 'volunteer' && user.status === 'approved') return {success:true,data:{...reviewProfile(user),id:user.id,status:'active',role:'Volunteer',org:user.org || ''},message:'Volunteer profile retrieved'};
    }
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

  @Patch('me/presence')
  @Roles('volunteer')
  @ApiOperation({ summary: 'Update your current availability and location' })
  updatePresence(@Headers('user-email') email: string, @Body() dto: UpdatePresenceDto) {
    if (!email) throw new ForbiddenException('Your signed-in email is required');
    this.ensureMyVolunteer(email);
    return { success: true, data: this.service.updatePresence(email, dto), message: 'Availability updated' };
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
