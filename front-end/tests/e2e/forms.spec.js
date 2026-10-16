import { test, expect } from '@playwright/test';

const accounts = {
  donor: {id:'don_001', name:'Arun Patel', email:'donor@kindred.org'},
  admin: {id:'adm_001', name:'Rajesh Verma', email:'admin@hopeconnect.org', org:'HopeConnect'},
  volunteer: {id:'vol_001', name:'Priya Singh', email:'volunteer@kindred.org'},
  seller: {id:'seller_001', name:'Ravi Kumar', email:'seller@kindred.org'},
  beneficiary: {id:'ben_001', name:'Meena Devi', email:'beneficiary@kindred.org'},
};
async function as(page, role, path) {
  await page.goto('/');
  await page.evaluate((session) => sessionStorage.setItem('kindred_session', JSON.stringify(session)), {...accounts[role], role, status:'approved'});
  await page.goto(path); await expect(page.locator('main[data-react-page]')).toBeVisible();
}
async function donate(page) {
  await as(page,'donor','/donate.html');
  await page.locator('#donate-org-grid .small-org-card').first().getByRole('button',{name:'Donate',exact:true}).click();
}
async function card(page) {
  await page.locator('#card-number').fill('4111111111111111'); await page.locator('#card-holder-name').fill('Form Test');
  await page.locator('#card-expiry').fill('12/39'); await page.locator('#card-cvv').fill('123');
}

test('registration errors identify and focus the field, clear on correction, and follow role changes', async ({page}) => {
  await page.goto('/signup.html?role=donor'); await page.locator('#form-donor button.btn').click();
  await expect(page.locator('#don-name')).toBeFocused(); await expect(page.locator('#don-name')).toHaveAttribute('aria-invalid','true');
  await expect(page.locator('#don-name-validation')).toContainText('required');
  await page.locator('#don-name').fill('Form Test'); await expect(page.locator('#don-name')).not.toHaveAttribute('aria-invalid','true');
  await page.locator('#don-email').fill('broken'); await page.locator('#don-phone').fill('9812345678');
  await page.locator('#don-pass').fill('Valid@123'); await page.locator('#don-pass2').fill('Valid@123'); await page.locator('#form-donor button.btn').click();
  await expect(page.locator('#don-email')).toBeFocused(); await expect(page.locator('#don-email-validation')).toContainText('valid email');
  await page.getByRole('button',{name:'Volunteer',exact:true}).click(); await expect(page.locator('#form-volunteer')).toBeVisible();
  await expect(page.locator('.page-action-error')).toHaveCount(0);
});

test('Enter submits sign-in through the same validated action as its button', async ({page}) => {
  await page.goto('/signin.html'); await page.getByRole('button',{name:'Donor',exact:true}).click();
  await page.locator('#si-pass').press('Enter'); await expect(page).toHaveURL(/donor-dashboard$/);
});

test('payment prevents duplicate writes, locks input, retains failed values, and permits retry', async ({page}) => {
  await donate(page); await page.locator('#proceed-donate-btn').click(); await card(page);
  let count = 0, release;
  await page.route('**/donations', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    count++;
    if (count === 1) { await new Promise((resolve) => {release=resolve;}); return route.fulfill({status:503,json:{success:false,message:'Temporary payment failure'}}); }
    return route.fulfill({json:{success:true,data:{id:'phase4-mocked-receipt', amount:500, cardLast4:'1111',status:'paid'}}});
  });
  await page.locator('#pay-now-btn').evaluate((button) => {button.click(); button.click();});
  await expect(page.locator('#pay-now-btn')).toBeDisabled(); await expect(page.locator('#card-number')).toBeDisabled();
  await expect.poll(() => count).toBe(1); release();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Temporary payment failure');
  await expect(page.locator('#card-number')).toHaveValue('4111 1111 1111 1111'); await expect(page.locator('#pay-now-btn')).toBeEnabled();
  await page.locator('#pay-now-btn').click(); await expect(page.locator('#donate-step-success')).toBeVisible(); expect(count).toBe(2);
  await expect(page.locator('#card-number')).toHaveValue(''); await expect(page.locator('#card-cvv')).toHaveValue('');
});

