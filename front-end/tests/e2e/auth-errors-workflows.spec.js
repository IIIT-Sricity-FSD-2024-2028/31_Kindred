/* global window, document */
import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`failed sign-in stays inside the centered form and clears after correction at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width,height:900 });
    await page.route('**/users/signin', (route) => route.fulfill({ json:{success:false,data:null,message:'Invalid email, password, or role'} }));
    await page.goto('/signin');
    await page.getByRole('button',{name:'Organization Admin',exact:true}).click();
    await page.locator('#si-pass').fill('WrongPassword');
    const form = page.locator('form.card');
    const before = await form.boundingBox();
    await page.locator('.btn-signin-main').click();
    const alert = form.getByRole('alert');
    await expect(alert).toHaveText('Invalid email, password, or role');
    await expect(page.locator('main > .page-action-error')).toHaveCount(0);
    const after = await form.boundingBox(), error = await alert.boundingBox();
    expect(Math.abs(before.x-after.x)).toBeLessThan(2);
    expect(Math.abs(before.width-after.width)).toBeLessThan(2);
    expect(error.height).toBeLessThan(120);
    expect(error.x).toBeGreaterThanOrEqual(after.x);
    expect(error.x+error.width).toBeLessThanOrEqual(after.x+after.width+1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await alert.scrollIntoViewIfNeeded();
    await page.screenshot({path:`test-results/signin-error-${width}.png`});
    await page.locator('#si-pass').fill('Admin@123');
    await expect(form.getByRole('alert')).toHaveCount(0);
    await page.locator('.btn-signin-main').click();
    await expect(form.getByRole('alert')).toBeVisible();
    await page.getByRole('button',{name:'Donor',exact:true}).click();
    await expect(form.getByRole('alert')).toHaveCount(0);
    await expect(page.locator('#si-email')).toHaveValue('donor@kindred.org');
  });
}

test('network errors appear in the sign-in form without breaking its layout', async ({ page }) => {
  await page.route('**/users/signin', route => route.abort('failed'));
  await page.goto('/signin');
  await page.getByRole('button',{name:'Donor',exact:true}).click();
  await page.locator('.btn-signin-main').click();
  await expect(page.locator('form.card').getByRole('alert')).toContainText('Unable to reach the server');
  await expect(page.locator('main > .page-action-error')).toHaveCount(0);
});

for (const [path,button] of [
  ['/forgot-password','Send OTP'], ['/forgot-otp','Verify OTP'],
  ['/otp-verify','Verify & Continue to Dashboard'], ['/phone-entry','Send Verification Code'],
  ['/reset-password','Reset Password'],
]) {
  test(`${path} renders validation or service errors inside its card`, async ({ page }) => {
    await page.goto(path);
    await page.getByRole('button',{name:button,exact:true}).click();
    await expect(page.locator('main .card > .inline-form-error')).toBeVisible();
    await expect(page.locator('main > .page-action-error')).toHaveCount(0);
  });
}
