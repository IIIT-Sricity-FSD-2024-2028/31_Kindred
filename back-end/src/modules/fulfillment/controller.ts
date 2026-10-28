import { Body, Controller, Get, Headers, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImage } from '../../common/utils/image-upload';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Actor, FulfillmentService } from './service';
import { DeliveryActionDto, DeliveryOfferDto, ReceiptDto, RequestUpdateDto, ResourceRequestDto, ResourceResponseDto } from './dto';
const actor = (h:Record<string,string>):Actor => ({role:h.role,email:h['user-email']||'',org:h.organization||''});
@Controller('fulfillment')
@UseGuards(RolesGuard)
export class FulfillmentController {
 constructor(private readonly service:FulfillmentService){}
 @Get('volunteers') @Roles('admin','superuser','seller') volunteers(){return {success:true,data:this.service.availableVolunteers()};}
 @Post('request-image') @Roles('beneficiary') @UseInterceptors(FileInterceptor('file',{limits:{fileSize:5*1024*1024}})) image(@UploadedFile() file:any){return {success:true,data:{url:saveImage(file,'resource-request')}};}
 @Get('inventory') @Roles('admin','superuser') inventory(@Headers() h:Record<string,string>){return {success:true,data:this.service.inventory(actor(h))};}
 @Post('receipts/:id') @Roles('admin','superuser') receive(@Param('id') id:string,@Body() b:ReceiptDto,@Headers() h:Record<string,string>){return {success:true,data:this.service.receive(id,b,actor(h))};}
 @Get('requests') @Roles('beneficiary','admin','superuser') requests(@Headers() h:Record<string,string>){return {success:true,data:this.service.listRequests(actor(h))};}
 @Post('requests') @Roles('beneficiary') request(@Body() b:ResourceRequestDto,@Headers() h:Record<string,string>){return {success:true,data:this.service.createRequest(b,actor(h))};}
 @Patch('requests/:id/respond') @Roles('admin','superuser') respond(@Param('id') id:string,@Body() b:ResourceResponseDto,@Headers() h:Record<string,string>){return {success:true,data:this.service.respond(id,b,actor(h))};}
 @Patch('requests/:id/message') @Roles('beneficiary','admin','superuser') message(@Param('id') id:string,@Body() b:RequestUpdateDto,@Headers() h:Record<string,string>){return {success:true,data:this.service.updateRequest(id,b.message,b.programId,actor(h))};}
 @Patch('requests/:id/receipt') @Roles('beneficiary') acknowledge(@Param('id') id:string,@Body() b:RequestUpdateDto,@Headers() h:Record<string,string>){return {success:true,data:this.service.acknowledge(id,b.message,actor(h))};}
 @Get('deliveries') @Roles('volunteer','admin','superuser','seller','beneficiary','donor') deliveries(@Headers() h:Record<string,string>){return {success:true,data:this.service.listDeliveries(actor(h))};}
 @Post('deliveries') @Roles('admin','superuser','seller') offer(@Body() b:DeliveryOfferDto,@Headers() h:Record<string,string>){return {success:true,data:this.service.offer(b,actor(h))};}
 @Patch('deliveries/:id/offer') @Roles('admin','superuser','seller') reoffer(@Param('id') id:string,@Body() b:DeliveryOfferDto,@Headers() h:Record<string,string>){return {success:true,data:this.service.reoffer(id,b,actor(h))};}
 @Patch('deliveries/:id/action') @Roles('admin','superuser','seller','volunteer') action(@Param('id') id:string,@Body() b:DeliveryActionDto,@Headers() h:Record<string,string>){return {success:true,data:this.service.act(id,b.action,b.reason,actor(h))};}
}
