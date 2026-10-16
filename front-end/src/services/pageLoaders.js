const sameEmail = (first, second) => String(first || '').toLowerCase() === String(second || '').toLowerCase();

// Login users and seller profiles have independently generated IDs.
export function pageLoader(api, session, signal) {
  let sellers;
  const getSellers = () => sellers ??= api.get('/sellers', { signal });
  return async (key, endpoint) => {
    if (session?.role === 'seller' && ['sellers','products','orders','replacements'].includes(key)) {
      const records = await getSellers();
      const seller = records.find((record) => sameEmail(record.email, session.email));
      if (key === 'sellers') return seller ? [seller] : [];
      if (!seller) return [];
      const path = key === 'replacements' ? `/replacements/by-seller/${encodeURIComponent(seller.id)}` : `/${key}?sellerId=${encodeURIComponent(seller.id)}`;
      return api.get(path, { signal });
    }
    return api.get(endpoint, { signal });
  };
}
export function collectionRecords(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}
export function collectionScope(path, session) {
  return JSON.stringify([path, session?.id, session?.email, session?.role, session?.org]);
}
