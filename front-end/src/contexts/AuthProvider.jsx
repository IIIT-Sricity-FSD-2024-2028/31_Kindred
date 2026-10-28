import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext.js';
import { clearSession, readSession, SESSION_KEY, writeSession } from '../services/session.js';
import { authService } from '../services/auth.js';
import { createApiClient } from '../services/api.js';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === SESSION_KEY || event.key === null) setSession(readSession());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const signIn = useCallback(async (credentials, options) => {
    const user = await authService.signIn(credentials, options);
    const nextSession = writeSession(user);
    setSession(nextSession);
    return nextSession;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);
  const updateSession = useCallback((patch) => {
    if (!session) return;
    const next = writeSession({ ...session, ...patch, id: session.id, role: session.role, status: session.status, authToken: session.authToken });
    setSession(next);
  }, [session]);

  const api = useMemo(() => createApiClient({ getSession: () => session }), [session]);
  const value = useMemo(() => ({ session, signIn, signOut, updateSession, api }), [session, signIn, signOut, updateSession, api]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
