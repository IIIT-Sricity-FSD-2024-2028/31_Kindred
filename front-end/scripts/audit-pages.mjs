/* global document, innerWidth, location */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { browserLaunchOptions } from './browser.mjs';
import { routeDefinitions } from '../src/routes/routeDefinitions.js';

const mobile = process.argv.includes('--mobile');
const outputDir = process.env.KINDRED_AUDIT_DIR || '../.migration/phase3/audit';
const browser = await chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ baseURL: 'http://127.0.0.1:5173', viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
const sessions = {
  superuser: { id: 'su_001', name: 'Kavita Sharma', email: 'super@kindred.org' },
  admin: { id: 'adm_001', name: 'Rajesh Verma', email: 'admin@hopeconnect.org', org: 'HopeConnect' },
  volunteer: { id: 'vol_001', name: 'Priya Singh', email: 'volunteer@kindred.org' },
  donor: { id: 'don_001', name: 'Arun Patel', email: 'donor@kindred.org' },
  beneficiary: { id: 'ben_001', name: 'Meena Devi', email: 'beneficiary@kindred.org' },
  seller: { id: 'seller_001', name: 'Ravi Kumar', email: 'seller@kindred.org' },
};
await mkdir(outputDir, { recursive: true });
const report = [];
let errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
const selected = process.argv.filter((arg) => arg.endsWith('.html'));
for (const route of routeDefinitions.filter((route) => !selected.length || selected.includes(route.path))) {
  const role = route.roles?.[0];
  await page.goto('/');
  await page.evaluate((session) => { if (session) sessionStorage.setItem('kindred_session', JSON.stringify(session)); else sessionStorage.removeItem('kindred_session'); }, role ? { ...sessions[role], role, status: 'approved' } : null);
  errors = [];
  await page.goto(route.path+(route.path === '/organization-details.html' ? '?id=org_001' : ''));
  await page.locator('main[data-react-page]').waitFor({ state: 'visible' });
  await page.waitForFunction(() => [...document.querySelectorAll('link[data-route-style]')].filter((link) => new URL(link.href).origin === location.origin).every((link) => link.sheet && [...document.styleSheets].includes(link.sheet)));
  await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('video').forEach((video) => { video.pause(); video.currentTime = 0; }); });
  await page.waitForTimeout(350);
  const data = await page.evaluate(() => ({
    title: document.title, mainCount: document.querySelectorAll('main').length,
    deadButtons: [...document.querySelectorAll('main button')].filter((b) => {
      const props = b[Object.keys(b).find((key) => key.startsWith('__reactProps$'))];
      return !props?.onClick && b.type !== 'submit' && !b.disabled;
    }).map((b) => ({ text: b.textContent.trim(), id: b.id })),
    deadLinks: [...document.querySelectorAll('main a[href="#"]')].filter((a) => !a[Object.keys(a).find((key) => key.startsWith('__reactProps$'))]?.onClick).map((a) => a.textContent.trim()),
    overflow: document.documentElement.scrollWidth > innerWidth,
    brokenImages: [...document.querySelectorAll('img')].filter((element) => element.getBoundingClientRect().width > 0 && element.complete && element.currentSrc && !element.naturalWidth).map((element) => element.currentSrc),
    outside: [...document.querySelectorAll('main *, footer *')].filter((e) => { const rect = e.getBoundingClientRect(); return rect.width > 0 && rect.right > innerWidth+1; }).slice(0,12).map((e) => ({ tag:e.tagName, class:e.className, width:e.getBoundingClientRect().width, right:e.getBoundingClientRect().right })),
  }));
  report.push({ path: route.path, ...data, errors });
  if (!process.argv.includes('--no-screenshots')) await page.screenshot({ path: `${outputDir}/${route.path.slice(1,-5)}-${mobile ? 'mobile' : 'desktop'}.png`, fullPage: true });
}
await writeFile(`${outputDir}/report${mobile ? '-mobile' : ''}.json`, JSON.stringify(report,null,2));
await browser.close();
console.log(JSON.stringify(report.filter((r) => r.errors.length || r.deadButtons.length || r.deadLinks.length || r.overflow),null,2));
