import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ProgramAssignmentsService } from '../program-assignments/service';
import { ProgramsService } from '../programs/service';
import { TasksService } from '../tasks/service';
import { SubtasksService } from '../subtasks/service';
import { HourLogsService } from '../hour-logs/service';
import { OrganizationsService } from '../organizations/service';
import { VolunteersService } from '../volunteers/service';
import { NotificationsService } from '../notifications/service';
import { ProofStore } from '../proofs/store';
import { workProgress } from '../../common/work-progress';
import { Schedule, validateSchedule } from '../../common/scheduling';
import { UsersService } from '../users/service';
type Actor = {role:string;email:string;org:string};
type ProgramMessage = {id:string;programId:string;senderEmail:string;senderName:string;recipientEmail?:string;message:string;createdAt:string};
type ProgramRating = {programId:string;volunteerEmail:string;score:number;feedback:string;ratedBy:string;ratedAt:string};

@Injectable()
export class ParticipationService {
  private messages: ProgramMessage[]=[];
  private ratings: ProgramRating[]=[];
  private certificates: {id:string;programId:string;email:string;name:string;organization:string;issuedAt:string;hours:number}[]=[];
  constructor(private assignments:ProgramAssignmentsService,private programs:ProgramsService,private tasks:TasksService,private subtasks:SubtasksService,private hours:HourLogsService,private organizations:OrganizationsService,private volunteers:VolunteersService,private notifications:NotificationsService,private proofs:ProofStore,private users:UsersService) {}
  private access(programId:string,actor:Actor) {
    const program=this.programs.findById(programId);
    const manager=actor.role==='superuser'||actor.role==='admin'&&!!actor.org&&actor.org===program.org;
    const members=this.assignments.findByProgram(programId).filter(a=>['active','withdrawal_requested'].includes(a.status));
    if(!actor.email||!manager&&!members.some(a=>a.volunteerEmail.toLowerCase()===actor.email.toLowerCase()))throw new ForbiddenException('Only this organization and accepted program members can access program conversations');
    const admins=this.users.findAll().filter(u=>u.role==='admin'&&u.org===program.org&&u.status==='approved').map(u=>({email:u.email,name:u.name,role:'Organization admin'}));
    const people=[...new Map([...admins,...members.map(a=>({email:a.volunteerEmail,name:a.volunteerName,role:'Program member'}))].map(person=>[person.email.toLowerCase(),person])).values()];
    return {program,manager,members,people};
  }
  workspace(programId:string,actor:Actor) {
    const {program,manager,members,people}=this.access(programId,actor);
    const email=actor.email.toLowerCase();
    return {program,canRate:manager,people,messages:this.messages.filter(m=>m.programId===programId&&(!m.recipientEmail||m.senderEmail.toLowerCase()===email||m.recipientEmail.toLowerCase()===email)),members:members.map(a=>{
      const work=this.work(programId,a.volunteerEmail),progress=workProgress(work.tasks,work.subtasks);
      const rating=this.ratings.find(r=>r.programId===programId&&r.volunteerEmail.toLowerCase()===a.volunteerEmail.toLowerCase());
      return {email:a.volunteerEmail,name:a.volunteerName,canRate:manager&&a.status==='active'&&!a.needsReconfirmation&&progress.eligible,rating:manager||a.volunteerEmail.toLowerCase()===email?rating:undefined};
    })};
  }
  sendMessage(programId:string,actor:Actor,body:{message:string;recipientEmail?:string}) {
    const {program,people}=this.access(programId,actor);
    const message=body.message?.trim();
    if(!message||message.length>2000)throw new BadRequestException('Enter a message of 1 to 2000 characters');
    const recipient=body.recipientEmail?.toLowerCase();
    if(recipient&&(!people.some(p=>p.email.toLowerCase()===recipient)||recipient===actor.email.toLowerCase()))throw new BadRequestException('Choose another member or organization admin in this program');
    const sender=this.users.findByEmail(actor.email);
    const saved:ProgramMessage={id:randomUUID(),programId,senderEmail:actor.email,senderName:sender?.name||people.find(p=>p.email.toLowerCase()===actor.email.toLowerCase())?.name||actor.email,recipientEmail:recipient,message,createdAt:new Date().toISOString()};
    this.messages.push(saved);
    for(const person of people.filter(p=>p.email.toLowerCase()!==actor.email.toLowerCase()&&(!recipient||p.email.toLowerCase()===recipient))) {
      const account=this.users.findByEmail(person.email);
      this.notifications.create({targetEmail:person.email,title:`${recipient?'Direct message':'Group message'}: ${program.name}`,message:`${saved.senderName}: ${message}`,link:`${account?.dashboard||'/volunteer-portal'}?program=${encodeURIComponent(programId)}`,type:'info'});
    }
    return saved;
  }
  rate(programId:string,actor:Actor,body:{volunteerEmail:string;score:number;feedback?:string}) {
    const {manager,members,program}=this.access(programId,actor);
    if(!manager)throw new ForbiddenException('Only the organization admin can rate completed work');
    const member=members.find(a=>a.volunteerEmail.toLowerCase()===body.volunteerEmail.toLowerCase());
    const work=this.work(programId,body.volunteerEmail);
    if(!member||member.status!=='active'||member.needsReconfirmation||!workProgress(work.tasks,work.subtasks).eligible)throw new BadRequestException('All assigned work must be verified complete before rating');
    if(!Number.isInteger(body.score)||body.score<1||body.score>5||body.feedback&&body.feedback.length>1000)throw new BadRequestException('Choose a rating from 1 to 5 and feedback up to 1000 characters');
    const rating:ProgramRating={programId,volunteerEmail:member.volunteerEmail,score:body.score,feedback:body.feedback?.trim()||'',ratedBy:actor.email,ratedAt:new Date().toISOString()};
    const index=this.ratings.findIndex(r=>r.programId===programId&&r.volunteerEmail.toLowerCase()===body.volunteerEmail.toLowerCase());
    if(index<0)this.ratings.push(rating);else this.ratings[index]=rating;
    const values=this.ratings.filter(r=>r.volunteerEmail.toLowerCase()===body.volunteerEmail.toLowerCase());
    this.volunteers.setRating(member.volunteerEmail,Math.round(values.reduce((sum,r)=>sum+r.score,0)/values.length*10)/10);
    this.notifications.create({targetEmail:member.volunteerEmail,title:`Work rating: ${body.score}/5`,message:`${program.name}. ${rating.feedback}`,link:`${this.users.findByEmail(member.volunteerEmail)?.dashboard||'/volunteer-portal'}?program=${encodeURIComponent(programId)}`,type:'info'});
    return rating;
  }
  private work(programId:string,email:string) {
    const same=(value:string)=>value?.toLowerCase()===email.toLowerCase();
    return {tasks:this.tasks.findByProgram(programId).filter(t=>same(t.assignedToEmail)),subtasks:this.subtasks.findByProgram(programId).filter(t=>same(t.assignedToEmail))};
  }
  brief(programId:string,email:string) {
    const program=this.programs.findById(programId);
    const membership=this.assignments.findByVolunteer(email).find(a=>a.programId===programId);
    if(!membership && ![...this.programs.findPublic(),...this.programs.findPortal()].some(p=>p.id===programId))throw new ForbiddenException('Only invited participants can read this private brief');
    const org=this.organizations.findAll().find(o=>o.name===program.org);
    const work=this.work(programId,email);
    return {program,organization:org?{id:org.id,name:org.name,focus:org.focus,city:org.city,email:org.email,phone:org.phone,status:org.status,image:org.image,joined:org.joined,volunteers:org.volunteers,beneficiaries:org.beneficiaries,rating:org.rating,neededResources:org.neededResources}:null,membership,work,progress:workProgress(work.tasks,work.subtasks),eligibility:this.volunteers.eligibility(email,program,membership?.id)};
  }
  candidates(schedule:Schedule) {
    validateSchedule(schedule);
    return this.volunteers.findAll().filter(v=>v.status==='active').map(v=>({...v,...this.volunteers.eligibility(v.email,schedule),commitments:this.assignments.findByVolunteer(v.email).filter(a=>['active','withdrawal_requested'].includes(a.status)).map(a=>({programId:a.programId,name:a.programName}))}));
  }
  withdraw(id:string,email:string,reason:string) {
    const a=this.assignments.findById(id);
    if(!email || a.volunteerEmail.toLowerCase()!==email.toLowerCase())throw new ForbiddenException();
    if(!reason?.trim() || !['active','pending'].includes(a.status))throw new BadRequestException('Provide a reason for an active membership or invitation');
    const work=this.work(a.programId,email);
    const started=work.tasks.some(t=>!['pending','cancelled'].includes(t.status))||work.subtasks.some(t=>t.progress>0||t.status==='completed');
    if(!started) {
      work.tasks.filter(t=>t.status==='pending').forEach(t=>this.tasks.cancelForHandover(t.id,reason));
      work.subtasks.filter(t=>t.status!=='completed').forEach(t=>this.subtasks.cancelForHandover(t.id,reason));
    }
    const result=this.assignments.setWithdrawal(id,started?'withdrawal_requested':'withdrawn',email,reason);
    this.notifications.create({targetOrg:this.programs.findById(a.programId).org,title:started?'Volunteer handover required':'Volunteer withdrew',message:`${a.volunteerName}: ${reason}`,link:'/org-admin#programs',type:'info'});
    return result;
  }
  handover(id:string,actor:{role:string;email:string;org:string},body:{reason:string;replacementEmail?:string}) {
    const a=this.assignments.findById(id), p=this.programs.findById(a.programId);
    if(actor.role!=='superuser' && (actor.role!=='admin'||actor.org!==p.org))throw new ForbiddenException();
    if(a.status!=='withdrawal_requested'||!body.reason?.trim())throw new BadRequestException('An open withdrawal and handover note are required');
    const work=this.work(a.programId,a.volunteerEmail);
    const ids=new Set([...work.tasks,...work.subtasks].map(t=>t.id));
    if(this.proofs.all().some(proof=>ids.has(proof.recordId)&&proof.status==='pending'))throw new BadRequestException('Review pending work proofs before finalizing handover');
    const replacement=body.replacementEmail?this.assignments.findByProgram(p.id).find(m=>m.status==='active'&&!m.needsReconfirmation&&m.volunteerEmail.toLowerCase()===body.replacementEmail!.toLowerCase()&&m.id!==id):null;
    if(body.replacementEmail&&!replacement)throw new BadRequestException('Choose another accepted, confirmed program member');
    for(const t of work.tasks.filter(t=>!['completed','cancelled'].includes(t.status))) {
      if(replacement)this.tasks.update(t.id,{assignedToEmail:replacement.volunteerEmail,assignedToName:replacement.volunteerName,notes:`${t.notes || ''}\nHandover from ${a.volunteerName}: ${body.reason}`});
      else this.tasks.cancelForHandover(t.id,body.reason);
    }
    for(const t of work.subtasks.filter(t=>!['completed','cancelled'].includes(t.status))) {
      if(replacement)this.subtasks.transfer(t.id,replacement.volunteerEmail,replacement.volunteerName,body.reason);
      else this.subtasks.cancelForHandover(t.id,body.reason);
    }
    return this.assignments.setWithdrawal(id,'withdrawn',actor.email,a.withdrawalReason || '',body.reason);
  }
  certificate(programId:string,email:string) {
    const membership=this.assignments.findByVolunteer(email).find(a=>a.programId===programId&&a.status==='active'&&!a.needsReconfirmation);
    const work=this.work(programId,email), progress=workProgress(work.tasks,work.subtasks);
    if(!membership || !progress.eligible)throw new BadRequestException('All assigned tasks and subtasks must be verified complete for an active, confirmed member');
    const existing=this.certificates.find(c=>c.programId===programId&&c.email.toLowerCase()===email.toLowerCase());if(existing)return existing;
    const p=this.programs.findById(programId);
    const certificate={id:`CERT-${randomUUID()}`,programId,email,name:membership.volunteerName,organization:p.org,issuedAt:new Date().toISOString(),hours:this.hours.findByVolunteer(email).filter(h=>h.programId===programId&&h.status==='approved').reduce((n,h)=>n+h.hours,0)};
    this.certificates.push(certificate);return certificate;
  }
}
