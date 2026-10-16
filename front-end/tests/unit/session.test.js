import test from 'node:test';
import assert from 'node:assert/strict';
import { clearSession, normalizeSession, readSession, SESSION_KEY, writeSession } from '../../src/services/session.js';
import { getAccessRedirect } from '../../src/routes/access.js';
import { routeDefinitions } from '../../src/routes/routeDefinitions.js';

const user = { id: 'don_001', name: 'Arun Patel', email: 'donor@kindred.org', role: 'donor', status: 'approved', dashboard: 'donor-dashboard.html', password: 'must-not-be-stored' };
function memoryStorage() {
  const items = new Map();
  return { getItem: (key) => items.get(key) ?? null, setItem: (key, value) => items.set(key, value), removeItem: (key) => items.delete(key) };
}

test('restores the existing session format and never persists passwords', () => {
  const storage = memoryStorage();
  storage.setItem(SESSION_KEY, JSON.stringify(user));
  const session = readSession(storage);
  assert.equal(session.dashboard, '/donor-dashboard.html');
  assert.equal(session.initials, 'AP');
  assert.equal(session.password, undefined);
  writeSession(user, storage);
  assert.equal(JSON.parse(storage.getItem(SESSION_KEY)).password, undefined);
  clearSession(storage);
  assert.equal(readSession(storage), null);
});

test('corrupt, unknown-role, and rejected sessions cannot restore access', () => {
  for (const raw of ['{bad-json', JSON.stringify({ ...user, role: 'owner' }), JSON.stringify({ ...user, status: 'rejected' }), JSON.stringify({ ...user, status: 'anything' }), JSON.stringify({ role: 'donor' })]) {
    const storage = memoryStorage();
    storage.setItem(SESSION_KEY, raw);
    assert.equal(readSession(storage), null);
    assert.equal(storage.getItem(SESSION_KEY), null);
  }
});

test('disabled browser storage does not crash the application', () => {
  const storage = { getItem() { throw new Error('disabled'); }, setItem() { throw new Error('disabled'); }, removeItem() { throw new Error('disabled'); } };
  assert.equal(readSession(storage), null);
  assert.equal(writeSession(user, storage).role, 'donor');
  assert.doesNotThrow(() => clearSession(storage));
});

test('pending users redirect to review and cannot be signed in', () => {
  const pending = { ...user, status: 'pending' };
  const storage = memoryStorage();
  storage.setItem(SESSION_KEY, JSON.stringify(pending));
  assert.equal(getAccessRedirect(readSession(storage), ['donor']), '/registration-pending.html');
  assert.throws(() => writeSession(pending, storage), /approved/);
});

test('route access distinguishes guests, permitted users, and other roles', () => {
  assert.equal(getAccessRedirect(null, null), null);
  assert.equal(getAccessRedirect(null, ['superuser']), '/signin.html');
  assert.equal(getAccessRedirect(user, ['donor']), null);
  assert.equal(getAccessRedirect(user, ['superuser']), '/donor-dashboard.html');
  assert.equal(getAccessRedirect({ ...user, status: 'rejected' }, ['donor']), '/signin.html');
  assert.equal(normalizeSession({ ...user, dashboard: 'https://untrusted.example' }).dashboard, '/donor-dashboard.html');
});

test('all 53 original URLs are unique React routes and each role has an accessible dashboard', () => {
  assert.equal(routeDefinitions.length, 53);
  assert.equal(new Set(routeDefinitions.map((route) => route.path)).size, 53);
  for (const role of ['superuser', 'admin', 'volunteer', 'donor', 'beneficiary', 'seller']) {
    const session = normalizeSession({ ...user, role });
    const route = routeDefinitions.find((route) => route.path === session.dashboard);
    assert.ok(route);
    assert.equal(getAccessRedirect(session, route.roles), null);
  }
});
