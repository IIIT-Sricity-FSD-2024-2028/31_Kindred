import { portalVolunteer } from '../../common/portal-volunteer';
import { deliveryArea } from '../../common/delivery-area';
import { UsersService } from '../users/service';
import { notifyDeliveryManagers } from '../../common/delivery-notifications';
import { SchedulingService, validateSchedule, scheduleHasEnded } from '../../common/scheduling';
import { Inject } from '@nestjs/common';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ResourceDonationsService } from '../resource-donations/service';
import { OrdersService } from '../orders/service';
import { OrganizationsService } from '../organizations/service';
import { ProgramsService } from '../programs/service';
import { VolunteersService } from '../volunteers/service';
import { SellersService } from '../sellers/service';
import { NotificationsService } from '../notifications/service';
import { ProofStore } from '../proofs/store';
import { DeliveryOfferDto, ResourceRequestDto, ResourceResponseDto, ReceiptDto } from './dto';

export interface Actor {role:string;email:string;org:string;}
export interface Allocation {stockId:string;quantity:number;}
export interface ResourceRequest {
 id:string;orgName:string;resource:string;quantity:number;reason:string;address:string;phone:string;name:string;beneficiaryEmail:string;photoUrl?:string;
 status:string;message:string;allocations:Allocation[];approvedQuantity:number;programId?:string;createdAt:string;history:{at:string;message:string;by:string}[];
 receipt?:string;
 unit?:string; deliveredQuantity?:number; deliveredAllocations?:Allocation[];
 issue?:{status:string;message:string;resolution?:string;history:{at:string;by:string;action:string;message:string}[]};
}
export interface Delivery {
 scheduleConflicts?:string[];
 scheduledDate?:string;shiftStart?:string;shiftEnd?:string;pickupArea?:string;destinationArea?:string;requirements?:string;allocations?:Allocation[];quantity?:number;
 id:string;kind:'collection'|'resource'|'order';sourceId:string;title:string;orgName:string;sellerEmail?:string;mode:string;status:string;
 invitedEmail?:string;volunteerEmail?:string;volunteerName?:string;pickupAddress:string;address:string;contact:string;recipientEmail:string;
 reason?:string;declinedEmails:string[];createdAt:string;updatedAt:string;history:{at:string;status:string;note?:string}[];
}
interface Receipt {donationId:string;orgName:string;items:{index:number;quantity:number}[];receivedAt:string;}
const equal = (a?:string,b?:string) => !!a && !!b && a.toLowerCase() === b.toLowerCase();
const copy = <T>(value:T):T => JSON.parse(JSON.stringify(value));

