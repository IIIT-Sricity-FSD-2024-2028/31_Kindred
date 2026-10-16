/* global window, document, getComputedStyle */
import { test, expect } from '@playwright/test';
const sessionFor = (role = 'donor', extra = {}) => ({ id: `phase2-${role}`, name: 'Shared UI Test', email: 'phase2@example.test', role, status: 'approved', org: role === 'admin' ? 'HopeConnect' : null, ...extra });
async function session(context, role, extra) {
  await context.addInitScript((value) => { if (!sessionStorage.getItem('kindred_session')) sessionStorage.setItem('kindred_session', JSON.stringify(value)); }, sessionFor(role, extra));
}

test('header/footer navigation uses React and preserves page-specific links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.navbar-links').getByRole('link', { name: 'Shop', exact: true })).toBeVisible();
  await page.evaluate(() => { window.__sharedNavigation = true; });
  await page.locator('.navbar-links').getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/contact$/);
  expect(await page.evaluate(() => window.__sharedNavigation)).toBe(true);
  await page.locator('footer').getByRole('link', { name: 'About Kindred' }).click();
  await expect(page).toHaveURL(/about$/);
  await expect(page.locator('.navbar-links').getByRole('link', { name: 'Shop', exact: true })).toHaveCount(0);
  await expect(page.locator('footer a[href="#"]')).toHaveCount(0);
  await expect(page.getByText('Privacy Policy', { exact: true })).toBeVisible();
});

