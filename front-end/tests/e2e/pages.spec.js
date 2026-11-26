import { login, authenticatedHeaders, scheduledProgram, readyVolunteer, futureDate, submitProof, proofImage } from '../fixtures/liveWorkflow.js';
import { API_BASE } from '../apiBase.js';
import { test, expect } from '@playwright/test';

const base = API_BASE;
const accounts = {
  superuser: { id: 'su_001', name: 'Kavita Sharma', email: 'super@kindred.org', password: 'Super@123', label: 'Platform Administrator', dashboard: 'platform-admin' },
  admin: { id: 'adm_001', name: 'Rajesh Verma', email: 'admin@hopeconnect.org', password: 'Admin@123', label: 'Organization Admin', org: 'HopeConnect', dashboard: 'org-admin' },
  volunteer: { id: 'vol_001', name: 'Priya Singh', email: 'volunteer@kindred.org', password: 'Vol@123', label: 'Volunteer', dashboard: 'volunteer-dashboard' },
  donor: { id: 'don_001', name: 'Arun Patel', email: 'donor@kindred.org', password: 'Donor@123', label: 'Donor', dashboard: 'donor-dashboard' },
  beneficiary: { id: 'ben_001', name: 'Meena Devi', email: 'beneficiary@kindred.org', password: 'Ben@123', label: 'Beneficiary', dashboard: 'beneficiary-dashboard' },
  seller: { id: 'seller_001', name: 'Ravi Kumar', email: 'seller@kindred.org', password: 'Seller@123', label: 'Seller / Artisan', dashboard: 'seller-dashboard' },
};
async function as(page, role, path, extra = {}) {
  await page.goto('/');
  const account = await login(page.request, role);
  await page.evaluate((session) => sessionStorage.setItem('kindred_session',JSON.stringify(session)), { ...account, role, status: 'approved', ...extra });
  await page.goto(path || `/${accounts[role].dashboard}.html`);
  await expect(page.locator('main[data-react-page]')).toBeVisible();
}
async function confirm(page) { await page.getByRole('dialog', { name: 'Confirm Action' }).getByRole('button', { name: 'Confirm', exact: true }).click(); await expect(page.getByRole('dialog', { name: 'Confirm Action' })).toHaveCount(0); }
async function card(page, prefix = '') {
  await page.locator(`#${prefix}card-number`).fill('4111111111111111');
  await page.locator(`#${prefix}card-holder-name`).fill('Migration Test');
  await page.locator(`#${prefix}card-expiry`).fill('12/39');
  await page.locator(`#${prefix}card-cvv`).fill('123');
}

test('home renders the preserved video and plays it inline', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-title-main')).toContainText('Through Kindness');
  const video = page.locator('video.hero-bg-video');
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate((v) => v.readyState)).toBeGreaterThan(1);
  expect(await video.evaluate((v) => ({ muted: v.muted, loop: v.loop, autoplay: v.autoplay, inline: v.playsInline }))).toEqual({ muted: true, loop: true, autoplay: true, inline: true });
  await expect.poll(() => video.evaluate((v) => v.currentTime)).toBeGreaterThan(0);
  await page.getByRole('link', { name: /Join as Volunteer/ }).click(); await expect(page).toHaveURL(/join-volunteer$/);
});

for (const [role, account] of Object.entries(accounts)) test(`sign-in role selection and backend login work for ${role}`, async ({ page }) => {
  await page.goto('/signin.html');
  await page.locator('.role-list').getByRole('button', { name: account.label, exact: true }).click();
  await expect(page.locator('#si-email')).toHaveValue(account.email);
  await page.locator('.btn-signin-main').click();
  await expect(page).toHaveURL(new RegExp(account.dashboard+'$'));
  const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('kindred_session')));
  expect(stored.role).toBe(role); expect(stored.password).toBeUndefined();
});

