/* global window */
import { test, expect } from '@playwright/test';

const org = { id: 'org-inline', name: 'HopeConnect', focus: 'Education', city: 'Pune', status: 'active', listingStatus: 'approved', bankAccountName: 'HopeConnect', bankAccountNumber: '12345678901', bankIfsc: 'SBIN0001234', volunteers: 2, beneficiaries: 0 };
const program = { id: 'prog-inline', name: 'Teaching Program', org: org.name, focus: 'Education', status: 'active', listingStatus: 'approved', budget: 1000, volunteers: 1, requiredSkills: [], openForApplications: true };

async function open(page, role, path, overrides = {}) {
  const writes = [];
  const records = { organizations: [org], programs: [program], ...overrides };
  await page.route('http://localhost:3000/**', async (route) => {
    const url = new URL(route.request().url());
    if (route.request().method() !== 'GET') {
      const body = route.request().postDataJSON();
      writes.push({ path: url.pathname, body });
      return route.fulfill({ json: { success: true, data: { ...body, orgId: org.id, id: 'donation-inline', paymentMode: 'card_demo', date: '2026-10-16' } } });
    }
    if (url.pathname === '/donations/public/organizations') return route.fulfill({ json: { success: true, data: [{ orgId: org.id, total: 750, count: 1 }] } });
    return route.fulfill({ json: { success: true, data: records[url.pathname.split('/')[1]] || [] } });
  });
  await page.goto('/');
  await page.evaluate((session) => window.sessionStorage.setItem('kindred_session',JSON.stringify(session)), { id: 'test-inline', name: 'Test Donor', email: 'donor@kindred.org', role, org: org.name, status: 'approved' });
  await page.goto(path);
  return writes;
}

test('Programs Donate is styled, opens the animated card in place and sends the exact recipient', async ({ page }) => {
  const writes = await open(page,'donor','/programs');
  const button = page.getByRole('button',{ name:'Donate',exact:true });
  await expect(button).toHaveCSS('background-color','rgb(15, 118, 110)');
  await button.click();
  await expect(page).toHaveURL(/\/programs$/);
  const modal = page.getByRole('dialog');
  await expect(modal.locator('.animated-payment-card')).toBeVisible();
  await modal.locator('.animated-payment-card').scrollIntoViewIfNeeded();
  await expect(modal).toContainText('Recipient: HopeConnect');
  await modal.getByLabel('Donation Amount (INR)').fill('750');
  await modal.getByLabel('Card Number',{ exact:true }).fill('4111111111111111');
  await modal.getByLabel('Card Holder Name',{ exact:true }).fill('Test Donor');
  await modal.getByLabel('Expiry (MM/YY)').fill('12/30');
  await expect(modal.locator('.card-holdername')).toHaveText('Test Donor');
  await expect(modal.locator('.card-number-display')).toContainText('4111 1111');
  await modal.getByLabel('CVV',{exact:true}).focus();
  await expect(modal.locator('.card-3d')).toHaveClass(/flipped/);
  await modal.getByLabel('CVV',{exact:true}).fill('123');
  await modal.getByLabel('Card Holder Name',{exact:true}).focus();
  await expect(modal.locator('.card-3d')).not.toHaveClass(/flipped/);
  await page.screenshot({ path:'test-results/inline-card-desktop.png',fullPage:true });
  await page.setViewportSize({ width:390,height:844 });
  await expect(modal.locator('.animated-payment-card')).toBeVisible();
  await modal.locator('.animated-payment-card').scrollIntoViewIfNeeded();
  const bounds = await modal.locator('.card-3d').boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  await page.screenshot({ path:'test-results/inline-card-mobile.png' });
  await modal.getByRole('button',{name:'Save',exact:true}).click();
  await expect(modal).toHaveCount(0);
  await expect(page).toHaveURL(/\/programs$/);
  expect(writes.find((w) => w.path === '/donations').body).toMatchObject({ org:org.name,programId:program.id,amount:750,cardLast4:'1111' });
});

test('organization listing link opens the public profile, NGO image and organization-specific donation totals', async ({ page }) => {
  await open(page,'admin','/org-admin');
  await page.getByRole('link',{name:'View Public Listing',exact:true}).click();
  await expect(page).toHaveURL(/organization-details\?id=org-inline/);
  await expect(page.locator('#org-name-title')).toHaveText('HopeConnect');
  await expect(page.locator('#org-banner')).toHaveAttribute('src','/images/ngo-placeholder.svg');
  const totals = page.getByRole('region',{name:'Organization donation totals'});
  await expect(totals).toContainText('INR 750');
  await expect(totals).toContainText('1 recorded donation');
});

test('missing bank details disable organization and program listing requests', async ({ page }) => {
  await open(page,'admin','/org-admin',{ organizations:[{...org,listingStatus:'unlisted',bankAccountNumber:''}] });
  await expect(page.getByRole('button',{name:'Request Public Listing',exact:true})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Update Bank Details',exact:true})).toBeVisible();
  await page.goto('/create-program');
  await expect(page.getByRole('checkbox',{name:'Request display on the public Programs page'})).toBeDisabled();
});

test('saved bank details remain valid while registration awaits approval', async ({ page }) => {
  await open(page,'admin','/org-admin',{ organizations:[{...org,status:'pending',listingStatus:'unlisted'}] });
  const checklist = page.locator('#public-organization-listing');
  await expect(checklist).toContainText('Saved and valid');
  await expect(checklist).toContainText('Organization registration: pending');
  await expect(checklist.getByRole('button',{name:'Request Public Listing',exact:true})).toBeDisabled();
  await page.goto('/create-program');
  await expect(page.getByRole('checkbox',{name:'Request display on the public Programs page'})).toBeDisabled();
  await expect(page.locator('.public-program-request')).toContainText('Bank details: saved. Registration: pending.');
});

test('approved registration with saved bank details enables a public organization listing request', async ({ page }) => {
  const writes = await open(page,'admin','/org-admin',{ organizations:[{...org,listingStatus:'unlisted'}] });
  await page.getByRole('button',{name:'Request Public Listing',exact:true}).click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByLabel('Bank Account Holder Name')).toHaveValue(org.bankAccountName);
  await modal.getByRole('button',{name:'Save',exact:true}).click();
  await expect(modal).toHaveCount(0);
  expect(writes.find((w) => w.path === `/organizations/${org.id}/request-listing`).body).toMatchObject({bankAccountName:org.bankAccountName,bankAccountNumber:org.bankAccountNumber,bankIfsc:org.bankIfsc});
});
