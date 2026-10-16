import { cleanPath } from '../routes/cleanPaths.js';
import { routeDefinitions } from '../routes/routeDefinitions.js';
export function notificationsPath(session) {
  const query = new URLSearchParams({ email: session.email, role: session.role, org: session.org || '' });
  return `/notifications?${query}`;
}
export function safeNotificationLink(link) {
  if (!link || typeof link !== 'string') return null;
  try {
    const url = new URL(link, 'https://kindred.local/');
    if (url.origin !== 'https://kindred.local' || (url.pathname !== '/' && !routeDefinitions.some((route) => cleanPath(route.path) === cleanPath(url.pathname)))) return null;
    return `${cleanPath(url.pathname)}${url.search}${url.hash}`;
  } catch { return null; }
}
