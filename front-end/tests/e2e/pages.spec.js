import { test, expect } from '@playwright/test';

const base = 'http://localhost:3000';
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
  const account = { ...accounts[role] }; delete account.password;
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
  await page.locator('.btn-signin-main').click(); await expect(page.locator('.page-action-error')).toContainText('Invalid email');
  await page.getByRole('button',{ name: 'Platform Administrator',exact:true }).click();
  await page.getByRole('button',{ name: /Team 2: Shop/ }).click(); await expect(page.locator('#si-email')).toHaveValue('admin2@kindred.org');
  await page.locator('.btn-signin-main').click(); await expect(page).toHaveURL(/platform-admin$/);
  await expect(page.getByRole('tab',{ name: /User Management/ })).toHaveCount(0);
});

test('controlled donor registration creates a real approved account', async ({ page, request }) => {
  const email = `react-donor-${Date.now()}@example.test`;
  await page.goto('/signup.html'); await page.getByRole('button',{ name: 'Donor',exact:true }).click();
  await page.locator('#don-name').fill('React Donor Test'); await page.locator('#don-email').fill(email); await page.locator('#don-phone').fill('9812345678');
  await page.locator('#don-pass').fill('Test@123'); await page.locator('#don-pass2').fill('different'); await page.locator('#form-donor button.btn').click();
  await expect(page.locator('.page-action-error')).toContainText('Passwords do not match'); await page.locator('#don-pass2').fill('Test@123'); await page.locator('#form-donor button.btn').click();
  await expect(page).toHaveURL(/donor-dashboard$/);
  const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('kindred_session'))); expect(stored.email).toBe(email);
  expect((await request.delete(`${base}/users/${stored.id}`,{ headers: { role:'superuser' } })).ok()).toBe(true);
});

test('volunteer registration, administrator approval, and subsequent sign-in work', async ({ page, request }) => {
  const email = `react-volunteer-${Date.now()}@example.test`;
  await page.goto('/signup.html'); await page.getByRole('button',{ name: 'Volunteer',exact:true }).click();
  await page.locator('#vol-name').fill('React Volunteer Test'); await page.locator('#vol-email').fill(email); await page.locator('#vol-phone').fill('9812345678'); await page.locator('#vol-pass').fill('Test@123'); await page.locator('#vol-pass2').fill('Test@123'); await page.locator('#form-volunteer button.btn').click();
  await expect(page).toHaveURL(/registration-pending$/);
  await as(page,'superuser','/admin-users.html'); await page.locator('#searchUsers').fill(email);
  const row = page.locator('#userTableBody tr').filter({ hasText: email }); await row.getByRole('button',{ name:'Approve',exact:true }).click(); await confirm(page); await expect(row).toContainText('approved');
  await page.evaluate(() => sessionStorage.removeItem('kindred_session')); await page.goto('/signin.html'); await page.getByRole('button',{ name:'Volunteer',exact:true }).click(); await page.locator('#si-email').fill(email); await page.locator('#si-pass').fill('Test@123'); await page.locator('.btn-signin-main').click(); await expect(page).toHaveURL(/volunteer-dashboard$/);
  const users = (await (await request.get(`${base}/users`,{ headers:{role:'superuser'} })).json()).data; const user = users.find((u) => u.email === email);
  const volunteers = (await (await request.get(`${base}/volunteers`,{ headers:{role:'superuser'} })).json()).data;
  expect(volunteers.some((v) => v.email === email)).toBe(true);
  await request.delete(`${base}/users/${user.id}`,{headers:{role:'superuser'}}); await request.delete(`${base}/volunteers/${volunteers.find((v) => v.email === email).id}`,{headers:{role:'superuser'}});
});

test('donation steps validate input and save the actual backend receipt with masked card data', async ({ page, request }) => {
  await as(page,'donor','/donate.html');
  await page.locator('#donate-org-grid .small-org-card').first().getByRole('button',{ name:'Donate',exact:true }).click();
  await page.locator('#donor-name').fill('React Donation Test'); await page.locator('#donor-email').fill(`react-donation-${Date.now()}@example.test`); await page.getByRole('button',{name:'Monthly',exact:true}).click(); await page.locator('[data-amount="1000"]').click(); await page.locator('#proceed-donate-btn').click();
  await expect(page.locator('#donate-step-2')).toBeVisible(); await page.locator('#pay-now-btn').click(); await expect(page.getByRole('dialog').getByRole('alert')).toContainText('16-digit');
  await card(page); await page.locator('#save-card-check').check(); await page.locator('#pay-now-btn').click(); await expect(page.locator('#donate-step-success')).toBeVisible();
  const id = await page.locator('#success-txn-id').textContent(); const donations = (await (await request.get(`${base}/donations`,{headers:{role:'superuser'}})).json()).data; expect(donations.find((d) => d.id === id)).toMatchObject({ amount:1000, frequency:'monthly',cardLast4:'1111' });
  const local = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(localStorage)))); expect(local).not.toContain('4111111111111111'); expect(local).not.toContain('"cvv"');
});

