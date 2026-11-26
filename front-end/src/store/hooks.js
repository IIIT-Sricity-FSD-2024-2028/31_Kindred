import { useCallback, useEffect, useId, useMemo } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { createRepositoryDispatcher } from './requests.js';
import { fieldSet, fieldRemoved } from './slices/uiSlice.js';
import { resolveReferences } from './normalization.js';
import { repositoryForPath } from './repositories.js';
import { queryKey } from './repositorySlice.js';
import { resultReferences } from './resultReferences.js';
import { selectRepositories } from './selectors.js';

// Files are ephemeral browser handles. Redux holds serializable references only.
const files = new Map();
const fileIds = new WeakMap();
const referenceChecks = new WeakMap();
function hasReference(value) {
  if (!value || typeof value !== 'object') return false;
  if (referenceChecks.has(value)) return referenceChecks.get(value);
  const result = Boolean(value.$file || value.$query || value.$entity || Object.values(value).some(hasReference));
  referenceChecks.set(value, result);
  return result;
}
function encodeUi(value, state) {
  if (typeof File !== 'undefined' && (value instanceof File || value instanceof Blob)) {
    if (!fileIds.has(value)) { const id = crypto.randomUUID(); fileIds.set(value, id); files.set(id, value); }
    return { $file: fileIds.get(value) };
  }
  if (Array.isArray(value)) return value.map(item => encodeUi(item, state));
  if (!value || typeof value !== 'object') return value;
  if (value.id != null) for (const [name, repository] of Object.entries(state)) {
    const record = repository?.entities?.[value.id];
    if (record && Object.keys(value).every(key => JSON.stringify(value[key]) === JSON.stringify(resolveReferences(record[key], state))))
      return { $entity: name, id: String(value.id) };
  }
  if (resultReferences.has(value)) return { $query: resultReferences.get(value) };
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, encodeUi(item, state)]));
}
function decodeUi(value, state) {
  if (!hasReference(value)) return value;
  if (Array.isArray(value)) return value.map(item => decodeUi(item, state));
  if (!value || typeof value !== 'object') return value;
  if (value.$file) return files.get(value.$file) || null;
  if (value.$query) {
    const { repository, key, path } = value.$query;
    let result = resolveReferences(state[repository].queries[key]?.result, state);
    for (const part of path) result = result?.[part];
    return result ?? null;
  }
  if (value.$entity) return resolveReferences(value, state);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decodeUi(item, state)]));
}

/** Form values, filters and selections live in uiSlice with normal setter semantics. */
export function useUiState(initialValue) {
  const key = useId(), dispatch = useDispatch(), reduxStore = useStore();
  // Match a lazy state initializer: subsequent renders do not reset a mounted form.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initial = useMemo(() => ({ value: typeof initialValue === 'function' ? initialValue() : initialValue }), []);
  const stored = useSelector(state => state.ui.fields[key]);
  const repositories = useSelector(selectRepositories);
  const value = useMemo(() => stored === undefined ? initial.value : decodeUi(stored, repositories), [stored, initial, repositories]);
  const setValue = useCallback(update => {
    const state = reduxStore.getState(), previous = state.ui.fields[key];
    const current = previous === undefined ? initial.value : decodeUi(previous, state);
    const next = typeof update === 'function' ? update(current) : update;
    dispatch(fieldSet({ key, value: encodeUi(next, state) }));
  }, [dispatch, reduxStore, key, initial]);
  useEffect(() => {
    if (!Object.hasOwn(reduxStore.getState().ui.fields, key)) dispatch(fieldSet({ key, value: encodeUi(initial.value, reduxStore.getState()) }));
    return () => { dispatch(fieldRemoved(key)); };
  }, [dispatch, key, reduxStore, initial]);
  return [value, setValue];
}

export function useRepositoryRequests() {
  const dispatch = useDispatch(), reduxStore = useStore();
  return useMemo(() => createRepositoryDispatcher(dispatch, reduxStore.getState), [dispatch, reduxStore]);
}

/** Reads a query from its owning slice; no component-local server response copy. */
export function useRepositoryQuery(path) {
  const request = useRepositoryRequests();
  const key = useSelector(state => path ? queryKey(state, path) : null);
  const name = path ? repositoryForPath(path) : null;
  const query = useSelector(state => name ? state[name].queries[key] : null);
  const repositories = useSelector(selectRepositories);
  const result = query?.result;
  const data = useMemo(() => result === undefined ? null : resolveReferences(result, repositories), [result, repositories]);
  return { data, loading: query?.status === 'pending' || Boolean(path && !query), error: query?.error || '',
    load: useCallback(options => path ? request.get(path, options) : Promise.resolve(null), [request, path]) };
}
