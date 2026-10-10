import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SellersService } from './service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Sellers')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary', 'seller'] })
@Controller('sellers')
@UseGuards(RolesGuard)
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @Roles('superuser', 'admin', 'seller')
  @ApiOperation({ summary: 'Get all sellers' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (pending, approved, rejected)' })
  @ApiResponse({ status: 200, description: 'Sellers retrieved successfully' })
  findAll(@Query('status') status?: string) {
    const data = status
      ? this.sellersService.findByStatus(status)
      : this.sellersService.findAll();
    return { success: true, data, message: 'Sellers retrieved successfully' };
  }

  @Get(':id')
  @Roles('superuser', 'admin', 'seller')
  @ApiOperation({ summary: 'Get seller by ID' })
  @ApiResponse({ status: 200, description: 'Seller retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.sellersService.findById(id), message: 'Seller retrieved successfully' };
  }

  @Post()
  @ApiOperation({ summary: 'Register a new seller (public)', description: 'Anyone can register as a seller. Status starts as pending until approved by platform admin.' })
  @ApiResponse({ status: 201, description: 'Seller registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or duplicate email' })
  create(@Body() dto: CreateSellerDto) {
    return { success: true, data: this.sellersService.create(dto), message: 'Seller registered successfully. Awaiting admin approval.' };
  }

  @Patch(':id')
  @Roles('superuser', 'seller')
  @ApiOperation({ summary: 'Update a seller' })
  @ApiResponse({ status: 200, description: 'Seller updated successfully' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  update(@Param('id') id: string, @Body() dto: UpdateSellerDto) {
    return { success: true, data: this.sellersService.update(id, dto), message: 'Seller updated successfully' };
  }

  @Patch(':id/approve')
  @Roles('superuser')
  @ApiOperation({ summary: 'Approve a seller', description: 'Platform admin approves a pending seller account.' })
  @ApiResponse({ status: 200, description: 'Seller approved successfully' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  approve(@Param('id') id: string) {
    return { success: true, data: this.sellersService.approve(id), message: 'Seller approved successfully' };
  }

  @Patch(':id/reject')
  @Roles('superuser')
  @ApiOperation({ summary: 'Reject a seller' })
  @ApiResponse({ status: 200, description: 'Seller rejected' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  reject(@Param('id') id: string) {
    return { success: true, data: this.sellersService.reject(id), message: 'Seller rejected' };
  }

  @Delete(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Delete a seller' })
  @ApiResponse({ status: 200, description: 'Seller deleted successfully' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  remove(@Param('id') id: string) {
    this.sellersService.delete(id);
    return { success: true, data: null, message: 'Seller deleted successfully' };
  }
}
