import { test, expect } from '@playwright/test';

async function setup(page, role, path, records) {
  const writes = [];
  await page.route('http://localhost:3000/**', async (route) => {
    const request = route.request(), url = new URL(request.url());
    if (request.method() === 'POST' && url.pathname === '/orders') {
      const body = request.postDataJSON();
      writes.push(body);
      records.products[0].quantity -= body.quantity;
      return route.fulfill({ json: { success: true, data: { ...body, id: 'order-test', productTitle: records.products[0].title, total: 100, date: '2026-10-31' } } });
    }
    if (request.method() === 'PATCH' && url.pathname === '/volunteers/me/presence') {
      const body = request.postDataJSON();
      writes.push(body);
      Object.assign(records.volunteer, body, { locationUpdatedAt: new Date().toISOString() });
      return route.fulfill({ json: { success: true, data: records.volunteer } });
    }
    const key = url.pathname.split('/')[1];
    const data = url.pathname.startsWith('/volunteers/by-email/') ? records.volunteer : records[key] || [];
    return route.fulfill({ json: { success: true, data } });
  });
  await page.goto('/');
  if (role) await page.evaluate((session) => sessionStorage.setItem('kindred_session', JSON.stringify(session)), { id: 'presence-user', email: 'volunteer@kindred.org', name: 'Test Volunteer', role, status: 'approved', org: 'HopeConnect' });
  await page.goto(path);
  return writes;
}

test('volunteer toggles availability and saves and clears current location', async ({ page }) => {
  const writes = await setup(page, 'volunteer', '/volunteer-dashboard', { volunteer: { id: 'v1', email: 'volunteer@kindred.org', name: 'Test Volunteer', status: 'active' } });
  const toggle = page.getByRole('switch', { name: 'Available now' });
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  await page.getByLabel('Current location', { exact: true }).fill('Andheri East, Mumbai');
  await page.getByRole('button', { name: 'Save location' }).click();
  await expect(page.locator('.presence-location-note')).toContainText('Last updated:');
  await page.getByLabel('Current location', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Save location' }).click();
  await expect(page.getByLabel('Current location', { exact: true })).toHaveValue('');
  await expect.poll(() => writes.length).toBe(3);
  expect(writes).toEqual([{ availableNow: true }, { currentLocation: 'Andheri East, Mumbai' }, { currentLocation: '' }]);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.volunteer-presence')).toBeVisible();
  await page.screenshot({ path: 'test-results/volunteer-presence-mobile.png', fullPage: true });
});

test('organization volunteer list shows availability and location without opening details', async ({ page }) => {
  await setup(page, 'admin', '/volunteers', { volunteers: [{ id: 'v1', name: 'Test Volunteer', email: 'volunteer@kindred.org', org: 'HopeConnect', status: 'active', availableNow: true, currentLocation: 'Andheri East, Mumbai', skills: [] }] });
  const row = page.locator('.volunteer-row');
  await expect(row).toContainText('Available now');
  await expect(row).toContainText('Current location: Andheri East, Mumbai');
});

test('shop cards reflect exhausted stock and restocking without navigation', async ({ page }) => {
  const records = { products: [{ id: 'p1', title: 'Handmade bag', category: 'Crafts', sellerName: 'Test Seller', price: 100, quantity: 1, status: 'approved' }] };
  await setup(page, 'donor', '/shop', records);
  const card = page.locator('.shop-product-card');
  await expect(card).toContainText('Handmade bag');
  await expect(card.getByText('Out of stock', { exact: true })).toHaveCount(0);
  records.products[0].quantity = 0;
  await expect(card.getByText('Out of stock', { exact: true })).toBeVisible({ timeout: 10000 });
  records.products[0].quantity = 4;
  await expect(card.getByText('Out of stock', { exact: true })).toHaveCount(0, { timeout: 10000 });
});

test('buying the last item shows out of stock on the card after checkout', async ({ page }) => {
  await setup(page, 'donor', '/shop', { products: [{ id: 'p1', title: 'Handmade bag', category: 'Handicrafts', sellerName: 'Test Seller', price: 100, quantity: 1, status: 'approved' }] });
  await page.getByRole('button', { name: /View Details/ }).click();
  await page.getByRole('button', { name: /Buy Now/ }).click();
  await page.locator('#checkout-phone').fill('9812345678');
  await page.locator('#checkout-address').fill('Andheri East, Mumbai 400069');
  await page.locator('#proceed-shop-pay-btn').click();
  await page.locator('#shop-card-number').fill('4111111111111111');
  await page.locator('#shop-card-holder-name').fill('Test Volunteer');
  await page.locator('#shop-card-expiry').fill('12/39');
  await page.locator('#shop-card-cvv').fill('123');
  await page.locator('#shop-pay-now-btn').click();
  await page.getByRole('button', { name: /Continue Shopping/ }).click();
  await expect(page.locator('.shop-product-card').getByText('Out of stock', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/shop-out-of-stock.png', fullPage: true });
});
