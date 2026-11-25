/* global window */
import {test,expect} from '@playwright/test';

const program={id:'program-test',name:'Community teaching',org:'HopeConnect',status:'active',openForApplications:true,listingStatus:'approved',requiredSkills:[],startDate:'2099-01-01',endDate:'2099-02-01'};
const volunteer={id:'vol-test',name:'Community Volunteer',email:'volunteer@kindred.org',phone:'9812345678',org:program.org,status:'active',skills:['Teaching']};
const membership={id:'member-test',programId:program.id,programName:program.name,volunteerEmail:volunteer.email,volunteerName:volunteer.name,status:'active'};
async function setup(page,role,path){
  const writes=[];
  const workspace={program,canRate:role==='admin',people:[{email:'admin@hopeconnect.org',name:'Coordinator',role:'Organization admin'},{email:volunteer.email,name:volunteer.name,role:'Program member'}],members:[{email:volunteer.email,name:volunteer.name,canRate:role==='admin'}],messages:[]};
  await page.route('http://localhost:3000/**',route=>{
    const request=route.request(),url=new URL(request.url()),key=url.pathname.split('/')[1];
    if(request.method()!=='GET'){
      const body=request.postDataJSON();writes.push({path:url.pathname,body});
      if(url.pathname.endsWith('/messages'))workspace.messages.push({id:'message-'+writes.length,senderEmail:role==='admin'?'admin@hopeconnect.org':volunteer.email,senderName:'Sender',...body,createdAt:new Date().toISOString()});
      if(url.pathname.endsWith('/ratings'))workspace.members[0].rating=body;
      return route.fulfill({json:{success:true,data:{id:'saved',...body}}});
    }
    if(url.pathname.endsWith('/workspace'))return route.fulfill({json:{success:true,data:workspace}});
    if(url.pathname==='/participation/candidates')return route.fulfill({json:{success:true,data:[{...volunteer,eligible:true,reasons:[],warnings:[]}]}});
    if(url.pathname.startsWith('/volunteers/review/'))return route.fulfill({json:{success:true,data:{...volunteer,bio:'Experienced teacher',availabilityDays:['Monday']}}});
    const data=key==='programs'?[program]:key==='volunteers'?(url.pathname.includes('/by-email/')?volunteer:[volunteer]):key==='program-assignments'?(url.pathname.endsWith('/my-programs')?[program]:[membership]):[];
    return route.fulfill({json:{success:true,data}});
  });
  await page.goto('/');
  await page.evaluate(session=>sessionStorage.setItem('kindred_session',JSON.stringify(session)),{id:'actor-test',name:'Actor',email:role==='admin'?'admin@hopeconnect.org':volunteer.email,org:program.org,role,status:'approved'});
  await page.goto(path);
  return {writes,workspace};
}

