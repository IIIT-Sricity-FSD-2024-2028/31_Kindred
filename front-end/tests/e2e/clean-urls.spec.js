/* global document, location */
import {test,expect} from '@playwright/test';
test('public navigation shows clean URLs and clean internal link hrefs',async ({page})=>{
  await page.goto('/index.html'); await expect(page).toHaveURL('http://127.0.0.1:5173/');
  await page.locator('.navbar-links').getByRole('link',{name:'Programs',exact:true}).click(); await expect(page).toHaveURL(/\/programs$/);
  await expect(page.locator('main[data-react-page]')).toBeVisible();
  expect(await page.evaluate(()=>[...document.querySelectorAll('a[href]')].filter((link)=>link.origin===location.origin&&link.pathname.endsWith('.html')).length)).toBe(0);
  await page.reload(); await expect(page).toHaveURL(/\/programs$/); await expect(page.locator('main[data-react-page]')).toBeVisible();
});
test('legacy bookmarks redirect while retaining query and anchors',async ({page})=>{
  await page.goto('/organization-details.html?id=org_001#mission');
  await expect(page).toHaveURL(/\/organization-details\?id=org_001#mission$/);
  await expect(page.locator('main[data-react-page]')).toBeVisible();
});
test('profile back link navigates to the clean role dashboard',async ({page})=>{
  await page.goto('/'); await page.evaluate(()=>sessionStorage.setItem('kindred_session',JSON.stringify({id:'don_001',name:'Arun Patel',email:'donor@kindred.org',role:'donor',status:'approved'})));
  await page.goto('/profile'); await page.locator('#backLink').click();
  await expect(page).toHaveURL(/\/donor-dashboard$/);
});
