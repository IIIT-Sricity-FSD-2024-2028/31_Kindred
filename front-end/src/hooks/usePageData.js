import { useCallback, useEffect, useMemo, useState } from 'react';
import { pageRequests } from '../services/pageData.js';
import { collectionRecords, collectionScope, pageLoader } from '../services/pageLoaders.js';

export default function usePageData(path, session, api) {
  const [revision, setRevision] = useState(0);
  const [results, setResults] = useState({});
  const jobs = useMemo(() => pageRequests(path, session), [path, session]);
  const scope = collectionScope(path, session);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    const load = pageLoader(api, session, controller.signal);
    for (const [key, endpoint] of Object.entries(jobs)) {
      load(key, endpoint).then((data) => {
        if (!controller.signal.aborted) setResults((previous) => ({ ...previous, [key]: { data, endpoint, error: null, revision, scope } }));
      }).catch((error) => {
        if (!controller.signal.aborted) setResults((previous) => ({ ...previous, [key]: { data: [], endpoint, error: error.message, revision, scope } }));
      });
    }
    return () => controller.abort();
  }, [jobs, api, revision, session, scope]);
  useEffect(() => {
    if (!session || !Object.keys(jobs).length) return;
    const visibleRefresh = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener('focus', visibleRefresh);
    document.addEventListener('visibilitychange', visibleRefresh);
    const timer = window.setInterval(visibleRefresh, 15000);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', visibleRefresh); document.removeEventListener('visibilitychange', visibleRefresh); };
  }, [scope, session, jobs, refresh]);
  const collections = Object.fromEntries(Object.entries(jobs).map(([key, endpoint]) => {
    const result = results[key];
    const current = result?.scope === scope && result.endpoint === endpoint;
    const loading = !current || result.revision !== revision;
    return [key, current ? { ...result, loading, error: loading ? null : result.error } : { data: [], endpoint, loading: true, error: null }];
  }));
  const data = (key) => {
    const records = key === 'programs' && !['admin','superuser'].includes(session?.role) ? [...new Map([...collectionRecords(collections[key]?.data), ...collectionRecords(collections.memberPrograms?.data)].map((p) => [p.id,p])).values()] : collectionRecords(collections[key]?.data);
    if (session?.role === 'beneficiary' && key === 'incoming') {
      return records.filter((record) => String(record.beneficiaryEmail || '').toLowerCase() === String(session.email || '').toLowerCase());
    }
    return session?.role === 'admin' && ['orders','replacements'].includes(key) ? records.filter((r) => !r.organizationName || r.organizationName === session.org) : records;
  };
  return { data, collections, jobs, revision, refresh };
}
