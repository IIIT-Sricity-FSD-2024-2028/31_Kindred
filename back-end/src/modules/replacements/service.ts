import { portalVolunteer } from '../../common/portal-volunteer';
import { deliveryArea } from '../../common/delivery-area';
import { UsersService } from '../users/service';
import { notifyDeliveryManagers } from '../../common/delivery-notifications';
import { Inject, Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ProofStore } from '../proofs/store';
import { Replacement } from './entities/replacement.entity';
import { CreateReplacementDto } from './dto/create-replacement.dto';
import { OrdersService } from '../orders/service';
import { ProductsService } from '../products/service';
import { SellersService } from '../sellers/service';
import { VolunteersService } from '../volunteers/service';
import { NotificationsService } from '../notifications/service';
import { Schedule, SchedulingService, validateSchedule, scheduleHasEnded } from '../../common/scheduling';
type Actor={role:string;email:string;org:string};
@Injectable()
export class ReplacementsService {
 @Inject(UsersService) private users:UsersService;
 private helpRequests:{id:string;message:string;at:string}[]=[];
 @Inject(ProofStore) private proofs:ProofStore;
 @Inject(ProductsService) private products:ProductsService;
 @Inject(SellersService) private sellers:SellersService;
 @Inject(VolunteersService) private volunteers:VolunteersService;
 @Inject(NotificationsService) private notifications:NotificationsService;
 @Inject(SchedulingService) private scheduling:SchedulingService;
 private replacements:Replacement[]=[];
 private counter=100;
 constructor(private ordersService:OrdersService){}
 findAll(){return this.replacements.map(r=>({...r}));}
 private record(id:string){const r=this.replacements.find(r=>r.id===id);if(!r)throw new NotFoundException('Replacement not found');return r;}
 findById(id:string){return {...this.record(id)};}
 findByBuyer(email:string){return this.findAll().filter(r=>r.buyerEmail.toLowerCase()===email.toLowerCase());}
 findByOrg(orgId:string){return this.findAll().filter(r=>r.organizationId===orgId);}
 findBySeller(sellerId:string){return this.findAll().filter(r=>r.sellerId===sellerId);}
 findByVolunteer(email:string){return this.findAll().filter(r=>r.assignedVolunteerEmail?.toLowerCase()===email.toLowerCase());}
 assertManager(id:string,actor:Actor){const r=this.record(id);if(actor.role==='superuser'||actor.role==='seller'&&this.sellers.findByEmail(actor.email)?.id===r.sellerId||actor.role==='admin'&&!!actor.org&&actor.org===r.organizationName)return;throw new ForbiddenException('Only this seller or responsible organization can manage the replacement');}
 private event(r:Replacement,action:string,by:string,reason?:string){r.status=action;r.reasonForStatus=reason;(r.history ||= []).push({at:new Date().toISOString(),action,by,reason});this.notifications.create({targetEmail:r.buyerEmail,title:'Replacement update',message:`${r.productTitle}: ${action.replaceAll('_',' ')}. ${reason||''}`,link:'/shop',type:'info'});}
 create(dto:CreateReplacementDto){
  const o=this.ordersService.findById(dto.orderId);
  if(o.buyerEmail.toLowerCase()!==dto.buyerEmail?.toLowerCase())throw new ForbiddenException('Only the original buyer may request replacement');
  if(o.deliveryStatus!=='delivered'||!dto.imageUrl?.trim())throw new BadRequestException('A delivered order and issue photo are required');
  if(this.replacements.some(r=>r.orderId===o.id&&!['rejected','cancelled'].includes(r.status)))throw new BadRequestException('This order already has a replacement claim');
  const quantity=dto.quantity||o.quantity;if(!Number.isInteger(quantity)||quantity<1||quantity>o.quantity)throw new BadRequestException('Invalid replacement quantity');
  const seller=this.sellers.findById(o.sellerId);
  const r:Replacement={id:`repl_${Date.now()}_${this.counter++}`,orderId:o.id,productId:o.productId,productTitle:o.productTitle,sellerId:o.sellerId,sellerName:o.sellerName,organizationId:o.organizationId,organizationName:o.organizationName,buyerEmail:o.buyerEmail,buyerName:o.buyerName,reason:dto.reason,description:dto.description,imageUrl:dto.imageUrl,status:'requested',quantity,pickupAddress:o.address,returnAddress:seller.pickupAddress||'',timestamps:{requestedAt:new Date().toISOString()},history:[]};
  this.replacements.push(r);this.notifications.create({targetEmail:seller.email,title:'Replacement review requested',message:r.productTitle,link:'/seller-dashboard',type:'info'});return {...r};
 }
 approve(id:string){const r=this.record(id);if(r.status!=='requested')throw new BadRequestException('Only requested claims can be approved');this.products.decreaseStock(r.productId,r.quantity||1);r.stockReserved=true;r.timestamps.approvedAt=new Date().toISOString();this.event(r,'approved','reviewer','Replacement stock reserved');return {...r};}
 reject(id:string,reason='Replacement declined'){const r=this.record(id);if(r.status!=='requested'||!reason.trim())throw new BadRequestException('Only requested claims can be rejected, with a reason');this.event(r,'rejected','reviewer',reason);return {...r};}
 assignVolunteer(id:string,email:string,name:string,schedule?:Schedule,details?:{destinationArea?:string;requirements?:string}){
  const r=this.record(id);if(r.status!=='approved'||!r.stockReserved)throw new BadRequestException('Approve the claim and reserve stock before inviting a volunteer');
  if(!schedule)throw new BadRequestException('Provide a pickup schedule and general area');schedule={...schedule,location:details?.destinationArea?`${schedule.location} -> ${details.destinationArea}`:schedule.location};validateSchedule(schedule);if(scheduleHasEnded(schedule))throw new BadRequestException('Pickup date is in the past');
  const result=this.volunteers.deliveryEligibility(email,schedule,id);if(!result.eligible)throw new BadRequestException(result.reasons.join('; '));
  const seller=this.sellers.findById(r.sellerId),volunteer=this.volunteers.findByEmail(email);
  if(!seller.pickupAddress?.trim())throw new BadRequestException('The seller must save their full pickup address before arranging a replacement');
  r.returnAddress=seller.pickupAddress.trim();r.pickupAddress=this.ordersService.findById(r.orderId).address;r.mode='direct';
  name=volunteer!.name;
  r.destinationArea=details?.destinationArea;r.requirements=details?.requirements;
  r.schedule=schedule;r.assignedVolunteerEmail=email;r.assignedVolunteerName=name;this.event(r,'volunteer_invited','reviewer');this.notifications.create({targetEmail:email,title:'Replacement pickup invitation',message:`${r.productTitle}: review details before accepting`,link:'/volunteer-dashboard',type:'info'});return {...r};
 }
 addresses(id:string,actor:Actor){this.assertManager(id,actor);const r=this.record(id);return {buyerAddress:this.ordersService.findById(r.orderId).address,sellerPickupAddress:this.sellers.findById(r.sellerId).pickupAddress||''};}
 arrange(id:string,body:{mode:string;pickupAddress?:string;volunteerEmail?:string;scheduledDate?:string;shiftStart?:string;shiftEnd?:string;pickupArea?:string;destinationArea?:string;requirements?:string},actor:Actor) {
  this.assertManager(id,actor);const r=this.record(id);
  if(actor.role!=='seller'||body.mode!=='broadcast')throw new ForbiddenException('The seller posts replacements directly to the volunteer portal');
  if(!['direct','broadcast'].includes(body.mode))throw new BadRequestException('Choose a valid assignment method');
  if(!['approved','portal_open','volunteer_invited'].includes(r.status)||!r.stockReserved)throw new BadRequestException('Approve the replacement and reserve stock before arranging pickup');
  const sellerProfile=this.sellers.findById(r.sellerId),buyerAddress=this.ordersService.findById(r.orderId).address;
  const sellerAddress=body.pickupAddress?.trim()||sellerProfile.pickupAddress?.trim()||'';
  body={...body,pickupArea:deliveryArea(buyerAddress,'Buyer pickup area'),destinationArea:deliveryArea(sellerAddress,'Seller exchange point')};
  if(!body.scheduledDate||!body.shiftStart||!body.shiftEnd||!body.pickupArea?.trim()||!body.destinationArea?.trim())throw new BadRequestException('Provide a delivery date, time window and both general areas');
  const schedule:Schedule={startDate:body.scheduledDate,endDate:body.scheduledDate,shiftStart:body.shiftStart,shiftEnd:body.shiftEnd,location:body.pickupArea.trim(),timeZone:'Asia/Kolkata'};
  validateSchedule(schedule);if(scheduleHasEnded(schedule))throw new BadRequestException('Pickup date is in the past');
  const seller=this.sellers.findById(r.sellerId);
  if(!sellerAddress)throw new BadRequestException('Enter a seller pickup address or save one in Seller Dashboard');
  if(body.mode==='direct'){
   const eligibility=this.volunteers.deliveryEligibility(body.volunteerEmail||'',{...schedule,location:`${schedule.location} -> ${body.destinationArea}`},id);
   if(!eligibility.eligible)throw new BadRequestException(eligibility.reasons.join('; '));
  }
  const oldEmail=r.assignedVolunteerEmail;
  if(body.mode==='direct'){
   r.status='approved';this.assignVolunteer(id,body.volunteerEmail!,'',schedule,body);
  }else{
   r.schedule={...schedule,location:`${schedule.location} -> ${body.destinationArea.trim()}`};r.destinationArea=body.destinationArea.trim();r.requirements=body.requirements;
   r.pickupAddress=this.ordersService.findById(r.orderId).address;r.returnAddress=sellerAddress;r.mode='broadcast';r.assignedVolunteerEmail=undefined;r.assignedVolunteerName=undefined;
   this.event(r,'portal_open',actor.email,'Replacement pickup posted to volunteer portal');
   for(const v of this.volunteers.findAll().filter(v=>v.status==='active'))this.notifications.create({targetEmail:v.email,title:'Replacement pickup available',message:`${r.productTitle}: review the route and schedule on the portal`,link:'/volunteer-portal#replacement-opportunities',type:'info'});
  }
  if(oldEmail&&oldEmail!==r.assignedVolunteerEmail)this.notifications.create({targetEmail:oldEmail,title:'Replacement invitation updated',message:`${r.productTitle}: the previous invitation is no longer available.`,link:'/volunteer-dashboard',type:'info'});
  return {...r};
 }
 requestHelp(id:string,message:string,actor:Actor){throw new BadRequestException('The seller posts replacement pickups directly to the volunteer portal');}
 visibleToVolunteer(email:string){
  return this.findAll().filter(r=>r.assignedVolunteerEmail?.toLowerCase()===email.toLowerCase()||r.mode==='broadcast'&&r.status==='portal_open'&&r.schedule&&!scheduleHasEnded(r.schedule)).map(r=>['volunteer_invited','portal_open'].includes(r.status)?{id:r.id,productTitle:r.productTitle,quantity:r.quantity,organizationName:r.organizationName,sellerName:r.sellerName,status:r.status,mode:r.mode,schedule:r.schedule,destinationArea:r.destinationArea,requirements:r.requirements,assignedVolunteerEmail:r.assignedVolunteerEmail,pickupAddress:'Shared after acceptance',returnAddress:'Shared after acceptance'}:r);
 }
 confirmReceipt(id:string,email:string){
  const r=this.record(id);if(!email||r.buyerEmail.toLowerCase()!==email.toLowerCase())throw new ForbiddenException('Only the buyer can confirm receipt');
  if(r.buyerReceivedAt)return {...r};
  if(!['replacement_in_transit','replaced'].includes(r.status))throw new BadRequestException('Receipt can be confirmed once the replacement is out for delivery');
  r.buyerReceivedAt=new Date().toISOString();(r.history||=[]).push({at:r.buyerReceivedAt,action:'buyer_confirmed_received',by:email});
  this.notifications.create({targetEmail:this.sellers.findById(r.sellerId).email,title:'Buyer confirmed replacement received',message:r.productTitle,link:'/seller-dashboard',type:'info'});
  if(r.assignedVolunteerEmail)this.notifications.create({targetEmail:r.assignedVolunteerEmail,title:'Buyer confirmed replacement received',message:r.productTitle,link:'/volunteer-dashboard',type:'info'});
  return {...r};
 }
 private reviewVersion(r:Replacement){return JSON.stringify([r.id,r.status,r.mode,r.schedule,r.pickupAddress,r.returnAddress,r.requirements]);}
 brief(id:string,actor:Actor){
  if(actor.role!=='volunteer')throw new ForbiddenException('Sign in as a volunteer');
  portalVolunteer(this.users,this.volunteers,actor.email);const r=this.record(id);
  const mine=r.assignedVolunteerEmail?.toLowerCase()===actor.email.toLowerCase(),open=r.status==='portal_open'&&r.mode==='broadcast'||r.status==='volunteer_invited'&&mine;
  if(!open&&!mine)throw new ForbiddenException('This replacement is no longer offered to you');
  if(!r.schedule)throw new BadRequestException('This replacement needs a pickup schedule');
  const schedule={...r.schedule,location:`${r.pickupAddress} -> ${r.returnAddress}`},eligibility=this.volunteers.eligibility(actor.email,schedule,id),confirmed=r.mode==='broadcast'?this.volunteers.portalEligibility(actor.email,schedule,id,true):this.volunteers.deliveryEligibility(actor.email,schedule,id),blockers=[...confirmed.reasons];
  if(scheduleHasEnded(schedule))blockers.push('The pickup window has expired; the seller must repost it');
  return {id:r.id,kind:'replacement',title:`Replacement: ${r.productTitle}`,status:r.status,mode:r.mode,orgName:r.organizationName,sellerName:r.sellerName,pickupAddress:r.pickupAddress,address:r.returnAddress,finalAddress:r.pickupAddress,scheduledDate:r.schedule.startDate,shiftStart:r.schedule.shiftStart,shiftEnd:r.schedule.shiftEnd,requirements:r.requirements,issue:r.description,items:[{name:r.productTitle,quantity:r.quantity||1}],reviewedVersion:this.reviewVersion(r),available:open&&!blockers.length,blockers,eligibility,warnings:confirmed.warnings,confirmationRequired:r.mode==='broadcast',conflicts:confirmed.conflicts};
 }
 action(id:string,action:string,reason:string|undefined,actor:Actor,consent:{confirmAvailability?:boolean;confirmConflict?:boolean;reviewedVersion?:string}={}){
  const r=this.record(id),mine=!!actor.email&&r.assignedVolunteerEmail?.toLowerCase()===actor.email.toLowerCase();
  if(action==='accept'&&mine&&actor.role==='volunteer'&&['volunteer_assigned','return_pickup','replacement_in_transit'].includes(r.status))return {...r};
  if(action==='accept'&&consent.reviewedVersion&&consent.reviewedVersion!==this.reviewVersion(r))throw new BadRequestException('The replacement details changed. Review the latest details before accepting.');
  const portal=action==='accept'&&r.status==='portal_open'&&r.mode==='broadcast';
  if(['cancel','return','reassign'].includes(action))this.assertManager(id,actor);else if((!mine&&!portal)||actor.role!=='volunteer')throw new ForbiddenException('Only an eligible volunteer may apply or the assigned volunteer may respond');
  if(action==='accept'){portalVolunteer(this.users,this.volunteers,actor.email);if(!['volunteer_invited','portal_open'].includes(r.status)||!r.schedule)throw new BadRequestException('No open invitation');if(scheduleHasEnded(r.schedule))throw new BadRequestException('Offer expired');const result=portal?this.volunteers.portalEligibility(actor.email,{...r.schedule,location:`${r.pickupAddress} -> ${r.returnAddress}`},id,consent.confirmAvailability===true):this.volunteers.deliveryEligibility(actor.email,r.schedule,id);if(!result.eligible)throw new BadRequestException(result.reasons.join('; '));const conflicts=this.scheduling.conflicts(actor.email,r.schedule,id);if(conflicts.length&&consent.confirmConflict!==true)throw new BadRequestException('Conflicts with '+conflicts.join(', ')+'. Acknowledge the scheduling conflict before accepting.');this.scheduling.reserve(id,actor.email,r.productTitle,r.schedule,consent.confirmConflict===true);r.scheduleConflicts=conflicts;r.assignedVolunteerEmail=actor.email;r.assignedVolunteerName=this.volunteers.findByEmail(actor.email)!.name;this.event(r,'volunteer_assigned',actor.email,conflicts.length?'Scheduling conflict acknowledged: '+conflicts.join(', '):undefined);notifyDeliveryManagers(this.notifications,this.users,undefined,this.sellers.findById(r.sellerId).email,portal?'Portal replacement application accepted':'Volunteer accepted replacement',`${r.assignedVolunteerName} ${portal?'applied through the portal and accepted':'accepted'} ${r.productTitle}. Only this volunteer is assigned.${conflicts.length?' Scheduling conflict acknowledged: '+conflicts.join(', '):''}`);}
  else if(action==='decline'||action==='withdraw'){if(!(action==='decline'?['volunteer_invited']:['volunteer_assigned']).includes(r.status)||!reason?.trim())throw new BadRequestException('Provide a reason before pickup');this.scheduling.release(id);r.assignedVolunteerEmail='';r.assignedVolunteerName='';this.event(r,'approved',actor.email,reason);}
  else if(action==='report'){if(!['volunteer_assigned','return_pickup','replacement_in_transit'].includes(r.status)||!reason?.trim())throw new BadRequestException('Provide a progress report for your active replacement');this.event(r,r.status,actor.email,reason.trim());}
  else if(action==='failed'){if(!['volunteer_assigned','return_pickup','replacement_in_transit'].includes(r.status)||!reason?.trim())throw new BadRequestException('Report a failure for accepted work with a reason');if(this.proofs.all().some(p=>p.collection==='replacements'&&p.recordId===id&&p.status!=='rejected'))throw new BadRequestException('Review pending proof first');this.event(r,'failed',actor.email,reason);}
  else if(action==='return'){if(r.status!=='failed'||!reason?.trim())throw new BadRequestException('Confirm return of all goods with a note before retrying');this.scheduling.release(id);r.assignedVolunteerEmail='';r.assignedVolunteerName='';this.event(r,'approved',actor.email,reason);}
  else if(action==='cancel'){if(!['requested','approved','portal_open','volunteer_invited','volunteer_assigned'].includes(r.status)||!reason?.trim())throw new BadRequestException('Confirm return before cancellation after pickup');if(r.stockReserved){this.products.increaseStock(r.productId,r.quantity||1);r.stockReserved=false;}this.scheduling.release(id);this.event(r,'cancelled',actor.email,reason);if(r.assignedVolunteerEmail)this.notifications.create({targetEmail:r.assignedVolunteerEmail,title:'Replacement cancelled',message:`${r.productTitle}: ${reason}`,link:'/volunteer-dashboard',type:'info'});}
  else throw new BadRequestException('Unsupported replacement action');
  if(action!=='accept')notifyDeliveryManagers(this.notifications,this.users,undefined,this.sellers.findById(r.sellerId).email,'Replacement coordination update',`${r.productTitle}: ${r.status}. ${reason||''}`);return {...r};
 }
 updateStatus(id:string,status:string){const r=this.record(id);const next={volunteer_assigned:'return_pickup',return_pickup:'replacement_in_transit',replacement_in_transit:'replaced'}[r.status];if(status!==next)throw new BadRequestException('Accept the invitation and follow pickup/delivery stages');if(status==='replaced'){this.proofs.assertVerified('replacements',id);r.stockReserved=false;this.scheduling.release(id);}this.event(r,status,r.assignedVolunteerEmail||'reviewer');return {...r};}
}
