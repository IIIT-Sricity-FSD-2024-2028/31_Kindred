/* global window, document */
import { test, expect } from '@playwright/test';
import { routeDefinitions } from '../../src/routes/routeDefinitions.js';
import { cleanPath } from '../../src/routes/cleanPaths.js';
import { ROLE_DASHBOARDS } from '../../src/services/session.js';

const makeSession = (role, status = 'approved') => ({ id: ({superuser:'su_001',admin:'adm_001',volunteer:'vol_001',donor:'don_001',beneficiary:'ben_001',seller:'seller_001'})[role], name: 'Foundation Test', email: role === 'admin' ? 'admin@hopeconnect.org' : role === 'superuser' ? 'super@kindred.org' : `${role}@kindred.org`, org: role === 'admin' ? 'HopeConnect' : null, role, status, dashboard: ROLE_DASHBOARDS[role] });

test('all 53 original document URLs load React instead of their old HTML', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/');
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  for (const route of routeDefinitions) {
    await page.evaluate((session) => {
      if (session) sessionStorage.setItem('kindred_session', JSON.stringify(session));
      else sessionStorage.removeItem('kindred_session');
    }, route.roles ? makeSession(route.roles[0]) : null);
    await page.goto(route.path);
    await expect(page.locator('main')).toHaveAttribute('data-react-page', route.path);
    await expect(page).toHaveTitle(route.title);
    expect(new URL(page.url()).pathname).toBe(cleanPath(route.path));
    expect(await page.locator('script[src]').evaluateAll((scripts) => scripts.map((script) => script.getAttribute('src')))).not.toContain('auth.js');
  }
  expect(errors).toEqual([]);
});

test('client navigation, query strings, history, and reload work', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { window.__foundationNavigationMarker = true; });
  await page.getByRole('link', { name: 'Organizations', exact: true }).click();
  await expect(page).toHaveURL(/\/organizations$/);
  expect(await page.evaluate(() => window.__foundationNavigationMarker)).toBe(true);
  await page.goBack();
  await expect(page).toHaveURL('http://127.0.0.1:5173/');
  await page.goto('/organization-details.html?id=org_001#mission');
  await page.reload();
  await expect(page).toHaveURL(/organization-details\?id=org_001#mission$/);
  await expect(page.locator('main')).toHaveAttribute('data-react-page', '/organization-details.html');
});

test('guest redirect retains the requested destination', async ({ page }) => {
  await page.goto('/platform-admin.html?tab=users');
  await expect(page).toHaveURL(/\/signin$/);
  expect(await page.evaluate(() => window.history.state.usr.from)).toBe('/platform-admin?tab=users');
});

test('page navigation resets scroll while in-page anchors retain their destination', async ({ page }) => {
  await page.goto('/contact.html');
  await page.locator('footer').getByRole('link',{name:'About Kindred'}).click();
  await expect(page.locator('main[data-react-page]')).toHaveAttribute('data-react-page','/about.html');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.goto('/donate.html');
  await page.getByRole('link',{name:/Browse Campaigns as Guest/}).click();
  await expect(page).toHaveURL(/#browse-orgs$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('wrong roles redirect to their own dashboard and sign-out updates React state', async ({ context, page }) => {
  await context.addInitScript((session) => sessionStorage.setItem('kindred_session', JSON.stringify(session)), makeSession('donor'));
  await page.goto('/platform-admin.html');
  await expect(page).toHaveURL(/\/donor-dashboard$/);
  await page.getByRole('button', { name: /Account:/ }).click();
  await page.getByRole('button', { name: /Sign Out/ }).click();
  await expect(page).toHaveURL(/\/signin$/);
  expect(await page.evaluate(() => sessionStorage.getItem('kindred_session'))).toBeNull();
});

test('pending sessions go to review; corrupt storage safely goes to sign-in', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((session) => sessionStorage.setItem('kindred_session', JSON.stringify(session)), makeSession('volunteer', 'pending'));
  await page.goto('/volunteer-dashboard.html');
  await expect(page).toHaveURL(/\/registration-pending$/);
  await page.evaluate(() => sessionStorage.setItem('kindred_session', '{broken'));
  await page.goto('/volunteer-dashboard.html');
  await expect(page).toHaveURL(/\/signin$/);
});

test('unknown paths display the React not-found screen', async ({ page }) => {
  await page.goto('/missing.html');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await page.goto('/missing/nested/path');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('mobile foundation fits the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.hero-title-main')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: '../.migration/phase3/mobile-layout.png', fullPage: true });
});

test('the browser API client communicates with the unchanged backend', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { createApiClient } = await import('/src/services/api.js');
    const anonymous = createApiClient();
    const organizations = await anonymous.get('/organizations');
    const user = await anonymous.post('/users/signin', { email: 'donor@kindred.org', password: 'Donor@123', role: 'donor' });
    const donor = createApiClient({ getSession: () => user });
    const donations = await donor.get(`/resource-donations/by-donor/${encodeURIComponent(user.email)}`);
    let invalidCredentials;
    let deniedAccess;
    try { await anonymous.post('/users/signin', { email: user.email, password: 'wrong', role: 'donor' }); } catch (error) { invalidCredentials = error.message; }
    try { await donor.get('/users'); } catch (error) { deniedAccess = error.status; }
    return { organizationCount: organizations.length, role: user.role, donationsAreArray: Array.isArray(donations), invalidCredentials, deniedAccess };
  });
  expect(result.organizationCount).toBeGreaterThan(0);
  expect(result.role).toBe('donor');
  expect(result.donationsAreArray).toBe(true);
  expect(result.invalidCredentials).toContain('Invalid email');
  expect(result.deniedAccess).toBe(403);
});
