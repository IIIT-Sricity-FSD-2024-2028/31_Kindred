import { ROLE_DASHBOARDS } from '../services/session.js';

export function getAccessRedirect(session, allowedRoles) {
  if (!allowedRoles?.length) return null;
  if (!session || !Object.hasOwn(ROLE_DASHBOARDS, session.role) || session.status === 'rejected') return '/signin.html';
  if (session.status === 'pending') return '/registration-pending.html';
  if (session.status !== 'approved') return '/signin.html';
  if (!allowedRoles.includes(session.role)) return ROLE_DASHBOARDS[session.role];
  return null;
}
