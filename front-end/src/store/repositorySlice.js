import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { repositoryDefinitions, sessionScope, operationPath, repositoryForPath } from './repositories.js';
import { normalizeResponse } from './normalization.js';

export const isRepositoryAction = action => action.meta?.arg?.repository && action.type.startsWith('repositories/');
export const isConfirmedWrite = action => isRepositoryAction(action) && action.type.endsWith('/fulfilled') && action.payload.method !== 'GET' && !action.payload.stale;
export const queryKey = (state, path) => `${sessionScope(state)}|${path}`;

export function createRepositorySlice(name) {
  const definition = repositoryDefinitions[name];
  function thunk(operation, method) {
    const requestThunk = createAsyncThunk(`repositories/${name}/${operation}`, async (arg, { extra, getState, rejectWithValue, signal }) => {
      const scope = sessionScope(getState()), version = getState().sync.revision;
      const path = operationPath(name, operation, arg);
      try {
        const response = await extra.api.request(path, { method: arg.method || method, body: arg.body, signal, withMetadata: true });
        const responseData = response.data;
        const normalized = normalizeResponse(responseData, name, path);
        const actualMethod = arg.method || method;
        return { ...normalized, method: actualMethod, path, queryKey: `${scope}|${actualMethod === 'GET' ? '' : actualMethod + '|'}${path}`, scope,
          serverRevision: response.revision, stale: scope !== sessionScope(getState()) || (method === 'GET' && version !== getState().sync.revision),
          deletedId: (arg.method || method) === 'DELETE' ? decodeURIComponent(path.split('/').at(-1)) : null };
      } catch (error) {
        return rejectWithValue({ message: error.message, status: error.status || 0, scope, path, queryKey: `${scope}|${path}` });
      }
    });
    const action = (arg = {}, options) => (dispatch, getState) => {
      const path = operationPath(name, operation, arg);
      if (!path) throw new Error(`${name} is an internal repository; it has no public CRUD endpoint.`);
      if (repositoryForPath(path) !== name) throw new Error(`Use the ${repositoryForPath(path)} slice for ${path}.`);
      return dispatch(requestThunk({ ...arg, path, repository: name, operation, key: queryKey(getState(), path), scope: sessionScope(getState()) }, options));
    };
    return Object.assign(action, requestThunk);
  }
  const thunks = { read: thunk('read', 'GET'), command: thunk('command', 'POST') };
  for (const [operation, method] of Object.entries({ create: 'POST', update: 'PATCH', delete: 'DELETE' }))
    if (definition.crud.includes(operation)) thunks[operation] = thunk(operation, method);
  const initialState = { entities: {}, entityVersions: {}, queries: {}, operations: {}, scope: null };
  const slice = createSlice({
    name, initialState,
    reducers: { clearErrors(state) { for (const operation of Object.values(state.operations)) operation.error = null; } },
    extraReducers: builder => {
      builder.addCase('auth/sessionChanged', () => initialState);
      builder.addCase('auth/signedOut', () => initialState);
      builder.addCase('auth/signIn/fulfilled', () => initialState);
      builder.addMatcher(action => isRepositoryAction(action) && action.meta.arg.repository === name && action.type.endsWith('/pending'), (state, action) => {
        const { key, scope, path, operation } = action.meta.arg;
        state.scope = scope;
        state.operations[operation] = { status: 'pending', loading: true, error: null, requestId: action.meta.requestId };
        if (operation === 'read') state.queries[key] = { ...state.queries[key], path, scope, status: 'pending', error: null, requestId: action.meta.requestId };
      });
      builder.addMatcher(action => isRepositoryAction(action) && action.type.endsWith('/fulfilled'), (state, action) => {
        const payload = action.payload;
        if (state.scope && state.scope !== payload.scope) return;
        if (payload.stale) {
          if (action.meta.arg.repository === name) {
            const operation = action.meta.arg.operation;
            if (state.operations[operation]?.requestId === action.meta.requestId) state.operations[operation] = { status: 'idle', loading: false, error: null };
            const query = state.queries[payload.queryKey];
            if (query?.requestId === action.meta.requestId) query.status = 'idle';
          }
          return;
        }
        for (const [id, record] of Object.entries(payload.records[name] || {})) {
          const revision = payload.serverRevision;
          if (revision != null && (state.entityVersions[id] || 0) > revision) continue;
          // Complete server records also clear fields removed by the backend.
          // Contextual/nested projections enrich their canonical owner instead.
          state.entities[id] = payload.snapshots?.[name]?.includes(id) ? record : { ...state.entities[id], ...record };
          if (revision != null) state.entityVersions[id] = revision;
        }
        if (action.meta.arg.repository !== name) return;
        if (payload.deletedId) {
          delete state.entities[payload.deletedId]; delete state.entityVersions[payload.deletedId];
        }
        const operation = action.meta.arg.operation;
        if (state.operations[operation]?.requestId === action.meta.requestId)
          state.operations[operation] = { status: 'succeeded', loading: false, error: null, requestId: action.meta.requestId };
        const previous = state.queries[payload.queryKey];
        if (payload.method !== 'GET' || previous?.requestId === action.meta.requestId)
          state.queries[payload.queryKey] = { result: payload.result, path: payload.path, scope: payload.scope, status: 'succeeded', error: null, requestId: action.meta.requestId };
      });
      builder.addMatcher(action => isRepositoryAction(action) && action.meta.arg.repository === name && action.type.endsWith('/rejected'), (state, action) => {
        const { key, operation, scope } = action.meta.arg;
        if (state.scope !== scope) return;
        const error = action.payload?.message || action.error.message;
        if (state.operations[operation]?.requestId === action.meta.requestId)
          state.operations[operation] = { status: action.meta.aborted ? 'idle' : 'failed', loading: false, error: action.meta.aborted ? null : error, requestId: action.meta.requestId };
        if (operation === 'read' && state.queries[key]?.requestId === action.meta.requestId) {
          state.queries[key].status = action.meta.aborted ? 'idle' : 'failed';
          state.queries[key].error = action.meta.aborted ? null : error;
        }
      });
    },
  });
  return { ...slice, thunks };
}
