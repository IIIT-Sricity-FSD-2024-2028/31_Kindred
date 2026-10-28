import {
  Controller, Get, Post, Patch, ForbiddenException,
  Param, Body, UseGuards, UploadedFile, UseInterceptors, Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { ReplacementsService } from './service';
import { CreateReplacementDto } from './dto/create-replacement.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { saveImage } from '../../common/utils/image-upload';
import { SellersService } from '../sellers/service';

@ApiTags('Replacements')
@ApiHeader({ name: 'role', required: false })
@Controller('replacements')
@UseGuards(RolesGuard)
export class ReplacementsController {
  constructor(private readonly service: ReplacementsService, private readonly sellers: SellersService) {}

  @Post('upload-image')
  @Roles('donor')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  uploadImage(@UploadedFile() file: any) {
    return { success: true, data: { url: saveImage(file, 'replacement-proof') }, message: 'Replacement photo uploaded' };
  }

  @Post()
  @ApiOperation({ summary: 'Request a product replacement (buyer)' })
  create(@Body() dto: CreateReplacementDto) {
    return { success: true, data: this.service.create(dto), message: 'Replacement request submitted' };
  }

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all replacement requests' })
  findAll() {
    return { success: true, data: this.service.findAll(), message: 'Replacements retrieved' };
  }

  @Get('by-buyer/:email')
  @ApiOperation({ summary: 'Get replacement requests by buyer email' })
  findByBuyer(@Param('email') email: string) {
    return { success: true, data: this.service.findByBuyer(email), message: 'Buyer replacements retrieved' };
  }

  @Get('by-org/:orgId')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get replacement requests by organization' })
  findByOrg(@Param('orgId') orgId: string) {
    return { success: true, data: this.service.findByOrg(orgId), message: 'Org replacements retrieved' };
  }

  @Get('by-seller/:sellerId')
  @Roles('admin', 'superuser', 'seller')
  @ApiOperation({ summary: 'Get replacement requests by seller' })
  findBySeller(@Param('sellerId') sellerId: string, @Headers('role') role: string, @Headers('user-email') email: string) {
    if (role === 'seller' && this.sellers.findByEmail(email)?.id !== sellerId) throw new ForbiddenException('You can only view your own replacement requests');
    return { success: true, data: this.service.findBySeller(sellerId), message: 'Seller replacements retrieved' };
  }

  @Get('by-volunteer/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get replacement pickups assigned to a volunteer' })
  findByVolunteer(@Param('email') email: string) {
    return { success: true, data: this.service.findByVolunteer(email), message: 'Volunteer replacements retrieved' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a replacement by ID' })
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Replacement retrieved' };
  }

  @Patch(':id/approve')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Approve a replacement request' })
  approve(@Param('id') id: string) {
    return { success: true, data: this.service.approve(id), message: 'Replacement approved' };
  }

  @Patch(':id/reject')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Reject a replacement request' })
  reject(@Param('id') id: string) {
    return { success: true, data: this.service.reject(id), message: 'Replacement rejected' };
  }

  @Patch(':id/assign-volunteer')
  @Roles('admin', 'superuser', 'seller')
  @ApiOperation({ summary: 'Assign volunteer for replacement pickup/delivery' })
  assignVolunteer(@Param('id') id: string, @Body() body: { volunteerEmail: string; volunteerName: string }, @Headers('role') role: string, @Headers('user-email') email: string) {
    if (role === 'seller') {
      const replacement = this.service.findById(id);
      if (this.sellers.findByEmail(email)?.id !== replacement.sellerId) throw new ForbiddenException('You can only assign volunteers to your own replacement requests');
    }
    return { success: true, data: this.service.assignVolunteer(id, body.volunteerEmail, body.volunteerName), message: 'Volunteer assigned for replacement' };
  }

  @Patch(':id/status')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Update replacement status (enforced transitions)' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return { success: true, data: this.service.updateStatus(id, body.status), message: 'Replacement status updated' };
  }
}
