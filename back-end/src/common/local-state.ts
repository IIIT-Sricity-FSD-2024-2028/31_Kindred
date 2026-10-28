import { CallHandler, ExecutionContext, INestApplication, NestInterceptor } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { tap } from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';
import { createLocalStateCodec } from './local-state-codec';

// Keep the local demo's records across development server restarts. Production
// deployments should replace the in-memory services with database repositories.
const names = new Set(['UsersService','OrganizationsService','VolunteersService','ProgramsService','RequestsService','IncomingService','TasksService','HourLogsService','ResourceDonationsService','ProgramAssignmentsService','ProgramApplicationsService','SubtasksService','SellersService','ProductsService','OrdersService','DonationsService','NotificationsService','ReplacementsService','VolunteerRequestsService','FulfillmentService','ProofStore']);
type State = Record<string,Record<string,unknown>>;
export function enableLocalState(app:INestApplication,file=path.resolve(process.cwd(),'../.run/server-state.enc')) {
 let stateFile=file,codec;
 try {codec=createLocalStateCodec(stateFile);}
 catch (error) {
  if(process.platform!=='win32')throw error;
  stateFile=file.replace(/\.enc$/,'.portable.enc');
  codec=createLocalStateCodec(stateFile,true);
  console.warn('Windows account encryption was unavailable. Using a development-only portable encrypted state file; the original state was not modified.');
 }
 const instances=new Map<string,Record<string,unknown>>();
 for(const module of app.get(ModulesContainer).values())for(const provider of module.providers.values()) {
  const instance=provider.instance;
  if(instance&&names.has(instance.constructor.name))instances.set(instance.constructor.name,instance as Record<string,unknown>);
 }
 if(fs.existsSync(stateFile)) {
  const saved:State=JSON.parse(codec.decrypt(fs.readFileSync(stateFile)));
  for(const [name,fields] of Object.entries(saved)) {
   const instance=instances.get(name);if(!instance)continue;
   for(const [key,value] of Object.entries(fields))if(Object.prototype.hasOwnProperty.call(instance,key)&&((Array.isArray(instance[key])&&Array.isArray(value))||(key==='counter'&&typeof value==='number')))instance[key]=value;
  }
 }
 const tasks=instances.get('TasksService') as {rebuildProgramProgress?:()=>void}|undefined;
 tasks?.rebuildProgramProgress?.();
 const save=()=>{
  const snapshot:State={};
  for(const [name,instance] of instances)snapshot[name]=Object.fromEntries(Object.entries(instance).filter(([key,value])=>Array.isArray(value)||(key==='counter'&&typeof value==='number')));
  fs.mkdirSync(path.dirname(stateFile),{recursive:true});fs.writeFileSync(stateFile+'.tmp',codec.encrypt(JSON.stringify(snapshot)),{mode:0o600});fs.renameSync(stateFile+'.tmp',stateFile);
 };
 class LocalStateInterceptor implements NestInterceptor {
  intercept(context:ExecutionContext,next:CallHandler) {return next.handle().pipe(tap(()=>{if(!['GET','HEAD','OPTIONS'].includes(context.switchToHttp().getRequest().method))save();}));}
 }
 app.useGlobalInterceptors(new LocalStateInterceptor());
}