test('assigning a task from a program preserves program context without another program choice',async({page})=>{
  const {writes}=await setup(page,'admin','/org-admin#programs');
  await page.locator(`[data-program-id="${program.id}"]`).getByRole('button',{name:'Assign Task',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Assign Task',exact:true});
  await expect(dialog).toContainText(`Program: ${program.name}`);
  await expect(dialog.getByRole('combobox',{name:'Program',exact:true})).toHaveCount(0);
  await dialog.getByRole('textbox',{name:'Task Title',exact:true}).fill('Prepare learning materials');
  await dialog.getByRole('combobox',{name:'Volunteer',exact:true}).selectOption(volunteer.email);
  await dialog.getByRole('button',{name:'Save',exact:true}).click();
  await expect.poll(()=>writes.length).toBe(1);
  expect(writes[0].body).toMatchObject({programId:program.id,assignedToEmail:volunteer.email});
});

test('admin sends group and direct messages and rates verified work',async({page})=>{
  const {writes}=await setup(page,'admin','/org-admin#programs');
  await page.getByRole('button',{name:'Messages & Ratings',exact:true}).click();
  const dialog=page.getByRole('dialog');
  await dialog.getByRole('textbox',{name:'Message',exact:true}).fill('Meet at the community hall.');
  await dialog.getByRole('button',{name:'Send message',exact:true}).click();
  await expect(dialog.getByLabel('Message history')).toContainText('Meet at the community hall.');
  await dialog.getByLabel('Send to',{exact:true}).selectOption(volunteer.email);
  await dialog.getByRole('textbox',{name:'Message',exact:true}).fill('Please bring the teaching materials.');
  await dialog.getByRole('button',{name:'Send message',exact:true}).click();
  await expect(dialog.getByLabel('Message history')).toContainText(`Direct to ${volunteer.name}`);
  await dialog.getByLabel('Rating out of 5',{exact:true}).selectOption('5');
  await dialog.getByRole('button',{name:'Save rating',exact:true}).click();
  await expect(dialog).toContainText('Rating: 5/5');
  await page.locator('.program-workspace-dialog').screenshot({path:'test-results/program-workspace-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.locator('.program-workspace-dialog').screenshot({path:'test-results/program-workspace-mobile.png'});
  expect(writes.map(item=>item.body)).toEqual([{message:'Meet at the community hall.'},{message:'Please bring the teaching materials.',recipientEmail:volunteer.email},{volunteerEmail:volunteer.email,score:5,feedback:''}]);
});

test('volunteer opens messages from their program and a notification URL',async({page})=>{
  const {writes}=await setup(page,'volunteer',`/volunteer-dashboard?program=${program.id}`);
  const dialog=page.getByRole('dialog');
  await dialog.getByLabel('Send to',{exact:true}).selectOption('admin@hopeconnect.org');
  await dialog.getByRole('textbox',{name:'Message',exact:true}).fill('I have arrived.');
  await dialog.getByRole('button',{name:'Send message',exact:true}).click();
  await expect(dialog.getByLabel('Message history')).toContainText('I have arrived.');
  expect(writes[0].body.recipientEmail).toBe('admin@hopeconnect.org');
  await expect(dialog.getByRole('button',{name:'Save rating',exact:true})).toHaveCount(0);
});

test('closing an admin notification conversation keeps it closed across tabs and reloads',async({page})=>{
  await setup(page,'admin',`/org-admin?program=${program.id}&source=notification#programs`);
  const dialog=page.getByRole('dialog');
  await expect(dialog).toContainText(`${program.name} — Messages & ratings`);
  await dialog.getByRole('button',{name:'Close dialog',exact:true}).click();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/org-admin\?source=notification#programs$/);
  for(const tab of ['overview','volunteers','resources','programs']) {
    await page.locator(`#dashboard-tab-${tab}`).click();
    await expect(page).toHaveURL(new RegExp(`#${tab}$`));
    await expect(dialog).toHaveCount(0);
  }
  await page.reload();
  await expect(page.getByRole('button',{name:'Messages & Ratings',exact:true})).toBeVisible();
  await expect(dialog).toHaveCount(0);
  await page.getByRole('button',{name:'Messages & Ratings',exact:true}).click();
  await expect(dialog).toContainText(`${program.name} — Messages & ratings`);
  await dialog.getByRole('button',{name:'Close dialog',exact:true}).click();
  await page.locator(`#dashboard-tab-overview`).click();
  await expect(dialog).toHaveCount(0);
});

test('program creation allows reviewing a volunteer without changing selection',async({page})=>{
  await setup(page,'admin','/create-program');
  await page.locator('#programLocation').fill('Mumbai');
  await page.getByLabel('Start date',{exact:true}).fill('2099-01-01');
  await page.locator('#programEndDate').fill('2099-02-01');
  await page.getByLabel('Shift starts',{exact:true}).fill('09:00');
  await page.getByLabel('Shift ends',{exact:true}).fill('12:00');
  await page.getByRole('button',{name:'View volunteer details',exact:true}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toContainText('Experienced teacher');
  await dialog.getByRole('button',{name:'Close dialog',exact:true}).click();
  await expect(page.getByRole('checkbox',{name:volunteer.name,exact:true})).not.toBeChecked();
});

test('delisted programs disappear from the portal and close an already open application',async({page})=>{
  await setup(page,'volunteer','/volunteer-portal');
  await page.getByRole('button',{name:'Apply Now',exact:true}).click();
  await page.route('http://localhost:3000/programs/portal',route=>route.fulfill({json:{success:true,data:[]}}));
  await page.route('http://localhost:3000/program-assignments/my-programs',route=>route.fulfill({json:{success:true,data:[{...program,status:'paused'}]}}));
  await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await expect(page.getByRole('alert')).toContainText('no longer accepting applications');
  await expect(page.getByRole('button',{name:/Submit Application/})).toBeDisabled();
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await expect(page.locator('.portal-card')).toHaveCount(0);
});