@Injectable()
export class FulfillmentService {
 @Inject(SchedulingService) private scheduling:SchedulingService;
 @Inject(UsersService) private users:UsersService;
 private helpRequests:{sourceId:string;kind:string;message:string;at:string}[]=[];
 private requests:ResourceRequest[]=[];
 private deliveries:Delivery[]=[];
 private receipts:Receipt[]=[];
 constructor(private readonly resources:ResourceDonationsService,private readonly orders:OrdersService,private readonly organizations:OrganizationsService,private readonly programs:ProgramsService,private readonly volunteers:VolunteersService,private readonly sellers:SellersService,private readonly notifications:NotificationsService,private readonly proofs:ProofStore) {}
 private admin(actor:Actor,org:string) {if(actor.role!=='superuser' && (actor.role!=='admin'||!equal(actor.org,org))) throw new ForbiddenException('Only the responsible organization admin can manage this record');}
 private notify(email:string,title:string,message:string,link:string) {if(email) this.notifications.create({targetEmail:email,title,message,link,type:'info'});}
 private request(id:string) {const r=this.requests.find(r=>r.id===id);if(!r)throw new NotFoundException('Resource request not found');return r;}
 findById(id:string) {const d=this.deliveries.find(d=>d.id===id);if(!d)throw new NotFoundException('Delivery not found');return copy(d);}
 assertLegacyAvailable(kind:string,id:string,actor:Actor) {
  if(this.deliveries.some(d=>d.kind===kind&&d.sourceId===id&&d.status!=='cancelled'))throw new ConflictException('Manage acceptance, tracking and proof from the delivery workflow');
  if(kind==='collection') {const donation=this.resources.findById(id);if(actor.role==='volunteer'){if(!equal(actor.email,donation.assignedVolunteerEmail))throw new ForbiddenException('Only the assigned volunteer can update this pickup');}else this.admin(actor,donation.orgName||'');}
  if(kind==='order') {const order=this.orders.findById(id);if(actor.role==='volunteer'){if(!equal(actor.email,order.assignedVolunteerEmail))throw new ForbiddenException('Only the assigned volunteer can update this order');}else this.canManage(actor,{kind:'order',orgName:order.organizationName||'',sellerEmail:this.sellers.findById(order.sellerId).email} as Delivery);}
 }
 assertDonationEditable(id:string,actor:Actor) {
  const d=this.resources.findById(id);this.admin(actor,d.orgName||'');
  if(this.receipts.some(r=>r.donationId===id))throw new ConflictException('Received inventory cannot be deleted or changed through the donation form');
  this.assertLegacyAvailable('collection',id,actor);
 }
 allocateDonation(id:string,programId:string,actor:Actor) {
  const donation=this.resources.findById(id);this.admin(actor,donation.orgName||'');
  const program=this.programs.findById(programId);this.program(programId,donation.orgName||'');
  return this.resources.allocateToProgram(id,program.id,program.name);
 }
 donationProgress(id:string) {
  const receipt=this.receipts.find(r=>r.donationId===id);if(!receipt)return null;
  const stock=this.inventory({role:'superuser',email:'',org:''}).filter(s=>s.donationId===id);
  return {received:stock.reduce((n,s)=>n+s.received,0),reserved:stock.reduce((n,s)=>n+s.reserved,0),distributed:stock.reduce((n,s)=>n+s.distributed,0),receivedAt:receipt.receivedAt};
 }
 visibleDonations(records:ReturnType<ResourceDonationsService['findAll']>,actor:Actor) {
  return records.filter(r=>{
   if(actor.role==='superuser')return true;
   if(actor.role==='admin')return equal(actor.org,r.orgName);
   if(actor.role==='donor')return equal(actor.email,r.donorEmail);
   const delivery=this.deliveries.find(d=>d.kind==='collection'&&d.sourceId===r.id&&d.status!=='cancelled');
   return actor.role==='volunteer'&&equal(actor.email,delivery?delivery.volunteerEmail:r.assignedVolunteerEmail);
  });
 }
 private ownedDelivery(id:string) {this.findById(id);return this.deliveries.find(d=>d.id===id)!;}
 private canManage(actor:Actor,d:Delivery) {if(actor.role==='superuser')return; if(d.kind==='order'&&actor.role==='seller'&&equal(actor.email,d.sellerEmail))return; this.admin(actor,d.orgName);}
 private volunteer(email:string) {return portalVolunteer(this.users,this.volunteers,email);}
 availableVolunteers() {return this.volunteers.findAll().filter(v=>v.status==='active'&&v.availableNow&&v.currentLocation?.trim());}
 deliveryCandidates(q:Record<string,string>) {
  const schedule={startDate:q.startDate,endDate:q.endDate,shiftStart:q.shiftStart,shiftEnd:q.shiftEnd,location:q.location||'',timeZone:'Asia/Kolkata'};
  validateSchedule(schedule);
  return this.volunteers.findAll().filter(v=>v.status==='active').map(v=>({id:v.id,name:v.name,email:v.email,availableNow:v.availableNow,currentLocation:v.currentLocation,locationUpdatedAt:v.locationUpdatedAt,availableFrom:v.availableFrom,availableUntil:v.availableUntil,availabilityDays:v.availabilityDays,serviceAreas:v.serviceAreas,willingToTravel:v.willingToTravel,...this.volunteers.deliveryEligibility(v.email,schedule,q.ignore)}));
 }
 requestOrderHelp(id:string,message:string,actor:Actor) {throw new BadRequestException('The seller posts shop deliveries directly to the volunteer portal; organization coordination is no longer required');}
 private program(id:string|undefined,org:string) {if(id&&this.programs.findById(id).org!==org)throw new BadRequestException('Select a program belonging to this organization');}
 inventory(actor:Actor) {
  const rows=this.receipts.flatMap(receipt=>{
   const donation=this.resources.findById(receipt.donationId);
   return receipt.items.map(item=>{
    const stockId=`${donation.id}:${item.index}`;
    const reservations=this.requests.flatMap(r=>[
      ...(['approved','partially_approved'].includes(r.status)?r.allocations.filter(a=>a.stockId===stockId).map(a=>({quantity:a.quantity,distributed:false})):[]),
      ...(r.deliveredAllocations || (r.status==='delivered'?r.allocations:[])).filter(a=>a.stockId===stockId).map(a=>({quantity:a.quantity,distributed:true}))
    ]);
    const reserved=reservations.filter(r=>!r.distributed).reduce((n,r)=>n+r.quantity,0),distributed=reservations.filter(r=>r.distributed).reduce((n,r)=>n+r.quantity,0);
    return {id:stockId,donationId:donation.id,orgName:receipt.orgName,name:donation.items[item.index].name,unit:(donation.items[item.index].unit||'unit').trim().toLowerCase(),condition:donation.items[item.index].condition,category:donation.category,received:item.quantity,reserved,distributed,available:item.quantity-reserved-distributed,programId:donation.programId,programName:donation.programName};
   });
  });
  return rows.filter(r=>actor.role==='superuser'||r.orgName===actor.org);
 }
 receive(id:string,body:ReceiptDto,actor:Actor) {
  const d=this.resources.findById(id);this.admin(actor,d.orgName||'');
  if(d.category==='Shop Delivery')throw new BadRequestException('Shop items do not become donated inventory');
  if(this.receipts.some(r=>r.donationId===id))throw new ConflictException('This donation has already been received');
  const delivery=this.deliveries.find(x=>x.kind==='collection'&&x.sourceId===id&&!['cancelled'].includes(x.status));
  if(delivery&&delivery.status!=='verified')throw new BadRequestException('Verify collection delivery proof before confirming warehouse receipt');
  if(body.items.length!==d.items.length||new Set(body.items.map(i=>i.index)).size!==d.items.length||body.items.some(i=>!d.items[i.index]||i.quantity>d.items[i.index].quantity))throw new BadRequestException('Record a usable quantity for every donated item, within the donated quantity');
  this.receipts.push({donationId:id,orgName:d.orgName||'',items:copy(body.items),receivedAt:new Date().toISOString()});
  const certificate=this.resources.recordReceipt(id,body.items);
  this.notify(d.donorEmail,'Resources received',`Your ${d.category} donation has been received by ${d.orgName}.`,'/donor-dashboard');
  this.notify(d.donorEmail,'Resource donation thank-you certificate',`Thank you! ${certificate.organization} received: ${certificate.items.map(item=>`${item.quantity} ${item.unit} ${item.name}`).join(', ')}. Your certificate is ready.`,`/donor-dashboard?resourceCertificate=${encodeURIComponent(id)}#resources`);
  return this.inventory(actor).filter(r=>r.donationId===id);
 }
 createRequest(body:ResourceRequestDto,actor:Actor) {
  if(!actor.email)throw new ForbiddenException('Sign in before requesting resources');
  const org=this.organizations.findAll().find(o=>o.name===body.orgName&&o.status==='active');if(!org)throw new BadRequestException('Select an active organization');
  const r:ResourceRequest={...body,unit:body.unit?.trim().toLowerCase()||'unit',deliveredQuantity:0,deliveredAllocations:[],id:randomUUID(),beneficiaryEmail:actor.email,status:'pending',message:'Awaiting organization response',allocations:[],approvedQuantity:0,createdAt:new Date().toISOString(),history:[]};
  this.requests.push(r);
  this.notifications.create({targetOrg:r.orgName,title:'New resource request',message:`${r.name} requested ${r.resource} (${r.quantity}).`,link:'/org-admin#requests',type:'info'});
  return copy(r);
 }
 catalog() {return this.inventory({role:'superuser',email:'',org:''}).map(s=>({name:s.name,unit:s.unit,orgName:s.orgName,available:s.available}));}
 listRequests(actor:Actor) {return copy(this.requests.filter(r=>actor.role==='superuser'||(actor.role==='admin'?equal(actor.org,r.orgName):equal(actor.email,r.beneficiaryEmail))).map(r=>({...r,deliveredQuantity:r.deliveredQuantity??(r.status==='delivered'?r.approvedQuantity:0),remainingQuantity:Math.max(0,r.quantity-(r.deliveredQuantity??(r.status==='delivered'?r.approvedQuantity:0)))})));}
 respond(id:string,body:ResourceResponseDto,actor:Actor) {
  const r=this.request(id);this.admin(actor,r.orgName);this.program(body.programId,r.orgName);
  if(['delivered','cancelled','rejected'].includes(r.status))throw new ConflictException('This request is closed');
  const running=this.deliveries.some(d=>d.kind==='resource'&&d.sourceId===id&&!['cancelled','verified'].includes(d.status));
  if(running)throw new ConflictException('Cancel or finish the delivery before changing the resource approval');
  const allocations=body.allocations||[];
  if(body.decision==='approve') {
   if(!allocations.length||new Set(allocations.map(a=>a.stockId)).size!==allocations.length)throw new BadRequestException('Select inventory and approved quantities without duplicate items');
   const total=allocations.reduce((n,a)=>n+a.quantity,0);
   if(total>r.quantity-(r.deliveredQuantity||0))throw new BadRequestException('Approved quantity cannot exceed the requested quantity');
   const stock=this.inventory(actor);
   for(const a of allocations){const row=stock.find(s=>s.id===a.stockId&&s.orgName===r.orgName);const current=r.allocations.find(x=>x.stockId===a.stockId)?.quantity||0;if(row && (row.name.trim().toLowerCase()!==r.resource.trim().toLowerCase() || row.unit!==(r.unit||'unit')))throw new BadRequestException('Allocate the exact requested resource and compatible unit; unrelated inventory cannot fulfill this request');if(!row||a.quantity>row.available+current)throw new ConflictException('Insufficient available stock; refresh inventory and adjust the approval');}
   r.allocations=copy(allocations);r.approvedQuantity=total;r.status=total<r.quantity-(r.deliveredQuantity||0)?'partially_approved':'approved';
  } else {r.allocations=[];r.approvedQuantity=0;r.status={reject:'rejected',information:'needs_information',waiting_stock:'waiting_stock',cancel:'cancelled'}[body.decision]!;}
  r.message=body.message;r.programId=body.programId||r.programId;r.history.push({at:new Date().toISOString(),message:body.message,by:actor.email||actor.role});
  this.notify(r.beneficiaryEmail,'Resource request updated',`${r.resource}: ${r.status}. ${r.message}`,'/beneficiary-dashboard');
  return copy(r);
 }
 updateRequest(id:string,message:string,programId:string|undefined,actor:Actor) {
  const r=this.request(id);
  if(actor.role==='admin'||actor.role==='superuser') {this.admin(actor,r.orgName);this.program(programId,r.orgName);if(programId)r.programId=programId;}
  else if(!equal(actor.email,r.beneficiaryEmail))throw new ForbiddenException();
  if(['delivered','cancelled','rejected'].includes(r.status))throw new BadRequestException('This request is closed');
  r.history.push({at:new Date().toISOString(),message,by:actor.email});
  if(actor.role==='beneficiary')this.notifications.create({targetOrg:r.orgName,title:'Beneficiary request update',message,link:'/org-admin#requests',type:'info'});
  else this.notify(r.beneficiaryEmail,'Resource request update',message,'/beneficiary-dashboard');
  if(r.status==='needs_information'&&actor.role==='beneficiary'){r.status='pending';r.message='Additional information submitted';}
  return copy(r);
 }
 acknowledge(id:string,message:string,actor:Actor,action='received') {
  const r=this.request(id);if(!message?.trim())throw new BadRequestException('Provide details');
  const owner=equal(r.beneficiaryEmail,actor.email);
  const at=new Date().toISOString();
  if(['investigate','resolve'].includes(action)) {
    this.admin(actor,r.orgName);if(!r.issue||['closed'].includes(r.issue.status))throw new BadRequestException('No open delivery issue');
    if(action==='resolve' && r.issue.status!=='investigating')throw new BadRequestException('Investigate the issue before proposing a resolution');
    r.issue.status=action==='resolve'?'resolved':'investigating';
    if(action==='resolve')r.issue.resolution=message;
  } else {
    if(!owner)throw new ForbiddenException();
    if(!(r.deliveredQuantity || r.status==='delivered'))throw new BadRequestException('No verified delivery yet');
    if(action==='issue') {if(r.issue&&r.issue.status!=='closed')throw new ConflictException('An issue is already open');r.issue={status:'open',message,history:[]};}
    else if(action==='close'||action==='reopen') {if(r.issue?.status!=='resolved')throw new BadRequestException('Review a proposed resolution first');r.issue.status=action==='close'?'closed':'open';}
    else if(action==='received')r.receipt=message;
    else throw new BadRequestException('Unsupported receipt action');
  }
  r.issue?.history.push({at,by:actor.email,action,message});r.history.push({at,by:actor.email,message:`${action}: ${message}`});
  if(owner)this.notifications.create({targetOrg:r.orgName,title:'Beneficiary delivery response',message,link:'/org-admin#requests',type:'info'});
  else this.notify(r.beneficiaryEmail,'Delivery issue updated',message,'/beneficiary-dashboard');
  return copy(r);
 }
 confirmOrderReceipt(id:string,actor:Actor){
  const previous=this.orders.findById(id),result=this.orders.confirmReceipt(id,actor.email);
  if(!previous.buyerReceivedAt){
   this.notify(this.sellers.findById(result.sellerId).email,'Buyer confirmed delivery received',`${result.productTitle}: the buyer confirmed receipt.`,'/seller-dashboard');
   this.notify(result.assignedVolunteerEmail||'','Buyer confirmed delivery received',`${result.productTitle}: the buyer confirmed receipt.`,'/volunteer-dashboard');
  }
  return result;
 }
 cancelOrder(id:string,reason:string,actor:Actor) {
   const order=this.orders.findById(id);
   if(!equal(order.buyerEmail,actor.email))this.canManage(actor,{kind:'order',orgName:order.organizationName||'',sellerEmail:this.sellers.findById(order.sellerId).email} as Delivery);
   if(order.deliveryStatus==='cancelled')return order;
   const d=this.deliveries.find(d=>d.kind==='order'&&d.sourceId===id&&!['cancelled','verified'].includes(d.status));
   if(d&& !['awaiting_acceptance','declined','withdrawn','returned','accepted'].includes(d.status))throw new BadRequestException('Goods must be returned before cancelling the order');
   const result=this.orders.cancel(id,reason);
   if(d){this.transition(d,'cancelled',reason);this.scheduling.release(d.id);this.notify(d.volunteerEmail||'','Order cancelled',reason,'/volunteer-dashboard');}
   this.notify(order.buyerEmail,'Order cancelled; demo payment reversed',reason,'/shop');return result;
 }
 private collectionDetails(id:string,actor:Actor){
  const donation=this.resources.findById(id);this.admin(actor,donation.orgName||'');
  const org=this.organizations.findAll().find(o=>o.name===donation.orgName);
  if(!org||!donation.pickupAddress?.trim())throw new BadRequestException('The donation needs a recipient organization and donor pickup address');
  const slot=donation.pickupTimeSlot?.trim().toLowerCase(),times=slot?.startsWith('morning')?['09:00','12:00']:slot?.startsWith('afternoon')?['12:00','16:00']:slot?.startsWith('evening')?['16:00','19:00']:null;
  if(!times)throw new BadRequestException('The donor must select a valid morning, afternoon or evening pickup slot');
  const schedule={startDate:donation.pickupDate,endDate:donation.pickupDate,shiftStart:times[0],shiftEnd:times[1],location:`${donation.pickupAddress} -> ${org.city}`,timeZone:'Asia/Kolkata'};
  validateSchedule(schedule);if(scheduleHasEnded(schedule))throw new BadRequestException('The donor pickup slot has passed. Ask the donor to update their pickup date before allocating a volunteer.');
  const parts=donation.pickupAddress.split(',').map(part=>part.trim()).filter(Boolean),last=parts.at(-1)||'';
  const pickupArea=parts.length>1&&!/\d/.test(last)&&last.length<80?last:donation.pickupAddress.trim().toLowerCase()===org.city.toLowerCase()?org.city:'Donor pickup';
  return {programName:donation.programName,pickupAddress:donation.pickupAddress,pickupDate:donation.pickupDate,pickupTimeSlot:donation.pickupTimeSlot,scheduledDate:donation.pickupDate,shiftStart:times[0],shiftEnd:times[1],pickupArea,destinationArea:org.city,address:`${org.name}, ${org.city}`,schedule};
 }
 collectionPlan(id:string,actor:Actor){
  const plan=this.collectionDetails(id,actor);
  const candidates=this.volunteers.findAll().filter(v=>v.status==='active').map(v=>({id:v.id,email:v.email,name:v.name,currentLocation:v.currentLocation,availableNow:v.availableNow,...this.volunteers.deliveryEligibility(v.email,plan.schedule)}));
  const {schedule,...details}=plan;return {...details,candidates};
 }
 orderAddresses(id:string,actor:Actor) {
  const order=this.orders.findById(id),seller=this.sellers.findById(order.sellerId);
  this.canManage(actor,{kind:"order",orgName:order.organizationName||"",sellerEmail:seller.email} as Delivery);
  return {pickupAddress:seller.pickupAddress?.trim()||"",address:order.address};
 }
 offer(body:DeliveryOfferDto,actor:Actor) {
  if(body.kind==='order'&&(actor.role!=='seller'||body.mode!=='broadcast'))throw new ForbiddenException('The seller posts shop deliveries directly to the volunteer portal');
  if(body.kind==='collection'&&body.mode!=='direct')throw new ForbiddenException('Resource donations must be allocated to a particular available volunteer by the organization admin');
  if(actor.role==='seller'&&(body.kind!=='order'||body.mode!=='broadcast'))throw new ForbiddenException('Sellers can post shop deliveries to the portal or request a volunteer through their organization admin');
  if(body.kind==='collection'){const {schedule,...plan}=this.collectionDetails(body.sourceId,actor);body={...body,...plan};}
  let details:Pick<Delivery,'title'|'orgName'|'pickupAddress'|'address'|'contact'|'recipientEmail'|'sellerEmail'>;
  if(body.kind==='collection') {
   const r=this.resources.findById(body.sourceId);if(r.category==='Shop Delivery')throw new BadRequestException('Assign shop deliveries from the shop order');this.admin(actor,r.orgName||'');
   if(this.receipts.some(x=>x.donationId===r.id)||['completed'].includes(r.status))throw new BadRequestException('Donation already received');
   details={title:`Collect ${r.category}`,orgName:r.orgName||'',pickupAddress:r.pickupAddress,address:this.collectionDetails(r.id,actor).address,contact:r.donorPhone,recipientEmail:r.donorEmail};
  } else if(body.kind==='resource') {
   const r=this.request(body.sourceId);this.admin(actor,r.orgName);
   if(!['approved','partially_approved'].includes(r.status))throw new BadRequestException('Approve and reserve resources before arranging delivery');
   details={title:`Deliver ${r.resource} (${r.approvedQuantity})`,orgName:r.orgName,pickupAddress:body.collectionAddress?.trim()||'',address:r.address,contact:r.phone,recipientEmail:r.beneficiaryEmail};
  } else {
   const r=this.orders.findById(body.sourceId),seller=this.sellers.findById(r.sellerId);
   const probe={kind:'order',orgName:r.organizationName,sellerEmail:seller.email} as Delivery;this.canManage(actor,probe);
   if(r.deliveryStatus!=='awaiting_admin_assignment')throw new BadRequestException('Order already assigned or delivered');
   details={title:`Deliver ${r.productTitle} (${r.quantity})`,orgName:r.organizationName||'',sellerEmail:seller.email,pickupAddress:body.pickupAddress?.trim()||this.orderAddresses(r.id,actor).pickupAddress,address:r.address,contact:r.buyerPhone,recipientEmail:r.buyerEmail};
  }
  if(body.kind==='order')body={...body,pickupArea:deliveryArea(details.pickupAddress,'Seller pickup area'),destinationArea:deliveryArea(details.address,'Buyer destination')};
  if(!details.pickupAddress||!details.address)throw new BadRequestException(body.kind==='order'?'Enter a seller pickup address or use the saved pickup address before posting':'Provide the exact organization collection address and recipient pickup or delivery address');
  if(this.deliveries.some(d=>d.kind===body.kind&&d.sourceId===body.sourceId&&!['cancelled','verified'].includes(d.status)))throw new ConflictException('A delivery already exists; manage or reassign it instead');
  if(!body.scheduledDate || !body.shiftStart || !body.shiftEnd || !body.pickupArea?.trim() || !body.destinationArea?.trim())throw new BadRequestException('Provide a delivery date, time window and both general areas');
  const schedule={startDate:body.scheduledDate,endDate:body.scheduledDate,shiftStart:body.shiftStart,shiftEnd:body.shiftEnd,location:`${['collection','order'].includes(body.kind)?details.pickupAddress:body.pickupArea} -> ${body.destinationArea}`,timeZone:'Asia/Kolkata'};
  validateSchedule(schedule);if(scheduleHasEnded(schedule))throw new BadRequestException('Delivery date is in the past');
  if(body.mode==='direct'){this.volunteer(body.volunteerEmail||'');const result=this.volunteers.deliveryEligibility(body.volunteerEmail!,schedule);if(!result.eligible)throw new BadRequestException(result.reasons.join('; '));}
  const now=new Date().toISOString();
  const d:Delivery={...details,scheduledDate:body.scheduledDate,shiftStart:body.shiftStart,shiftEnd:body.shiftEnd,pickupArea:body.pickupArea,destinationArea:body.destinationArea,requirements:body.requirements,allocations:body.kind==='resource'?copy(this.request(body.sourceId).allocations):undefined,quantity:body.kind==='resource'?this.request(body.sourceId).approvedQuantity:undefined,id:randomUUID(),kind:body.kind,sourceId:body.sourceId,mode:body.mode,status:'awaiting_acceptance',invitedEmail:body.mode==='direct'?body.volunteerEmail:undefined,declinedEmails:[],createdAt:now,updatedAt:now,history:[{at:now,status:'awaiting_acceptance'}]};
  this.deliveries.push(d);this.announce(d);return copy(d);
 }
 private announce(d:Delivery) {
  const emails=d.mode==='direct'?[d.invitedEmail!]:this.volunteers.findAll().filter(v=>v.status==='active').map(v=>v.email);
  for(const email of new Set(emails))this.notify(email,d.mode==='direct'?'Delivery invitation':'Delivery available',`${d.title}. Review the schedule before applying and accepting.`,d.mode==='direct'?'/volunteer-dashboard':'/volunteer-portal#resource-deliveries');
 }
 portal(actor:Actor){return this.listDeliveries(actor).filter(d=>d.kind!=='collection'&&d.mode==='broadcast'&&d.status==='awaiting_acceptance'&&d.scheduledDate&&!scheduleHasEnded({startDate:d.scheduledDate,endDate:d.scheduledDate,shiftStart:d.shiftStart,shiftEnd:d.shiftEnd,location:d.pickupArea||''}));}
 listDeliveries(actor:Actor) {
  return copy(this.deliveries.filter(d=>actor.role==='superuser'||(actor.role==='admin'&&equal(actor.org,d.orgName))||(actor.role==='seller'&&equal(actor.email,d.sellerEmail))||equal(actor.email,d.recipientEmail)||equal(actor.email,d.volunteerEmail)||(actor.role==='volunteer'&&(d.kind!=='collection'||d.mode==='direct')&&d.status==='awaiting_acceptance'&&!d.declinedEmails.some(e=>equal(e,actor.email))&&(d.mode==='broadcast'||equal(d.invitedEmail,actor.email)))).map(d=>{
   const manager=actor.role==='superuser'||(actor.role==='admin'&&equal(actor.org,d.orgName))||(actor.role==='seller'&&equal(actor.email,d.sellerEmail));
   if(manager||equal(actor.email,d.volunteerEmail)||equal(actor.email,d.recipientEmail))return d;
   return {...d,pickupAddress:'Details shared after acceptance',address:'Details shared after acceptance',contact:'',recipientEmail:'',sellerEmail:undefined,declinedEmails:[],history:[]};
  }));
 }
 reoffer(id:string,body:DeliveryOfferDto,actor:Actor) {
  if(actor.role==='seller'&&body.mode!=='broadcast')throw new ForbiddenException('Sellers cannot directly invite volunteers; post to the portal or contact the organization admin');
  const d=this.ownedDelivery(id);this.canManage(actor,d);
  if(d.kind==='order'&&(actor.role!=='seller'||body.mode!=='broadcast'))throw new ForbiddenException('Only the seller can repost shop deliveries to the portal');
  if(d.kind==='collection'&&body.mode!=='direct')throw new ForbiddenException('Allocate a particular available volunteer to resource donations');
  if(d.kind==='order'){const addresses=this.orderAddresses(d.sourceId,actor);const pickup=body.pickupAddress?.trim()||addresses.pickupAddress;body={...body,pickupArea:deliveryArea(pickup,'Seller pickup area'),destinationArea:deliveryArea(addresses.address,'Buyer destination')};}
  if(!['awaiting_acceptance','declined','withdrawn','returned'].includes(d.status))throw new BadRequestException('Only an unclaimed or returned delivery can be reassigned');
  if(d.kind==='collection'){const {schedule,...plan}=this.collectionDetails(d.sourceId,actor);body={...body,...plan};}
  if(!body.scheduledDate || !body.shiftStart || !body.shiftEnd || !body.pickupArea?.trim() || !body.destinationArea?.trim())throw new BadRequestException('Provide a delivery date, time window and both general areas');
  const schedule={startDate:body.scheduledDate,endDate:body.scheduledDate,shiftStart:body.shiftStart,shiftEnd:body.shiftEnd,location:`${d.kind==='collection'?this.resources.findById(d.sourceId).pickupAddress:d.kind==='order'?(body.pickupAddress?.trim()||this.orderAddresses(d.sourceId,actor).pickupAddress):body.pickupArea} -> ${body.destinationArea}`,timeZone:'Asia/Kolkata'};
  validateSchedule(schedule);if(scheduleHasEnded(schedule))throw new BadRequestException('Delivery date is in the past');
  if(body.mode==='direct'){this.volunteer(body.volunteerEmail||'');const result=this.volunteers.deliveryEligibility(body.volunteerEmail!,schedule);if(!result.eligible)throw new BadRequestException(result.reasons.join('; '));}
  if(body.collectionAddress?.trim()){if(d.kind==='resource')d.pickupAddress=body.collectionAddress.trim();}
  if(d.kind==='collection'){const plan=this.collectionDetails(d.sourceId,actor);d.pickupAddress=plan.pickupAddress;d.address=plan.address;}
  if(d.kind==='order') {
   const addresses=this.orderAddresses(d.sourceId,actor);
   addresses.pickupAddress=body.pickupAddress?.trim()||addresses.pickupAddress;
   if(!addresses.pickupAddress)throw new BadRequestException("Enter a seller pickup address or use the saved pickup address before reposting");
   Object.assign(d,addresses);
  }
  this.scheduling.release(d.id);
  Object.assign(d,{scheduledDate:body.scheduledDate,shiftStart:body.shiftStart,shiftEnd:body.shiftEnd,pickupArea:body.pickupArea,destinationArea:body.destinationArea,requirements:body.requirements});
  d.mode=body.mode;d.invitedEmail=body.mode==='direct'?body.volunteerEmail:undefined;d.volunteerEmail=undefined;d.volunteerName=undefined;d.declinedEmails=[];this.transition(d,'awaiting_acceptance');this.announce(d);return copy(d);
 }
 private transition(d:Delivery,status:string,note?:string) {d.status=status;d.updatedAt=new Date().toISOString();d.history.push({at:d.updatedAt,status,note});}
 private deliveryVersion(d:Delivery){return JSON.stringify([d.id,d.status,d.mode,d.invitedEmail,d.scheduledDate,d.shiftStart,d.shiftEnd,d.pickupAddress,d.address,d.requirements]);}
 private deliverySchedule(d:Delivery){return {startDate:d.scheduledDate||'',endDate:d.scheduledDate||'',shiftStart:d.shiftStart,shiftEnd:d.shiftEnd,location:`${['collection','order'].includes(d.kind)?d.pickupAddress:d.pickupArea||''} -> ${d.kind==='order'?d.address:d.destinationArea||''}`,timeZone:'Asia/Kolkata'};}
 brief(id:string,actor:Actor){
  if(actor.role!=='volunteer')throw new ForbiddenException('Sign in as a volunteer to review this delivery');
  this.volunteer(actor.email);const d=this.ownedDelivery(id);
  const open=d.status==='awaiting_acceptance'&&(d.mode==='broadcast'&&d.kind!=='collection'||d.mode==='direct'&&equal(d.invitedEmail,actor.email))&&!d.declinedEmails.some(email=>equal(email,actor.email));
  if(!open&&!equal(d.volunteerEmail,actor.email))throw new ForbiddenException('This delivery is no longer offered to you');
  const schedule=this.deliverySchedule(d);validateSchedule(schedule);
  const eligibility=this.volunteers.eligibility(actor.email,schedule,d.id),confirmed=d.mode==='broadcast'?this.volunteers.portalEligibility(actor.email,schedule,d.id,true):this.volunteers.deliveryEligibility(actor.email,schedule,d.id);
  const blockers=[...confirmed.reasons];if(scheduleHasEnded(schedule))blockers.push('The pickup window has expired; the seller or coordinator must repost it');
  let items:{name:string;quantity:number;unit?:string;condition?:string}[]=[],sellerName='';
  if(d.kind==='order'){const order=this.orders.findById(d.sourceId);sellerName=this.sellers.findById(order.sellerId).businessName;items=[{name:order.productTitle,quantity:order.quantity}];if(order.deliveryStatus!=='awaiting_admin_assignment'&&open)blockers.push('The source order is no longer awaiting a volunteer');}
  else if(d.kind==='collection')items=this.resources.findById(d.sourceId).items;
  else {const request=this.request(d.sourceId);items=[{name:request.resource,quantity:d.quantity||request.approvedQuantity,unit:request.unit}];}
  return {id:d.id,kind:d.kind,title:d.title,status:d.status,mode:d.mode,orgName:d.orgName,sellerName,pickupAddress:d.pickupAddress,address:d.address,contact:d.contact,scheduledDate:d.scheduledDate,shiftStart:d.shiftStart,shiftEnd:d.shiftEnd,requirements:d.requirements,items,reviewedVersion:this.deliveryVersion(d),available:open&&!blockers.length,blockers,eligibility,confirmationRequired:d.mode==='broadcast',warnings:confirmed.warnings,conflicts:confirmed.conflicts};
 }
 act(id:string,action:string,reason:string|undefined,actor:Actor,consent:{confirmAvailability?:boolean;confirmConflict?:boolean;reviewedVersion?:string}={}) {
  const d=this.ownedDelivery(id);
  if(action==='accept'&&d.status==='accepted'&&equal(d.volunteerEmail,actor.email)&&actor.role==='volunteer')return copy(d);
  if(action==='accept'&&consent.reviewedVersion&&consent.reviewedVersion!==this.deliveryVersion(d))throw new ConflictException('The delivery details changed. Review the latest details before accepting.');
  if(action==='accept'&&d.kind==='collection'&&d.mode==='broadcast')throw new ConflictException('Resource donations must be allocated by the organization admin to a particular volunteer');
  if(action==='accept'||action==='decline') {
   if(actor.role!=='volunteer')throw new ForbiddenException('Only volunteers can respond to delivery offers');
   const v=this.volunteer(actor.email);
   if(d.status!=='awaiting_acceptance')throw new ConflictException('Already assigned or no longer available. Refresh delivery offers.');
   if(d.mode==='direct'&&!equal(d.invitedEmail,actor.email))throw new ForbiddenException('This invitation is for another volunteer');
   if(d.declinedEmails.some(e=>equal(e,actor.email)))throw new ConflictException('You already declined this offer');
   if(action==='decline'){d.declinedEmails.push(actor.email);if(d.mode==='direct'){this.transition(d,'declined');notifyDeliveryManagers(this.notifications,this.users,d.kind==='order'?undefined:d.orgName,d.sellerEmail,'Delivery invitation declined',`${v.name} declined ${d.title}. Please arrange another volunteer.`);}return copy(d);}
   const schedule=this.deliverySchedule(d);
   if(scheduleHasEnded(schedule))throw new BadRequestException('Delivery offer has expired; ask the coordinator to reschedule');
   const eligibility=d.mode==='direct'?this.volunteers.deliveryEligibility(actor.email,schedule,id):this.volunteers.portalEligibility(actor.email,schedule,id,consent.confirmAvailability===true);if(!eligibility.eligible)throw new BadRequestException(eligibility.reasons.join('; '));
   const conflicts=this.scheduling.conflicts(actor.email,schedule,id);
   if(conflicts.length&&consent.confirmConflict!==true)throw new BadRequestException('Conflicts with '+conflicts.join(', ')+'. Acknowledge the scheduling conflict before accepting.');
   this.scheduling.reserve(id,actor.email,d.title,schedule,consent.confirmConflict===true);
   // Claim and source assignment are synchronous; release the reservation if the source rejects the claim.
   try{if(d.kind==='order')this.orders.assignVolunteer(d.sourceId,v.email,v.name);if(d.kind==='collection')this.resources.assignVolunteer(d.sourceId,v.name,v.email);}
   catch(error){this.scheduling.release(id);throw error;}
   d.volunteerEmail=v.email;d.volunteerName=v.name;d.scheduleConflicts=conflicts;this.transition(d,'accepted',conflicts.length?'Scheduling conflict acknowledged: '+conflicts.join(', '):undefined);
   notifyDeliveryManagers(this.notifications,this.users,d.kind==='order'?undefined:d.orgName,d.sellerEmail,d.mode==='broadcast'?'Portal delivery application accepted':'Volunteer accepted delivery',`${v.name} ${d.mode==='broadcast'?'applied through the portal and accepted':'accepted'} ${d.title}. This delivery is assigned to this volunteer only.${conflicts.length?' Scheduling conflict acknowledged: '+conflicts.join(', '):''}`);
   this.notify(d.recipientEmail,'Delivery assigned',`${d.title} has been accepted.`,d.kind==='collection'?'/donor-dashboard':d.kind==='order'?'/shop':'/beneficiary-dashboard');
  } else if(action==='cancel'||action==='return') {
   this.canManage(actor,d);
   if(action==='cancel'&&!['awaiting_acceptance','declined','withdrawn','returned','accepted'].includes(d.status))throw new BadRequestException('After pickup, record a failed delivery and confirm the stock return first');
   if(action==='return'&&d.status!=='failed')throw new BadRequestException('Only a failed delivery can be returned');
   if(!reason?.trim())throw new BadRequestException('Provide a reason');
   this.transition(d,action==='cancel'?'cancelled':'returned',reason);this.scheduling.release(d.id);
   if(d.kind==='order')this.orders.releaseDelivery(d.sourceId);
   if(d.kind==='collection')this.resources.releaseDelivery(d.sourceId);
   if(action==='cancel'&&d.kind==='resource'){const r=this.request(d.sourceId);r.status=(r.deliveredQuantity||0)>0?'partially_delivered':'waiting_stock';r.allocations=[];r.approvedQuantity=0;r.message=reason;}
   this.notify(d.volunteerEmail||'','Delivery updated',`${d.title}: ${d.status}. ${reason}`,'/volunteer-dashboard');
  } else {
   if(!equal(actor.email,d.volunteerEmail))throw new ForbiddenException('Only the assigned volunteer can update this delivery');
   const pending=this.proofs.all().some(p=>p.collection==='deliveries'&&p.recordId===id&&p.status!=='rejected');
   if(pending)throw new BadRequestException('Delivery proof is awaiting review or has been verified');
   if(action==='report'){if(!['accepted','picked_up','in_transit'].includes(d.status)||!reason?.trim())throw new BadRequestException('Submit a progress report for your active delivery');this.transition(d,d.status,`${d.kind==='collection'?'Collection':'Delivery'} report: ${reason.trim()}`);}
   else if(action==='withdraw') {if(d.status!=='accepted')throw new BadRequestException('Withdrawal is only allowed before pickup');if(!reason?.trim())throw new BadRequestException('Provide a withdrawal reason');this.transition(d,'withdrawn',reason);this.scheduling.release(d.id);if(d.kind==='order')this.orders.releaseDelivery(d.sourceId);if(d.kind==='collection')this.resources.releaseDelivery(d.sourceId);d.volunteerEmail=undefined;d.volunteerName=undefined;}
   else if(action==='picked_up') {if(d.status!=='accepted')throw new BadRequestException('Accept the delivery before pickup');if(d.kind==='order'){this.orders.updateDeliveryStatus(d.sourceId,'pickup_started');this.orders.updateDeliveryStatus(d.sourceId,'picked_up');}if(d.kind==='collection')this.resources.startPickup(d.sourceId);this.transition(d,'picked_up');}
   else if(action==='in_transit') {if(d.status!=='picked_up')throw new BadRequestException('Confirm pickup first');if(d.kind==='order')this.orders.updateDeliveryStatus(d.sourceId,'in_transit');this.transition(d,'in_transit');}
   else if(action==='failed') {if(!['accepted','picked_up','in_transit'].includes(d.status)||!reason?.trim())throw new BadRequestException('Provide a failure reason for an active delivery');d.reason=reason;this.transition(d,'failed',reason);}
   else throw new BadRequestException('Unsupported delivery action');
  }
  if(!['accept','decline'].includes(action))notifyDeliveryManagers(this.notifications,this.users,d.kind==='order'?undefined:d.orgName,d.sellerEmail,'Delivery coordination update',`${d.title}: ${d.status}. ${reason||''}`);
  return copy(d);
 }
 complete(id:string) {
  const d=this.ownedDelivery(id);this.proofs.assertVerified('deliveries',id);
  if(d.status!=='in_transit')throw new BadRequestException('Delivery must be out for delivery before verification');
  if(d.kind==='resource'){const r=this.request(d.sourceId);r.deliveredAllocations ||= [];r.deliveredAllocations.push(...(d.allocations||r.allocations));r.deliveredQuantity=(r.deliveredQuantity||0)+(d.quantity||r.approvedQuantity);r.allocations=[];r.approvedQuantity=0;r.status=r.deliveredQuantity<r.quantity?'partially_delivered':'delivered';r.message=r.status==='delivered'?'Requested quantity delivered':'Partial delivery verified; remaining quantity stays open';for(const sourceId of new Set((d.allocations||r.deliveredAllocations||[]).map(a=>a.stockId.split(':')[0]))){const donation=this.resources.findById(sourceId);this.notify(donation.donorEmail,'Donated resources distributed',`Resources from your ${donation.category} donation have been delivered to a beneficiary.`,'/donor-dashboard');}}
  if(d.kind==='order')this.orders.completeSharedDelivery(d.sourceId);
  if(d.kind==='collection')this.resources.completeSharedDelivery(d.sourceId);
  this.transition(d,'verified');this.scheduling.release(d.id);this.notify(d.recipientEmail,'Delivery verified',`${d.title} is complete.` ,d.kind==='collection'?'/donor-dashboard':d.kind==='order'?'/shop':'/beneficiary-dashboard');
  return copy(d);
 }
 proofReviewer(id:string,actor:Actor) {const d=this.ownedDelivery(id);if(actor.role==='superuser')return;if(d.kind==='order'){if(actor.role!=='seller'||!equal(actor.email,d.sellerEmail))throw new ForbiddenException('The seller verifies shop delivery proof; platform admin can resolve disputes');}else this.admin(actor,d.orgName);}
}
