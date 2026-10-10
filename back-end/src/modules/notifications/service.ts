import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationRecord } from './entities/notification.entity';
@Injectable() export class NotificationsService {
 private items: NotificationRecord[]=[]; private counter=100;
 create(dto:CreateNotificationDto):NotificationRecord { const rec:NotificationRecord={id:`ntf_${Date.now()}_${this.counter++}`,targetEmail:dto.targetEmail,targetRole:dto.targetRole,targetOrg:dto.targetOrg,title:dto.title,message:dto.message,type:dto.type||'info',link:dto.link,read:dto.read||false,createdAt:new Date().toISOString()}; this.items.unshift(rec); return {...rec}; }
 find(email?:string, role?:string, org?:string):NotificationRecord[]{ const e=(email||'').toLowerCase(),r=(role||'').toLowerCase(),o=(org||'').toLowerCase(); return this.items.filter(n=>{const em=n.targetEmail&&e&&n.targetEmail.toLowerCase()===e; const rm=n.targetRole&&r&&n.targetRole.toLowerCase()===r; const om=n.targetOrg&&o&&n.targetOrg.toLowerCase()===o; const global=!n.targetEmail&&!n.targetRole&&!n.targetOrg; return !!(em||rm||om||global)}).map(n=>({...n})); }
 markRead(id:string){const i=this.items.findIndex(n=>n.id===id); if(i<0) throw new NotFoundException('Notification not found'); this.items[i].read=true; return {...this.items[i]};}
}