test('failed sign-in stays on the form; password visibility and team credentials work', async ({ page }) => {
  await page.goto('/signin.html'); await page.getByRole('button',{ name: 'Donor',exact:true }).click();
  await page.locator('#si-pass').fill('wrong-password'); await page.locator('.pass-eye').click(); await expect(page.locator('#si-pass')).toHaveAttribute('type','text');
  await page.locator('.btn-signin-main').click(); await expect(page.locator('form [role=alert]')).toContainText('Invalid email');
  await page.getByRole('button',{ name: 'Platform Administrator',exact:true }).click();
  await page.getByRole('button',{ name: /Team 2: Shop/ }).click(); await expect(page.locator('#si-email')).toHaveValue('admin2@kindred.org');
  await page.locator('.btn-signin-main').click(); await expect(page).toHaveURL(/platform-admin$/);
  await expect(page.getByRole('tab',{ name: /User Management/ })).toHaveCount(0);
});

async function recoveryQuestions(page) {
  await page.locator('#security-question-1').selectOption('first_school');
  await page.getByRole('textbox',{name:'Answer to security question 1',exact:true}).fill('School');
  await page.locator('#security-question-2').selectOption('first_pet');
  await page.getByRole('textbox',{name:'Answer to security question 2',exact:true}).fill('Pet');
}
async function verifyRegistration(page,prefix,form) {
  const started=page.waitForResponse(r=>r.url().endsWith('/users/verification/start')&&r.request().method()==='POST');
  await page.locator(form+' button.btn').click();
  const challenge=(await (await started).json()).data;
  await page.locator('#'+prefix+'-verification-code').fill(challenge.developmentCode);
  await page.locator(form+' button.btn').click();
}

test('controlled donor registration creates a real approved account', async ({ page, request }) => {
  const email = `react-donor-${Date.now()}@example.test`;
  await page.goto('/signup.html'); await page.getByRole('button',{ name: 'Donor',exact:true }).click();
  await page.locator('#don-name').fill('React Donor Test'); await page.locator('#don-email').fill(email); await page.locator('#don-phone').fill('9812345678');
  await page.locator('#don-pass').fill('Test@123'); await page.locator('#don-pass2').fill('different'); await page.locator('#form-donor button.btn').click();
  await expect(page.locator('#don-pass2-validation')).toContainText('Passwords do not match');
  await page.locator('#don-pass2').fill('Test@123'); await recoveryQuestions(page);
  await page.locator('#don-location').fill('Pune'); await page.locator('#don-dob').fill('2000-01-01');
  await page.locator('#don-verification-method').selectOption('card_simulation'); await page.locator('#don-verification-reference').fill('1111');
  await verifyRegistration(page,'don','#form-donor'); await expect(page).toHaveURL(/donor-dashboard$/);
  const stored=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('kindred_session'))); expect(stored.email).toBe(email);
  expect((await request.delete(`${base}/users/${stored.id}`,{headers:await authenticatedHeaders(request,'superuser')})).ok()).toBe(true);
});

test('volunteer registration, administrator approval, and subsequent sign-in work', async ({ page, request }) => {
  const email=`react-volunteer-${Date.now()}@example.test`;
  await page.goto('/signup.html'); await page.getByRole('button',{name:'Volunteer',exact:true}).click();
  for(const [field,value] of Object.entries({name:'React Volunteer Test',email,phone:'9812345678',pass:'Test@123',pass2:'Test@123',location:'Pune',dob:'2000-01-01','present-address':'Community road, Pune','permanent-address':'Community road, Pune'})) await page.locator('#vol-'+field).fill(value);
  await recoveryQuestions(page); await page.locator('#vol-aadhaar-consent').check(); await page.locator('#vol-day-Monday').check();
  await verifyRegistration(page,'vol','#form-volunteer'); await expect(page).toHaveURL(/registration-pending$/);
  await as(page,'superuser','/admin-users.html'); await page.locator('#searchUsers').fill(email);
  const row=page.locator('#userTableBody tr').filter({hasText:email}); await row.getByRole('button',{name:'Approve',exact:true}).click(); await confirm(page); await expect(row).toContainText('approved');
  await page.evaluate(()=>sessionStorage.removeItem('kindred_session')); await page.goto('/signin.html'); await page.getByRole('button',{name:'Volunteer',exact:true}).click(); await page.locator('#si-email').fill(email); await page.locator('#si-pass').fill('Test@123'); await page.locator('.btn-signin-main').click(); await expect(page).toHaveURL(/volunteer-dashboard$/);
  const session=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('kindred_session')));
  const headers=await authenticatedHeaders(request,'superuser');
  const volunteers=(await (await request.get(`${base}/volunteers`,{headers})).json()).data;
  const profile=volunteers.find(v=>v.email===email); expect(profile).toBeTruthy();
  await request.delete(`${base}/users/${session.id}`,{headers}); await request.delete(`${base}/volunteers/${profile.id}`,{headers});
});

