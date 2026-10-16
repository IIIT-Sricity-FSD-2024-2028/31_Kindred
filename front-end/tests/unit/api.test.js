import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, createApiClient } from '../../src/services/api.js';

test('uses the configured base URL, exact JSON body, and actual approved role', async () => {
  let captured;
  const client = createApiClient({
    baseUrl: 'https://api.example.test///',
    getSession: () => ({ role: 'donor', status: 'approved' }),
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return Response.json({ success: true, data: { id: 'new-id' }, message: 'Created' }, { status: 201 });
    },
  });
  assert.deepEqual(await client.post('/donations', { amount: 10 }), { id: 'new-id' });
  assert.equal(captured.url, 'https://api.example.test/donations');
  assert.equal(captured.options.method, 'POST');
  assert.equal(captured.options.headers.get('role'), 'donor');
  assert.equal(captured.options.body, '{"amount":10}');
});

test('anonymous and pending sessions never default to superuser', async () => {
  for (const session of [null, { role: 'superuser', status: 'pending' }]) {
    const client = createApiClient({ getSession: () => session, fetchImpl: async (_url, options) => {
      assert.equal(options.headers.has('role'), false);
      assert.equal(options.headers.has('Content-Type'), false);
      assert.equal(options.body, undefined);
      return Response.json({ success: true, data: [] });
    } });
    await client.get('/organizations');
  }
});

test('rejects business failures even when the HTTP response is successful', async () => {
  const client = createApiClient({ fetchImpl: async () => Response.json({ success: false, data: null, message: 'Invalid email, password, or role' }, { status: 201 }) });
  await assert.rejects(client.post('/users/signin', {}), (error) => error instanceof ApiError && error.status === 201 && error.message.includes('Invalid email'));
});

test('surfaces HTTP validation and authorization errors', async () => {
  const client = createApiClient({ fetchImpl: async () => Response.json({ success: false, message: ['name is required', 'email is invalid'] }, { status: 400 }) });
  await assert.rejects(client.post('/users/register', {}), { name: 'ApiError', status: 400, message: 'name is required; email is invalid' });
});

test('distinguishes network failures, invalid responses, and request cancellation', async () => {
  const network = createApiClient({ fetchImpl: async () => { throw new TypeError('offline'); } });
  await assert.rejects(network.get('/organizations'), { name: 'ApiError', status: 0 });
  const malformed = createApiClient({ fetchImpl: async () => new Response('<html>error</html>', { status: 502 }) });
  await assert.rejects(malformed.get('/organizations'), { name: 'ApiError', status: 502 });
  const abortError = new DOMException('Aborted', 'AbortError');
  const aborted = createApiClient({ fetchImpl: async () => { throw abortError; } });
  await assert.rejects(aborted.get('/organizations'), (error) => error === abortError);
});

test('multipart uploads preserve the browser-generated content-type boundary', async () => {
  const form = new FormData();
  form.append('file', new Blob(['test'], { type: 'image/png' }), 'test.png');
  const client = createApiClient({ fetchImpl: async (_url, options) => {
    assert.equal(options.body, form);
    assert.equal(options.headers.has('Content-Type'), false);
    return Response.json({ success: true, data: { url: '/uploads/test.png' } });
  } });
  assert.deepEqual(await client.post('/products/upload', form), { url: '/uploads/test.png' });
});
