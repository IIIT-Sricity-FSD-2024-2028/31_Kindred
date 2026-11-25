/* global document, getComputedStyle */
import { test, expect } from '@playwright/test';

const program = {
  id: 'design-program', name: 'Cyclone Relief Fund', org: 'HopeConnect',
  status: 'active', listingStatus: 'approved', focus: ['Disaster Relief'],
  description: 'Emergency shelter, food and medical aid for cyclone victims in coastal Odisha.',
  location: 'Coastal Odisha', budget: 1200000, raised: 850000, volunteers: 2,
  volunteerGoal: 150, completedTasks: 0, totalTasks: 3, taskProgress: 0,
  requiredSkills: ['Field Work', 'Medical Aid', 'Logistics', 'Construction'],
  startDate: '2026-11-25', endDate: '2026-12-25', openForApplications: true,
};
const organization = { id: 'org-one', name: 'HopeConnect', focus: ['Disaster Relief'], status: 'active', city: 'Mumbai', volunteers: 42, beneficiaries: 240, rating: 4.8, joined: '2026-01-01' };
const roles = [
  ['donor', '/donor-dashboard'], ['volunteer', '/volunteer-dashboard'],
  ['superuser', '/platform-admin'], ['admin', '/org-admin'],
  ['beneficiary', '/beneficiary-dashboard'],
];

async function setup(page, role, path) {
  await page.route('http://localhost:3000/**', route => {
    const url = new URL(route.request().url()), key = url.pathname.split('/')[1];
    const volunteer = { id: 'actor', name: 'Priya Singh', email: 'actor@kindred.org', status: 'active', availableNow: true, currentLocation: 'Mumbai', availabilityDays: ['Monday'] };
    const data = key === 'organizations' ? [organization] : key === 'programs' ? [program]
      : url.pathname.startsWith('/donations/balance/') ? { total: 850000, available: 600000, spent: 250000 }
      : key === 'volunteers' ? url.pathname.includes('/by-email/') ? volunteer : [volunteer]
      : key === 'users' ? [{ ...volunteer, role: 'volunteer', status: 'approved', org: 'HopeConnect' }]
      : key === 'notifications' ? [] : [];
    return route.fulfill({ json: { success: true, data } });
  });
  await page.goto('/');
  await page.evaluate(role => sessionStorage.setItem('kindred_session', JSON.stringify({ id: 'actor', name: 'Priya Singh', email: 'actor@kindred.org', role, org: 'HopeConnect', status: 'approved' })), role);
  await page.goto(path);
  await expect(page.locator('[data-dashboard] main[data-react-page]')).toBeVisible();
}

for (const width of [1440, 390]) {
  for (const [role, path] of roles) {
    test(`${role} dashboard and every tab fit at ${width}px`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width, height: 1000 });
      await setup(page, role, path);
      const main = page.locator('main[data-react-page]');
      const tabs = page.getByRole('tab');
      const count = await tabs.count();
      for (let index = 0; index < Math.max(1, count); index++) {
        if (count) await tabs.nth(index).click();
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
        const box = await main.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
        await expect.poll(() => main.evaluate(el => getComputedStyle(el).fontFamily)).toContain('Segoe UI');
        if (role === 'admin' && await page.locator('.program-card:visible').count()) {
          const card = page.locator('.program-card:visible').first();
          await expect(card.locator('dt')).toHaveCount(4);
          await card.getByText('Work, schedule and coordinator', { exact: true }).click();
          await expect(card.locator('.program-schedule-body')).toBeVisible();
          await card.screenshot({ path: `test-results/design-program-${width}.png` });
        }
      }
      await page.screenshot({ path: `test-results/design-${role}-${width}.png`, fullPage: true });
      expect(errors).toEqual([]);
    });
  }
}