test('donation steps validate input and save the actual backend receipt with masked card data', async ({ page, request }) => {
  await as(page,'donor','/donate.html');
  await page.locator('#donate-org-grid .small-org-card').first().getByRole('button',{name:'Donate',exact:true}).click();
  await page.locator('#custom-amount').fill('1000'); await page.getByRole('dialog').getByRole('button',{name:'Save',exact:true}).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('16-digit'); await card(page);
  const saved=page.waitForResponse(r=>r.url()===`${base}/donations`&&r.request().method()==='POST');
  await page.getByRole('dialog').getByRole('button',{name:'Save',exact:true}).click(); const receipt=(await (await saved).json()).data;
  await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.getByRole('status')).toContainText('Demo card donation recorded');
  const donations=(await (await request.get(`${base}/donations`,{headers:{role:'superuser'}})).json()).data;
  expect(donations.find(d=>d.id===receipt.id)).toMatchObject({amount:1000,frequency:'one-time',cardLast4:'1111'});
  await page.reload(); await expect(page.locator('main')).toBeVisible();
  const local=await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries(localStorage)))); expect(local).not.toContain('4111111111111111'); expect(local).not.toContain('"cvv"');
});

test('resource donation persists through assignment, pickup, delivery, and completion', async ({ page, request }) => {
  test.setTimeout(60000);
  const volunteerHeaders=await readyVolunteer(request), adminHeaders=await authenticatedHeaders(request,'admin');
  const description=`React resource ${Date.now()}`;
  await as(page,'donor','/donor-dashboard.html#resources'); await page.getByRole('button',{name:/Donate Resources/}).click();
  await page.getByRole('combobox',{name:'Recipient Organization',exact:true}).selectOption('org_001');
  await page.locator('#rd-phone').fill('9812345678'); await page.locator('#rd-category').selectOption('Food'); await page.getByRole('textbox',{name:'Item name',exact:true}).fill('Rice bags');
  await page.locator('#rd-desc').fill(description); await page.locator('#rd-address').fill('Community road, Pune'); await page.locator('#rd-date').fill(futureDate()); await page.locator('#rd-timeslot').selectOption('Morning (9AM-12PM)');
  const saved=page.waitForResponse(r=>r.url()===`${base}/resource-donations`&&r.request().method()==='POST'); await page.getByRole('button',{name:/Submit Donation/}).click(); const donation=(await (await saved).json()).data;
  await expect(page.getByRole('dialog')).toHaveCount(0); await page.reload(); await expect(page.locator('#donor-resource-list')).toContainText(description);
  await as(page,'admin','/org-admin.html#resources');
  await page.locator(`[data-resource-id="${donation.id}"]`).getByRole('button',{name:'Allocate Volunteer',exact:true}).click();
  await page.getByRole('dialog').getByLabel('Volunteer',{exact:true}).selectOption(accounts.volunteer.email);
  const offered=page.waitForResponse(r=>r.url()===`${base}/fulfillment/deliveries`&&r.request().method()==='POST');
  await page.getByRole('dialog').getByRole('button',{name:/Save|Allocate/,exact:false}).click(); const delivery=(await (await offered).json()).data;
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await as(page,'volunteer'); const row=page.locator(`[data-delivery-id="${delivery.id}"]`); await row.getByRole('button',{name:'Accept Delivery',exact:true}).click();
  for(const checkbox of await page.getByRole('dialog').getByRole('checkbox').all()) await checkbox.check(); await page.getByRole('dialog').getByRole('button',{name:'Accept Delivery',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Close dialog',exact:true}).click();
  await row.getByRole('button',{name:'Confirm Pickup',exact:true}).click(); await row.getByRole('button',{name:'Start Delivery',exact:true}).click(); await expect(row).toContainText('in transit');
  const proof=await submitProof(request,'deliveries',delivery.id,volunteerHeaders);
  expect((await request.patch(`${base}/proofs/${proof.id}/approve`,{headers:adminHeaders,data:{}})).ok()).toBe(true);
  await as(page,'admin','/resources.html'); await expect(page.locator(`[data-delivery-id="${delivery.id}"]`)).toContainText('verified');
  await page.locator(`[data-resource-id="${donation.id}"]`).getByRole('button',{name:'Confirm Usable Receipt',exact:true}).click(); await page.getByRole('dialog').getByRole('button',{name:'Submit',exact:true}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.locator('.inventory-table')).toContainText('Rice bags');
});

test('program creation, portal filtering, application review, and assignment use the real API', async ({ page, request }) => {
  test.setTimeout(60000);
  await readyVolunteer(request); const name=`React program ${Date.now()}`, schedule={...scheduledProgram(),shiftStart:'13:00',shiftEnd:'14:00',reportingTime:'12:45'};
  await as(page,'admin','/create-program.html');
  const fields={programTitle:name,programLocation:schedule.location,programBudget:'5000',programEndDate:schedule.endDate,volunteerGoal:'10',programDesc:'Community support verification.',};
  for(const [id,value] of Object.entries(fields)) await page.locator('#'+id).fill(value);
  for(const [label,value] of [['Start date',schedule.startDate],['Shift starts',schedule.shiftStart],['Shift ends',schedule.shiftEnd],['Reporting time',schedule.reportingTime],['Invitation deadline',schedule.invitationDeadline],['Coordinator name',schedule.contactName],['Coordinator phone',schedule.contactPhone],['Meeting point',schedule.meetingPoint],['Work to be done, expected hours, equipment and support',schedule.workBrief]]) await page.getByLabel(label,{exact:true}).fill(value);
  await page.locator('#progCategoryContainer').getByLabel('Education',{exact:true}).check(); await page.getByRole('checkbox',{name:'Monday',exact:true}).check();
  const saved=page.waitForResponse(r=>r.url()===`${base}/programs`&&r.request().method()==='POST'); await page.locator('#createProgramBtn').click(); const program=(await (await saved).json()).data; await expect(page).toHaveURL(/program-success\?id=/);
  await as(page,'volunteer','/volunteer-portal.html'); await page.locator('#portal-search').fill(name); const card=page.locator('#portalGrid article').filter({hasText:name});
  await card.getByRole('button',{name:'Apply Now',exact:true}).click(); await page.locator('#apply-message').fill('I can help.'); await page.getByRole('button',{name:/Submit Application/}).click(); await expect(page.getByRole('dialog')).toHaveCount(0);
  await as(page,'admin','/org-admin.html#programs'); const application=page.locator('[data-application-id]:visible').filter({hasText:name}); await application.getByRole('button',{name:'Approve',exact:true}).click(); await confirm(page); await expect(application).toContainText('approved');
  await as(page,'volunteer'); const article=page.locator('#my-programs-list article').filter({hasText:name}); await article.getByRole('button',{name:'Review program & organization details',exact:true}).click(); await page.getByRole('dialog').getByRole('checkbox').check(); await page.getByRole('button',{name:'Accept Invitation',exact:true}).click(); await expect(page.getByRole('dialog')).toHaveCount(0);
  const headers={role:'admin',organization:'HopeConnect'}; const memberships=(await (await request.get(`${base}/program-assignments/by-program/${program.id}`,{headers})).json()).data;
  expect(memberships.find(a=>a.volunteerEmail===accounts.volunteer.email).status).toBe('active');
  const applications=(await (await request.get(`${base}/program-applications/by-program/${program.id}`,{headers})).json()).data;
  for(const record of memberships) await request.delete(`${base}/program-assignments/${record.id}`,{headers}); for(const record of applications) await request.delete(`${base}/program-applications/${record.id}`,{headers}); await request.delete(`${base}/programs/${program.id}`,{headers});
});

test('contact, feedback, emergency and beneficiary forms use supported submissions and expose missing anonymous access', async ({ page, request }) => {
  await page.goto('/contact.html'); await page.locator('#cf-fname').fill('React'); await page.locator('#cf-lname').fill('Test'); await page.locator('#cf-email').fill('react@example.test'); await page.locator('#cf-subject').fill('Migration test'); await page.locator('#cf-message').fill('A synthetic message for verification.'); await page.locator('#contact-submit-btn').click(); await expect(page.locator('.page-action-error')).toContainText('requires a beneficiary');
  await as(page,'beneficiary','/feedback.html'); await page.locator('#feedbackName').fill('React Test'); await page.locator('#feedbackEmail').fill('react@example.test'); await page.locator('#feedbackCategory').selectOption({index:1}); await page.getByRole('button',{name:'5 stars',exact:true}).click(); await page.locator('#feedbackText').fill('This is a synthetic feedback submission for verification.'); await page.locator('#submitFeedbackBtn').click(); await expect(page).toHaveURL(/feedback-thankyou$/);
  await as(page,'beneficiary','/beneficiary-dashboard.html'); await page.getByRole('button',{name:'New Request',exact:true}).click(); await page.locator('[name="phone"]').fill('9812345678'); await page.locator('[name="location"]').fill('Test city'); await page.locator('[name="type"]').first().check(); await page.locator('textarea[name="description"]').fill('Synthetic assistance request for verification.'); const response=page.waitForResponse(r=>r.url()===`${base}/incoming`&&r.request().method()==='POST'); await page.locator('#broadcast-btn').click(); await expect(page).toHaveURL(/page4-broadcast-sent$/);
  const saved=(await (await response).json()).data; expect(saved.beneficiaryEmail).toBe(accounts.beneficiary.email); await request.delete(`${base}/incoming/${saved.id}`,{headers:{role:'superuser'}});
});

test('shop category/search, checkout, backend stock, and order receipt work', async ({ page, request }) => {
  const sellerResponse = await request.post(`${base}/sellers`,{data:{name:'React Checkout Seller',email:`react-seller-${Date.now()}@example.test`,businessName:'Synthetic Checkout Business',organizationId:'org_001',organizationName:'HopeConnect'}}); const seller = (await sellerResponse.json()).data;
  const created = await request.post(`${base}/products`,{headers:{role:'superuser'},data:{sellerId:seller.id,sellerName:seller.name,title:`React product ${Date.now()}`,description:'Synthetic verification product.',price:125,quantity:3,category:'Handicrafts',photos:[]}}); const product = (await created.json()).data; await request.patch(`${base}/products/${product.id}/approve`,{headers:{role:'superuser'},data:{}});
  await as(page,'donor','/shop.html'); await page.getByPlaceholder(/Search.*product/i).fill(product.title); await page.locator('#shopProductsGrid').getByRole('button',{name:'View Details →'}).click(); await page.getByRole('button',{name:/Buy Now/}).click(); await page.locator('#checkout-phone').fill('9812345678'); await page.locator('#checkout-address').fill('Synthetic test delivery address'); await page.locator('#checkout-qty').fill('2'); await page.locator('#proceed-shop-pay-btn').click(); await card(page,'shop-'); await page.locator('#shop-pay-now-btn').click(); await expect(page.locator('#shop-step-success')).toBeVisible(); await expect(page.locator('#success-order-amount')).toContainText('250');
  const current = (await (await request.get(`${base}/products/${product.id}`)).json()).data; expect(current.quantity).toBe(1); await request.delete(`${base}/products/${product.id}`,{headers:{role:'superuser'}}); await request.delete(`${base}/sellers/${seller.id}`,{headers:{role:'superuser'}});
});

test('organization create/edit/delete and CSV export are functional', async ({ page, request }) => {
  const name = `React Organization ${Date.now()}`;
  await as(page,'superuser','/platform-admin.html'); await page.locator('.page-header .btn-add-org').click();
  await page.getByRole('dialog').getByLabel('Organization Name').fill(name); await page.getByRole('dialog').getByLabel('Focus Area').fill('Education'); await page.getByRole('dialog').getByLabel('Email',{exact:true}).fill('org@example.test'); await page.getByRole('dialog').getByLabel('Phone',{exact:true}).fill('9812345678'); await page.getByRole('dialog').getByLabel('City',{exact:true}).fill('Test city'); await page.getByRole('dialog').getByRole('button',{name:'Save',exact:true}).click(); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('#searchOrgs').fill(name); const row = page.locator('#orgTableBody tr').filter({hasText:name}); await expect(row).toHaveCount(1); await row.getByRole('button',{name:'Edit',exact:true}).click(); await page.getByRole('dialog').getByLabel('City',{exact:true}).fill('Updated city'); await page.getByRole('dialog').getByRole('button',{name:'Save',exact:true}).click(); await expect(page.getByRole('dialog')).toHaveCount(0); await row.getByRole('button',{name:'Delete',exact:true}).click(); await confirm(page); await expect(page.locator('#orgTableBody')).not.toContainText(name);
  await as(page,'admin','/incoming.html'); const download = page.waitForEvent('download'); await page.getByRole('button',{name:/Export CSV/}).click(); expect((await download).suggestedFilename()).toBe('kindred-incoming.csv');
  const orgs = (await (await request.get(`${base}/organizations`)).json()).data; expect(orgs.some((o) => o.name === name)).toBe(false);
});

async function uploadProofModal(page) {
  await page.getByRole('dialog').getByLabel('Proof Image').setInputFiles(proofImage);
  const saved=page.waitForResponse(r=>r.url()===`${base}/proofs`&&r.request().method()==='POST');
  await page.getByRole('button',{name:'Submit Proof for Review',exact:true}).click();
  const proof=(await (await saved).json()).data; await expect(page.getByRole('dialog')).toHaveCount(0); return proof;
}

test('volunteer task states, notes, hour logs, and administrator review persist', async ({ page, request }) => {
  test.setTimeout(60000);
  const title=`React Task ${Date.now()}`;
  await as(page,'volunteer'); await page.getByRole('button',{name:/Add Task/}).click(); await page.locator('#vt-title').fill(title); await page.locator('#vt-desc').fill('Task verification.');
  const created=page.waitForResponse(r=>r.url()===`${base}/tasks`&&r.request().method()==='POST'); await page.getByRole('dialog').getByRole('button',{name:/Submit|Create|Add Task/}).click(); const task=(await (await created).json()).data;
  const card=page.locator('#assignments-list article').filter({hasText:title}); await card.getByRole('button',{name:'Start Task',exact:true}).click(); await expect(card).toContainText('in-progress');
  await card.getByRole('button',{name:'Add Notes',exact:true}).click(); await page.getByRole('dialog').getByLabel('Progress Notes').fill('Work is ready for review.'); await page.getByRole('dialog').getByRole('button',{name:'Save',exact:true}).click(); await expect(page.getByRole('dialog')).toHaveCount(0);
  await card.getByRole('button',{name:'Submit for Review',exact:true}).click(); const taskProof=await uploadProofModal(page);
  await page.getByRole('button',{name:/Log Hours/}).first().click(); await page.locator('#log-activity').fill(title+' hours'); await page.locator('#log-hours').fill('2');
  const logged=page.waitForResponse(r=>r.url()===`${base}/hour-logs`&&r.request().method()==='POST'); await page.getByRole('dialog').getByRole('button',{name:'Log Hours',exact:true}).click(); const hour=(await (await logged).json()).data;
  const hourProof=await uploadProofModal(page); await as(page,'admin','/org-admin.html#volunteers');
  for(const proof of [taskProof,hourProof]) {
    const review=page.locator('.proof-review-card').filter({has:page.getByRole('heading',{name:proof.title,exact:true})}); await review.getByRole('button',{name:'Verify Proof & Complete',exact:true}).click(); await confirm(page); await expect(review).toContainText('approved');
  }
  const headers={role:'admin'};
  expect((await (await request.get(`${base}/tasks/${task.id}`,{headers})).json()).data).toMatchObject({status:'completed',notes:'Work is ready for review.'});
  expect((await (await request.get(`${base}/hour-logs/${hour.id}`,{headers})).json()).data.status).toBe('approved');
  await page.reload(); await expect(page.locator('#taskApprovalList')).toContainText('completed');
  await request.delete(`${base}/tasks/${task.id}`,{headers}); await request.delete(`${base}/hour-logs/${hour.id}`,{headers});
});

test('program progress updates unlock a React-rendered printable certificate', async ({ page, request }) => {
  test.setTimeout(60000);
  const volunteerHeaders=await readyVolunteer(request), headers={role:'admin',organization:'HopeConnect','user-email':accounts.admin.email};
  const program=(await (await request.post(`${base}/programs`,{headers,data:{name:`React Certificate ${Date.now()}`,org:'HopeConnect',focus:'Education',...scheduledProgram(),shiftStart:'15:00',shiftEnd:'16:00',reportingTime:'14:45',budget:100,description:'Certificate verification.'}})).json()).data;
  const assignment=(await (await request.post(`${base}/program-assignments`,{headers,data:{programId:program.id,programName:program.name,volunteerEmail:accounts.volunteer.email,volunteerName:accounts.volunteer.name}})).json()).data;
  expect((await request.patch(`${base}/program-assignments/${assignment.id}/respond`,{headers:volunteerHeaders,data:{action:'accepted',version:program.version||1,attendanceConfirmed:true}})).ok()).toBe(true);
  const subtask=(await (await request.post(`${base}/subtasks`,{headers,data:{programId:program.id,title:'Certificate verification subtask',assignedToEmail:accounts.volunteer.email,assignedToName:accounts.volunteer.name}})).json()).data;
  try {
    await as(page,'volunteer'); const article=page.locator('#my-programs-list article').filter({hasText:program.name});
    await expect(article.getByRole('button',{name:'Download Certificate',exact:true})).toHaveCount(0);
    await article.getByRole('button',{name:'Report Progress',exact:true}).click(); await page.getByRole('slider',{name:/Certificate verification/}).fill('60'); await page.getByRole('button',{name:'Save Progress',exact:true}).click(); await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(article.getByRole('button',{name:'Download Certificate',exact:true})).toHaveCount(0);
    const proof=await submitProof(request,'subtasks',subtask.id,volunteerHeaders); expect((await request.patch(`${base}/proofs/${proof.id}/approve`,{headers,data:{}})).ok()).toBe(true);
    await page.reload(); await article.getByRole('button',{name:'Download Certificate',exact:true}).click(); await expect(page.locator('.completion-certificate')).toContainText(accounts.volunteer.name); await expect(page.getByRole('button',{name:'Print / Save PDF',exact:true})).toBeVisible();
  } finally { await request.delete(`${base}/subtasks/${subtask.id}`,{headers}); await request.delete(`${base}/program-assignments/${assignment.id}`,{headers}); await request.delete(`${base}/programs/${program.id}`,{headers}); }
});

test('seller listing creation, editing, and deletion use the backend', async ({ page, request }) => {
  const title = `React Listing ${Date.now()}`;
  await as(page,'seller'); await page.getByRole('button',{name:/Add (?:New )?Product/}).first().click(); await page.locator('#prod-title').fill(title); await page.locator('#prod-price').fill('125'); await page.locator('#prod-quantity').fill('3'); await page.locator('#prod-desc').fill('Synthetic listing for verification.');
  const created = page.waitForResponse((r) => r.url() === `${base}/products` && r.request().method() === 'POST'); await page.getByRole('dialog').getByRole('button',{name:/Submit|Save|Add Product/}).click(); const product = (await (await created).json()).data; await expect(page.getByRole('dialog')).toHaveCount(0);
  const article = page.locator('#sellerProductsGrid article').filter({hasText:title}); await expect(article).toContainText('pending_approval'); await article.getByRole('button',{name:'Edit',exact:true}).click(); await page.locator('#prod-price').fill('150'); await page.getByRole('dialog').getByRole('button',{name:/Submit|Save|Add Product/}).click(); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(article).toContainText('150'); await article.getByRole('button',{name:'Delete',exact:true}).click(); await confirm(page); await expect(article).toHaveCount(0);
  expect((await (await request.get(`${base}/products/${product.id}`)).json()).data.status).toBe('archived');
});

test('volunteer CRUD retains the selected role and skills on edit', async ({ page, request }) => {
  const email = `react-vol-crud-${Date.now()}@example.test`;
  await as(page,'admin','/volunteers.html'); await page.locator('[data-add-volunteer]').click();
  const dialog = page.getByRole('dialog'); await dialog.getByLabel('Full Name').fill('React CRUD Volunteer'); await dialog.getByLabel('Email',{exact:true}).fill(email); await dialog.getByLabel('Phone',{exact:true}).fill('9812345678'); await dialog.getByLabel('Volunteer Role').fill('Field Coordinator'); await dialog.getByLabel('Skills (comma separated)').fill('Teaching, Logistics');
  const created = page.waitForResponse((r) => r.url() === `${base}/volunteers` && r.request().method() === 'POST'); await dialog.getByRole('button',{name:'Save',exact:true}).click(); const volunteer = (await (await created).json()).data;
  await page.locator('#volunteerSearch').fill(email); const row = page.locator('#volTableBody tr').filter({hasText:email}); await row.getByRole('button',{name:'Edit',exact:true}).click(); await dialog.getByLabel('Phone',{exact:true}).fill('9823456789'); await dialog.getByRole('button',{name:'Save',exact:true}).click(); await expect(dialog).toHaveCount(0);
  const saved = (await (await request.get(`${base}/volunteers/${volunteer.id}`,{headers:{role:'admin'}})).json()).data; expect(saved).toMatchObject({phone:'9823456789',role:'Field Coordinator',skills:['Teaching','Logistics']}); await row.getByRole('button',{name:'Delete',exact:true}).click(); await confirm(page); await expect(row).toHaveCount(0);
});

test('OTP and password recovery controls report the missing backend without simulating success', async ({ page }) => {
  await page.goto('/phone-entry.html'); await page.locator('#phone-input').fill('9812345678'); await page.getByRole('button',{name:'Send Verification Code'}).click(); await expect(page.locator('#page-form-error')).toContainText('no OTP'); await expect(page).toHaveURL(/phone-entry$/);
  await page.goto('/reset-password.html'); await page.locator('#rp-pass').fill('Test@123'); await page.locator('#rp-pass2').fill('Test@123'); await page.getByRole('button',{name:/Reset Password|Set New Password|Update Password/}).click(); await expect(page.locator('#page-form-error')).toContainText('Start password recovery');
});