test('resource donation persists through assignment, pickup, delivery, and completion', async ({ page, request }) => {
  const description = `React resource ${Date.now()}`;
  await as(page,'donor','/donor-dashboard.html#resources'); await page.getByRole('button',{name:/Donate Resources/}).click();
  await page.locator('#rd-phone').fill('9812345678'); await page.locator('#rd-category').selectOption('Food'); await page.getByRole('textbox',{name:'Item name',exact:true}).fill('Rice bags'); await page.locator('#rd-desc').fill(description); await page.locator('#rd-address').fill('Test pickup address'); await page.locator('#rd-date').fill('2030-12-12'); await page.locator('#rd-timeslot').selectOption('Morning (9AM-12PM)');
  const response = page.waitForResponse((r) => r.url() === `${base}/resource-donations` && r.request().method() === 'POST'); await page.getByRole('button',{name:/Submit Donation/}).click(); const record = (await (await response).json()).data;
  await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.locator('#donor-resource-list')).toContainText(description);
  await as(page,'admin','/org-admin.html#resources'); const row = page.locator('#orgResourcesTableBody tr').filter({hasText:description});
  // Table descriptions are available through the selected record's item names.
  const target = page.locator('#orgResourcesTableBody tr').filter({hasText:'Rice bags'}).last(); await target.getByRole('button',{name:'Assign Volunteer',exact:true}).click();
  await page.getByRole('dialog').getByLabel('Volunteer',{exact:true}).selectOption('volunteer@kindred.org'); await page.getByRole('dialog').getByRole('button',{name:'Save',exact:true}).click(); await expect(page.getByRole('dialog')).toHaveCount(0);
  await as(page,'volunteer'); const pickup = page.locator(`[data-record-id="${record.id}"]`); await pickup.getByRole('button',{name:'Start Pickup'}).click(); await confirm(page); await expect(pickup).toContainText('in transit'); await pickup.getByRole('button',{name:'Mark Delivered'}).click(); await confirm(page); await expect(pickup).toContainText('delivered');
  await as(page,'admin','/resources.html'); const complete = page.locator(`[data-record-id="${record.id}"]`); await complete.getByRole('button',{name:'Mark Complete'}).click(); await confirm(page); await expect(complete).toContainText('completed');
  await request.delete(`${base}/resource-donations/${record.id}`,{headers:{role:'superuser'}});
  void row;
});

test('program creation, portal filtering, application review, and assignment use the real API', async ({ page, request }) => {
  const name = `React program ${Date.now()}`;
  await as(page,'admin','/create-program.html'); await page.locator('#programTitle').fill(name); await page.locator('#progCategoryContainer').getByLabel('Education',{exact:true}).check(); await page.locator('#programLocation').fill('Test city'); await page.locator('#programBudget').fill('5000'); await page.locator('#programEndDate').fill('2030-12-31'); await page.locator('#volunteerGoal').fill('10'); await page.locator('#programDesc').fill('A synthetic program for frontend migration verification.'); await page.locator('#createProgramBtn').click(); await expect(page).toHaveURL(/program-success$/);
  const program = await page.evaluate(() => JSON.parse(sessionStorage.getItem('kindred_last_program')));
  await as(page,'volunteer','/volunteer-portal.html'); await page.locator('#portal-search').fill(name); const card = page.locator('#portalGrid article').filter({hasText:name}); await card.getByRole('button',{name:'Apply Now'}).click(); await page.locator('#apply-message').fill('I can help with this program.'); await page.getByRole('button',{name:/Submit Application/}).click(); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(card).toContainText('Application pending');
  await as(page,'admin','/org-admin.html#programs'); const application = page.locator('#programApplicationsList article').filter({hasText:name}); await application.getByRole('button',{name:'Approve',exact:true}).click(); await confirm(page); await expect(application).toContainText('approved');
  const assignments = (await (await request.get(`${base}/program-assignments/by-program/${program.id}`,{headers:{role:'admin'}})).json()).data; expect(assignments.some((a) => a.volunteerEmail === accounts.volunteer.email)).toBe(true);
  const applications = (await (await request.get(`${base}/program-applications/by-program/${program.id}`,{headers:{role:'admin'}})).json()).data;
  for (const a of assignments) await request.delete(`${base}/program-assignments/${a.id}`,{headers:{role:'admin'}}); for (const a of applications) await request.delete(`${base}/program-applications/${a.id}`,{headers:{role:'admin'}}); await request.delete(`${base}/programs/${program.id}`,{headers:{role:'admin'}});
});

