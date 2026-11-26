import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from './AuthContext.js';
import { readSession, SESSION_KEY } from '../services/session.js';
import { signIn as signInThunk, signOut as signOutAction, updateSession as patchSession, sessionChanged } from '../store/slices/authSlice.js';
import { useRepositoryRequests } from '../store/hooks.js';

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const session = useSelector(state => state.auth.session);
  const requests = useRepositoryRequests();
  useEffect(() => {
    const handleStorage = event => { if (event.key === SESSION_KEY || event.key === null) dispatch(sessionChanged(readSession())); };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [dispatch]);
  const signIn = useCallback(async credentials => {
    try { return await dispatch(signInThunk(credentials)).unwrap(); }
    catch (failure) { throw new Error(typeof failure === 'string' ? failure : failure.message, { cause: failure }); }
  }, [dispatch]);
  const signOut = useCallback(() => dispatch(signOutAction()), [dispatch]);
  const updateSession = useCallback(patch => dispatch(patchSession(patch)), [dispatch]);
  // Compatibility for action modules: api dispatches thunks, with no transport here.
  const value = useMemo(() => ({ session, signIn, signOut, updateSession, requests, api: requests }), [session, signIn, signOut, updateSession, requests]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
