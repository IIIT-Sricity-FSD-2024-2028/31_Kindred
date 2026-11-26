import { DeliveryActionDto } from '../fulfillment/dto';
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
  @Roles('donor','beneficiary','volunteer','seller','admin','superuser')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  uploadImage(@UploadedFile() file: any) {
    return { success: true, data: { url: saveImage(file, 'replacement-proof') }, message: 'Replacement photo uploaded' };
  }

  @Post()
  @ApiOperation({ summary: 'Request a product replacement (buyer)' })
  @Roles('donor','beneficiary','volunteer','seller','admin','superuser')
  create(@Body() dto: CreateReplacementDto,@Headers('user-email') email:string) {
    if(!email||email.toLowerCase()!==dto.buyerEmail.toLowerCase())throw new ForbiddenException('Submit your own replacement request');
    return { success: true, data: this.service.create(dto), message: 'Replacement request submitted' };
  }

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get all replacement requests' })
  findAll(@Headers('role') role:string,@Headers('organization') org:string) {
    return { success: true, data: this.service.findAll().filter(r=>role==='superuser'||!!org&&r.organizationName===org), message: 'Replacements retrieved' };
  }

  @Get('by-buyer/:email')
  @ApiOperation({ summary: 'Get replacement requests by buyer email' })
  @Roles('donor','beneficiary','volunteer','seller','admin','superuser')
  findByBuyer(@Param('email') email: string,@Headers('user-email') caller:string) {
    if(email.toLowerCase()!==String(caller).toLowerCase())throw new ForbiddenException('Read your own claims');
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
  findByVolunteer(@Param('email') email: string,@Headers('user-email') caller:string) {
    if(!caller||email.toLowerCase()!==caller.toLowerCase())throw new ForbiddenException('Read your own replacement assignments');
    return { success: true, data: this.service.visibleToVolunteer(email), message: 'Volunteer replacements retrieved' };
  }

  @Patch(':id/received') @Roles('donor','beneficiary','volunteer','seller','admin','superuser')
  received(@Param('id') id:string,@Headers('user-email') email:string){return {success:true,data:this.service.confirmReceipt(id,email)};}
  @Get(':id/brief') @Roles('volunteer')
  brief(@Param('id') id:string,@Headers() h:Record<string,string>){return {success:true,data:this.service.brief(id,{role:h.role,email:h['user-email'],org:h.organization})};}
  @Get(':id/addresses') @Roles('seller')
  addresses(@Param('id') id:string,@Headers() h:Record<string,string>){return {success:true,data:this.service.addresses(id,{role:h.role,email:h['user-email'],org:h.organization})};}
  @Patch(':id/offer') @Roles('admin','superuser','seller')
  offer(@Param('id') id:string,@Body() body:Parameters<ReplacementsService['arrange']>[1],@Headers() h:Record<string,string>){return {success:true,data:this.service.arrange(id,body,{role:h.role,email:h['user-email'],org:h.organization})};}
  @Post(':id/request-help') @Roles('seller')
  help(@Param('id') id:string,@Body() body:{message:string},@Headers() h:Record<string,string>){return {success:true,data:this.service.requestHelp(id,body.message,{role:h.role,email:h['user-email'],org:h.organization})};}
  @Get(':id')
  @Roles('admin','superuser','seller','volunteer','donor','beneficiary')
  @ApiOperation({ summary: 'Get a replacement by ID' })
  findOne(@Param('id') id: string,@Headers() h:Record<string,string>) {
    const r=this.service.findById(id),email=(h['user-email']||'').toLowerCase();
    if(h.role==='volunteer'&&r.assignedVolunteerEmail?.toLowerCase()===email)return {success:true,data:this.service.visibleToVolunteer(email).find(record=>record.id===id)};
    if(r.buyerEmail.toLowerCase()!==email)this.service.assertManager(id,{role:h.role,email,org:h.organization});
    return { success: true, data: r, message: 'Replacement retrieved' };
  }

  @Patch(':id/approve')
  @Roles('admin', 'superuser','seller')
  @ApiOperation({ summary: 'Approve a replacement request' })
  approve(@Param('id') id: string,@Headers() h:Record<string,string>) {
    this.service.assertManager(id,{role:h.role,email:h['user-email'],org:h.organization});
    return { success: true, data: this.service.approve(id), message: 'Replacement approved' };
  }

  @Patch(':id/reject')
  @Roles('admin', 'superuser','seller')
  @ApiOperation({ summary: 'Reject a replacement request' })
  reject(@Param('id') id: string,@Headers() h:Record<string,string>,@Body() b:{reason:string}) {
    this.service.assertManager(id,{role:h.role,email:h['user-email'],org:h.organization});
    return { success: true, data: this.service.reject(id,b.reason), message: 'Replacement rejected' };
  }

  @Patch(':id/assign-volunteer')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Assign volunteer for replacement pickup/delivery' })
  assignVolunteer(@Param('id') id: string, @Body() body: { volunteerEmail: string; volunteerName: string; schedule?:import('../../common/scheduling').Schedule;destinationArea?:string;requirements?:string;pickupArea?:string }, @Headers('role') role: string, @Headers('user-email') email: string,@Headers('organization') org:string) {
    throw new ForbiddenException('The seller posts replacement pickups to the volunteer portal');
    return { success: true, data: this.service.assignVolunteer(id, body.volunteerEmail, body.volunteerName,body.schedule,body), message: 'Volunteer assigned for replacement' };
  }

  @Patch(':id/action') @Roles('admin','superuser','seller','volunteer')
  action(@Param('id') id:string,@Body() b:DeliveryActionDto,@Headers() h:Record<string,string>){return {success:true,data:this.service.action(id,b.action,b.reason,{role:h.role,email:h['user-email'],org:h.organization},b)};}

  @Patch(':id/status')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Update replacement status (enforced transitions)' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string },@Headers('user-email') email:string) {
    if(this.service.findById(id).assignedVolunteerEmail?.toLowerCase()!==String(email).toLowerCase())throw new ForbiddenException('Only the accepted volunteer can move the pickup forward');
    return { success: true, data: this.service.updateStatus(id, body.status), message: 'Replacement status updated' };
  }
}
