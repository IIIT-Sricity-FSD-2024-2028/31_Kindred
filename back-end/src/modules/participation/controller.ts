import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ParticipationService } from './service';
import { ProgramMessageDto, ProgramRatingDto } from './workspace.dto';
import { UsersService } from '../users/service';
@Controller('participation') @UseGuards(RolesGuard)
export class ParticipationController {
  constructor(private service:ParticipationService,private users:UsersService) {}
  private actor(headers:Record<string,string>){const user=this.users.assertSession(headers.authorization,['admin','superuser','volunteer','donor','beneficiary','seller']);return {role:user.role,email:user.email,org:user.org||''};}
  @Get('programs/:id/workspace') @Roles('admin','superuser','volunteer','donor','beneficiary','seller')
  workspace(@Param('id') id:string,@Headers() h:Record<string,string>){return {success:true,data:this.service.workspace(id,this.actor(h))};}
  @Post('programs/:id/messages') @Roles('admin','superuser','volunteer','donor','beneficiary','seller')
  message(@Param('id') id:string,@Headers() h:Record<string,string>,@Body() body:ProgramMessageDto){return {success:true,data:this.service.sendMessage(id,this.actor(h),body)};}
  @Post('programs/:id/ratings') @Roles('admin','superuser')
  rating(@Param('id') id:string,@Headers() h:Record<string,string>,@Body() body:ProgramRatingDto){return {success:true,data:this.service.rate(id,this.actor(h),body)};}
  @Get('candidates') @Roles('admin','superuser')
  candidates(@Query() q:Record<string,string>) {return {success:true,data:this.service.candidates({startDate:q.startDate,endDate:q.endDate,shiftStart:q.shiftStart,shiftEnd:q.shiftEnd,shiftDays:q.shiftDays?.split(','),location:q.location||'',timeZone:'Asia/Kolkata'})};}
  @Get('programs/:id/brief') @Roles('volunteer','donor','beneficiary','seller')
  brief(@Param('id') id:string,@Headers('user-email') email:string){return {success:true,data:this.service.brief(id,email||'')};}
  @Patch('memberships/:id/withdraw') @Roles('volunteer','donor','beneficiary','seller')
  withdraw(@Param('id') id:string,@Headers('user-email') email:string,@Body() b:{reason:string}){return {success:true,data:this.service.withdraw(id,email,b.reason)};}
  @Patch('memberships/:id/handover') @Roles('admin','superuser')
  handover(@Param('id') id:string,@Headers() h:Record<string,string>,@Body() b:{reason:string;replacementEmail?:string}){return {success:true,data:this.service.handover(id,{role:h.role,email:h['user-email'],org:h.organization},b)};}
  @Post('programs/:id/certificate') @Roles('volunteer','donor','beneficiary','seller')
  certificate(@Param('id') id:string,@Headers('user-email') email:string){return {success:true,data:this.service.certificate(id,email||'')};}
}
