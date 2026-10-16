import { useEffect } from 'react';

export function useDismissable({ open, rootRef, onClose, triggerRef }) {
  useEffect(() => {
    if (!open) return;
    const pointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) onClose();
    };
    const keyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        triggerRef?.current?.focus();
      }
    };
    document.addEventListener('pointerdown', pointerDown);
    document.addEventListener('keydown', keyDown);
    return () => {
      document.removeEventListener('pointerdown', pointerDown);
      document.removeEventListener('keydown', keyDown);
    };
  }, [open, rootRef, onClose, triggerRef]);
}