test('closing and reopening donation starts a fresh payment and frequency selection', async ({page}) => {
  await donate(page); await page.getByRole('button',{name:'Monthly',exact:true}).click(); await page.locator('#proceed-donate-btn').click(); await card(page);
  await page.locator('#pay-now-btn').focus(); await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('#donate-org-grid .small-org-card').first().getByRole('button',{name:'Donate',exact:true}).click();
  await expect(page.locator('#donate-step-1')).toBeVisible(); await expect(page.locator('[data-freq="one-time"]')).toHaveClass(/active/);
  await page.locator('#proceed-donate-btn').click();
  for (const field of ['card-number','card-holder-name','card-expiry','card-cvv']) await expect(page.locator('#'+field)).toHaveValue('');
});

test('corrupt and wrong-shaped browser payment preferences do not break the dashboard', async ({page}) => {
  await as(page,'donor','/donor-dashboard.html');
  await page.evaluate(() => { localStorage.setItem('kindred_react_cards:donor@kindred.org','{}'); localStorage.setItem('kindred_react_donations:donor@kindred.org','{broken'); });
  await page.reload(); await page.getByRole('tab',{name:/Saved Cards/}).click();
  await expect(page.locator('main[data-react-page]')).toBeVisible(); await expect(page.locator('#tab-cards')).toBeVisible();
  await page.evaluate(() => {localStorage.clear();});
});

