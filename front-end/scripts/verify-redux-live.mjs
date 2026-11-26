// Real HTTP + SQLite + Redux. Requires `npm run build` in back-end first.
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { createAppStore } from '../src/store/store.js';
import { createApiClient } from '../src/services/api.js';
import { sessionChanged } from '../src/store/slices/authSlice.js';
import { createRequests, fetchRequests, updateRequests, deleteRequests } from '../src/store/slices/requestsSlice.js';

const require = createRequire(import.meta.url);
const { NestFactory } = require('../../back-end/node_modules/@nestjs/core');
const { ValidationPipe } = require('../../back-end/node_modules/@nestjs/common');
const { AppModule } = require('../../back-end/dist/app.module.js');
const { UsersService } = require('../../back-end/dist/modules/users/service.js');
const { OrganizationsService } = require('../../back-end/dist/modules/organizations/service.js');
const { enableDatabaseRepositories } = require('../../back-end/dist/common/repositories/database.js');
const { AllExceptionsFilter } = require('../../back-end/dist/common/filters/http-exception.filter.js');
const directory = mkdtempSync(path.join(tmpdir(), 'kindred-redux-live-'));
const databaseFile = path.join(directory, 'records.sqlite');
let app, persistence, reduxStore;
async function open() {
  app = await NestFactory.create(AppModule, { logger: false });
  persistence = enableDatabaseRepositories(app, databaseFile);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(0, '127.0.0.1');
  const api = createApiClient({ baseUrl: await app.getUrl(), getSession: () => reduxStore?.getState().auth.session });
  reduxStore = createAppStore({ api });
  const account = app.get(UsersService).findAll().find(user => user.role === 'superuser' && user.status === 'approved');
  assert.ok(account, 'Use a database with an existing approved administrator');
  reduxStore.dispatch(sessionChanged(structuredClone(account)));
}
try {
  await open();
  await reduxStore.dispatch(fetchRequests()).unwrap();
  const before = reduxStore.getState().requests.entities;
  const beforeQueries = reduxStore.getState().requests.queries;
  const org = app.get(OrganizationsService).findAll()[0].name;
  const description = randomUUID();
  const creating = reduxStore.dispatch(createRequests({ body: { org, type: 'Redux database verification', description } }));
  assert.strictEqual(reduxStore.getState().requests.entities, before, 'No optimistic entity changes');
  assert.equal(reduxStore.getState().requests.operations.create.status, 'pending');
  const created = await creating.unwrap();
  for (const [key, query] of Object.entries(beforeQueries)) assert.strictEqual(reduxStore.getState().requests.queries[key].result, query.result, 'POST results must not replace GET lists at the same URL');
  const id = created.result.id;
  assert.equal(reduxStore.getState().requests.entities[id].description, description);
  console.log('PASS: thunk pending/fulfilled and database-confirmed create');
  const previous = reduxStore.getState().requests.entities;
  persistence.database.exec("CREATE TRIGGER reject_request_write BEFORE UPDATE ON repository_records WHEN NEW.repository='requests' BEGIN SELECT RAISE(FAIL,'Verification write failure'); END");
  await assert.rejects(reduxStore.dispatch(updateRequests({ id, body: { description: randomUUID() } })).unwrap());
  assert.strictEqual(reduxStore.getState().requests.entities, previous, 'Failed database write preserves Redux entities');
  assert.equal(reduxStore.getState().requests.operations.update.status, 'failed');
  persistence.database.exec('DROP TRIGGER reject_request_write');
  console.log('PASS: real database write failure preserves Redux and repository records');
  const updated = randomUUID();
  await reduxStore.dispatch(updateRequests({ id, body: { description: updated } })).unwrap();
  assert.equal(reduxStore.getState().requests.entities[id].description, updated);
  await app.close(); app = null;
  await open();
  assert.deepEqual(reduxStore.getState().requests.entities, {}, 'Fresh frontend store starts without cached records');
  await reduxStore.dispatch(fetchRequests()).unwrap();
  assert.equal(reduxStore.getState().requests.entities[id].description, updated, 'Saved data survives both store and server restart');
  console.log('PASS: database persistence after backend restart and frontend store recreation');
  await reduxStore.dispatch(deleteRequests({ id })).unwrap();
  assert.equal(reduxStore.getState().requests.entities[id], undefined);
  await reduxStore.dispatch(fetchRequests()).unwrap();
  assert.equal(reduxStore.getState().requests.entities[id], undefined);
  console.log('PASS: database-confirmed delete and subsequent read');
} finally {
  if (app) await app.close();
  if (path.resolve(directory).startsWith(path.resolve(tmpdir()) + path.sep) && path.basename(directory).startsWith('kindred-redux-live-')) rmSync(directory, { recursive: true, force: true });
  else console.error('Refused cleanup of unexpected test directory:', directory);
}
