import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Users')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC (superuser, admin, volunteer, donor, beneficiary)', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary'] })
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all users', description: 'Returns the complete list of registered users. Requires admin or superuser role.' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  findAll() {
    return { success: true, data: this.usersService.findAll(), message: 'Users retrieved successfully' };
  }

  @Get('search')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Search users by name, email, or role' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query string' })
  @ApiResponse({ status: 200, description: 'Search completed successfully' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  search(@Query('q') q: string) {
    return { success: true, data: this.usersService.search(q), message: 'Search completed' };
  }

  @Get('pending')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get pending users', description: 'Returns users awaiting approval (status=pending)' })
  @ApiResponse({ status: 200, description: 'Pending users retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getPending() {
    return { success: true, data: this.usersService.getPending(), message: 'Pending users retrieved' };
  }

  @Get('approved')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get approved users' })
  @ApiResponse({ status: 200, description: 'Approved users retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getApproved() {
    return { success: true, data: this.usersService.getApproved(), message: 'Approved users retrieved' };
  }

  @Get('rejected')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get rejected users' })
  @ApiResponse({ status: 200, description: 'Rejected users retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getRejected() {
    return { success: true, data: this.usersService.getRejected(), message: 'Rejected users retrieved' };
  }

  @Get(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.usersService.findById(id), message: 'User retrieved successfully' };
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create a new user (admin-only)', description: 'Admin/superuser creates a user directly. For public registration, use POST /users/register instead.' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or duplicate email' })
  @ApiResponse({ status: 403, description: 'Access denied — requires admin or superuser role' })
  create(@Body() dto: CreateUserDto) {
    return { success: true, data: this.usersService.create(dto), message: 'User created successfully' };
  }

  @Post('register')
  @ApiOperation({ summary: 'Public registration (no role header required)', description: 'Anyone can register. Donors and beneficiaries get instant approval. Volunteers and admins go to pending status.' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or duplicate email' })
  register(@Body() dto: CreateUserDto) {
    return { success: true, data: this.usersService.create(dto), message: 'User registered successfully' };
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user', description: 'Authenticates a user with email, password, and role. Returns user data on success.' })
  @ApiResponse({ status: 200, description: 'Signed in successfully' })
  @ApiResponse({ status: 200, description: 'Sign-in failed — invalid credentials or account not approved' })
  signIn(@Body() body: { email: string; password: string; role: string }) {
    const user = this.usersService.signIn(body.email, body.password, body.role);
    if (!user) {
      return { success: false, data: null, message: 'Invalid email, password, or role' };
    }
    if (user.status === 'pending') {
      return { success: false, data: null, message: 'Your account is under review by the Platform Administrator.' };
    }
    if (user.status === 'rejected') {
      return { success: false, data: null, message: 'Your registration was not approved. Please contact support.' };
    }
    return { success: true, data: user, message: 'Signed in successfully' };
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return { success: true, data: this.usersService.update(id, dto), message: 'User updated successfully' };
  }

  @Patch(':id/approve')
  @Roles('superuser')
  @ApiOperation({ summary: 'Approve a user', description: 'Changes user status from pending to approved. Superuser only.' })
  @ApiResponse({ status: 200, description: 'User approved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Access denied — requires superuser role' })
  approve(@Param('id') id: string) {
    return { success: true, data: this.usersService.approve(id), message: 'User approved successfully' };
  }

  @Patch(':id/reject')
  @Roles('superuser')
  @ApiOperation({ summary: 'Reject a user', description: 'Changes user status to rejected. Superuser only.' })
  @ApiResponse({ status: 200, description: 'User rejected' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Access denied — requires superuser role' })
  reject(@Param('id') id: string) {
    return { success: true, data: this.usersService.reject(id), message: 'User rejected' };
  }

  @Delete(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Delete a user', description: 'Permanently removes a user from the system. Superuser only.' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Access denied — requires superuser role' })
  remove(@Param('id') id: string) {
    this.usersService.delete(id);
    return { success: true, data: null, message: 'User deleted successfully' };
  }
}
