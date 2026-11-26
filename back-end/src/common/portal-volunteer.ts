import {ForbiddenException} from '@nestjs/common';
import {UsersService} from '../modules/users/service';
import {VolunteersService} from '../modules/volunteers/service';

export function portalVolunteer(users:UsersService,volunteers:VolunteersService,email:string){
 const user=users.findAll().find(u=>u.email.toLowerCase()===email.toLowerCase());
 if(user&&(user.role!=='volunteer'||user.status!=='approved'))throw new ForbiddenException('An approved volunteer account is required');
 let profile=volunteers.findByEmail(email);
 if(!profile&&user){
  profile=volunteers.create({name:user.name,email:user.email,phone:user.phone||'',skills:user.skills||[],org:user.org||'',role:'Volunteer'});
  if(user.availabilityDays)volunteers.updatePresence(user.email,{availabilityDays:user.availabilityDays});
 }
 if(!profile||profile.status!=='active')throw new ForbiddenException('An active volunteer profile is required');
 return profile;
}
