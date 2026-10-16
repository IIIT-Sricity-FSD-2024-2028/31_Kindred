import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

test('frontend has one React HTML entry and no standalone legacy runtime', async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const files = await readdir(root);
  assert.deepEqual(files.filter((name) => name.endsWith('.html')), ['index.html']);
  const entry = await readFile(join(root,'index.html'),'utf8');
  assert.match(entry,/\/src\/main\.jsx/);
  const scripts = files.filter((name) => name.endsWith('.js'));
  assert.ok(scripts.every((name) => name.endsWith('.config.js') || name === 'playwright.production.config.js'));
  assert.ok(!files.includes('_server.ps1'));
  const packageJson = JSON.parse(await readFile(join(root,'package.json'),'utf8'));
  assert.ok(!packageJson.scripts['reference:serve']);
});
