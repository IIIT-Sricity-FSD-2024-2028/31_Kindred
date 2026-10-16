import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanPath, cleanDestination } from '../../src/routes/cleanPaths.js';
import { routeDefinitions } from '../../src/routes/routeDefinitions.js';
test('all page destinations are unique clean paths, retaining query and hash', () => {
  const paths = routeDefinitions.map((route) => cleanPath(route.path));
  assert.equal(new Set(paths).size,53);
  assert.ok(paths.every((path) => !path.includes('.html')));
  assert.equal(cleanPath('/index.html'),'/');
  assert.equal(cleanPath('/organization-details.html?id=org_001#mission'),'/organization-details?id=org_001#mission');
  assert.equal(cleanPath('signin.html'), 'signin');
  assert.equal(cleanPath('/about?download=note.html#doc.html'), '/about?download=note.html#doc.html');
});
test('navigation normalization preserves history deltas and external destinations', () => {
  assert.equal(cleanDestination(-1),-1);
  assert.equal(cleanDestination('https://example.test/page.html'),'https://example.test/page.html');
  assert.deepEqual(cleanDestination({pathname:'/org-admin.html',hash:'#programs',search:'?edit=x'}),{pathname:'/org-admin',hash:'#programs',search:'?edit=x'});
});
