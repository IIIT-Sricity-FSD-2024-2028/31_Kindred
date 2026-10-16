import { useRef, useState } from 'react';
import Modal from './Modal.jsx';

function Confirmation({ title = 'Confirm Action', children, onConfirm, onClose, confirmLabel = 'Confirm' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  async function confirm() {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true); setError('');
    try { await onConfirm(); onClose(); } catch (failure) { setError(failure.message || 'The action could not be completed.'); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <Modal open title={title} onClose={onClose} busy={busy} actions={<>
    <button className="btn-modal-cancel" type="button" disabled={busy} onClick={onClose}>Cancel</button>
    <button className="btn-modal-save" type="button" disabled={busy} onClick={confirm}>{busy ? 'Please wait…' : confirmLabel}</button>
  </>}>
    {children}{error && <p role="alert" className="shared-error">{error}</p>}
  </Modal>;
}
export default function ConfirmDialog({ open, ...props }) {
  return open ? <Confirmation {...props} /> : null;
}
