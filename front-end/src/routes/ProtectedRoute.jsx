import { Navigate, useLocation } from './navigation.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getAccessRedirect } from './access.js';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { session } = useAuth();
  const location = useLocation();
  const redirect = getAccessRedirect(session, allowedRoles);
  return redirect ? <Navigate to={redirect} replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} /> : children;
}
