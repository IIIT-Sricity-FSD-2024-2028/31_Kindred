/* global window, document */
import { test, expect } from '@playwright/test';

const org = { id: 'org-test', name: 'Test Organization', focus: 'Education', city: 'Pune', email: 'org@example.test', phone: '9812345678', status: 'active', listingStatus: 'unlisted', bankAccountName: 'Test Organization', bankAccountNumber: '12345678901', bankIfsc: 'SBIN0001234', volunteers: 0, beneficiaries: 0 };
const program = { id: 'program-test', name: 'Community Teaching', org: org.name, focus: 'Education', status: 'active', budget: 1000, requiredSkills: [] };
async function setup(page, role, path, records = {}) {
  const collections = { organizations: [org], programs: [program], volunteers: [
    { id: 'v1', name: 'Accepted Volunteer', email: 'accepted@example.test', org: org.name },
    { id: 'v2', name: 'Pending Volunteer', email: 'pending@example.test', org: org.name },
  ], assignments: [
    { id: 'a1', programId: program.id, volunteerEmail: 'accepted@example.test', volunteerName: 'Accepted Volunteer', status: 'active' },
    { id: 'a2', programId: program.id, programName: program.name, volunteerEmail: 'pending@example.test', volunteerName: 'Pending Volunteer', status: 'pending', role: 'Volunteer' },
  ], ...records };
  const writes = [];
  await page.route('http://localhost:3000/**', async (route) => {
    const req = route.request(), url = new URL(req.url()), key = url.pathname.split('/')[1];
    const names = { 'program-assignments': 'assignments', 'hour-logs': 'hours', 'program-applications': 'applications', 'resource-donations': 'resources' };
    if (req.method() !== 'GET') {
      writes.push({ path: url.pathname, body: req.postDataJSON() });
      if (url.pathname.endsWith('/request-listing')) collections.organizations = [{ ...org, ...req.postDataJSON(), listingStatus: 'pending' }];
      if (url.pathname.endsWith('/approve-listing')) collections.organizations[0].listingStatus = 'approved';
      if (url.pathname.endsWith('/reject-listing')) collections.organizations[0].listingStatus = 'rejected';
      if (url.pathname.endsWith('/respond')) collections.assignments[1].status = req.postDataJSON().action === 'accepted' ? 'active' : 'declined';
      return route.fulfill({ json: { success: true, data: {} } });
    }
    return route.fulfill({ json: { success: true, data: collections[names[key] || key] || [] } });
  });
  await page.goto('/');
  await page.evaluate((session) => sessionStorage.setItem('kindred_session', JSON.stringify(session)), { id: 'test-user', name: 'Workflow Tester', role, email: 'pending@example.test', status: 'approved', org: org.name });
  await page.goto(path);
  return writes;
}

test('beneficiary has one Requests tab', async ({ page }) => {
  await setup(page, 'beneficiary', '/beneficiary-dashboard');
  await expect(page.getByRole('tab', { name: 'Requests', exact: true })).toHaveCount(1);
  await expect(page.getByRole('tab', { name: 'My Requests', exact: true })).toHaveCount(0);
});

test('program success card is styled and fits desktop and mobile', async ({ page }) => {
  await setup(page, 'admin', '/program-success');
  await expect(page.getByRole('heading', { name: 'Program Created!' })).toBeVisible();
  await expect(page.locator('.success-card')).toHaveCSS('border-radius', '20px');
  await expect(page.locator('.success-icon')).toHaveText('✓');
  await expect(page.locator('.next-steps')).toContainText('Invite volunteers and wait for their acceptance');
  await page.screenshot({ path: 'test-results/program-success-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.success-card')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/program-success-mobile.png', fullPage: true });
});

test('organization admin submits bank details without a photo and sees pending status', async ({ page }) => {
  const writes = await setup(page, 'admin', '/org-admin');
  await page.getByRole('button', { name: 'Request Public Listing', exact: true }).click();
  const modal = page.getByRole('dialog');
  await modal.getByLabel('Bank Account Holder Name', { exact: true }).fill('');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal.getByRole('alert')).toBeVisible();
  await modal.getByLabel('Bank Account Holder Name', { exact: true }).fill('Test Organization');
  await modal.getByLabel('Bank Account Number', { exact: true }).fill('12345678901');
  await modal.getByLabel('Bank IFSC Code', { exact: true }).fill('sbin0001234');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('.organization-listing-manager')).toContainText('Awaiting platform admin review');
  expect(writes.find((w) => w.path.endsWith('/request-listing')).body).toEqual({ bankAccountName: 'Test Organization', bankAccountNumber: '12345678901', bankIfsc: 'SBIN0001234' });
});

test('platform admin can review listing bank details and accept a listing', async ({ page }) => {
  const writes = await setup(page, 'superuser', '/platform-admin#requests', { organizations: [{ ...org, listingStatus: 'pending', bankAccountName: 'Test Organization', bankAccountNumber: '12345678901', bankIfsc: 'SBIN0001234' }] });
  await expect(page.locator('.listing-review')).toContainText('12345678901');
  await page.getByRole('button', { name: 'Accept Listing', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('.listing-review')).toHaveCount(0);
  expect(writes.some((w) => w.path.endsWith('/approve-listing'))).toBe(true);
});

test('task and subtask pickers contain only accepted program members', async ({ page }) => {
  await setup(page, 'admin', '/org-admin#programs');
  await page.locator('[data-program-id="program-test"]').getByRole('button', { name: 'Assign Task', exact: true }).click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByLabel('Volunteer', { exact: true }).locator('option')).toHaveText(['Select...', 'Accepted Volunteer (accepted@example.test)']);
  await modal.getByLabel('Program', { exact: true }).selectOption('');
  await expect(modal.getByLabel('Volunteer', { exact: true }).locator('option')).toHaveCount(1);
  await modal.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.locator('[data-program-id="program-test"]').getByRole('button', { name: 'Details', exact: true }).click();
  await page.getByRole('button', { name: 'Add Subtask', exact: true }).click();
  await expect(modal.getByLabel('Assigned Volunteer', { exact: true }).locator('option')).toHaveText(['Select...', 'Accepted Volunteer']);
});

test('volunteer accepts a program invitation before progress controls appear', async ({ page }) => {
  const writes = await setup(page, 'volunteer', '/volunteer-dashboard');
  await expect(page.locator('.program-invitation-card')).toContainText('Community Teaching');
  await expect(page.locator('.program-invitation-card').getByRole('button', { name: 'Report Progress' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Accept Invitation', exact: true }).click();
  await expect(page.locator('.program-invitation-card')).toHaveCount(0);
  expect(writes.find((w) => w.path.endsWith('/respond')).body).toEqual({ action: 'accepted' });
});
