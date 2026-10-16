import { Route, Routes, useLocation } from 'react-router-dom';
import { Navigate } from './routes/navigation.jsx';
import { cleanPath } from './routes/cleanPaths.js';
import { routeDefinitions } from './routes/routeDefinitions.js';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PageView from './pages/PageView.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SiteLayout from './layouts/SiteLayout.jsx';

export default function App() {
  const location = useLocation();
  return (
    <Routes>
      {routeDefinitions.map((route) => (
        <Route key={route.path} path={cleanPath(route.path)} element={
          <ProtectedRoute allowedRoles={route.roles}>
            <SiteLayout route={route}><PageView key={route.path} route={route} /></SiteLayout>
          </ProtectedRoute>
        } />
      ))}
      {routeDefinitions.map((route) => <Route key={`legacy:${route.path}`} path={route.path} element={<Navigate to={`${cleanPath(route.path)}${location.search}${location.hash}`} replace state={location.state} />} />)}
      <Route path="/index" element={<Navigate to={`/${location.search}${location.hash}`} replace />} />
      <Route path="*" element={<SiteLayout route={routeDefinitions.find((route) => route.path === '/index.html')}><NotFoundPage /></SiteLayout>} />
    </Routes>
  );
}
