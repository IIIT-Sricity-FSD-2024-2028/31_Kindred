import { Body, Controller, Get, Patch, Post, Param, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard'; import { Roles } from '../../common/decorators/roles.decorator'; import { CreateNotificationDto } from './dto/create-notification.dto'; import { NotificationsService } from './service';
@Controller('notifications') @UseGuards(RolesGuard) export class NotificationsController { constructor(private readonly service:NotificationsService){}
 @Get() find(@Query('email') email?:string,@Query('role') role?:string,@Query('org') org?:string){return {success:true,data:this.service.find(email,role,org),message:'Notifications retrieved'};}
 @Post() @Roles('superuser','admin','seller','donor','beneficiary','volunteer') create(@Body() dto:CreateNotificationDto){return {success:true,data:this.service.create(dto),message:'Notification created'};}
 @Patch(':id/read') markRead(@Param('id') id:string){return {success:true,data:this.service.markRead(id),message:'Notification marked read'};}
}
