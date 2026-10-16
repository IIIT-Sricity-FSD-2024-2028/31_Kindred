/* global window */
import { test, expect } from '@playwright/test';

const org = { id: 'org_001', name: 'HopeConnect', focus: 'Education', status: 'active', listingStatus: 'approved', bankAccountName: 'HopeConnect', bankAccountNumber: '12345678901', bankIfsc: 'SBIN0001234' };
const program = { id: 'prog_001', name: 'Community Teaching', org: org.name, focus: 'Education', location: 'Pune', status: 'active', listingStatus: 'approved', openForApplications: true, budget: 1000, volunteers: 1, requiredSkills: [] };
const volunteer = { id: 'vol_001', name: 'Priya', email: 'volunteer@kindred.org', role: 'Volunteer', org: org.name };
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jN1sAAAAASUVORK5CYII=', 'base64');
async function setup(page, role, path, extra = {}) {
  const data = { organizations: [org], programs: [program], volunteers: [volunteer], assignments: [], proofs: [], donations: [], ...extra };
  const writes = [];
  await page.route('http://localhost:3000/**', async (route) => {
    const req = route.request(), url = new URL(req.url()), key = url.pathname.split('/')[1];
    const names = { 'program-assignments': 'assignments', 'program-applications': 'applications', 'hour-logs': 'hours', 'resource-donations': 'resources' };
    if (req.method() !== 'GET') {
      const multipart = req.headers()['content-type']?.includes('multipart/form-data');
      const body = multipart ? req.postData() : req.postDataJSON();
      writes.push({ path: url.pathname, body });
      let result = {};
      if (url.pathname === '/programs') { result = { ...body, id: 'created-program', status: 'active', listingStatus: 'pending', volunteers: 0 }; data.programs.push(result); }
      if (url.pathname === '/program-applications') { result = { ...body, id: 'application', status: 'pending' }; data.applications = [result]; }
      if (url.pathname === '/proofs') { data.proofs = [{ id: 'proof', collection: 'tasks', recordId: 'task', title: 'Teaching task', status: 'pending', volunteerEmail: volunteer.email, organization: org.name, image: '/images/org-education.png' }]; }
      if (url.pathname === '/proofs/proof/approve') { data.proofs[0].status = 'approved'; }
      if (url.pathname.endsWith('/approve-listing')) data.programs[0].listingStatus = 'approved';
      if (url.pathname === '/donations') { result = { ...body, id: 'donation', paymentMode: 'card_demo', bankAccountName: org.bankAccountName, bankAccountNumber: org.bankAccountNumber, bankIfsc: org.bankIfsc, date: '2026-10-16', status: 'paid' }; data.donations.push(result); }
      if (url.pathname.endsWith('/issue-certificate')) { data.donations[0].certificateNumber = 'THANKS-001'; data.donations[0].certificateIssuedAt = '2026-10-16'; }
      return route.fulfill({ json: { success: true, data: result } });
    }
    if (url.pathname === '/program-assignments/my-programs') return route.fulfill({ json: { success: true, data: data.programs } });
    if (url.pathname.startsWith('/program-assignments/by-program/')) return route.fulfill({ json: { success: true, data: data.assignments.filter((a) => a.programId === url.pathname.split('/').at(-1)) } });
    if (key === 'balance' || url.pathname.startsWith('/donations/balance/')) return route.fulfill({ json: { success: true, data: { verifiedTotal: data.donations.reduce((n,d) => n+d.amount,0) } } });
    return route.fulfill({ json: { success: true, data: data[names[key] || key] || [] } });
  });
  await page.goto('/');
  if (role) await page.evaluate((session) => window.sessionStorage.setItem('kindred_session',JSON.stringify(session)), { id: 'test-user', name: 'Tester', email: role === 'volunteer' ? volunteer.email : `${role}@kindred.org`, role, org: org.name, status: 'approved' });
  await page.goto(path);
  return writes;
}

test('public programs offer guest donation signup and joining, including existing volunteers but excluding admins', async ({ page }) => {
  await setup(page,null,'/programs');
  await expect(page.getByRole('button',{ name: 'Donate', exact: true })).toBeVisible();
  await page.getByRole('button',{ name: 'Join as Volunteer', exact: true }).click();
  await expect(page).toHaveURL(/signup\?role=volunteer/);
  await page.evaluate(() => window.sessionStorage.setItem('kindred_session',JSON.stringify({ id:'vol',name:'Priya',email:'volunteer@kindred.org',role:'volunteer',status:'approved',org:'HopeConnect' })));
  await page.goto('/programs');
  await expect(page.getByRole('button',{ name: 'Join as Volunteer', exact: true })).toBeVisible();
  await page.getByRole('button',{ name: 'Join as Volunteer', exact: true }).click();
  await expect(page.getByRole('button',{ name: 'Join as Volunteer', exact: true })).toBeDisabled();
  await page.evaluate(() => window.sessionStorage.setItem('kindred_session',JSON.stringify({ id:'admin',name:'Admin',email:'admin@kindred.org',role:'admin',status:'approved',org:'HopeConnect' })));
  await page.goto('/programs');
  await expect(page.getByRole('button',{ name: 'Join as Volunteer', exact: true })).toHaveCount(0);
});

