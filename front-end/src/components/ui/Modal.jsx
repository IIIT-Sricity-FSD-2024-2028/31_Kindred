import { useId, useLayoutEffect, useRef } from 'react';

let scrollLocks = 0;
let previousOverflow;
export default function Modal({ open, title, children, onClose, actions, busy = false, className = '', preserveContent = false }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  useLayoutEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const focused = document.activeElement;
    if (scrollLocks++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
    dialog.showModal();
    return () => {
      dialog.close();
      if (--scrollLocks === 0) document.body.style.overflow = previousOverflow;
      if (focused?.isConnected) focused.focus();
    };
  }, [open]);
  if (!open) return null;
  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')].filter((element) => element.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <dialog ref={dialogRef} className="modal-overlay react-modal" aria-labelledby={preserveContent ? undefined : titleId} aria-label={preserveContent ? title : undefined} aria-busy={busy} onKeyDown={trapFocus} onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }} onClick={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    {preserveContent ? children : <div className={`modal-box ${className}`}>
      <div className="modal-header"><h3 id={titleId}>{title}</h3><button className="modal-close-btn" type="button" aria-label="Close dialog" disabled={busy} onClick={onClose}>×</button></div>
      <div className="modal-body">{children}</div>
      {actions && <div className="modal-actions">{actions}</div>}
    </div>}
  </dialog>;
}
