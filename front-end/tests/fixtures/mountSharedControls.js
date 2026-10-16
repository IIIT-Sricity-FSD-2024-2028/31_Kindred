/* global document */
import { StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '../../src/contexts/ToastProvider.jsx';
import SharedControls from './SharedControls.jsx';
// Test-only entry, never imported by the application or included in its build.
export function mountSharedControls() {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  root.render(createElement(StrictMode, null, createElement(ToastProvider, null, createElement(SharedControls))));
  return () => { root.unmount(); host.remove(); };
}