test('file selection validates type, permits the same file after removal, and resets new products', async ({page}) => {
  await as(page,'seller','/seller-dashboard.html'); await page.getByRole('button',{name:/Add Product/}).first().click();
  const input = page.locator('#prodPhotoInput');
  await input.setInputFiles({name:'invalid.txt', mimeType:'text/plain', buffer:Buffer.from('invalid')});
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Only image');
  const image = {name:'small.png', mimeType:'image/png', buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=','base64')};
  await input.setInputFiles(image); await expect(page.locator('#prodPhotoPreview')).toBeVisible(); await expect(page.getByRole('dialog').getByRole('alert')).toHaveCount(0);
  await page.keyboard.press('Escape'); await page.getByRole('button',{name:/Add Product/}).first().click();
  await expect(page.locator('#prodPhotoPreview')).toBeHidden(); await input.setInputFiles(image); await expect(page.locator('#prodPhotoPreview')).toBeVisible();
});

test('incoming tabs filter their status and resolve keyboard focus to the correct panel', async ({page}) => {
  const records = ['pending','accepted','declined'].map((status) => ({id:'phase4-'+status,name:'Test '+status,type:'Food',desc:status,status}));
  await page.route('**/incoming', (route) => route.fulfill({json:{success:true,data:records}}));
  await as(page,'admin','/incoming.html');
  await expect(page.locator('.request-card')).toHaveCount(1); await expect(page.locator('.request-card')).toContainText('Test pending');
  const accepted = page.getByRole('tab',{name:/Accepted/}); await accepted.click(); await expect(page.locator('.request-card')).toContainText('Test accepted');
  await expect(accepted).toHaveAttribute('aria-controls','incoming-panel'); await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby',await accepted.getAttribute('id'));
  await accepted.press('ArrowRight'); await page.keyboard.press('Enter'); await expect(page.locator('.request-card')).toContainText('Test declined');
});

test('request modal URL opens a usable dialog and restores the dashboard when cancelled', async ({page}) => {
  await as(page,'beneficiary','/page2-new-request-modal.html'); await expect(page.getByRole('dialog',{name:'Submit New Request'})).toBeVisible();
  await page.getByRole('button',{name:'Cancel',exact:true}).click(); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button',{name:'New Request',exact:true}).click(); await expect(page.getByRole('dialog')).toBeVisible();
});

test('future volunteer hours are rejected before an API write and focus the date', async ({page}) => {
  let writes = 0;
  page.on('request', (request) => {if (request.url().endsWith('/hour-logs') && request.method() === 'POST') writes++;});
  await as(page,'volunteer','/volunteer-dashboard.html'); await page.getByRole('button',{name:/Log Hours/}).first().click();
  await page.locator('#log-activity').fill('Test activity'); await page.locator('#log-hours').fill('2'); await page.locator('#log-date').fill('2099-12-12');
  await page.getByRole('dialog').getByRole('button',{name:'Log Hours',exact:true}).click();
  await expect(page.locator('#log-date')).toBeFocused(); await expect(page.locator('#log-date-validation')).toContainText('earlier');
  expect(writes).toBe(0);
});

test('donor tabs have unique IDs and refer to their own visible panels', async ({page}) => {
  await as(page,'donor','/donor-dashboard.html');
  for (const tab of await page.getByRole('tab').all()) {
    await tab.click(); const id = await tab.getAttribute('aria-controls');
    await expect(page.locator('#'+id)).toHaveCount(1); await expect(page.locator('#'+id)).toBeVisible();
    await expect(page.locator('#'+id)).toHaveAttribute('aria-labelledby',await tab.getAttribute('id'));
  }
});

test('profile Cancel restores server skills and custom tags without claiming an unsupported save', async ({page}) => {
  await as(page,'volunteer','/profile.html');
  await expect(page.locator('#pf-skill-logistics')).toBeChecked();
  await expect(page.locator('#pfCustomSkillTags')).toContainText('Field Work');
  await page.locator('#pf-skill-logistics').uncheck(); await page.locator('#pf-skill-driving').check();
  await page.getByRole('button',{name:'Remove Field Work',exact:true}).click();
  await page.locator('#skillsSection').getByRole('button',{name:'Cancel',exact:true}).click();
  await expect(page.locator('#pf-skill-logistics')).toBeChecked(); await expect(page.locator('#pf-skill-driving')).not.toBeChecked();
  await expect(page.locator('#pfCustomSkillTags')).toContainText('Field Work');
  await page.locator('#skillsSection').getByRole('button',{name:/Save Skills/}).click();
  await expect(page.locator('.page-action-error')).toContainText('does not permit');
});

test('resource donation rows focus invalid quantities and reset after a successful request', async ({page}) => {
  let writes = 0;
  await page.route('**/resource-donations', (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    writes++; return route.fulfill({json:{success:true,data:{id:'phase4-mocked-resource'}}});
  });
  await as(page,'donor','/donor-dashboard.html#resources'); await page.getByRole('button',{name:/Donate Resources/}).click();
  await page.locator('#rd-phone').fill('9812345678'); await page.locator('#rd-category').selectOption('Food');
  await page.getByRole('textbox',{name:'Item name',exact:true}).fill('Rice'); await page.getByRole('spinbutton',{name:'Quantity',exact:true}).fill('1.5');
  await page.locator('#rd-desc').fill('Phase 4 test'); await page.locator('#rd-address').fill('Test address'); await page.locator('#rd-date').fill('2099-12-12'); await page.locator('#rd-timeslot').selectOption('Morning (9AM-12PM)');
  await page.getByRole('button',{name:/Submit Donation/}).click();
  await expect(page.getByRole('spinbutton',{name:'Quantity',exact:true})).toBeFocused(); expect(writes).toBe(0);
  await page.getByRole('spinbutton',{name:'Quantity',exact:true}).fill('2'); await page.getByRole('button',{name:/Submit Donation/}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0); expect(writes).toBe(1);
  await page.getByRole('button',{name:/Donate Resources/}).click();
  await expect(page.getByRole('textbox',{name:'Item name',exact:true})).toHaveValue('');
  await expect(page.getByRole('spinbutton',{name:'Quantity',exact:true})).toHaveValue('1');
});
