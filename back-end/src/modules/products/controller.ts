import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Products')
@ApiHeader({ name: 'role', required: true, description: 'User role for RBAC', enum: ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary', 'seller'] })
@Controller('products')
@UseGuards(RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products', description: 'Returns products. Use ?status=approved for public shop view, ?sellerId=X for seller dashboard.' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (pending_approval, approved, rejected)' })
  @ApiQuery({ name: 'sellerId', required: false, description: 'Filter by seller ID' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  findAll(@Query('status') status?: string, @Query('sellerId') sellerId?: string) {
    let data = this.productsService.findAll();
    if (status) data = data.filter((p) => p.status === status);
    if (sellerId) data = data.filter((p) => p.sellerId === sellerId);
    return { success: true, data, message: 'Products retrieved successfully' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.productsService.findById(id), message: 'Product retrieved successfully' };
  }

  @Post('upload')
  @Roles('seller', 'superuser')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 4 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Upload a product image (multipart/form-data file upload middleware)' })
  upload(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Please attach an image file using field name "file"');
    if (!String(file.mimetype || '').startsWith('image/')) throw new BadRequestException('Only image files are allowed');
    const ext = path.extname(file.originalname || '').replace(/[^.a-zA-Z0-9]/g, '') || '.jpg';
    const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    const uploadsDir = path.join(process.cwd(), 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);
    return { success: true, data: { url: `http://localhost:3000/uploads/${filename}`, filename }, message: 'Product image uploaded successfully' };
  }

  @Post()
  @Roles('seller', 'superuser')
  @ApiOperation({ summary: 'Add a new product', description: 'Seller adds a product. Status starts as pending_approval until admin approves.' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() dto: CreateProductDto) {
    return { success: true, data: this.productsService.create(dto), message: 'Product created. Awaiting admin approval.' };
  }

  @Patch(':id')
  @Roles('seller', 'superuser')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return { success: true, data: this.productsService.update(id, dto), message: 'Product updated successfully' };
  }

  @Patch(':id/approve')
  @Roles('superuser')
  @ApiOperation({ summary: 'Approve a product', description: 'Platform admin approves a pending product for the public shop.' })
  @ApiResponse({ status: 200, description: 'Product approved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  approve(@Param('id') id: string) {
    return { success: true, data: this.productsService.approve(id), message: 'Product approved successfully' };
  }

  @Patch(':id/reject')
  @Roles('superuser')
  @ApiOperation({ summary: 'Reject a product' })
  @ApiResponse({ status: 200, description: 'Product rejected' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  reject(@Param('id') id: string) {
    return { success: true, data: this.productsService.reject(id), message: 'Product rejected' };
  }

  @Delete(':id')
  @Roles('seller', 'superuser')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    this.productsService.delete(id);
    return { success: true, data: null, message: 'Product deleted successfully' };
  }
}
