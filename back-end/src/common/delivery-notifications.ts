import { NotificationsService } from '../modules/notifications/service';
import { UsersService } from '../modules/users/service';

export function notifyDeliveryManagers(notifications:NotificationsService, users:UsersService, org:string|undefined, sellerEmail:string|undefined, title:string, message:string) {
  const admins=users.findAll().filter(user=>user.status==='approved'&&user.role==='admin'&&org&&user.org?.toLowerCase()===org.toLowerCase());
  for(const email of new Set(admins.map(user=>user.email))) notifications.create({targetEmail:email,title,message,link:'/org-admin#resources',type:'info'});
  if(sellerEmail)notifications.create({targetEmail:sellerEmail,title,message,link:'/seller-dashboard#resource-deliveries',type:'info'});
}
