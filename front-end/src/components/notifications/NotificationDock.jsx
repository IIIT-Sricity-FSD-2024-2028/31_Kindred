import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from '../../routes/navigation.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { useDismissable } from '../../hooks/useDismissable.js';
import { notificationsPath, safeNotificationLink } from '../../services/notifications.js';
import Modal from '../ui/Modal.jsx';

export default function NotificationDock() {
  const { session, api } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [readingId, setReadingId] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const reading = useRef(false);
  const close = useCallback(() => setOpen(false), []);
  useDismissable({ open, rootRef, triggerRef, onClose: close });
  useEffect(() => {
    if (session?.status !== 'approved') return;
    const controller = new AbortController();
    let active = true;
    let inFlight = false;
    async function load() {
      if (inFlight) return;
      inFlight = true;
      try {
        const records = await api.get(notificationsPath(session), { signal: controller.signal });
        if (!Array.isArray(records)) throw new Error('The server returned an invalid notification list.');
        if (active) { setItems(records); setError(''); }
      } catch (failure) {
        if (active && failure.name !== 'AbortError') setError(failure.message);
      } finally { inFlight = false; if (active) setLoading(false); }
    }
    load();
    const interval = setInterval(load, 15000);
    window.addEventListener('focus', load);
    return () => { active = false; controller.abort(); clearInterval(interval); window.removeEventListener('focus', load); };
  }, [api, session]);
  async function read(item) {
    if (reading.current) return;
    reading.current = true; setReadingId(item.id);
    try {
      if (!item.read) await api.patch(`/notifications/${encodeURIComponent(item.id)}/read`, {});
      setItems((records) => records.map((record) => record.id === item.id ? { ...record, read: true } : record));
      setOpen(false);
      const destination = safeNotificationLink(item.link);
      if (destination) navigate(destination);
      else setSelected(item);
    } catch (failure) {
      showToast({ type: 'error', title: 'Could not update notification', body: failure.message });
    } finally { reading.current = false; setReadingId(null); }
  }
  if (session?.status !== 'approved') return null;
  const unread = items.filter((item) => !item.read).length;
  return <>
    <div ref={rootRef} className="notification-dock">
      <button ref={triggerRef} type="button" className="notification-bell" title="Notifications" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} aria-expanded={open} aria-controls="notification-panel" onClick={() => setOpen((value) => !value)}>🔔{unread > 0 && <span className="notification-count">{unread}</span>}</button>
      {open && <div id="notification-panel" className="notification-panel" role="region" aria-label="Notifications" aria-busy={loading}>
        <div className="notification-heading">Notifications</div>
        {loading && <p className="notification-empty" role="status">Loading notifications…</p>}
        {error && <p className="notification-empty shared-error" role="alert">{error}</p>}
        {!loading && !error && !items.length && <p className="notification-empty">No notifications yet.</p>}
        {items.slice(0, 12).map((item) => <button type="button" key={item.id} className={`notification-item${item.read ? '' : ' unread'}`} disabled={readingId !== null} onClick={() => read(item)}>
          <span className="notification-title">{item.title}</span><span className="notification-message">{item.message}</span>{readingId === item.id && <span role="status">Please wait…</span>}
        </button>)}
      </div>}
    </div>
    <Modal open={selected !== null} title={selected?.title || 'Notification'} onClose={() => setSelected(null)} actions={<button type="button" className="btn-modal-save" onClick={() => setSelected(null)}>OK</button>}><p>{selected?.message}</p></Modal>
  </>;
}
