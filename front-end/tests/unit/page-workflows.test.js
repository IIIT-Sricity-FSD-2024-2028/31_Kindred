import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCard, validatePasswords, validatePhone, validateEmail } from '../../src/services/validation.js';
import { pageRequests, filterRecords } from '../../src/services/pageData.js';
import { executeConfirmation } from '../../src/services/workflow.js';

test('phone validation requires exactly ten digits starting with 6, 7, 8 or 9', () => {
  for (const number of ['9812345678','6123456789','7123456789','8123456789','9999999999']) assert.doesNotThrow(() => validatePhone(number));
  for (const number of ['123','5123456789','+91 98123 45678','09812345678','98123 45678','98abc12345678']) assert.throws(() => validatePhone(number));
});

test('email validation accepts common providers and rejects malformed addresses',()=>{
  for(const email of ['person@gmail.com','person+tag@outlook.com','a.b@community.org'])assert.doesNotThrow(()=>validateEmail(email));
  for(const email of ['bad','person@@gmail.com','.person@gmail.com','person..name@gmail.com','a b@outlook.com','person@-gmail.com'])assert.throws(()=>validateEmail(email));
});
test('registration passwords retain the original strength and matching requirements', () => {
  assert.doesNotThrow(() => validatePasswords('Valid@123','Valid@123'));
  for (const password of ['short','lowercase@1','NoNumbers@','NoSymbols1']) assert.throws(() => validatePasswords(password,password));
  assert.throws(() => validatePasswords('Valid@123','Other@123'),/do not match/);
});
test('card validation accepts the current expiry month and returns only masked metadata', () => {
  const today = new Date();
  const values = { 'card-number':'4111 1111 1111 1111', 'card-holder-name':'Test Holder', 'card-expiry':String(today.getMonth()+1).padStart(2,'0')+'/'+String(today.getFullYear()).slice(-2), 'card-cvv':'123' };
  assert.deepEqual(validateCard(values), { cardLast4:'1111',cardType:'Visa' });
  assert.throws(() => validateCard({...values,'card-expiry':'13/39'}),/expiry/);
  assert.throws(() => validateCard({...values,'card-expiry':'01/20'}),/expired/);
  assert.throws(() => validateCard({...values,'card-number':'6011111111111111'}),/Visa or Mastercard/);
});
test('page data plans preserve anonymous and donor permissions and combine search with filters', () => {
  assert.deepEqual(Object.keys(pageRequests('/index.html',null)).sort(),['organizations','programs']);
  const donor = pageRequests('/donor-dashboard.html',{role:'donor',email:'donor+test@example.test'});
  assert.equal(donor.resources,'/resource-donations/by-donor/donor%2Btest%40example.test');
  assert.ok(!Object.values(donor).includes('/users'));
  assert.deepEqual(filterRecords([{id:1,name:'Asha',role:'volunteer',status:'approved'},{id:2,name:'Asha',role:'donor',status:'pending'}],'asha','volunteer').map((r) => r.id),[1]);
});
test('retrying program approval does not create a duplicate active assignment', async () => {
  const application = { programId:'program-test',programName:'Test',volunteerEmail:'vol@example.test',volunteerName:'Volunteer' };
  let writes = 0;
  const api = { patch:async () => application, get:async () => [{...application,status:'active'}], post:async () => { writes++; } };
  await executeConfirmation(api,{method:'patch',endpoint:'/program-applications/app-test/approve',body:{}});
  assert.equal(writes,0);
});
test('approval surfaces a failed server-side invitation instead of claiming success', async () => {
  const api = { patch:async () => {throw new Error('Assignment failed');},get:async () => {throw new Error('Unexpected client reconciliation');},post:async () => {throw new Error('Unexpected client write');} };
  await assert.rejects(executeConfirmation(api,{method:'patch',endpoint:'/program-applications/app-test/approve',body:{}}),/Assignment failed/);
});
