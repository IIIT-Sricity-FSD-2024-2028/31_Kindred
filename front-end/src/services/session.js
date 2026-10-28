export const SESSION_KEY = 'kindred_session';

export const ROLE_DASHBOARDS = Object.freeze({
  superuser: '/platform-admin.html',
  admin: '/org-admin.html',
  volunteer: '/volunteer-dashboard.html',
  donor: '/donor-dashboard.html',
  beneficiary: '/beneficiary-dashboard.html',
  seller: '/seller-dashboard.html',
});

function sessionStorageOrNull() {
  try { return globalThis.sessionStorage ?? null; } catch { return null; }
}

export function normalizeSession(user) {
  if (!user || typeof user !== 'object' ||
      !Object.hasOwn(ROLE_DASHBOARDS, user.role) ||
      !['id', 'name', 'email'].every((key) => typeof user[key] === 'string' && user[key].trim())) return null;
  const status = user.status ?? 'approved';
  if (!['approved', 'pending', 'rejected'].includes(status)) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status,
    team: ['team1', 'team2'].includes(user.team) ? user.team : null,
    org: typeof user.org === 'string' ? user.org : null,
    phone: typeof user.phone === 'string' ? user.phone : '',
    bio: typeof user.bio === 'string' ? user.bio : '',
    skills: Array.isArray(user.skills) ? user.skills.filter((skill) => typeof skill === 'string') : [],
    initials: typeof user.initials === 'string' ? user.initials : user.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2),
    avatar: typeof user.avatar === 'string' ? user.avatar : '#1a3b5c',
    dashboard: ROLE_DASHBOARDS[user.role],
    authToken: typeof user.authToken === 'string' && user.authToken.length >= 32 ? user.authToken : null,
    loginTime: Number.isFinite(user.loginTime) ? user.loginTime : Date.now(),
  };
}

export function readSession(storage = sessionStorageOrNull()) {
  try {
    const raw = storage?.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = normalizeSession(JSON.parse(raw));
    if (!session || session.status === 'rejected') {
      clearSession(storage);
      return null;
    }
    return session;
  } catch {
    clearSession(storage);
    return null;
  }
}

export function writeSession(user, storage = sessionStorageOrNull()) {
  const session = normalizeSession(user);
  if (!session || session.status !== 'approved') throw new Error('Only approved users can sign in.');
  try { storage?.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* Keep the React session usable when browser storage is unavailable. */ }
  return session;
}

export function clearSession(storage = sessionStorageOrNull()) {
  try { storage?.removeItem(SESSION_KEY); } catch { /* Storage may be disabled. */ }
}
