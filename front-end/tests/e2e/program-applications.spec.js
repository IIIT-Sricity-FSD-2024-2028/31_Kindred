import { API_BASE } from '../apiBase.js';
/* global window */
import {test,expect} from '@playwright/test';

const program={id:'portal-program',name:'Portal teaching',org:'HopeConnect',status:'active',openForApplications:true,listingStatus:'approved',requiredSkills:['Teaching'],startDate:'2099-01-01',endDate:'2099-02-01',version:1,location:'Mumbai',description:'Teach children',workBrief:'Prepare and teach lessons',shiftStart:'09:00',shiftEnd:'12:00'};
const volunteer={id:'portal-volunteer',name:'Portal Volunteer',email:'portal@example.org',org:'Another NGO',status:'active',skills:['Teaching']};
async function setup(page){
  const data={applications:[],assignments:[],tasks:[],writes:[]};
  await page.route(`${API_BASE}/**`,route=>{
    const req=route.request(),path=new URL(req.url()).pathname;
    if(req.method()!=='GET'){
      const body=req.postDataJSON();data.writes.push({path,body});let result={};
      if(path==='/program-applications'){result={...body,id:'application',status:'pending',appliedAt:'2026-11-02'};data.applications.push(result);}
      if(path==='/program-applications/application/approve'){data.applications[0].status='approved';data.assignments.push({id:'membership',programId:program.id,programName:program.name,volunteerEmail:volunteer.email,volunteerName:volunteer.name,status:'pending'});}
      if(path==='/program-applications/application/reject')data.applications[0].status='rejected';
      if(path==='/program-assignments/membership/respond')data.assignments[0].status='active';
      if(path==='/tasks'){result={...body,id:'task',status:'pending'};data.tasks.push(result);}
      if(path==='/tasks/task')Object.assign(data.tasks[0],body);
      return route.fulfill({json:{success:true,data:result}});
    }
    if(path.endsWith('/applicant'))return route.fulfill({json:{success:true,data:{application:data.applications[0],program,profile:{...volunteer,bio:'Experienced community teacher'}}}});
    if(path.endsWith('/brief'))return route.fulfill({json:{success:true,data:{program,organization:{name:program.org},membership:data.assignments[0],eligibility:{eligible:true,reasons:[],warnings:[]}}}});
    const key=path.split('/')[1];
    const result=key==='programs'?[program]:key==='program-applications'?data.applications:key==='program-assignments'?(path.endsWith('/my-programs')?[program]:data.assignments):key==='tasks'?data.tasks:key==='volunteers'?(path.includes('/by-email/')?volunteer:[volunteer]):[];
    return route.fulfill({json:{success:true,data:result}});
  });
  await page.goto('/');
  return data;
}
async function actor(page,role,path){
  await page.evaluate(session=>window.sessionStorage.setItem('kindred_session',JSON.stringify(session)),{id:role==='admin'?'org-admin':volunteer.id,name:role==='admin'?'Coordinator':volunteer.name,email:role==='admin'?'admin@hopeconnect.org':volunteer.email,role,org:role==='admin'?program.org:volunteer.org,status:'approved'});
  await page.goto(path);
}

for(const path of ['/org-admin#programs','/org-admin#volunteers','/org-admin-programs','/volunteers'])test(`portal applicants are reviewable from ${path}`,async({page})=>{
  const data=await setup(page);
  data.applications.push({id:'application',programId:program.id,programName:program.name,volunteerEmail:volunteer.email,volunteerName:volunteer.name,message:'I can help teach',status:'pending'});
  await actor(page,'admin',path);
  const card=page.locator('[data-application-id="application"]:visible');
  await expect(card).toContainText(volunteer.email);
  await card.getByRole('button',{name:'Applicant Details',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('Experienced community teacher');
  await page.getByRole('button',{name:'Close dialog',exact:true}).click();
  await card.getByRole('button',{name:'Reject',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();
  await expect(card).toContainText('rejected');
});

test('portal application proceeds through admin approval, attendance, assignment and volunteer work',async({page})=>{
  const data=await setup(page);
  await actor(page,'volunteer','/volunteer-portal');
  await page.getByRole('button',{name:'Apply Now',exact:true}).click();
  await page.getByRole('button',{name:/Submit Application/}).click();
  await expect.poll(()=>data.applications.length).toBe(1);
  await actor(page,'admin','/org-admin-programs');
  const card=page.locator('[data-application-id="application"]:visible');
  await card.getByRole('button',{name:'Approve',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();
  await expect(card).toContainText('must review the program invitation');
  await expect(card.getByRole('button',{name:'Assign Task',exact:true})).toHaveCount(0);
  await actor(page,'volunteer','/volunteer-dashboard');
  await page.getByRole('button',{name:'Review program & organization details',exact:true}).click();
  await page.getByRole('dialog').getByRole('checkbox').check();
  await page.getByRole('button',{name:'Accept Invitation',exact:true}).click();
  await expect.poll(()=>data.assignments[0].status).toBe('active');
  await actor(page,'admin','/org-admin-programs');
  await card.getByRole('button',{name:'Assign Task',exact:true}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toContainText(`Program: ${program.name}`);
  await expect(dialog.getByRole('combobox',{name:'Volunteer',exact:true})).toHaveValue(volunteer.email);
  await dialog.getByRole('textbox',{name:'Task Title',exact:true}).fill('Prepare lesson materials');
  await dialog.getByRole('button',{name:'Save',exact:true}).click();
  await expect.poll(()=>data.tasks.length).toBe(1);
  await actor(page,'volunteer','/volunteer-dashboard');
  await expect(page.locator('#assignments-list')).toContainText('Prepare lesson materials');
  await page.getByRole('button',{name:'Start Task',exact:true}).click();
  await expect.poll(()=>data.tasks[0].status).toBe('in-progress');
  await expect(page.getByRole('button',{name:'Upload Completion Proof',exact:true})).toBeVisible();
});
