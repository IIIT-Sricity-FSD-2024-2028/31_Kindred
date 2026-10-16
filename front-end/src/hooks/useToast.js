import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext.js';
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider.');
  return context;
}
