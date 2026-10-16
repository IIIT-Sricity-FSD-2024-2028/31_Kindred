import test from 'node:test';
import assert from 'node:assert/strict';
import { FieldError, requireFields, validateField, validateEmail, validatePasswordFields, validateDate } from '../../src/services/validation.js';
import { readStored, writeStored } from '../../src/services/storage.js';
import { contributionActions } from '../../src/pages/actions/contributionActions.js';
import { managementActions } from '../../src/pages/actions/managementActions.js';
import { profileSkillValues } from '../../src/services/skills.js';

test('validation identifies the missing, malformed, and mismatched fields', () => {
  assert.throws(() => requireFields({ first: 'OK', second: ' ' }, ['first','second']), (error) => error instanceof FieldError && error.field === 'second');
  assert.throws(() => validateField('email', validateEmail, 'invalid'), (error) => error.field === 'email');
  assert.throws(() => validatePasswordFields({ pass: 'Valid@123', confirm: 'Other@123' }, 'pass', 'confirm'), (error) => error.field === 'confirm');
  assert.throws(() => validatePasswordFields({ pass: 'short', confirm: 'short' }, 'pass', 'confirm'), (error) => error.field === 'pass');
});

test('calendar validation rejects impossible dates and enforces pickup/hour boundaries', () => {
  assert.doesNotThrow(() => validateDate('2028-02-29'));
  for (const date of ['2027-02-29','2026-02-31','2026-13-01','not-a-date','']) assert.throws(() => validateDate(date));
  assert.throws(() => validateDate('2026-10-13', { field:'pickup', min:'2026-10-14' }), (error) => error.field === 'pickup');
  assert.throws(() => validateDate('2026-10-15', { max:'2026-10-14' }));
});

test('saved profile skills restore known selections and preserve distinct custom skills', () => {
  assert.deepEqual(profileSkillValues(['Medical Aid','First Aid','Counselling','Field Work','field work'], ['pf-skill-medical','pf-skill-first-aid','pf-skill-counseling','pf-skill-driving']), {
    checks:{'pf-skill-medical':true,'pf-skill-first-aid':true,'pf-skill-counseling':true,'pf-skill-driving':false}, custom:['Field Work'],
  });
});

test('preference storage handles unavailable access, broken JSON, and wrong shapes', () => {
  const kind = '__formTestStorage';
  try {
    Object.defineProperty(globalThis, kind, { configurable: true, get() { throw new Error('Access denied'); } });
    assert.deepEqual(readStored('cards', [], kind), []); assert.equal(writeStored('cards', [], kind), false);
    Object.defineProperty(globalThis, kind, { configurable: true, value: { getItem: () => '{broken' } });
    assert.deepEqual(readStored('cards', [], kind), []);
    globalThis[kind].getItem = () => '{}'; assert.deepEqual(readStored('cards', [], kind), []);
    globalThis[kind].getItem = () => '[null,3,[],{"id":"valid"}]'; assert.deepEqual(readStored('cards', [], kind), [{id:'valid'}]);
  } finally { delete globalThis[kind]; }
});

function uiFor(values = {}) {
  const writes = [], state = { files:{}, product:{id:'product', quantity:2}, frequency:'one-time', donationOrg:'Test Org' };
  const ui = { values, state, session:{role:'seller', email:'seller@example.test'}, api:{post:async (...args) => {writes.push(args); return {id:'saved'};}},
    update: (patch) => Object.assign(state,patch), setValues: (patch) => Object.assign(values,patch), data: () => [], refresh() {}, toast() {} };
  return {ui,writes};
}

test('final payment revalidates both steps before creating any server record', async () => {
  const {ui,writes} = uiFor({ 'custom-amount':'Infinity', 'donor-name':'Test', 'donor-email':'test@example.test' });
  await assert.rejects(contributionActions(ui).executeDonation(), (error) => error.field === 'custom-amount');
  await assert.rejects(contributionActions(ui).executeShopPayment(), (error) => error.field === 'checkout-name');
  assert.equal(writes.length,0);
});

test('product image edits do not mutate fetched records or leak into new listings', async () => {
  const {ui} = uiFor({ 'prod-title':'Test', 'prod-price':'10', 'prod-quantity':'1', 'prod-category':'Art', 'prod-desc':'Test item' });
  const photos = Object.freeze(['/original.png']);
  ui.state.editingProduct = {id:'edit',photos}; ui.state.files.prodPhotoInput = new Blob(['image']);
  ui.data = () => [{id:'seller',email:'seller@example.test',name:'Seller'}];
  let payload;
  ui.api.post = async () => ({url:'/new.png'}); ui.api.patch = async (_endpoint,body) => {payload=body;};
  await managementActions(ui).saveNewProduct();
  assert.deepEqual(photos,['/original.png']); assert.deepEqual(payload.photos,['/original.png','/new.png']);
});