test('contact, feedback, emergency and beneficiary forms use supported submissions and expose missing anonymous access', async ({ page, request }) => {
  await page.goto('/contact.html'); await page.locator('#cf-fname').fill('React'); await page.locator('#cf-lname').fill('Test'); await page.locator('#cf-email').fill('react@example.test'); await page.locator('#cf-subject').fill('Migration test'); await page.locator('#cf-message').fill('A synthetic message for verification.'); await page.locator('#contact-submit-btn').click(); await expect(page.locator('.page-action-error')).toContainText('requires a beneficiary');
  await as(page,'beneficiary','/feedback.html'); await page.locator('#feedbackName').fill('React Test'); await page.locator('#feedbackEmail').fill('react@example.test'); await page.locator('#feedbackCategory').selectOption({index:1}); await page.getByRole('button',{name:'5 stars',exact:true}).click(); await page.locator('#feedbackText').fill('This is a synthetic feedback submission for verification.'); await page.locator('#submitFeedbackBtn').click(); await expect(page).toHaveURL(/feedback-thankyou$/);
  await as(page,'beneficiary','/beneficiary-dashboard.html'); await page.getByRole('button',{name:'New Request',exact:true}).click(); await page.locator('[name="phone"]').fill('9812345678'); await page.locator('[name="location"]').fill('Test city'); await page.locator('[name="type"]').first().check(); await page.locator('textarea[name="description"]').fill('Synthetic assistance request for verification.'); await page.locator('#broadcast-btn').click(); await expect(page).toHaveURL(/page4-broadcast-sent$/);
  const saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem('kindred_last_request'))); expect(saved.beneficiaryEmail).toBe(accounts.beneficiary.email); await request.delete(`${base}/incoming/${saved.id}`,{headers:{role:'superuser'}});
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

test('volunteer task states, notes, hour logs, and administrator review persist', async ({ page, request }) => {
  const title = `React Task ${Date.now()}`;
  await as(page,'volunteer'); await page.getByRole('button',{name:/Add Task/}).click(); await page.locator('#vt-title').fill(title); await page.locator('#vt-desc').fill('Synthetic task for verification.');
  const created = page.waitForResponse((r) => r.url() === `${base}/tasks` && r.request().method() === 'POST'); await page.getByRole('dialog').getByRole('button',{name:/Submit|Create|Add Task/}).click(); const task = (await (await created).json()).data;
  const taskCard = page.locator('#assignments-list article').filter({hasText:title}); await taskCard.getByRole('button',{name:'Start Task'}).click(); await expect(taskCard).toContainText('in-progress'); await taskCard.getByRole('button',{name:'Add Notes'}).click(); await page.getByRole('dialog').getByLabel('Progress Notes').fill('Work is ready for review.'); await page.getByRole('dialog').getByRole('button',{name:'Save',exact:true}).click(); await expect(page.getByRole('dialog')).toHaveCount(0); await taskCard.getByRole('button',{name:'Submit for Review'}).click(); await expect(taskCard).toContainText('pending_review');
  await page.getByRole('button',{name:/Log Hours/}).first().click(); await page.locator('#log-activity').fill(title); await page.locator('#log-hours').fill('2');
  const logged = page.waitForResponse((r) => r.url() === `${base}/hour-logs` && r.request().method() === 'POST'); await page.getByRole('dialog').getByRole('button',{name:'Log Hours',exact:true}).click(); const hour = (await (await logged).json()).data; await expect(page.getByRole('dialog')).toHaveCount(0);
  await as(page,'admin','/org-admin.html#volunteers'); const review = page.locator('#taskApprovalList article').filter({hasText:title}); await review.getByRole('button',{name:'Approve Completion'}).click(); await expect(review).toContainText('completed'); const hours = page.locator('#hourVerificationList article').filter({hasText:title}); await hours.getByRole('button',{name:'Verify'}).click(); await confirm(page); await expect(hours).toHaveCount(0);
  expect((await (await request.get(`${base}/tasks/${task.id}`,{headers:{role:'admin'}})).json()).data.notes).toBe('Work is ready for review.'); await request.delete(`${base}/tasks/${task.id}`,{headers:{role:'admin'}}); await request.delete(`${base}/hour-logs/${hour.id}`,{headers:{role:'admin'}});
});