test('account menu handles keyboard, outside click, profile navigation, and role differences', async ({ context, page }) => {
  await session(context, 'donor');
  await page.goto('/donor-dashboard.html');
  const trigger = page.getByRole('button', { name: /Account:/ });
  await trigger.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('group', { name: 'Account menu' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click(); await page.getByRole('heading', { level: 1 }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click(); await page.getByRole('link', { name: /My Profile/ }).click();
  await expect(page).toHaveURL(/profile$/);
  await expect(page.getByRole('group', { name: 'Account menu' })).toHaveCount(0);
  await page.evaluate((value) => sessionStorage.setItem('kindred_session', JSON.stringify(value)), sessionFor('superuser'));
  await page.goto('/platform-admin.html');
  await page.getByRole('button', { name: /Account:/ }).click();
  await expect(page.getByRole('link', { name: /My Profile/ })).toHaveCount(0);
});

test('dashboard tabs retain hash state, keyboard navigation, refresh, and team restrictions', async ({ context, page }) => {
  await session(context, 'superuser', { team: 'team2' });
  await page.goto('/platform-admin.html#users');
  await expect(page).toHaveURL(/#overview$/);
  await expect(page.getByRole('tab', { name: /User Management/ })).toHaveCount(0);
  const shop = page.getByRole('tab', { name: /Shop Management/ });
  await shop.click(); await expect(page.getByRole('tabpanel')).toContainText('Artisan & Seller Product Catalog');
  await expect(page).toHaveURL(/#shop$/);
  await page.reload(); await expect(shop).toHaveAttribute('aria-selected', 'true');
  await shop.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#inbox$/);
  await page.evaluate((value) => sessionStorage.setItem('kindred_session', JSON.stringify(value)), sessionFor('superuser', { team: 'team1' }));
  await page.goto('/platform-admin.html#shop');
  await page.reload();
  await expect(page).toHaveURL(/#overview$/);
  await expect(page.getByRole('tab', { name: /Shop Management/ })).toHaveCount(0);
});

test('style families unload on navigation and assets are served at their original URLs', async ({ page, request }) => {
  await page.goto('/signin.html');
  await expect(page.locator('link[data-route-style][href="/styles.css"]')).toHaveCount(1);
  await page.locator('.navbar-brand').click();
  await expect(page.locator('link[data-route-style][href="/styles.css"]')).toHaveCount(0);
  await expect(page.locator('link[data-route-style][href="/style1.css"]')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundImage)).toBe('none');
  for (const path of ['/style1.css', '/shared.css', '/styles.css', '/styles1.css', '/images/logo.jpeg', '/images/program-education.png', '/Untitled%20design%20(1).mp4']) expect((await request.get(path)).status()).toBe(200);
});

test('notifications show backend errors and do not mark failed updates as read or navigate', async ({ context, page }) => {
  await session(context, 'donor');
  await page.route('http://localhost:3000/notifications**', (route) => route.fulfill({ status: route.request().method() === 'PATCH' ? 500 : 200, json: route.request().method() === 'PATCH' ? { success: false, data: null, message: 'Update failed' } : { success: true, data: [{ id: 'test-id', title: 'Test update', message: 'Read this update', read: false, link: '/profile.html' }] } }));
  await page.goto('/donor-dashboard.html');
  await page.getByRole('button', { name: /Notifications, 1 unread/ }).click();
  await page.getByRole('button', { name: /Test update/ }).click();
  await expect(page.getByRole('alert')).toContainText('Update failed');
  await expect(page).toHaveURL(/donor-dashboard$/);
  await expect(page.getByRole('button', { name: /Notifications, 1 unread/ })).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('notifications display loading, empty, and fetch failure states', async ({ context, page }) => {
  await session(context, 'donor');
  let release;
  const delayed = new Promise((resolve) => { release = resolve; });
  await page.route('http://localhost:3000/notifications**', async (route) => { await delayed; await route.fulfill({ json: { success: true, data: [] } }); });
  await page.goto('/donor-dashboard.html');
  await page.getByRole('button', { name: 'Notifications', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Loading notifications');
  release(); await expect(page.getByText('No notifications yet.')).toBeVisible();
  await page.unroute('http://localhost:3000/notifications**');
  await page.route('http://localhost:3000/notifications**', (route) => route.abort('failed'));
  await page.reload(); await page.getByRole('button', { name: 'Notifications', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Unable to reach the server');
});

test('real notification API loads targeted data, marks read, and opens its detail modal', async ({ context, page, request }) => {
  const email = `phase2-${Date.now()}@example.test`;
  const created = await request.post('http://localhost:3000/notifications', { headers: { role: 'donor' }, data: { targetEmail: email, title: 'Phase 2 verification', message: 'Synthetic local notification for migration verification.', type: 'info' } });
  expect(created.ok()).toBe(true);
  const record = (await created.json()).data;
  await session(context, 'donor', { email });
  await page.goto('/donor-dashboard.html');
  await page.getByRole('button', { name: /Notifications, [1-9]\d* unread/ }).click();
  await page.getByRole('button', { name: /Phase 2 verification/ }).click();
  await expect(page.getByRole('dialog', { name: 'Phase 2 verification' })).toBeVisible();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const stored = await request.get(`http://localhost:3000/notifications?email=${encodeURIComponent(email)}`);
  expect((await stored.json()).data.find((item) => item.id === record.id).read).toBe(true);
});

test('shared dialogs trap focus, restore scrolling and focus, and support cancel/failed confirmation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await page.evaluate(async () => { const { mountSharedControls } = await import('/tests/fixtures/mountSharedControls.js'); mountSharedControls(); });
  const open = page.getByRole('button', { name: 'Open test dialog' });
  await open.click();
  await expect(page.getByRole('dialog', { name: 'Test dialog' })).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.getByRole('button', { name: 'Done', exact: true }).focus(); await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(open).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await page.getByRole('checkbox', { name: 'Fail the test action' }).check();
  await page.getByRole('button', { name: 'Open test confirmation' }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Please wait…' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText('Test action failed');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Fail the test action' }).uncheck();
  await page.getByRole('button', { name: 'Open test confirmation' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByText('Completed: 1', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Show test toast' }).click();
  await expect(page.locator('.toast-stack .toast').getByText('Test feedback')).toBeVisible();
  await expect(page.locator('.toast-stack .toast')).toHaveCount(0);
});
