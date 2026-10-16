import { test, expect } from '@playwright/test';
import { routeDefinitions } from '../../src/routes/routeDefinitions.js';
import { cleanPath } from '../../src/routes/cleanPaths.js';

test('all 53 converted pages load from production bundles without legacy scripts', async ({ page }) => {
  test.setTimeout(120000);
  const errors = []; page.on('pageerror',(error) => errors.push(error.message));
  const ids = {superuser:'su_001',admin:'adm_001',volunteer:'vol_001',donor:'don_001',beneficiary:'ben_001',seller:'seller_001'};
  await page.goto('/');
  for (const route of routeDefinitions) {
    const role = route.roles?.[0];
    await page.evaluate((value) => { if (value) sessionStorage.setItem('kindred_session',JSON.stringify(value)); else sessionStorage.removeItem('kindred_session'); },role ? { id:ids[role],name:'Production Test',email:role === 'admin' ? 'admin@hopeconnect.org' : role === 'superuser' ? 'super@kindred.org' : `${role}@kindred.org`,role,status:'approved',org:role === 'admin' ? 'HopeConnect' : null } : null);
    await page.goto(cleanPath(route.path)); await expect(page.locator('main[data-react-page]')).toHaveAttribute('data-react-page',route.path);
    expect(new URL(page.url()).pathname).toBe(cleanPath(route.path));
    expect(await page.locator('script[src]').evaluateAll((scripts) => scripts.map((s) => s.getAttribute('src')))).toEqual([expect.stringMatching(/^\/assets\/index-.*\.js$/)]);
  }
  expect(errors).toEqual([]);
});

test('production entry and legacy URLs render React after direct load and reload', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const path of ['/', '/index.html', '/organizations.html', '/organization-details.html?id=org_001']) {
    await page.goto(path);
    await expect(page.locator('main[data-react-page]')).toBeVisible();
    await page.reload();
    await expect(page.locator('main[data-react-page]')).toBeVisible();
    expect(await page.locator('script[src]').evaluateAll((scripts) => scripts.map((script) => script.getAttribute('src')))).toEqual([expect.stringMatching(/^\/assets\/index-.*\.js$/)]);
  }
  await page.goto('/platform-admin.html');
  await expect(page).toHaveURL(/\/signin$/);
  await page.goto('/missing/nested/route');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  expect(errors).toEqual([]);
  await page.goto('/');
  await page.screenshot({ path: '../.migration/phase3/desktop-layout.png', fullPage: true });
});
