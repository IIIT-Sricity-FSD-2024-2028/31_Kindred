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
  await page.evaluate(()=>sessionStorage.setItem('kindred_session',JSON.stringify({id:'adm_001',name:'Rajesh Verma',email:'admin@hopeconnect.org',org:'HopeConnect',role:'admin',status:'approved'})));
  await page.goto('/create-program.html');
  const education=page.locator('#progCategoryContainer').getByLabel('Education',{exact:true});
  await education.check();
  await expect.poll(()=>education.evaluate((input)=>getComputedStyle(input.parentElement).backgroundColor)).toBe('rgb(254, 243, 199)');
  await education.uncheck();
  await expect.poll(()=>education.evaluate((input)=>getComputedStyle(input.parentElement).backgroundColor)).toBe('rgb(255, 255, 255)');
  await expect(page.locator('#progVolsContainer .program-volunteer').first()).toContainText('@');
});