test('program progress updates unlock a React-rendered printable certificate', async ({ page, request }) => {
  const program = (await (await request.post(`${base}/programs`,{headers:{role:'admin'},data:{name:`React Certificate ${Date.now()}`,org:'HopeConnect',focus:'Education',startDate:'2026-10-14',budget:100,description:'Synthetic certificate verification.'}})).json()).data;
  const assignment = (await (await request.post(`${base}/program-assignments`,{headers:{role:'admin'},data:{programId:program.id,programName:program.name,volunteerEmail:accounts.volunteer.email,volunteerName:accounts.volunteer.name}})).json()).data;
  const subtask = (await (await request.post(`${base}/subtasks`,{headers:{role:'admin'},data:{programId:program.id,title:'Certificate verification subtask',assignedToEmail:accounts.volunteer.email,assignedToName:accounts.volunteer.name}})).json()).data;
  await as(page,'volunteer'); const article = page.locator('#my-programs-list article').filter({hasText:program.name}); await article.getByRole('button',{name:'Report Progress'}).click(); await page.getByRole('slider',{name:/Certificate verification/}).focus(); await page.keyboard.press('End'); await page.getByRole('button',{name:'Save Progress'}).click(); await expect(page.getByRole('dialog')).toHaveCount(0); await article.getByRole('button',{name:'Download Certificate'}).click(); await expect(page.locator('.completion-certificate')).toContainText(accounts.volunteer.name); await expect(page.getByRole('button',{name:'Print / Save PDF'})).toBeVisible();
  await request.delete(`${base}/subtasks/${subtask.id}`,{headers:{role:'admin'}}); await request.delete(`${base}/program-assignments/${assignment.id}`,{headers:{role:'admin'}}); await request.delete(`${base}/programs/${program.id}`,{headers:{role:'admin'}});
});

test('seller listing creation, editing, and deletion use the backend', async ({ page, request }) => {
  const title = `React Listing ${Date.now()}`;
  await as(page,'seller'); await page.getByRole('button',{name:/Add Product/}).first().click(); await page.locator('#prod-title').fill(title); await page.locator('#prod-price').fill('125'); await page.locator('#prod-quantity').fill('3'); await page.locator('#prod-desc').fill('Synthetic listing for verification.');
  const created = page.waitForResponse((r) => r.url() === `${base}/products` && r.request().method() === 'POST'); await page.getByRole('dialog').getByRole('button',{name:/Submit|Save Product|Add Product/}).click(); const product = (await (await created).json()).data; await expect(page.getByRole('dialog')).toHaveCount(0);
  const article = page.locator('#sellerProductsGrid article').filter({hasText:title}); await expect(article).toContainText('pending_approval'); await article.getByRole('button',{name:'Edit',exact:true}).click(); await page.locator('#prod-price').fill('150'); await page.getByRole('dialog').getByRole('button',{name:/Submit|Save Product|Add Product/}).click(); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(article).toContainText('150'); await article.getByRole('button',{name:'Delete',exact:true}).click(); await confirm(page); await expect(article).toHaveCount(0);
  expect((await request.get(`${base}/products/${product.id}`)).status()).toBe(404);
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
  await page.goto('/phone-entry.html'); await page.locator('#phone-input').fill('9812345678'); await page.getByRole('button',{name:'Send Verification Code'}).click(); await expect(page.locator('.page-action-error')).toContainText('no OTP'); await expect(page).toHaveURL(/phone-entry$/);
  await page.goto('/reset-password.html'); await page.locator('#rp-pass').fill('Test@123'); await page.locator('#rp-pass2').fill('Test@123'); await page.getByRole('button',{name:/Reset Password|Set New Password|Update Password/}).click(); await expect(page.locator('.page-action-error')).toContainText('has not changed');
});
