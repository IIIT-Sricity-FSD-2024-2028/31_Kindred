export const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, data = null, cause } = {}) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function createApiClient({ baseUrl = API_BASE_URL, getSession = () => null, fetchImpl = globalThis.fetch } = {}) {
  async function request(path, { method = 'GET', body, signal } = {}) {
    const headers = new Headers({ Accept: 'application/json' });
    const session = getSession();
    if (session?.status === 'approved' && session.role) {
      headers.set('role', session.role);
      if (session.email) headers.set('user-email', session.email);
      if (session.org) headers.set('organization', session.org);
    }
    const isForm = body instanceof FormData;
    if (body !== undefined && !isForm) headers.set('Content-Type', 'application/json');

    let response;
    try {
      response = await fetchImpl(`${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`, {
        method, headers, signal,
        ...(body !== undefined ? { body: isForm ? body : JSON.stringify(body) } : {}),
      });
    } catch (cause) {
      if (cause.name === 'AbortError' || signal?.aborted) throw cause;
      throw new ApiError('Unable to reach the server. Please try again.', { cause });
    }

    let payload;
    try { payload = await response.json(); } catch (cause) {
      throw new ApiError(`The server returned an invalid response (HTTP ${response.status}).`, { status: response.status, cause });
    }
    if (!response.ok || payload?.success !== true) {
      const message = Array.isArray(payload?.message) ? payload.message.join('; ') : payload?.message;
      throw new ApiError(message || `Request failed (HTTP ${response.status}).`, { status: response.status, data: payload?.data });
    }
    return payload.data;
  }
  return {
    request,
    get: (path, options) => request(path, options),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  };
}
