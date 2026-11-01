import { test, expect } from '@playwright/test';

const org={id:'org_001',name:'HopeConnect',status:'active',listingStatus:'approved',focus:'Education',city:'Mumbai',email:'coordinator@hopeconnect.org',phone:'9812345678',bankAccountName:'HopeConnect',bankAccountNumber:'12345678901',bankIfsc:'SBIN0001234'};
const program={id:'future-program',name:'Community Teaching',org:org.name,status:'active',listingStatus:'approved',startDate:'2099-01-01',endDate:'2099-01-07',shiftStart:'09:00',shiftEnd:'12:00',reportingTime:'08:45',shiftDays:['Monday'],timeZone:'Asia/Kolkata',invitationDeadline:'2098-12-30',location:'Mumbai',meetingPoint:'Central hall',contactName:'Anita',contactPhone:'9812345678',workBrief:'Teach children for two hours. Materials and training provided.',description:'Community learning',requiredSkills:['Teaching'],version:2,budget:100,volunteerGoal:5,openForApplications:true};
const membership={id:'member-1',programId:program.id,programName:program.name,volunteerEmail:'volunteer@kindred.org',volunteerName:'Priya',status:'pending',role:'Teacher'};
async function setup(page,role,path,overrides={}){
 const state={organizations:[org],programs:[program],assignments:[structuredClone(membership)],volunteers:[{id:'v1',name:'Priya',email:'volunteer@kindred.org',org:org.name,status:'active',currentLocation:'Mumbai',availableNow:true}],tasks:[],subtasks:[],buyerOrders:[],buyerReplacements:[],...overrides},writes=[];
 await page.route('http://localhost:3000/**',async route=>{
   const req=route.request(),url=new URL(req.url()),parts=url.pathname.split('/');
   if(req.method()!=='GET'){
     const body=req.postDataJSON();writes.push({path:url.pathname,body});
     if(url.pathname.endsWith('/respond')&&parts[1]==='program-assignments')state.assignments[0].status=body.action==='accepted'?'active':'declined';
     if(parts[1]==='subtasks')Object.assign(state.subtasks.find(t=>t.id===parts[2]),body);
     if(parts[1]==='orders'&&parts[3]==='cancel')state.buyerOrders[0].deliveryStatus='cancelled';
     if(parts[1]==='fulfillment'&&parts[4]==='receipt'){const r=state.resourceRequests[0];if(body.action==='close')r.issue.status='closed';}
     return route.fulfill({json:{success:true,data:parts[1]==='programs'?{...program,id:'saved-program'}:{}}});
   }
   if(url.pathname.includes('/brief'))return route.fulfill({json:{success:true,data:{program,organization:org,membership:state.assignments[0],work:{tasks:state.tasks,subtasks:state.subtasks},eligibility:{eligible:true,reasons:[],warnings:['Travel to this location needs confirmation']}}}});
   if(url.pathname==='/participation/candidates')return route.fulfill({json:{success:true,data:[{...state.volunteers[0],eligible:true,reasons:[],warnings:[],availableFrom:'2099-01-01',availableUntil:'2099-12-31',willingToTravel:true},{id:'v2',name:'Busy volunteer',email:'busy@example.test',eligible:false,reasons:['Conflicts with another accepted shift'],warnings:[],currentLocation:'Delhi',availableNow:false}]}});
   const aliases={'program-assignments':'assignments','program-applications':'applications','hour-logs':'hours','resource-donations':'resources'};
   let value=state[aliases[parts[1]]||parts[1]]||[];
   if(parts[1]==='volunteers'&&parts[2]==='by-email')value=state.volunteers[0];
   if(parts[1]==='fulfillment')value=state[{requests:'resourceRequests',inventory:'inventory',deliveries:'deliveries',volunteers:'volunteers',catalog:'resourceCatalog'}[parts[2]]]||[];
   if(parts[1]==='orders'&&parts[2]==='by-buyer')value=state.buyerOrders;
   if(parts[1]==='replacements'&&parts[2]==='by-buyer')value=state.buyerReplacements;
   return route.fulfill({json:{success:true,data:value}});
 });
 await page.goto('/');await page.evaluate(session=>sessionStorage.setItem('kindred_session',JSON.stringify(session)),{id:'tester',role,email:`${role}@kindred.org`,name:'Priya',org:org.name,status:'approved'});await page.goto(path);
 return {state,writes};
}

