import { useCallback, useEffect, useState } from 'react';
import { ToastContext } from './ToastContext.js';

function Toast({ toast, dismiss }) {
  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(() => dismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast, dismiss]);
  return <div className={`toast ${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
    <div className="toast-icon" aria-hidden="true"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill={toast.type === 'success' ? '#dcfce7' : '#dbeafe'} />{toast.type === 'success' ? <path stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" /> : <path stroke="#2563eb" strokeWidth="2" d="M12 8v4m0 4h.01" />}</svg></div>
    <div><div className="toast-title">{toast.title}</div><div className="toast-body">{toast.body}</div></div>
    <button className="toast-close" type="button" aria-label="Dismiss notification" onClick={() => dismiss(toast.id)}>×</button>
  </div>;
}
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback(({ type = 'info', title, body, duration = 4000 }) => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, type, title, body, duration }].slice(-4));
    return id;
  }, []);
  const dismiss = useCallback((id) => setToasts((items) => items.filter((toast) => toast.id !== id)), []);
  return <ToastContext.Provider value={showToast}>{children}<div className="toast-stack" aria-label="Status messages">{toasts.map((toast) => <Toast key={toast.id} toast={toast} dismiss={dismiss} />)}</div></ToastContext.Provider>;
}
