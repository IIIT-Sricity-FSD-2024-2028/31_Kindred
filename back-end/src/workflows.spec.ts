import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ProgramsService } from './modules/programs/service';
import { ProgramAssignmentsService } from './modules/program-assignments/service';
import { ProgramApplicationsService } from './modules/program-applications/service';
import { VolunteersService } from './modules/volunteers/service';
import { ParticipationService } from './modules/participation/service';
import { TasksService } from './modules/tasks/service';
import { SubtasksService } from './modules/subtasks/service';
import { ProofStore } from './modules/proofs/store';
import { ProofsController } from './modules/proofs/controller';
import { FulfillmentService } from './modules/fulfillment/service';
import { ResourceDonationsService } from './modules/resource-donations/service';
import { OrdersService } from './modules/orders/service';
import { ProductsService } from './modules/products/service';
import { SellersService } from './modules/sellers/service';
import { ReplacementsService } from './modules/replacements/service';
import { SchedulingService, scheduleOverlaps, scheduleHasEnded } from './common/scheduling';
import { NotificationsService } from './modules/notifications/service';
import { ParticipationController } from './modules/participation/controller';
import { UsersService } from './modules/users/service';
import { OrganizationsService } from './modules/organizations/service';

describe('Connected business workflows (real Nest services)',()=>{
 let module:TestingModule;
 let programs:ProgramsService,assignments:ProgramAssignmentsService,volunteers:VolunteersService,participation:ParticipationService,tasks:TasksService,subtasks:SubtasksService,proofs:ProofStore,fulfillment:FulfillmentService,resources:ResourceDonationsService,orders:OrdersService,products:ProductsService,sellers:SellersService,replacements:ReplacementsService;
 const admin={role:'admin',email:'admin@hopeconnect.org',org:'HopeConnect'};
 const sellerActor={role:'seller',email:'seller@kindred.org',org:'HopeConnect'};
 const actor=(email:string)=>({role:'volunteer',email,org:'HopeConnect'});
 const schedule={startDate:'2099-01-01',endDate:'2099-01-07',shiftStart:'09:00',shiftEnd:'12:00',location:'Mumbai',timeZone:'Asia/Kolkata'};
 beforeEach(async()=>{
   module=await Test.createTestingModule({imports:[AppModule]}).compile();await module.init();
   programs=module.get(ProgramsService);assignments=module.get(ProgramAssignmentsService);volunteers=module.get(VolunteersService);participation=module.get(ParticipationService);tasks=module.get(TasksService);subtasks=module.get(SubtasksService);proofs=module.get(ProofStore);fulfillment=module.get(FulfillmentService);resources=module.get(ResourceDonationsService);orders=module.get(OrdersService);products=module.get(ProductsService);sellers=module.get(SellersService);replacements=module.get(ReplacementsService);
 });
 afterEach(async()=>{await module.close();});
 function program(){return programs.create({name:'Future community work',org:'HopeConnect',focus:'Education',budget:100,description:'Teach children and distribute learning materials',workBrief:'Teach 2 hours; coordinator supplies equipment',meetingPoint:'Mumbai central hall',contactName:'Coordinator',contactPhone:'9812345678',reportingTime:'08:45',invitationDeadline:'2098-12-30',shiftDays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],...schedule});}
 function member(programId:string,email='volunteer@kindred.org'){
   const v=volunteers.findByEmail(email)!;volunteers.updatePresence(email,{currentLocation:'Mumbai',availableFrom:'2099-01-01',availableUntil:'2099-12-31',willingToTravel:true});
   const a=assignments.create({programId,programName:programs.findById(programId).name,volunteerName:v.name,volunteerEmail:email,role:'Volunteer'});
   return assignments.respond(a.id,email,'accepted',{version:1,attendanceConfirmed:true});
 }
 function verify(collection:string,id:string,email:string){const proof=proofs.submit({collection,recordId:id,title:'Work',organization:'HopeConnect',volunteerEmail:email,image:'/evidence.png'});proofs.get(proof.id).status='approved';}

 it('requires an explicit recipient organization and routes donations to a matching current program',()=>{
   const p=program(),organizations=module.get(OrganizationsService);
   const org=organizations.findAll().find(o=>o.name==='HopeConnect')!;
   const other=organizations.findAll().find(o=>o.name==='MyTrust Foundation')!;
   organizations.update(org.id,{neededResources:'Rice: 100 kg; Blankets: 50 units'});
   const body={donorName:'Donor',donorEmail:'donor@kindred.org',donorPhone:'9812345678',category:'Food',items:[{name:'Rice',unit:'kg',quantity:10,condition:'New'}],description:'Food supplies',pickupAddress:'Mumbai',pickupDate:'2099-01-01',pickupTimeSlot:'Morning',programId:p.id};
   expect(()=>resources.create(body)).toThrow(/organization is required/);
   expect(()=>resources.create({...body,orgId:other.id})).toThrow(/available programs/);
   const donation=resources.create({...body,orgId:org.id});
   expect(donation).toMatchObject({orgId:org.id,orgName:org.name,programId:p.id,programName:p.name});
   expect(resources.findByOrg(other.name).some(d=>d.id===donation.id)).toBe(false);
   const options=resources.donationOptions();
   expect(options.organizations.find(o=>o.id===org.id)?.neededResources).toContain('100 kg');
   expect(options.organizations[0]).not.toHaveProperty('bankAccountNumber');
   programs.update(p.id,{status:'paused'});
   expect(resources.donationOptions().programs.some(record=>record.id===p.id)).toBe(false);
   expect(()=>resources.create({...body,orgId:org.id})).toThrow(/available programs/);
 });

 it('allows one collection volunteer and sends an itemized certificate only after confirmed warehouse receipt',()=>{
   volunteers.updatePresence('volunteer@kindred.org',{availableNow:true,currentLocation:'Mumbai',willingToTravel:true});
   sellers.update('seller_001',{pickupAddress:'Shop 12, Mumbai 400001'});
   const p=program(),donation=resources.create({donorName:'Resource Donor',donorEmail:'donor@kindred.org',donorPhone:'9812345678',orgName:'HopeConnect',programId:p.id,category:'Food',items:[{name:'Rice',unit:'kg',quantity:10,condition:'New'},{name:'Blankets',unit:'unit',quantity:20,condition:'Good'}],description:'Supplies',pickupAddress:'Mumbai',pickupDate:'2099-01-01',pickupTimeSlot:'Morning'});
   const offer={kind:'collection' as const,sourceId:donation.id,mode:'direct' as const,volunteerEmail:'volunteer@kindred.org',scheduledDate:'2099-01-01',shiftStart:'13:00',shiftEnd:'14:00',pickupArea:'Mumbai',destinationArea:'Mumbai',collectionAddress:'HopeConnect warehouse'};
   const d=fulfillment.offer(offer,admin),v=actor('volunteer@kindred.org');
   expect(()=>fulfillment.offer(offer,admin)).toThrow(/already exists/);
   fulfillment.act(d.id,'accept',undefined,v);
   expect(()=>fulfillment.act(d.id,'accept',undefined,actor('amit.sharma@email.com'))).toThrow(/Already assigned/);
   expect(resources.findById(donation.id).assignedVolunteerEmail).toBe(v.email);
   expect(()=>fulfillment.receive(donation.id,{items:[{index:0,quantity:8},{index:1,quantity:12}]},admin)).toThrow(/Verify collection/);
   expect(resources.findById(donation.id).certificate).toBeUndefined();
   fulfillment.act(d.id,'picked_up',undefined,v);fulfillment.act(d.id,'in_transit',undefined,v);verify('deliveries',d.id,v.email);fulfillment.complete(d.id);
   fulfillment.receive(donation.id,{items:[{index:0,quantity:8},{index:1,quantity:12}]},admin);
   const certificate=resources.findById(donation.id).certificate!;
   expect(certificate).toMatchObject({donorName:'Resource Donor',organization:'HopeConnect',programName:p.name,items:[{name:'Rice',quantity:8,unit:'kg',offeredQuantity:10},{name:'Blankets',quantity:12,unit:'unit',offeredQuantity:20}]});
   const notices=module.get(NotificationsService).find(donation.donorEmail).filter(n=>n.title==='Resource donation thank-you certificate');
   expect(notices).toHaveLength(1);expect(notices[0].message).toContain('8 kg Rice');expect(notices[0].link).toContain(`resourceCertificate=${donation.id}`);
   expect(()=>fulfillment.receive(donation.id,{items:[{index:0,quantity:8},{index:1,quantity:12}]},admin)).toThrow(/already been received/);
   expect(resources.findById(donation.id).certificate?.id).toBe(certificate.id);
 });

 it('keeps group and direct messages inside a program and private messages between their participants',()=>{
   const p=program(),first=member(p.id),second=member(p.id,'amit.sharma@email.com');
   participation.sendMessage(p.id,admin,{message:'Meet at the hall'});
   participation.sendMessage(p.id,actor(first.volunteerEmail),{recipientEmail:admin.email,message:'I need the supplies list'});
   participation.sendMessage(p.id,admin,{recipientEmail:second.volunteerEmail,message:'Please bring the boxes'});
   expect(participation.workspace(p.id,actor(first.volunteerEmail)).messages.map(m=>m.message)).toEqual(['Meet at the hall','I need the supplies list']);
   expect(participation.workspace(p.id,actor(second.volunteerEmail)).messages.map(m=>m.message)).toEqual(['Meet at the hall','Please bring the boxes']);
   expect(()=>participation.workspace(p.id,actor('outsider@example.test'))).toThrow(/accepted program/);
   expect(()=>participation.sendMessage(p.id,admin,{message:'Private',recipientEmail:'outsider@example.test'})).toThrow(/Choose another/);
   expect(()=>participation.workspace(p.id,{...admin,org:'Other organization'})).toThrow();
   expect(module.get(NotificationsService).find(first.volunteerEmail).some(n=>n.title.startsWith('Group message:'))).toBe(true);
 });

 it('uses the authenticated account for conversations instead of trusting role or email headers',()=>{
   const p=program(),a=member(p.id),users=module.get(UsersService),controller=module.get(ParticipationController);
   expect(()=>controller.workspace(p.id,{role:'admin','user-email':admin.email,organization:admin.org})).toThrow();
   const token=users.issueSession(users.findByEmail(a.volunteerEmail)!);
   const forged={authorization:`Bearer ${token}`,role:'admin','user-email':admin.email,organization:admin.org};
   expect(controller.workspace(p.id,forged).data.canRate).toBe(false);
   expect(()=>controller.rating(p.id,forged,{volunteerEmail:a.volunteerEmail,score:5})).toThrow(/organization admin/);
   expect(controller.message(p.id,forged,{message:'Hello group'}).data.senderEmail).toBe(a.volunteerEmail);
 });

 it('rates only verified completed work and updates a program rating without double-counting',()=>{
   const p=program(),a=member(p.id);
   const body={volunteerEmail:a.volunteerEmail,score:4,feedback:'Reliable work'};
   expect(()=>participation.rate(p.id,admin,body)).toThrow(/verified complete/);
   const t=subtasks.create({programId:p.id,title:'Teach children',assignedToEmail:a.volunteerEmail});
   expect(()=>participation.rate(p.id,admin,body)).toThrow(/verified complete/);
   verify('subtasks',t.id,a.volunteerEmail);subtasks.update(t.id,{status:'completed',progress:100});
   expect(()=>participation.rate(p.id,actor(a.volunteerEmail),body)).toThrow(/organization admin/);
   expect(()=>participation.rate(p.id,admin,{...body,score:6})).toThrow(/1 to 5/);
   expect(participation.rate(p.id,admin,body).score).toBe(4);
   participation.rate(p.id,admin,{...body,score:5});
   expect(volunteers.findByEmail(a.volunteerEmail)?.rating).toBe(5);
   expect(participation.workspace(p.id,actor(a.volunteerEmail)).members.find(m=>m.email===a.volunteerEmail)?.rating?.score).toBe(5);
 });

 it('removes delisted programs from discovery, keeps member history current and notifies participants',()=>{
   const p=program(),a=member(p.id);
   programs.update(p.id,{status:'paused'});
   expect(programs.findPortal().some(record=>record.id===p.id)).toBe(false);
   expect(programs.findPublic().some(record=>record.id===p.id)).toBe(false);
   expect(assignments.memberPrograms(a.volunteerEmail).find(record=>record.id===p.id)?.status).toBe('paused');
   expect(()=>assignments.assertReady(p.id,a.volunteerEmail)).toThrow(/current program/);
   expect(module.get(NotificationsService).find(a.volunteerEmail).some(n=>n.title==='Program: program paused')).toBe(true);
 });

 it('connects a portal applicant to org review, confirmed membership, task work and notifications',()=>{
   const p=program(),applications=module.get(ProgramApplicationsService),notifications=module.get(NotificationsService);
   const email='volunteer@kindred.org';
   volunteers.update(volunteers.findByEmail(email)!.id,{org:'Another organization'});
   const app=applications.create({programId:p.id,programName:'Stale portal title',volunteerEmail:email,volunteerName:'Portal applicant',message:'I would like to help'});
   expect(app.programName).toBe(p.name);
   expect(applications.findByOrg(p.org)).toContainEqual(app);
   expect(applications.applicantDetails(app.id,'admin',p.org).profile.email).toBe(email);
   expect(notifications.find(admin.email,'admin',p.org).some(n=>n.title==='New volunteer request')).toBe(true);
   applications.approve(app.id);
   const invitation=assignments.findByProgram(p.id).find(a=>a.volunteerEmail===email)!;
   const work={title:'Prepare learning materials',assignedToEmail:email,assignedToName:app.volunteerName,programId:p.id,programName:p.name};
   expect(()=>tasks.create(work)).toThrow();
   assignments.respond(invitation.id,email,'accepted',{version:1,attendanceConfirmed:true});
   const task=tasks.create(work);
   expect(notifications.find(email).some(n=>n.title==='New program task assigned')).toBe(true);
   expect(tasks.findByVolunteer(email)).toContainEqual(task);
   tasks.update(task.id,{status:'in-progress'});
   expect(notifications.find(admin.email,'admin',p.org).some(n=>n.title==='Volunteer task updated'&&n.message.includes(work.title))).toBe(true);
   verify('tasks',task.id,email);
   tasks.update(task.id,{status:'completed'});
   expect(tasks.findByProgram(p.id)[0].status).toBe('completed');
 });

 it('notifies volunteer and beneficiary applicants of approval and rejection on their own dashboards',()=>{
   const p=program(),applications=module.get(ProgramApplicationsService),notifications=module.get(NotificationsService);
   for(const email of ['volunteer@kindred.org','beneficiary@kindred.org']){
     const app=applications.create({programId:p.id,programName:p.name,volunteerEmail:email,volunteerName:'Applicant'});
     applications.reject(app.id);
     expect(notifications.find(email).find(n=>n.title==='Application rejected')?.link).toContain(email.startsWith('beneficiary')?'beneficiary-dashboard':'volunteer-dashboard');
     const retry=applications.create({programId:p.id,programName:p.name,volunteerEmail:email,volunteerName:'Applicant'});
     applications.approve(retry.id);
     expect(notifications.find(email).find(n=>n.title.startsWith('Application approved'))?.link).toContain(email.startsWith('beneficiary')?'beneficiary-dashboard':'volunteer-dashboard');
   }
 });

 it('accepts portal applications independently of public listing approval and closes them when disabled',()=>{
   const p=program(), applications=module.get(ProgramApplicationsService);
   const application={programId:p.id,programName:p.name,volunteerEmail:'volunteer@kindred.org',volunteerName:'Volunteer'};
   expect(p.listingStatus).toBe('unlisted');
   expect(programs.findPublic().some(record=>record.id===p.id)).toBe(false);
   expect(programs.findPortal().some(record=>record.id===p.id)).toBe(true);
   expect(applications.create(application).status).toBe('pending');
   programs.update(p.id,{openForApplications:false});
   expect(programs.findPortal().some(record=>record.id===p.id)).toBe(false);
   expect(()=>applications.create({...application,volunteerEmail:'another@example.test'})).toThrow(/not accepting/);
   programs.update(p.id,{openForApplications:true,status:'paused'});
   expect(programs.findPortal().some(record=>record.id===p.id)).toBe(false);
   expect(()=>applications.create({...application,volunteerEmail:'another@example.test'})).toThrow(/not accepting/);
 });

 it('provides organization briefs before applying and scopes applicant profile reviews to the owning admin',()=>{
   const p=program(), applications=module.get(ProgramApplicationsService);
   const email='volunteer@kindred.org';
   expect(participation.brief(p.id,email)).toMatchObject({program:{id:p.id},organization:{name:'HopeConnect',city:'Mumbai'}});
   const application=applications.create({programId:p.id,programName:p.name,volunteerEmail:email,volunteerName:'Volunteer',message:'I can teach on weekdays'});
   const details=applications.applicantDetails(application.id,'admin','HopeConnect');
   expect(details.application.message).toBe('I can teach on weekdays');
   expect(details.profile.email).toBe(email);
   expect(details.profile.skills).toBeDefined();
   for(const key of ['password','authToken','securityAnswerHash1','securityAnswerHash2','verificationReference','presentAddress','permanentAddress']) expect(details.profile).not.toHaveProperty(key);
   expect(()=>applications.applicantDetails(application.id,'admin','Other NGO')).toThrow(/own organization/);
   programs.update(p.id,{openForApplications:false});
   expect(()=>participation.brief(p.id,email)).toThrow(/private brief/);
 });

 it('validates dates and makes attendance informed, conflict checked and versioned',()=>{
   expect(()=>programs.create({name:'Bad',org:'HopeConnect',budget:0,description:'x',workBrief:'work',meetingPoint:'hall',contactName:'Coordinator',contactPhone:'9812345678',reportingTime:'08:45',invitationDeadline:'2098-12-30',shiftDays:['Monday'],...schedule,endDate:'2098-12-31'})).toThrow(/dates/);
   const p=program(), a=member(p.id);
   expect(participation.brief(p.id,a.volunteerEmail).organization?.phone).toBeTruthy();
   const other=program();expect(()=>assignments.create({programId:other.id,programName:other.name,volunteerName:'Priya',volunteerEmail:a.volunteerEmail})).toThrow(/Conflicts/);
   programs.update(p.id,{location:'Pune'});expect(assignments.findById(a.id).needsReconfirmation).toBe(true);
   expect(()=>assignments.respond(a.id,a.volunteerEmail,'accepted',{version:1,attendanceConfirmed:true})).toThrow(/latest/);
   expect(assignments.respond(a.id,a.volunteerEmail,'accepted',{version:2,attendanceConfirmed:true}).needsReconfirmation).toBe(false);
   const scheduling=module.get(SchedulingService);expect(scheduling.conflicts(a.volunteerEmail,{...schedule,location:'Pune'})).toHaveLength(1);
   expect(scheduleOverlaps({...schedule,shiftEnd:'10:00'},{...schedule,shiftStart:'10:00'})).toBe(false);
   expect(scheduleHasEnded({...schedule,endDate:'2099-01-01',shiftEnd:'09:00'},new Date('2099-01-01T04:00:00Z'))).toBe(true);
 });

 it('checks planned dates, weekdays and travel willingness at selection',()=>{
   volunteers.updatePresence('volunteer@kindred.org',{currentLocation:'Delhi',serviceAreas:'Delhi',willingToTravel:false,availableFrom:'2099-02-01',availableUntil:'2099-03-01',availabilityDays:['Monday']});
   const result=volunteers.eligibility('volunteer@kindred.org',{...schedule,shiftDays:['Tuesday']});
   expect(result.eligible).toBe(false);expect(result.reasons.join(' ')).toMatch(/dates/);expect(result.reasons.join(' ')).toMatch(/weekdays/);expect(result.reasons.join(' ')).toMatch(/travel/);
 });

 it('withdraws applications without read-side membership resurrection',()=>{
   const p=program();programs.update(p.id,{requestListing:true});programs.reviewListing(p.id,true);
   const applications=module.get(ProgramApplicationsService);
   const a=applications.create({programId:p.id,programName:p.name,volunteerName:'Priya',volunteerEmail:'volunteer@kindred.org'});
   applications.withdraw(a.id,a.volunteerEmail,'Dates no longer suit');expect(()=>applications.approve(a.id)).toThrow(/pending/);
   const next=applications.create({programId:p.id,programName:p.name,volunteerName:'Priya',volunteerEmail:a.volunteerEmail});applications.approve(next.id);
   const invitation=assignments.findByProgram(p.id)[0];expect(invitation.status).toBe('pending');
   participation.withdraw(invitation.id,invitation.volunteerEmail,'Cannot attend');applications.findAll();applications.findByOrg('HopeConnect');expect(assignments.findById(invitation.id).status).toBe('withdrawn');
 });

 it('approval tolerates an invitation sent after application and does not reactivate on retry',()=>{
   const p=program();programs.update(p.id,{requestListing:true});programs.reviewListing(p.id,true);
   const applications=module.get(ProgramApplicationsService);
   const app=applications.create({programId:p.id,programName:p.name,volunteerName:'Priya',volunteerEmail:'volunteer@kindred.org'});
   const invitation=assignments.create({programId:p.id,programName:p.name,volunteerName:'Priya',volunteerEmail:app.volunteerEmail});
   applications.approve(app.id);expect(assignments.findByProgram(p.id)).toHaveLength(1);expect(assignments.findById(invitation.id).status).toBe('pending');
   participation.withdraw(invitation.id,app.volunteerEmail,'Not attending');applications.approve(app.id);expect(assignments.findById(invitation.id).status).toBe('withdrawn');
 });

 it('hands over unfinished work while keeping completed work and blocks premature certificates',()=>{
   const p=program(),a=member(p.id),replacement=member(p.id,'amit.sharma@email.com');
   const t=tasks.create({programId:p.id,programName:p.name,title:'Teaching',description:'Two lessons',assignedToEmail:a.volunteerEmail});tasks.update(t.id,{status:'in-progress'});
   const st=subtasks.create({programId:p.id,title:'Prepare worksheets',assignedToEmail:a.volunteerEmail});verify('subtasks',st.id,a.volunteerEmail);subtasks.update(st.id,{status:'completed',progress:100});
   expect(()=>participation.certificate(p.id,a.volunteerEmail)).toThrow(/All assigned/);
   const another=subtasks.create({programId:p.id,title:'Distribute sheets',assignedToEmail:a.volunteerEmail});subtasks.update(another.id,{progress:30,status:'in-progress'});
   expect(()=>subtasks.update(st.id,{progress:20,status:'in-progress'})).toThrow(/locked/);
   expect(programs.findById(p.id).taskProgress).toBe(33);
   expect(participation.withdraw(a.id,a.volunteerEmail,'Moving away').status).toBe('withdrawal_requested');
   participation.handover(a.id,admin,{reason:'Amit takes over the lessons and distribution',replacementEmail:replacement.volunteerEmail});
   expect(tasks.findById(t.id).assignedToEmail).toBe(replacement.volunteerEmail);expect(subtasks.findById(st.id).assignedToEmail).toBe(a.volunteerEmail);expect(subtasks.findById(another.id).progress).toBe(30);expect(assignments.findById(a.id).status).toBe('withdrawn');
 });

 it('rejects unrelated inventory and tracks separate delivery batches, remainder and issue resolution',()=>{
   const donation=resources.create({donorName:'Donor',donorEmail:'donor@kindred.org',donorPhone:'9812345678',orgName:'HopeConnect',category:'Food',items:[{name:'Rice',unit:'kg',quantity:10,condition:'New'},{name:'Blankets',unit:'unit',quantity:10,condition:'New'}],description:'Supplies',pickupAddress:'Mumbai',pickupDate:'2099-01-01',pickupTimeSlot:'Morning'});
   const stock=fulfillment.receive(donation.id,{items:[{index:0,quantity:10},{index:1,quantity:10}]},admin);
   const recipient={role:'beneficiary',email:'beneficiary@kindred.org',org:''};
   const r=fulfillment.createRequest({orgName:'HopeConnect',resource:'Rice',unit:'kg',quantity:10,reason:'Food',address:'Mumbai recipient',phone:'9812345678',name:'Recipient'},recipient);
   expect(()=>fulfillment.respond(r.id,{decision:'approve',message:'wrong item',allocations:[{stockId:stock[1].id,quantity:4}]},admin)).toThrow(/exact requested/);
   function deliver(quantity:number,date:string){fulfillment.respond(r.id,{decision:'approve',message:'Suitable rice reserved',allocations:[{stockId:stock[0].id,quantity}]},admin);const d=fulfillment.offer({kind:'resource',sourceId:r.id,mode:'broadcast',scheduledDate:date,shiftStart:'10:00',shiftEnd:'11:00',pickupArea:'Mumbai',destinationArea:'Mumbai',collectionAddress:'Warehouse address'},admin);const v=actor('volunteer@kindred.org');fulfillment.act(d.id,'accept',undefined,v);fulfillment.act(d.id,'picked_up',undefined,v);fulfillment.act(d.id,'in_transit',undefined,v);verify('deliveries',d.id,v.email);fulfillment.complete(d.id);}
   deliver(4,'2099-01-02');expect(fulfillment.listRequests(recipient)[0]).toMatchObject({deliveredQuantity:4,remainingQuantity:6,status:'partially_delivered'});expect(fulfillment.inventory(admin)[0]).toMatchObject({available:6,distributed:4,reserved:0});
   deliver(6,'2099-01-03');expect(fulfillment.listRequests(recipient)[0]).toMatchObject({deliveredQuantity:10,remainingQuantity:0,status:'delivered'});expect(fulfillment.inventory(admin)[0]).toMatchObject({distributed:10,available:0});
   fulfillment.acknowledge(r.id,'One packet damaged',recipient,'issue');fulfillment.acknowledge(r.id,'Checking warehouse',admin,'investigate');fulfillment.acknowledge(r.id,'Replacement provided in person',admin,'resolve');fulfillment.acknowledge(r.id,'Still damaged',recipient,'reopen');fulfillment.acknowledge(r.id,'Reviewing again',admin,'investigate');fulfillment.acknowledge(r.id,'Issue corrected',admin,'resolve');expect(fulfillment.acknowledge(r.id,'Confirmed',recipient,'close').issue?.status).toBe('closed');
 });

 function order(){return orders.create({productId:'prod_001',quantity:1,buyerName:'Buyer',buyerEmail:'donor@kindred.org',buyerPhone:'9812345678',address:'Mumbai',cardLast4:'1111',cardType:'Visa'});}
 it('uses saved seller and checkout addresses for shop deliveries and reassignment',()=>{
   const o=order(),body={kind:'order' as const,sourceId:o.id,mode:'broadcast' as const,scheduledDate:'2099-01-05',shiftStart:'10:00',shiftEnd:'11:00',pickupArea:'Mumbai',destinationArea:'Mumbai',collectionAddress:'Incorrect manually entered pickup'};
   expect(()=>fulfillment.offer(body,sellerActor)).toThrow(/seller pickup address/);
   sellers.update(o.sellerId,{pickupAddress:'  Shop 12, Market Road, Mumbai 400001  '});
   expect(fulfillment.orderAddresses(o.id,admin)).toEqual({pickupAddress:'Shop 12, Market Road, Mumbai 400001',address:o.address});
   expect(()=>fulfillment.orderAddresses(o.id,{...admin,org:'Another organization'})).toThrow();
   expect(()=>fulfillment.orderAddresses(o.id,{role:'seller',email:'other@seller.com',org:''})).toThrow();
   const d=fulfillment.offer(body,sellerActor);
   expect(d).toMatchObject({pickupAddress:'Shop 12, Market Road, Mumbai 400001',address:o.address});
   sellers.update(o.sellerId,{pickupAddress:'Shop 20, New Street, Mumbai 400002'});
   expect(fulfillment.findById(d.id).pickupAddress).toBe(d.pickupAddress);
   const reassigned=fulfillment.reoffer(d.id,body,sellerActor);
   expect(reassigned).toMatchObject({pickupAddress:'Shop 20, New Street, Mumbai 400002',address:o.address});
   expect(()=>sellers.update(o.sellerId,{pickupAddress:'   '})).toThrow(/full seller pickup address/);
 });

 it('cancels purchases once, restoring stock and reversing demo accounting',()=>{
   const before=products.findById('prod_001').quantity,balance=sellers.findById('seller_001').salesBalance;
   const o=order();expect(products.findById('prod_001').quantity).toBe(before-1);
   const buyer={role:'donor',email:o.buyerEmail,org:''};fulfillment.cancelOrder(o.id,'No longer needed',buyer);fulfillment.cancelOrder(o.id,'Retry',buyer);
   expect(products.findById('prod_001').quantity).toBe(before);expect(sellers.findById('seller_001').salesBalance).toBe(balance);expect(orders.findById(o.id).paymentStatus).toBe('reversed_demo');
 });

 it('issues one certificate only after every main task and subtask is verified',()=>{
   const p=program(),a=member(p.id);
   const t=tasks.create({programId:p.id,title:'Main task',assignedToEmail:a.volunteerEmail,description:'Work'});
   const sub=subtasks.create({programId:p.id,title:'Extra work',assignedToEmail:a.volunteerEmail});
   verify('subtasks',sub.id,a.volunteerEmail);subtasks.update(sub.id,{progress:100,status:'completed'});
   expect(()=>participation.certificate(p.id,a.volunteerEmail)).toThrow();
   tasks.update(t.id,{status:'in-progress'});verify('tasks',t.id,a.volunteerEmail);tasks.update(t.id,{status:'completed'});
   const first=participation.certificate(p.id,a.volunteerEmail);expect(participation.certificate(p.id,a.volunteerEmail).id).toBe(first.id);expect(programs.findById(p.id).taskProgress).toBe(100);
 });

 it('requires replacement approval, reserves stock, requires acceptance and safely returns failed work',()=>{
   volunteers.updatePresence('volunteer@kindred.org',{availableNow:true,currentLocation:'Mumbai',willingToTravel:true});
   sellers.update('seller_001',{pickupAddress:'Shop 12, Mumbai 400001'});
   const o=order();(orders as any).orders.find((r:any)=>r.id===o.id).deliveryStatus='delivered';
   const r=replacements.create({orderId:o.id,buyerEmail:o.buyerEmail,buyerName:o.buyerName,reason:'Damaged',description:'Broken',imageUrl:'/evidence.png'});
   const before=products.findById(o.productId).quantity;
   expect(()=>replacements.assignVolunteer(r.id,'volunteer@kindred.org','Priya',schedule)).toThrow(/Approve/);
   replacements.approve(r.id);expect(products.findById(o.productId).quantity).toBe(before-1);
   replacements.assignVolunteer(r.id,'volunteer@kindred.org','Priya',schedule);expect(()=>replacements.updateStatus(r.id,'return_pickup')).toThrow(/Accept/);
   const v=actor('volunteer@kindred.org');replacements.action(r.id,'accept',undefined,v);replacements.updateStatus(r.id,'return_pickup');replacements.action(r.id,'failed','Recipient unavailable',v);
   expect(()=>replacements.action(r.id,'cancel','Cancel',admin)).toThrow(/return/);
   replacements.action(r.id,'return','All goods back at warehouse',admin);replacements.action(r.id,'cancel','Buyer no longer needs replacement',admin);
   expect(products.findById(o.productId).quantity).toBe(before);
 });

 it('requires confirmed return before purchase cancellation after pickup',()=>{
   sellers.update('seller_001',{pickupAddress:'Seller warehouse address'});
   const o=order(),before=products.findById(o.productId).quantity;
   const d=fulfillment.offer({kind:'order',sourceId:o.id,mode:'broadcast',scheduledDate:'2099-01-05',shiftStart:'10:00',shiftEnd:'11:00',pickupArea:'Mumbai',destinationArea:'Mumbai',collectionAddress:'Seller warehouse address'},sellerActor);
   const v=actor('volunteer@kindred.org');fulfillment.act(d.id,'accept',undefined,v);fulfillment.act(d.id,'picked_up',undefined,v);fulfillment.act(d.id,'in_transit',undefined,v);
   const buyer={role:'donor',email:o.buyerEmail,org:''};expect(()=>fulfillment.cancelOrder(o.id,'Cannot receive',buyer)).toThrow(/returned/);
   fulfillment.act(d.id,'failed','Recipient unavailable',v);fulfillment.act(d.id,'return','Goods checked back into seller stock',admin);fulfillment.cancelOrder(o.id,'Buyer cancelled after goods returned',buyer);
   expect(products.findById(o.productId).quantity).toBe(before+1);expect(orders.findById(o.id).deliveryStatus).toBe('cancelled');
 });

 it('seller verifies replacement proof only after accepted pickup and dispatch',()=>{
   volunteers.updatePresence('volunteer@kindred.org',{availableNow:true,currentLocation:'Mumbai',willingToTravel:true});
   sellers.update('seller_001',{pickupAddress:'Shop 12, Mumbai 400001'});
   const o=order();(orders as any).orders.find((r:any)=>r.id===o.id).deliveryStatus='delivered';
   const claim=replacements.create({orderId:o.id,buyerEmail:o.buyerEmail,buyerName:o.buyerName,reason:'Broken',description:'Broken item',imageUrl:'/claim.png'});
   replacements.approve(claim.id);replacements.assignVolunteer(claim.id,'volunteer@kindred.org','Priya',schedule);replacements.action(claim.id,'accept',undefined,actor('volunteer@kindred.org'));replacements.updateStatus(claim.id,'return_pickup');replacements.updateStatus(claim.id,'replacement_in_transit');
   const proof=proofs.submit({collection:'replacements',recordId:claim.id,title:'Replacement delivered',organization:'HopeConnect',volunteerEmail:'volunteer@kindred.org',image:'/delivered.png'});
   expect(()=>module.get(ProofsController).review(proof.id,'approve','seller','HopeConnect','other@example.test',{})).toThrow();
   module.get(ProofsController).review(proof.id,'approve','seller','HopeConnect','seller@kindred.org',{});
   expect(replacements.findById(claim.id)).toMatchObject({status:'replaced',stockReserved:false});
 });
});
