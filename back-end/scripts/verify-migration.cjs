// Read-only verification of the existing encrypted snapshot against a temporary DB.
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { enableDatabaseRepositories } = require('../dist/common/repositories/database');
const { createLocalStateCodec } = require('../dist/common/local-state-codec');
const { repositoryDefinitions } = require('../dist/common/repositories/definitions');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

async function verify() {
  const source = path.resolve(process.argv[2] || '../.run/server-state.enc');
  assert.ok(fs.existsSync(source) && fs.existsSync(source + '.key'), 'Existing encrypted snapshot and its key are required.');
  const original = [hash(source), hash(source + '.key')];
  const legacy = JSON.parse(createLocalStateCodec(source, source.includes('.portable.')).decrypt(fs.readFileSync(source)));
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kindred-migration-'));
  let app;
  try {
    app = await NestFactory.create(AppModule, { logger: false });
    const persistence = enableDatabaseRepositories(app, path.join(directory, 'migration.sqlite'), source);
    await app.listen(0, '127.0.0.1');
    let records = 0;
    for (const [name, owner] of Object.entries(repositoryDefinitions)) {
      const saved = persistence.repositories.get(name).read();
      for (const [collection, rows] of Object.entries(legacy[owner] || {})) {
        if (!Array.isArray(rows)) { assert.deepEqual(saved[collection], rows); continue; }
        assert.equal(saved[collection].length, rows.length, `${name}.${collection}: record count`);
        assert.deepEqual(saved[collection].map(row => row.id), rows.map(row => row.id), `${name}.${collection}: record identities`);
        records += rows.length;
      }
    }
    assert.deepEqual([hash(source), hash(source + '.key')], original, 'Original records and key must remain unchanged.');
    console.log(`PASS: ${persistence.repositories.size} repositories imported; ${records} saved records retained; original snapshot and key unchanged.`);
  } finally {
    if (app) await app.close();
    if (path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep) && path.basename(directory).startsWith('kindred-migration-')) fs.rmSync(directory, { recursive: true, force: true });
  }
}
verify().catch(error => { console.error(error.message); process.exitCode = 1; });
