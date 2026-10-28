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
interface Allocation {stockId:string;quantity:number;}
export interface ResourceRequest {
 id:string;orgName:string;resource:string;quantity:number;reason:string;address:string;phone:string;name:string;beneficiaryEmail:string;photoUrl?:string;
 status:string;message:string;allocations:Allocation[];approvedQuantity:number;programId?:string;createdAt:string;history:{at:string;message:string;by:string}[];
 receipt?:string;
}
export interface Delivery {
 id:string;kind:'collection'|'resource'|'order';sourceId:string;title:string;orgName:string;sellerEmail?:string;mode:string;status:string;
 invitedEmail?:string;volunteerEmail?:string;volunteerName?:string;pickupAddress:string;address:string;contact:string;recipientEmail:string;
 reason?:string;declinedEmails:string[];createdAt:string;updatedAt:string;history:{at:string;status:string;note?:string}[];
}
interface Receipt {donationId:string;orgName:string;items:{index:number;quantity:number}[];receivedAt:string;}
const equal = (a?:string,b?:string) => !!a && !!b && a.toLowerCase() === b.toLowerCase();
const copy = <T>(value:T):T => JSON.parse(JSON.stringify(value));

@Injectable()
export class FulfillmentService {
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
 private volunteer(email:string) {const v=this.volunteers.findAll().find(v=>equal(v.email,email)&&v.status==='active');if(!v)throw new ForbiddenException('An active volunteer profile is required to accept deliveries');return v;}
 availableVolunteers() {return this.volunteers.findAll().filter(v=>v.status==='active').map(v=>({id:v.id,name:v.name,email:v.email}));}
 private program(id:string|undefined,org:string) {if(id&&this.programs.findById(id).org!==org)throw new BadRequestException('Select a program belonging to this organization');}
 inventory(actor:Actor) {
  const rows=this.receipts.flatMap(receipt=>{
   const donation=this.resources.findById(receipt.donationId);
   return receipt.items.map(item=>{
    const stockId=`${donation.id}:${item.index}`;
    const reservations=this.requests.filter(r=>['approved','partially_approved','delivered'].includes(r.status)).flatMap(r=>r.allocations.filter(a=>a.stockId===stockId).map(a=>({quantity:a.quantity,distributed:r.status==='delivered'})));
    const reserved=reservations.filter(r=>!r.distributed).reduce((n,r)=>n+r.quantity,0),distributed=reservations.filter(r=>r.distributed).reduce((n,r)=>n+r.quantity,0);
    return {id:stockId,donationId:donation.id,orgName:receipt.orgName,name:donation.items[item.index].name,condition:donation.items[item.index].condition,category:donation.category,received:item.quantity,reserved,distributed,available:item.quantity-reserved-distributed,programId:donation.programId,programName:donation.programName};
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
  this.resources.recordReceipt(id);
  this.notify(d.donorEmail,'Resources received',`Your ${d.category} donation has been received by ${d.orgName}.`,'/donor-dashboard');
  return this.inventory(actor).filter(r=>r.donationId===id);
 }
 createRequest(body:ResourceRequestDto,actor:Actor) {
  if(!actor.email)throw new ForbiddenException('Sign in before requesting resources');
  const org=this.organizations.findAll().find(o=>o.name===body.orgName&&o.status==='active');if(!org)throw new BadRequestException('Select an active organization');
  const r:ResourceRequest={...body,id:randomUUID(),beneficiaryEmail:actor.email,status:'pending',message:'Awaiting organization response',allocations:[],approvedQuantity:0,createdAt:new Date().toISOString(),history:[]};
  this.requests.push(r);
  this.notifications.create({targetOrg:r.orgName,title:'New resource request',message:`${r.name} requested ${r.resource} (${r.quantity}).`,link:'/org-admin#requests',type:'info'});
  return copy(r);
 }
 listRequests(actor:Actor) {return copy(this.requests.filter(r=>actor.role==='superuser'||(actor.role==='admin'?equal(actor.org,r.orgName):equal(actor.email,r.beneficiaryEmail))));}
 respond(id:string,body:ResourceResponseDto,actor:Actor) {
  const r=this.request(id);this.admin(actor,r.orgName);this.program(body.programId,r.orgName);
  if(['delivered','cancelled','rejected'].includes(r.status))throw new ConflictException('This request is closed');
  const running=this.deliveries.some(d=>d.kind==='resource'&&d.sourceId===id&&!['cancelled'].includes(d.status));
  if(running)throw new ConflictException('Cancel or finish the delivery before changing the resource approval');
  const allocations=body.allocations||[];
  if(body.decision==='approve') {
   if(!allocations.length||new Set(allocations.map(a=>a.stockId)).size!==allocations.length)throw new BadRequestException('Select inventory and approved quantities without duplicate items');
   const total=allocations.reduce((n,a)=>n+a.quantity,0);
   if(total>r.quantity)throw new BadRequestException('Approved quantity cannot exceed the requested quantity');
   const stock=this.inventory(actor);
   for(const a of allocations){const row=stock.find(s=>s.id===a.stockId&&s.orgName===r.orgName);const current=r.allocations.find(x=>x.stockId===a.stockId)?.quantity||0;if(!row||a.quantity>row.available+current)throw new ConflictException('Insufficient available stock; refresh inventory and adjust the approval');}
   r.allocations=copy(allocations);r.approvedQuantity=total;r.status=total<r.quantity?'partially_approved':'approved';
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
 acknowledge(id:string,message:string,actor:Actor) {
  const r=this.request(id);if(!equal(r.beneficiaryEmail,actor.email))throw new ForbiddenException();
  if(r.status!=='delivered')throw new BadRequestException('Delivery has not been verified yet');
  r.receipt=message;r.history.push({at:new Date().toISOString(),message,by:actor.email});
  this.notifications.create({targetOrg:r.orgName,title:'Beneficiary delivery response',message,link:'/org-admin#requests',type:'info'});return copy(r);
 }
 offer(body:DeliveryOfferDto,actor:Actor) {
  let details:Pick<Delivery,'title'|'orgName'|'pickupAddress'|'address'|'contact'|'recipientEmail'|'sellerEmail'>;
  if(body.kind==='collection') {
   const r=this.resources.findById(body.sourceId);if(r.category==='Shop Delivery')throw new BadRequestException('Assign shop deliveries from the shop order');this.admin(actor,r.orgName||'');
   if(this.receipts.some(x=>x.donationId===r.id)||['completed'].includes(r.status))throw new BadRequestException('Donation already received');
   details={title:`Collect ${r.category}`,orgName:r.orgName||'',pickupAddress:r.pickupAddress,address:body.collectionAddress?.trim()||`${r.orgName} collection point`,contact:r.donorPhone,recipientEmail:r.donorEmail};
  } else if(body.kind==='resource') {
   const r=this.request(body.sourceId);this.admin(actor,r.orgName);
   if(!['approved','partially_approved'].includes(r.status))throw new BadRequestException('Approve and reserve resources before arranging delivery');
   details={title:`Deliver ${r.resource} (${r.approvedQuantity})`,orgName:r.orgName,pickupAddress:body.collectionAddress?.trim()||`${r.orgName} collection point`,address:r.address,contact:r.phone,recipientEmail:r.beneficiaryEmail};
  } else {
   const r=this.orders.findById(body.sourceId),seller=this.sellers.findById(r.sellerId);
   const probe={kind:'order',orgName:r.organizationName,sellerEmail:seller.email} as Delivery;this.canManage(actor,probe);
   if(r.deliveryStatus!=='awaiting_admin_assignment')throw new BadRequestException('Order already assigned or delivered');
   details={title:`Deliver ${r.productTitle} (${r.quantity})`,orgName:r.organizationName||'',sellerEmail:seller.email,pickupAddress:seller.businessName,address:r.address,contact:r.buyerPhone,recipientEmail:r.buyerEmail};
  }
  if(this.deliveries.some(d=>d.kind===body.kind&&d.sourceId===body.sourceId&&d.status!=='cancelled'))throw new ConflictException('A delivery already exists; manage or reassign it instead');
  if(body.mode==='direct')this.volunteer(body.volunteerEmail||'');
  const now=new Date().toISOString();
  const d:Delivery={...details,id:randomUUID(),kind:body.kind,sourceId:body.sourceId,mode:body.mode,status:'awaiting_acceptance',invitedEmail:body.mode==='direct'?body.volunteerEmail:undefined,declinedEmails:[],createdAt:now,updatedAt:now,history:[{at:now,status:'awaiting_acceptance'}]};
  this.deliveries.push(d);this.announce(d);return copy(d);
 }
 private announce(d:Delivery) {
  const emails=d.mode==='direct'?[d.invitedEmail!]:this.volunteers.findAll().filter(v=>v.status==='active').map(v=>v.email);
  for(const email of new Set(emails))this.notify(email,d.mode==='direct'?'Delivery invitation':'Delivery available',`${d.title}. Accept to take this delivery.`,'/volunteer-dashboard');
 }
 listDeliveries(actor:Actor) {
  return copy(this.deliveries.filter(d=>actor.role==='superuser'||(actor.role==='admin'&&equal(actor.org,d.orgName))||(actor.role==='seller'&&equal(actor.email,d.sellerEmail))||equal(actor.email,d.recipientEmail)||equal(actor.email,d.volunteerEmail)||(actor.role==='volunteer'&&d.status==='awaiting_acceptance'&&!d.declinedEmails.some(e=>equal(e,actor.email))&&(d.mode==='broadcast'||equal(d.invitedEmail,actor.email)))).map(d=>{
   const manager=actor.role==='superuser'||(actor.role==='admin'&&equal(actor.org,d.orgName))||(actor.role==='seller'&&equal(actor.email,d.sellerEmail));
   if(manager||equal(actor.email,d.volunteerEmail)||equal(actor.email,d.recipientEmail))return d;
   return {...d,pickupAddress:'Details shared after acceptance',address:'Details shared after acceptance',contact:'',recipientEmail:'',sellerEmail:undefined,declinedEmails:[],history:[]};
  }));
 }
 reoffer(id:string,body:DeliveryOfferDto,actor:Actor) {
  const d=this.ownedDelivery(id);this.canManage(actor,d);
  if(!['awaiting_acceptance','declined','withdrawn','returned'].includes(d.status))throw new BadRequestException('Only an unclaimed or returned delivery can be reassigned');
  if(body.mode==='direct')this.volunteer(body.volunteerEmail||'');
  if(body.collectionAddress?.trim()){if(d.kind==='collection')d.address=body.collectionAddress.trim();if(d.kind==='resource')d.pickupAddress=body.collectionAddress.trim();}
  d.mode=body.mode;d.invitedEmail=body.mode==='direct'?body.volunteerEmail:undefined;d.volunteerEmail=undefined;d.volunteerName=undefined;d.declinedEmails=[];this.transition(d,'awaiting_acceptance');this.announce(d);return copy(d);
 }
 private transition(d:Delivery,status:string,note?:string) {d.status=status;d.updatedAt=new Date().toISOString();d.history.push({at:d.updatedAt,status,note});}
 act(id:string,action:string,reason:string|undefined,actor:Actor) {
  const d=this.ownedDelivery(id);
  if(action==='accept'||action==='decline') {
   if(actor.role!=='volunteer')throw new ForbiddenException('Only volunteers can respond to delivery offers');
   const v=this.volunteer(actor.email);
   if(d.status!=='awaiting_acceptance')throw new ConflictException('Already assigned or no longer available. Refresh delivery offers.');
   if(d.mode==='direct'&&!equal(d.invitedEmail,actor.email))throw new ForbiddenException('This invitation is for another volunteer');
   if(d.declinedEmails.some(e=>equal(e,actor.email)))throw new ConflictException('You already declined this offer');
   if(action==='decline'){d.declinedEmails.push(actor.email);if(d.mode==='direct')this.transition(d,'declined');return copy(d);}
   // No await between checking and assigning: competing accepts have exactly one winner.
   if(d.kind==='order')this.orders.assignVolunteer(d.sourceId,v.email,v.name);
   if(d.kind==='collection')this.resources.assignVolunteer(d.sourceId,v.name,v.email);
   d.volunteerEmail=v.email;d.volunteerName=v.name;this.transition(d,'accepted');
   this.notify(d.recipientEmail,'Delivery assigned',`${d.title} has been accepted.`,'/beneficiary-dashboard');
  } else if(action==='cancel'||action==='return') {
   this.canManage(actor,d);
   if(action==='cancel'&&!['awaiting_acceptance','declined','withdrawn','returned','accepted'].includes(d.status))throw new BadRequestException('After pickup, record a failed delivery and confirm the stock return first');
   if(action==='return'&&d.status!=='failed')throw new BadRequestException('Only a failed delivery can be returned');
   if(!reason?.trim())throw new BadRequestException('Provide a reason');
   this.transition(d,action==='cancel'?'cancelled':'returned',reason);
   if(d.kind==='order')this.orders.releaseDelivery(d.sourceId);
   if(d.kind==='collection')this.resources.releaseDelivery(d.sourceId);
   if(action==='cancel'&&d.kind==='resource'){const r=this.request(d.sourceId);r.status='cancelled';r.allocations=[];r.approvedQuantity=0;r.message=reason;}
   this.notify(d.volunteerEmail||'','Delivery updated',`${d.title}: ${d.status}. ${reason}`,'/volunteer-dashboard');
  } else {
   if(!equal(actor.email,d.volunteerEmail))throw new ForbiddenException('Only the assigned volunteer can update this delivery');
   const pending=this.proofs.all().some(p=>p.collection==='deliveries'&&p.recordId===id&&p.status!=='rejected');
   if(pending)throw new BadRequestException('Delivery proof is awaiting review or has been verified');
   if(action==='withdraw') {if(d.status!=='accepted')throw new BadRequestException('Withdrawal is only allowed before pickup');if(!reason?.trim())throw new BadRequestException('Provide a withdrawal reason');this.transition(d,'withdrawn',reason);if(d.kind==='order')this.orders.releaseDelivery(d.sourceId);if(d.kind==='collection')this.resources.releaseDelivery(d.sourceId);d.volunteerEmail=undefined;d.volunteerName=undefined;}
   else if(action==='picked_up') {if(d.status!=='accepted')throw new BadRequestException('Accept the delivery before pickup');if(d.kind==='order'){this.orders.updateDeliveryStatus(d.sourceId,'pickup_started');this.orders.updateDeliveryStatus(d.sourceId,'picked_up');}if(d.kind==='collection')this.resources.startPickup(d.sourceId);this.transition(d,'picked_up');}
   else if(action==='in_transit') {if(d.status!=='picked_up')throw new BadRequestException('Confirm pickup first');if(d.kind==='order')this.orders.updateDeliveryStatus(d.sourceId,'in_transit');this.transition(d,'in_transit');}
   else if(action==='failed') {if(!['accepted','picked_up','in_transit'].includes(d.status)||!reason?.trim())throw new BadRequestException('Provide a failure reason for an active delivery');d.reason=reason;this.transition(d,'failed',reason);}
   else throw new BadRequestException('Unsupported delivery action');
  }
  return copy(d);
 }
 complete(id:string) {
  const d=this.ownedDelivery(id);this.proofs.assertVerified('deliveries',id);
  if(d.status!=='in_transit')throw new BadRequestException('Delivery must be out for delivery before verification');
  if(d.kind==='resource'){const r=this.request(d.sourceId);r.status='delivered';r.message='Delivery proof verified';for(const sourceId of new Set(r.allocations.map(a=>a.stockId.split(':')[0]))){const donation=this.resources.findById(sourceId);this.notify(donation.donorEmail,'Donated resources distributed',`Resources from your ${donation.category} donation have been delivered to a beneficiary.`,'/donor-dashboard');}}
  if(d.kind==='order')this.orders.completeSharedDelivery(d.sourceId);
  if(d.kind==='collection')this.resources.completeSharedDelivery(d.sourceId);
  this.transition(d,'verified');this.notify(d.recipientEmail,'Delivery verified',`${d.title} is complete.` ,d.kind==='collection'?'/donor-dashboard':d.kind==='order'?'/shop':'/beneficiary-dashboard');
  return copy(d);
 }
 proofReviewer(id:string,actor:Actor) {const d=this.ownedDelivery(id);if(actor.role==='superuser')return;if(d.kind==='order'){if(actor.role!=='seller'||!equal(actor.email,d.sellerEmail))throw new ForbiddenException('The seller verifies shop delivery proof; platform admin can resolve disputes');}else this.admin(actor,d.orgName);}
}
