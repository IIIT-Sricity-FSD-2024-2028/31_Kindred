export function cleanPath(path) {
  if (typeof path !== 'string' || /^(?:[a-z]+:|\/\/)/i.test(path)) return path;
  const [, pathname, suffix] = /^([^?#]*)(.*)$/.exec(path);
  const clean = pathname === '/index.html' || pathname === 'index.html' ? '/' : pathname.replace(/\.html$/, '');
  return clean + suffix;
}
export function cleanDestination(to) {
  if (typeof to === 'string') return cleanPath(to);
  return to && typeof to === 'object' ? { ...to, ...(to.pathname ? { pathname: cleanPath(to.pathname) } : {}) } : to;
}
