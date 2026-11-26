import { login, readyVolunteer, futureDate } from '../fixtures/liveWorkflow.js';
/* global document, getComputedStyle */
import { test, expect } from '@playwright/test';

test('cached route styles remain ready across repeated navigation', async ({page}) => {
  await page.goto('/about.html');
  for (let index=0; index<6; index++) {
    await page.locator('.navbar-links').getByRole('link',{name:'Contact',exact:true}).click();
    await expect(page.locator('main[data-react-page]')).toBeVisible();
    await page.locator('footer').getByRole('link',{name:'About Kindred',exact:true}).click();
    await expect(page.locator('main[data-react-page]')).toBeVisible();
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('link[data-route-style]')].every((link) => Boolean(link.sheet)))).toBe(true);
  }
});

test('a failed route stylesheet shows an error and allows reload instead of staying hidden', async ({page}) => {
  await page.route('**/styles.css',route=>route.abort());
  await page.goto('/signin.html');
  await expect(page.getByRole('alert')).toContainText('Some page styles could not load');
  await expect(page.getByRole('button',{name:'Reload',exact:true})).toBeVisible();
  await expect(page.locator('main[data-react-page]')).toBeVisible();
});

test('program choices retain original neutral and selected styles', async ({page}) => {
  await page.goto('/');
  await readyVolunteer(page.request);
  const session=await login(page.request,'admin');
  await page.evaluate(value=>sessionStorage.setItem('kindred_session',JSON.stringify(value)),session);
  await page.goto('/create-program.html');
  const education=page.locator('#progCategoryContainer').getByLabel('Education',{exact:true});
  await education.check();
  await expect.poll(()=>education.evaluate((input)=>getComputedStyle(input.parentElement).backgroundColor)).toBe('rgb(254, 243, 199)');
  await education.uncheck();
  await expect.poll(()=>education.evaluate((input)=>getComputedStyle(input.parentElement).backgroundColor)).toBe('rgb(255, 255, 255)');
  await page.getByLabel('Start date',{exact:true}).fill(futureDate()); await page.locator('#programEndDate').fill(futureDate(14));
  await page.getByLabel('Shift starts',{exact:true}).fill('17:00'); await page.getByLabel('Shift ends',{exact:true}).fill('18:00'); await page.locator('#programLocation').fill('Pune');
  await page.getByRole('checkbox',{name:'Monday',exact:true}).check();
  await expect(page.locator('#progVolsContainer .candidate-card').first()).toContainText('@');
});
