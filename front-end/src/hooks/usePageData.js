import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pageRequests } from '../services/pageData.js';
import { collectionRecords, collectionScope } from '../services/pageLoaders.js';
import { refreshRequested } from '../store/slices/syncSlice.js';
import { repositoryForPath } from '../store/repositories.js';
import { queryKey } from '../store/repositorySlice.js';
import { resolveReferences } from '../store/normalization.js';
import { selectRepositories } from '../store/selectors.js';

export default function usePageData(path, session, requests) {
  const dispatch = useDispatch();
  const repositories = useSelector(selectRepositories);
  const auth = useSelector(state => state.auth);
  const revision = useSelector(state => state.sync.revision);
  const state = { ...repositories, auth };
  const seller = session?.role === 'seller' ? Object.values(repositories.sellers.entities).find(record => record.email?.toLowerCase() === session.email.toLowerCase()) : null;
  const sellerId = seller?.id;
  const jobs = useMemo(() => {
    const jobs = pageRequests(path, session?.role === 'seller' && sellerId ? { ...session, id: sellerId } : session);
    if (session?.role === 'seller' && !sellerId) for (const key of ['products', 'orders', 'replacements']) delete jobs[key];
    return jobs;
  }, [path, session, sellerId]);
  const scope = collectionScope(path, session);
  const refresh = useCallback(() => {
    dispatch(refreshRequested());
    try { localStorage.setItem('kindred_data_revision', `${Date.now()}:${Math.random()}`); } catch { /* Polling remains available. */ }
  }, [dispatch]);
  useEffect(() => {
    const changed = event => { if (event.key === 'kindred_data_revision') dispatch(refreshRequested()); };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, [dispatch]);
  useEffect(() => {
    const controller = new AbortController();
    for (const endpoint of new Set(Object.values(jobs))) requests.get(endpoint, { signal: controller.signal }).catch(() => {});
    return () => controller.abort();
  }, [jobs, requests, revision]);
  useEffect(() => {
    if (!Object.keys(jobs).length) return;
    const visibleRefresh = () => { if (document.visibilityState === 'visible') dispatch(refreshRequested()); };
    window.addEventListener('focus', visibleRefresh);
    document.addEventListener('visibilitychange', visibleRefresh);
    const timer = window.setInterval(visibleRefresh, jobs.programs || jobs.products || jobs.volunteers || jobs.volunteer ? 5000 : 15000);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', visibleRefresh); document.removeEventListener('visibilitychange', visibleRefresh); };
  }, [scope, jobs, dispatch]);
  const collections = Object.fromEntries(Object.entries(jobs).map(([key, endpoint]) => {
    const query = repositories[repositoryForPath(endpoint)].queries[queryKey(state, endpoint)];
    return [key, { data: query?.result === undefined ? [] : resolveReferences(query.result, state), endpoint, scope: query?.scope,
      loading: !query || ['idle', 'pending'].includes(query.status), error: query?.error || null }];
  }));
  const data = key => {
    const records = key === 'programs' && !['admin','superuser'].includes(session?.role)
      ? [...new Map([...collectionRecords(collections[key]?.data), ...collectionRecords(collections.memberPrograms?.data)].filter(Boolean).map(p => [p.id, p])).values()]
      : collectionRecords(collections[key]?.data).filter(Boolean);
    if (session?.role === 'beneficiary' && key === 'incoming') return records.filter(record => String(record.beneficiaryEmail || '').toLowerCase() === session.email.toLowerCase());
    return session?.role === 'admin' && ['orders','replacements'].includes(key) ? records.filter(record => !record.organizationName || record.organizationName === session.org) : records;
  };
  return { data, collections, jobs, revision, refresh };
}
