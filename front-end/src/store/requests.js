import { repositoryThunks } from './registry.js';
import { repositoryForPath, sessionScope } from './repositories.js';
import { resolveReferences } from './normalization.js';
import { registerResult } from './resultReferences.js';

/** Dispatches the owning repository's real createAsyncThunk; never performs transport. */
export function createRepositoryDispatcher(dispatch, getState) {
  const reads = new Map();
  function execute(method, path, body, options = {}) {
    const repository = repositoryForPath(path);
    const operation = ({ GET: 'read', POST: 'create', PATCH: 'update', DELETE: 'delete' })[method] || 'command';
    const thunk = repositoryThunks[repository][operation] || repositoryThunks[repository].command;
    const key = `${sessionScope(getState())}|${path}|${getState().sync.revision}`;
    if (method === 'GET' && !options.signal && reads.has(key)) return reads.get(key);
    const task = dispatch(thunk({ method, path, body }, { signal: options.signal }));
    const result = task.unwrap().then(payload => {
      if (payload.stale) {
        if (method === 'GET' && payload.scope === sessionScope(getState()) && !options.signal?.aborted)
          return execute(method, path, body, options);
        const error = new Error('The request was superseded by a newer session or database change.');
        error.name = 'AbortError'; throw error;
      }
      return registerResult(resolveReferences(payload.result, getState()), { repository, key: payload.queryKey });
    }).catch(failure => {
      if (failure instanceof Error) throw failure;
      const error = new Error(failure.message || 'The request could not be completed.');
      error.status = failure.status; error.name = failure.name || 'Error'; throw error;
    });
    if (method === 'GET' && !options.signal) {
      reads.set(key, result);
      result.finally(() => reads.delete(key)).catch(() => {});
    }
    return result;
  }
  return {
    get: (path, options) => execute('GET', path, undefined, options),
    post: (path, body, options) => execute('POST', path, body, options),
    patch: (path, body, options) => execute('PATCH', path, body, options),
    delete: (path, options) => execute('DELETE', path, undefined, options),
  };
}
