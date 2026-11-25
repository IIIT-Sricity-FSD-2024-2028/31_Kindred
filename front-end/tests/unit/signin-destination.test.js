import test from 'node:test';
import assert from 'node:assert/strict';
import { authActions } from '../../src/pages/actions/authActions.js';
import { ROLE_DASHBOARDS } from '../../src/services/session.js';
import { pageRequests } from '../../src/services/pageData.js';

test('sign-in lands each role on its dashboard even with a previous destination', async () => {
  for (const [role, dashboard] of Object.entries(ROLE_DASHBOARDS)) {
    let destination;
    const ui = {
      values: { 'si-email': 'actor@example.test', 'si-pass': 'Valid@123' },
      state: { selectedRole: role }, location: { search: '?redirect=/shop', state: { from: '/profile' } },
      signIn: async () => ({ role, dashboard }), navigate: (to) => { destination = to; },
    };
    await authActions(ui).signIn();
    assert.equal(destination, dashboard);
  }
});

test('portal loads its application feed for guests and each signed-in role', () => {
  for (const role of [null, ...Object.keys(ROLE_DASHBOARDS)]) {
    const session = role && { role, email: 'actor@example.test', org: 'HopeConnect' };
    assert.equal(pageRequests('/volunteer-portal.html', session).programs, '/programs/portal');
    assert.equal(pageRequests('/programs.html', session).programs, '/programs');
  }
});

test('delivery portal loads real opportunities and sellers do not load volunteer directories', () => {
  const volunteer={role:'volunteer',email:'volunteer@example.test',org:'HopeConnect'};
  const seller={role:'seller',id:'user-seller',email:'seller@example.test',org:'HopeConnect'};
  const portal=pageRequests('/volunteer-portal.html',volunteer);
  assert.equal(portal.deliveries,'/fulfillment/portal');
  assert.equal(portal.replacements,'/replacements/by-volunteer/volunteer%40example.test');
  const dashboard=pageRequests('/seller-dashboard.html',seller);
  assert.equal(dashboard.deliveries,'/fulfillment/deliveries');
  assert.equal(dashboard.deliveryVolunteers,undefined);
  assert.equal(dashboard.volunteers,undefined);
  assert.equal(pageRequests('/volunteer-portal.html',null).deliveries,undefined);
});
