import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createAppStore } from '../../src/store/store.js';
import { repositoryDefinitions, sessionScope } from '../../src/store/repositories.js';
import { repositoryThunks } from '../../src/store/registry.js';
import { normalizeResponse, resolveReferences } from '../../src/store/normalization.js';
import { queryKey } from '../../src/store/repositorySlice.js';

test('every backend repository has exactly one registered entity slice and supported CRUD thunks', async () => {
  const definitions = await readFile(new URL('../../../back-end/src/common/repositories/definitions.ts', import.meta.url), 'utf8');
  const services = [...definitions.matchAll(/: '([A-Za-z]+(?:Service|Store))'/g)].map(match => match[1]);
  assert.deepEqual(Object.values(repositoryDefinitions).map(value => value.service).sort(), services.sort());
  const state = createAppStore().getState();
  for (const [name, definition] of Object.entries(repositoryDefinitions)) {
    assert.ok(state[name]?.entities);
    for (const operation of definition.crud) assert.equal(typeof repositoryThunks[name][operation], 'function', `${name}.${operation}`);
    assert.match(await readFile(new URL(`../../src/store/slices/${name}Slice.js`, import.meta.url), 'utf8'), new RegExp(`createRepositorySlice\\('${name}'\\)`));
  }
});

test('repository reducers change entity records only on confirmed success and retain data on failed writes', () => {
  const store = createAppStore(), path = '/requests';
  const scope = sessionScope(store.getState()), key = queryKey(store.getState(), path);
  const arg = { repository: 'requests', operation: 'create', scope, key, path };
  const record = { id: crypto.randomUUID(), description: crypto.randomUUID() };
  const pending = { type: 'repositories/requests/create/pending', meta: { arg, requestId: 'create', requestStatus: 'pending' } };
  store.dispatch(pending);
  assert.deepEqual(store.getState().requests.entities, {});
  store.dispatch({ type: 'repositories/requests/create/fulfilled', payload: { ...normalizeResponse(record, 'requests', path), method: 'POST', scope, path, queryKey: key }, meta: { arg, requestId: 'create', requestStatus: 'fulfilled' } });
  assert.deepEqual(store.getState().requests.entities[record.id], record);
  const before = store.getState().requests.entities;
  const updateArg = { ...arg, operation: 'update' };
  store.dispatch({ type: 'repositories/requests/update/pending', meta: { arg: updateArg, requestId: 'update', requestStatus: 'pending' } });
  assert.strictEqual(store.getState().requests.entities, before);
  store.dispatch({ type: 'repositories/requests/update/rejected', payload: { message: 'Database unavailable' }, error: { message: 'Rejected' }, meta: { arg: updateArg, requestId: 'update', requestStatus: 'rejected' } });
  assert.strictEqual(store.getState().requests.entities, before);
  assert.equal(store.getState().requests.operations.update.error, 'Database unavailable');
});

test('composite query results refer to their owning entities and session changes clear all records', () => {
  const programId = crypto.randomUUID(), organizationId = crypto.randomUUID();
  const normalized = normalizeResponse({ program: { id: programId, name: crypto.randomUUID() }, organization: { id: organizationId, name: crypto.randomUUID() } }, 'participation', '/participation/programs/x/brief');
  assert.equal(normalized.result.program.$entity, 'programs');
  assert.equal(normalized.result.organization.$entity, 'organizations');
  assert.equal(normalized.records.participation, undefined);
  const store = createAppStore();
  const scope = sessionScope(store.getState());
  store.dispatch({ type: 'repositories/participation/read/fulfilled', payload: { ...normalized, scope }, meta: { arg: { repository: 'participation', operation: 'read' }, requestId: 'read', requestStatus: 'fulfilled' } });
  assert.equal(resolveReferences(normalized.result, store.getState()).program.id, programId);
  store.dispatch({ type: 'auth/signedOut' });
  for (const name of Object.keys(repositoryDefinitions)) assert.deepEqual(store.getState()[name].entities, {});
});

test('server revisions and authentication scopes prevent older responses from restoring stale records', () => {
  const store = createAppStore(), path = '/requests', id = crypto.randomUUID();
  const scope = sessionScope(store.getState()), key = queryKey(store.getState(), path);
  const fulfilled = (description, serverRevision) => ({
    type: 'repositories/requests/read/fulfilled',
    payload: { ...normalizeResponse({ id, description }, 'requests', path), scope, path, queryKey: key, method: 'GET', serverRevision },
    meta: { arg: { repository: 'requests', operation: 'read', scope }, requestId: String(serverRevision), requestStatus: 'fulfilled' },
  });
  store.dispatch(fulfilled('Confirmed newer value', 20));
  store.dispatch(fulfilled('Late older value', 19));
  assert.equal(store.getState().requests.entities[id].description, 'Confirmed newer value');
  store.dispatch({ type: 'auth/signedOut' });
  store.dispatch(fulfilled('Response from previous session', 21));
  assert.deepEqual(store.getState().requests.entities, {});
});

test('authoritative server snapshots clear removed fields while projections retain canonical record details', () => {
  const store = createAppStore(), id = crypto.randomUUID(), scope = sessionScope(store.getState());
  const apply = (record, path, revision) => store.dispatch({
    type: 'repositories/fulfillment/read/fulfilled',
    payload: { ...normalizeResponse(record, 'fulfillment', path), scope, path, method: 'GET', serverRevision: revision },
    meta: { arg: { repository: 'fulfillment', operation: 'read', scope }, requestId: String(revision), requestStatus: 'fulfilled' },
  });
  apply({ id, status: 'accepted', title: 'Collection', volunteerEmail: 'assigned@example.test' }, '/fulfillment/deliveries', 1);
  apply({ id, title: 'Collection details', available: true }, `/fulfillment/deliveries/${id}/brief`, 2);
  assert.equal(store.getState().fulfillment.entities[id].volunteerEmail, 'assigned@example.test');
  apply({ id, status: 'awaiting_acceptance', title: 'Collection' }, '/fulfillment/deliveries', 3);
  assert.equal(store.getState().fulfillment.entities[id].volunteerEmail, undefined);
});
