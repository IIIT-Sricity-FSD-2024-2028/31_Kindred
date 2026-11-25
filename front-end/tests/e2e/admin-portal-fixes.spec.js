import { test, expect } from '@playwright/test';

const program = { id: 'portal-program', name: 'Open community program', org: 'HopeConnect', status: 'active', listingStatus: 'unlisted', openForApplications: true, requiredSkills: [], focus: ['Education'] };
async function setup(page, path, role = 'admin') {
  await page.route('http://localhost:3000/**', route => {
    const key = new URL(route.request().url()).pathname.split('/')[1];
    return route.fulfill({ json: { success: true, data: ({ programs: [program], products: [{ id: 'product', title: 'Community bag', price: 100, quantity: 3, status: 'approved', photos: [] }] })[key] || [] } });
  });
  await page.goto('/');
  await page.evaluate(role => sessionStorage.setItem('kindred_session', JSON.stringify({ id: 'actor-test', name: 'Test Actor', email: 'actor@hopeconnect.org', org: 'HopeConnect', role, status: 'approved' })), role);
  await page.goto(path);
}

test('closing program Details keeps organization programs usable', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await setup(page, '/org-admin#programs');
  await page.getByRole('button', { name: 'Details', exact: true }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Details', exact: true }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('workflow sections only appear in their relevant organization areas', async ({ page }) => {
  await setup(page, '/org-admin#programs');
  await expect(page.getByRole('heading', { name: 'Participation & handovers' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My Purchases' })).toHaveCount(0);
  await page.goto('/create-program');
  await expect(page.getByRole('heading', { name: 'Participation & handovers' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Replacement Requests' })).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Monday', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Wednesday', exact: true }).check();
  await expect(page.getByRole('checkbox', { name: 'Monday', exact: true })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Wednesday', exact: true })).toBeChecked();
});

test('portal displays open programs without public listing approval', async ({ page }) => {
  await setup(page, '/volunteer-portal', 'volunteer');
  await expect(page.locator('.portal-card')).toContainText(program.name);
});

test('shop immediately shows available stock beneath an excessive quantity', async ({ page }) => {
  await setup(page, '/shop');
  await page.locator('.shop-product-actions').getByRole('button').click();
  await page.getByRole('button', { name: /Buy Now/ }).click();
  await page.locator('#checkout-qty').fill('4');
  await expect(page.locator('#checkout-stock')).toContainText('3 item(s) of stock available');
  await expect(page.locator('#checkout-stock')).toHaveAttribute('role', 'alert');
  await expect(page.locator('#checkout-qty')).toHaveAttribute('aria-invalid', 'true');
});

test('portal details can be read before applying and without losing an application draft', async ({ page }) => {
  await setup(page, '/volunteer-portal', 'volunteer');
  await page.route('**/participation/programs/*/brief', route => route.fulfill({ json: { success: true, data: { program: { ...program, workBrief: 'Teach children in the community hall', shiftDays: ['Monday','Wednesday'], contactName: 'Program Coordinator', contactPhone: '9812345678' }, organization: { name: 'HopeConnect', city: 'Mumbai', email: 'contact@hopeconnect.org', phone: '9812345678', status: 'active', volunteers: 50, beneficiaries: 200 } } } }));
  await page.getByRole('button', { name: 'View Details', exact: true }).click();
  const details = page.getByRole('dialog', { name: 'Organization & program details', exact: true });
  await expect(details).toContainText('contact@hopeconnect.org');
  await expect(details).toContainText('Program Coordinator');
  await details.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await page.getByRole('button', { name: 'Apply Now', exact: true }).click();
  await page.locator('#apply-message').fill('I can help on Mondays.');
  const apply = page.getByRole('dialog', { name: 'Apply to Program', exact: true });
  await apply.getByRole('button', { name: 'View Details', exact: true }).click();
  await expect(details).toContainText('Teach children in the community hall');
  await details.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await expect(page.locator('#apply-message')).toHaveValue('I can help on Mondays.');
});

test('admins can review applicant profiles including reviewed applications', async ({ page }) => {
  await setup(page, '/org-admin#programs');
  const profile = { name: 'Community Applicant', email: 'applicant@example.test', phone: '9812345678', skills: ['Teaching'], availabilityDays: ['Monday','Wednesday'], willingToTravel: true, bio: 'Experienced community teacher' };
  const application = { id: 'application-review', programId: program.id, programName: program.name, volunteerName: profile.name, volunteerEmail: profile.email, status: 'approved', message: 'I can teach children', appliedAt: '2026-11-01' };
  await page.route('**/program-applications/by-org/*', route => route.fulfill({ json: { success: true, data: [application] } }));
  await page.route('**/program-applications/application-review/applicant', route => route.fulfill({ json: { success: true, data: { application, program, profile } } }));
  await page.reload();
  await page.getByRole('button', { name: 'Applicant Details', exact: true }).click();
  const dialog = page.getByRole('dialog');
  for (const text of [profile.email,profile.phone,profile.bio,'Monday, Wednesday',application.message]) await expect(dialog).toContainText(text);
  await dialog.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Applicant Details', exact: true })).toBeVisible();
});

test('admins can open full volunteer profiles from the volunteer directory', async ({ page }) => {
  await setup(page, '/volunteers');
  const profile = { id: 'vol-review', name: 'Directory Volunteer', email: 'volunteer@example.test', org: 'HopeConnect', status: 'active', phone: '9812345678', skills: ['Teaching'], serviceAreas: 'Mumbai', availableFrom: '2026-11-01', availableUntil: '2026-12-31' };
  await page.route('http://localhost:3000/volunteers', route => route.fulfill({ json: { success: true, data: [profile] } }));
  await page.route('**/volunteers/review/*', route => route.fulfill({ json: { success: true, data: profile } }));
  await page.reload();
  await page.getByRole('button', { name: 'Details', exact: true }).click();
  const dialog = page.getByRole('dialog');
  for (const text of [profile.phone,profile.serviceAreas,profile.availableFrom,profile.availableUntil]) await expect(dialog).toContainText(text);
});

test('volunteer edits personal details and planned availability from Edit Profile', async ({ page }) => {
  await setup(page, '/profile', 'volunteer');
  const profile = {id:'actor-test',name:'Test Actor',email:'actor@hopeconnect.org',role:'volunteer',status:'approved',bio:'Existing introduction',location:'Pune',dateOfBirth:'2000-04-15',verificationStatus:'verified'};
  const volunteer = {id:'volunteer-profile',name:profile.name,email:profile.email,status:'active',skills:[],availableNow:false};
  const writes = [];
  await page.route('**/volunteers/by-email/*', route => route.fulfill({json:{success:true,data:volunteer}}));
  await page.route('**/volunteers/me/profile', route => {
    if(route.request().method()==='PATCH'){const body=route.request().postDataJSON();writes.push(body);Object.assign(profile,body);}
    return route.fulfill({json:{success:true,data:profile}});
  });
  await page.route('**/volunteers/me/presence', route => {
    const body=route.request().postDataJSON();writes.push(body);Object.assign(volunteer,body);
    return route.fulfill({json:{success:true,data:volunteer}});
  });
  await page.reload();
  await expect(page.locator('#pf-bio')).toHaveValue('Existing introduction');
  await page.locator('#pf-bio').fill('I teach children and organize learning activities.');
  await page.getByLabel('Home location', {exact:true}).fill('Mumbai');
  await page.getByLabel('Date of birth', {exact:true}).fill('1998-05-20');
  await page.locator('#saveBtn').click();
  await expect.poll(()=>writes.length).toBe(1);
  await page.getByLabel('Available from',{exact:true}).fill('2099-01-01');
  await page.getByLabel('Available until',{exact:true}).fill('2099-02-01');
  await page.getByLabel('Service areas (comma separated)',{exact:true}).fill('Mumbai, Thane');
  await page.getByRole('checkbox',{name:'Monday',exact:true}).check();
  await page.getByRole('checkbox',{name:'Wednesday',exact:true}).check();
  await page.getByRole('checkbox',{name:'Willing to travel outside my service areas',exact:true}).check();
  await page.getByRole('button',{name:'Save planned availability',exact:true}).click();
  await expect.poll(()=>writes.length).toBe(2);
  expect(writes[1]).toMatchObject({availableFrom:'2099-01-01',availableUntil:'2099-02-01',serviceAreas:'Mumbai, Thane',availabilityDays:['Monday','Wednesday'],willingToTravel:true});
  await page.reload();
  await expect(page.locator('#pf-bio')).toHaveValue(profile.bio);
  await expect(page.getByLabel('Home location',{exact:true})).toHaveValue('Mumbai');
  await expect(page.getByRole('checkbox',{name:'Wednesday',exact:true})).toBeChecked();
});