test('volunteer reviews organizer, work, route and schedule before confirming the current brief',async({page})=>{
 const {writes}=await setup(page,'volunteer','/volunteer-dashboard');
 await page.getByRole('button',{name:'Review program & organization details'}).click();
 const modal=page.getByRole('dialog');await expect(modal).toContainText('Teach children for two hours');await expect(modal).toContainText('coordinator@hopeconnect.org');await expect(modal).toContainText('08:45');await expect(modal).toContainText('Central hall');
 const accept=modal.getByRole('button',{name:'Accept Invitation',exact:true});await expect(accept).toBeDisabled();await modal.getByRole('checkbox').check();await accept.click();await expect(modal).toHaveCount(0);
 expect(writes.find(w=>w.path.endsWith('/respond')).body).toEqual({action:'accepted',version:2,attendanceConfirmed:true});
 await page.getByRole('button',{name:'Withdraw from program'}).click();await page.getByRole('dialog').getByLabel('Reason / handover note').fill('Moving to another city; keep my completed work.');await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();
 expect(writes.some(w=>w.path==='/participation/memberships/member-1/withdraw')).toBe(true);
});

test('a verified subtask does not block other progress or permit an early certificate',async({page})=>{
 const {writes}=await setup(page,'volunteer','/volunteer-dashboard',{assignments:[{...membership,status:'active'}],tasks:[{id:'main-task',programId:program.id,title:'Teach lessons',assignedToEmail:'volunteer@kindred.org',status:'pending'}],subtasks:[{id:'done',programId:program.id,title:'Prepare materials',assignedToEmail:'volunteer@kindred.org',status:'completed',progress:100},{id:'unfinished',programId:program.id,title:'Visit school',assignedToEmail:'volunteer@kindred.org',status:'in-progress',progress:20}]});
 await expect(page.getByRole('button',{name:'Download Certificate',exact:true})).toHaveCount(0);await page.getByRole('button',{name:'Report Progress',exact:true}).click();
 const dialog=page.getByRole('dialog');await expect(dialog.getByRole('slider',{name:'Progress: Prepare materials'})).toBeDisabled();await dialog.getByRole('slider',{name:'Progress: Visit school'}).fill('60');await dialog.getByRole('button',{name:'Save Progress'}).click();
 expect(writes.filter(w=>w.path.startsWith('/subtasks/'))).toEqual([{path:'/subtasks/unfinished',body:{progress:60,status:'in-progress'}}]);
});

test('program planner exposes date and suitability context and excludes conflicting volunteers',async({page})=>{
 await setup(page,'admin','/create-program',{assignments:[]});
 await page.getByLabel('Start date',{exact:true}).fill('2099-01-01');await page.locator('#programEndDate').fill('2099-01-07');await page.locator('#programLocation').fill('Mumbai');await page.getByLabel('Shift starts').fill('09:00');await page.getByLabel('Shift ends').fill('12:00');
 await expect(page.getByRole('checkbox',{name:'Priya',exact:true})).toBeEnabled();await expect(page.getByRole('checkbox',{name:'Busy volunteer',exact:true})).toBeDisabled();await expect(page.locator('.volunteer-candidates')).toContainText('Conflicts with another accepted shift');await expect(page.locator('.volunteer-candidates')).toContainText('Travel: Willing');
 await page.setViewportSize({width:390,height:844});await page.locator('.volunteer-candidates').screenshot({path:'test-results/volunteer-selection-context.png'});
});

for(const role of ['volunteer','beneficiary','seller','admin'])test(`${role} can see and cancel their own purchase`,async({page})=>{
 const {writes}=await setup(page,role,role==='admin'?'/org-admin':`/${role}-dashboard`,{buyerOrders:[{id:'purchase-1',productTitle:'Handmade bag',quantity:1,total:100,address:'Mumbai',deliveryStatus:'awaiting_admin_assignment',paymentStatus:'paid'}]});
 const section=page.getByRole('region',{name:'Purchases and replacements'});await expect(section).toContainText('Handmade bag');await section.getByRole('button',{name:'Cancel purchase'}).click();await page.getByRole('dialog').getByLabel('Reason',{exact:true}).fill('Delivery no longer needed');await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();await expect(section.getByRole('button',{name:'Cancel purchase'})).toHaveCount(0);expect(writes.find(w=>w.path==='/orders/purchase-1/cancel').body.reason).toBe('Delivery no longer needed');
});

test('partial resource requests show outstanding need and let recipients close a resolved issue',async({page})=>{
 const {writes}=await setup(page,'beneficiary','/beneficiary-dashboard',{resourceRequests:[{id:'partial',orgName:org.name,resource:'Rice',quantity:10,unit:'kg',deliveredQuantity:4,remainingQuantity:6,approvedQuantity:0,status:'partially_delivered',message:'Remainder open',history:[],allocations:[],issue:{status:'resolved',message:'A packet was damaged',resolution:'Damaged packet replaced',history:[]}}]});
 const card=page.locator('[data-resource-request-id="partial"]');await expect(card).toContainText('Delivered: 4 kg');await expect(card).toContainText('Remaining need: 6');await card.getByRole('button',{name:'Accept resolution / reopen issue'}).click();const modal=page.getByRole('dialog');await modal.getByLabel('Message',{exact:true}).fill('Replacement received');await modal.getByRole('button',{name:'Submit',exact:true}).click();await expect(card).toContainText('Delivery issue: closed');expect(writes.find(w=>w.path.endsWith('/receipt')).body.action).toBe('close');
});