test('creating a program sends invitations and requests public listing without requiring a photo', async ({ page }) => {
  const writes = await setup(page,'admin','/create-program', { volunteers: [{ ...volunteer, org: 'Another NGO', skills: ['Teaching'] }] });
  await page.getByRole('searchbox',{ name:'Search volunteers to invite' }).fill('Teaching');
  await expect(page.getByRole('checkbox',{ name:'Priya', exact:true })).toBeVisible();
  await page.getByRole('searchbox',{ name:'Search volunteers to invite' }).fill('No matching person');
  await expect(page.getByRole('checkbox',{ name:'Priya', exact:true })).toHaveCount(0);
  await page.getByRole('searchbox',{ name:'Search volunteers to invite' }).fill('Priya');
  await page.locator('#programTitle').fill('New Education Program');
  await page.locator('#programLocation').fill('Pune');
  await page.locator('#programBudget').fill('1000');
  await page.locator('#programEndDate').fill('2027-10-16');
  await page.locator('#volunteerGoal').fill('5');
  await page.locator('#programDesc').fill('Teaching children in the local community');
  await page.locator('#progCategoryContainer').getByLabel('Education',{ exact: true }).check();
  await page.getByRole('checkbox',{ name: 'Priya', exact: true }).check();
  await page.getByRole('checkbox',{ name: 'Request display on the public Programs page' }).check();
  await page.locator('#createProgramBtn').click();
  await expect(page).toHaveURL(/program-success/);
  expect(writes.find((w) => w.path === '/programs').body.requestListing).toBe(true);
  const invitation = writes.find((w) => w.path === '/program-assignments');
  expect(invitation.body.status).toBe('pending');
  expect(invitation.body.volunteerEmail).toBe(volunteer.email);
});

test('volunteer uploads proof and sees pending verification rather than completed work', async ({ page }) => {
  const writes = await setup(page,'volunteer','/volunteer-dashboard',{ tasks: [{ id:'task',title:'Teaching task',assignedToEmail:volunteer.email,programId:program.id,programName:program.name,status:'in-progress' }] });
  await page.getByRole('button',{ name:'Upload Completion Proof',exact:true }).click();
  const modal = page.getByRole('dialog');
  await modal.getByRole('button',{ name:'Submit Proof for Review' }).click();
  await expect(modal.getByRole('alert')).toContainText('Upload a proof image');
  await modal.getByLabel('Proof Image').setInputFiles({ name:'proof.png',mimeType:'image/png',buffer:png });
  await modal.getByRole('button',{ name:'Submit Proof for Review' }).click();
  await expect(modal).toHaveCount(0);
  await expect(page.getByRole('region',{name:'Work proof verification'})).toContainText('Awaiting organization verification');
  expect(writes.find((w) => w.path === '/proofs').body).toContain('proof.png');
});

test('organization admin reviews proof and platform admin reviews program listing', async ({ page }) => {
  await setup(page,'admin','/org-admin',{ proofs:[{ id:'proof',collection:'tasks',recordId:'task',title:'Teaching task',organization:org.name,volunteerEmail:volunteer.email,status:'pending',image:'/images/org-education.png' }] });
  await page.getByRole('button',{name:'Verify Proof & Complete'}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();
  await expect(page.getByRole('button',{name:'Verify Proof & Complete'})).toHaveCount(0);
  await page.evaluate(() => window.sessionStorage.setItem('kindred_session',JSON.stringify({ id:'super',name:'Platform Admin',email:'super@kindred.org',role:'superuser',status:'approved' })));
  await page.goto('/platform-admin#requests');
  // A pending listing is rendered from the management collection.
  await page.route('http://localhost:3000/programs/manage',route => route.fulfill({json:{success:true,data:[{...program,listingStatus:'pending'}]}}));
  await page.reload();
  await expect(page.getByRole('region',{name:'Program listing requests'})).toContainText(program.name);
  await expect(page.getByRole('button',{name:'Accept Program Listing'})).toBeVisible();
});

test('card demo preserves the program recipient and organization-issued certificates are printable', async ({ page }) => {
  const writes = await setup(page,'donor','/donate?org=HopeConnect&program=prog_001');
  await page.getByRole('button',{name:'Donate by Card',exact:true}).click();
  const modal = page.getByRole('dialog');
  await expect(modal).toContainText('no money is charged or settled');
  await modal.getByLabel('Donation Amount (INR)').fill('750');
  await modal.getByLabel('Card Number',{exact:true}).fill('4111111111111111');
  await modal.getByLabel('Card Holder Name',{exact:true}).fill('Test Donor');
  await modal.getByLabel('Expiry (MM/YY)').fill('12/30');
  await modal.getByLabel('CVV',{exact:true}).fill('123');
  await modal.getByRole('button',{name:'Save',exact:true}).click();
  await expect(modal).toHaveCount(0);
  const donation = writes.find((w) => w.path === '/donations').body;
  expect(donation.org).toBe('HopeConnect'); expect(donation.programId).toBe('prog_001');
  expect(donation.cardLast4).toBe('1111'); expect(donation.cardNumber).toBeUndefined(); expect(donation.cvv).toBeUndefined();
  await page.evaluate(() => window.sessionStorage.setItem('kindred_session',JSON.stringify({id:'admin',name:'Admin',email:'admin@kindred.org',role:'admin',org:'HopeConnect',status:'approved'})));
  await page.goto('/org-admin');
  await expect(page.getByRole('region',{name:'Organization donations and certificates'})).toContainText('750');
  await page.getByRole('button',{name:'Issue Thank-You Certificate'}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();
  await page.evaluate(() => window.sessionStorage.setItem('kindred_session',JSON.stringify({id:'donor',name:'Tester',email:'donor@kindred.org',role:'donor',org:'HopeConnect',status:'approved'})));
  await page.goto('/donor-dashboard');
  await page.getByRole('button',{name:'View Thank-You Certificate',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('THANKS-001');
  await expect(page.getByRole('dialog').getByRole('button',{name:'Print / Save PDF'})).toBeVisible();
});
