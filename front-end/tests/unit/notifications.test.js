import test from 'node:test';
import assert from 'node:assert/strict';
import { notificationsPath, safeNotificationLink } from '../../src/services/notifications.js';

test('notification filtering encodes the actual session identity and organization', () => {
  const query = new URL(notificationsPath({ email: 'a+b@example.test', role: 'admin', org: 'Hope & Care' }), 'https://local.test').searchParams;
  assert.equal(query.get('email'), 'a+b@example.test');
  assert.equal(query.get('role'), 'admin');
  assert.equal(query.get('org'), 'Hope & Care');
});
test('notification links retain supported legacy paths, queries, and hashes', () => {
  assert.equal(safeNotificationLink('org-admin.html#programs'), '/org-admin#programs');
  assert.equal(safeNotificationLink('/organization-details.html?id=org_001'), '/organization-details?id=org_001');
  assert.equal(safeNotificationLink('/'), '/');
});
test('notification text cannot inject scripts, external navigation, or unknown pages', () => {
  for (const link of ['javascript:alert(1)', 'https://outside.example/path', '//outside.example/path', '/missing.html', '/src/main.jsx', null]) assert.equal(safeNotificationLink(link), null);
});
