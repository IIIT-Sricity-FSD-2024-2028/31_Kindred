import test from 'node:test';
import assert from 'node:assert/strict';
import { pageLoader, collectionScope } from '../../src/services/pageLoaders.js';
import { ensureAssignment } from '../../src/services/workflow.js';
import { authActions } from '../../src/pages/actions/authActions.js';

test('seller collections share discovery and use the profile ID rather than login ID', async () => {
  const paths = [];
  const api = {get:async (path) => { paths.push(path); return path === '/sellers' ? [{id:'profile-id',email:'Seller@Example.test'}] : []; }};
  const load = pageLoader(api,{role:'seller',id:'login-id',email:'seller@example.test'});
  await Promise.all(['sellers','products','orders','replacements'].map((key) => load(key,'/unused')));
  assert.equal(paths.filter((p) => p === '/sellers').length,1);
  assert.ok(paths.includes('/replacements/by-seller/profile-id'));
  assert.ok(paths.includes('/orders?sellerId=profile-id'));
  assert.ok(!paths.some((p) => p.includes('login-id')));
});
test('scope changes isolate records when user, role, or route changes', () => {
  assert.notEqual(collectionScope('/dashboard',{id:'a',role:'seller'}),collectionScope('/dashboard',{id:'b',role:'seller'}));
  assert.notEqual(collectionScope('/dashboard',{id:'a',role:'seller'}),collectionScope('/profile',{id:'a',role:'seller'}));
});
test('cancelled assignments resend an invitation without a duplicate create', async () => {
  const writes=[];
  await ensureAssignment({patch:async (...args) => writes.push(args),post:async () => assert.fail('duplicate create')}, {volunteerEmail:'VOL@example.test'}, [{id:'existing',volunteerEmail:'vol@example.test',status:'cancelled'}]);
  assert.deepEqual(writes,[['/program-assignments/existing',{status:'pending'}]]);
});
test('registration retries only the failed second step and retains no password in progress', async () => {
  const state={files:{},customSkills:[]}; let users=0,sellers=0;
  const ui={values:{'seller-name':'Test Seller','seller-email':'seller@example.test','seller-phone':'9812345678','seller-pass':'Valid@123','seller-pass2':'Valid@123','seller-business':'Test Shop'},state,
    update:patch=>Object.assign(state,patch), api:{post:async (path) => {
      if(path==='/users/register') {users++;return {id:'created',name:'Test',email:'seller@example.test',role:'seller',status:'pending',password:'SECRET'};}
      sellers++; if(sellers===1) throw new Error('Temporary outage'); return {};
    }},navigate() {}};
  await assert.rejects(authActions(ui).submitSeller(),/Retry this form/);
  assert.equal(state.registrationProgress.user.password,undefined);
  await authActions(ui).submitSeller(); assert.equal(users,1); assert.equal(sellers,2);
});
