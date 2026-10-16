/* eslint-disable react-refresh/only-export-components -- Router adapter exports navigation components and their hook together. */
import { useCallback } from 'react';
import { Link as RouterLink, NavLink as RouterNavLink, Navigate as RouterNavigate, useNavigate as useRouterNavigate } from 'react-router-dom';
import { cleanDestination } from './cleanPaths.js';
export { useLocation } from 'react-router-dom';

export function Link({ to, ...props }) { return <RouterLink {...props} to={cleanDestination(to)} />; }
export function NavLink({ to, ...props }) { return <RouterNavLink {...props} to={cleanDestination(to)} />; }
export function Navigate({ to, ...props }) { return <RouterNavigate {...props} to={cleanDestination(to)} />; }
export function useNavigate() {
  const navigate = useRouterNavigate();
  return useCallback((to, options) => navigate(cleanDestination(to), options), [navigate]);
}
