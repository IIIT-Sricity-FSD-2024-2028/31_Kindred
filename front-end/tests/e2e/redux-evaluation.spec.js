import { test, expect } from '@playwright/test';
import { login } from '../fixtures/liveWorkflow.js';

async function start(page) {
  const session = await login(page.request, 'superuser');
  await page.goto('/');
  await page.evaluate(value => sessionStorage.setItem('kindred_session', JSON.stringify(value)), session);
  await page.goto('/platform-admin');
  await expect(page.locator('#orgTableBody tr').filter({hasText:'HopeConnect'})).toBeVisible();
}

test('database records reload into all registered Redux repositories and form filters stay in uiSlice', async ({ page }) => {
  await start(page);
  const inspect = () => page.evaluate(async () => {
    const { store } = await import('/src/store/store.js');
    const { repositoryDefinitions } = await import('/src/store/repositories.js');
    const state = store.getState();
    return { count: Object.keys(repositoryDefinitions).length, registered: Object.keys(repositoryDefinitions).every(name => Boolean(state[name]?.entities)),
      ids: Object.keys(state.organizations.entities).sort(), queries: Object.values(state.organizations.queries).map(query => query.result) };
  });
  const first = await inspect(); expect(first.count).toBe(23); expect(first.registered).toBe(true); expect(first.ids.length).toBeGreaterThan(0);
  expect(JSON.stringify(first.queries)).toContain('$entity');
  await page.locator('#searchOrgs').fill('Redux filter verification');
  expect(await page.evaluate(async () => JSON.stringify((await import('/src/store/store.js')).store.getState().ui.fields))).toContain('Redux filter verification');
  await page.reload(); await expect(page.locator('#orgTableBody tr').filter({hasText:'HopeConnect'})).toBeVisible();
  // Other live CRUD tests may add/remove their own records concurrently.
  const persistentIds=first.ids.filter(id=>/^org_\d{3}$/.test(id));
  expect(persistentIds.length).toBeGreaterThan(0);
  expect((await inspect()).ids).toEqual(expect.arrayContaining(persistentIds));
});

test('real rejected HTTP writes leave Redux entities unchanged during pending and rejected actions', async ({ page }) => {
  await start(page);
  const result = await page.evaluate(async () => {
    const { store } = await import('/src/store/store.js');
    const { fetchRequests, updateRequests } = await import('/src/store/slices/requestsSlice.js');
    await store.dispatch(fetchRequests()).unwrap();
    const before = JSON.stringify(store.getState().requests.entities);
    const pending = store.dispatch(updateRequests({ id: crypto.randomUUID(), body: { description: 'Rejected update verification' } }));
    const during = JSON.stringify(store.getState().requests.entities);
    const action = await pending;
    return { before, during, after: JSON.stringify(store.getState().requests.entities), status: action.meta.requestStatus,
      operation: store.getState().requests.operations.update };
  });
  expect(result.during).toBe(result.before); expect(result.after).toBe(result.before);
  expect(result.status).toBe('rejected'); expect(result.operation.status).toBe('failed'); expect(result.operation.error).toBeTruthy();
});
