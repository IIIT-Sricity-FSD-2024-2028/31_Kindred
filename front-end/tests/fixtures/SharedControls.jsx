import { useState } from 'react';
import Modal from '../../src/components/ui/Modal.jsx';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog.jsx';
import { useToast } from '../../src/hooks/useToast.js';

export default function SharedControls() {
  const [modal, setModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [fail, setFail] = useState(false);
  const [completed, setCompleted] = useState(0);
  const toast = useToast();
  return <div>
    <button onClick={() => setModal(true)}>Open test dialog</button>
    <button onClick={() => setConfirmation(true)}>Open test confirmation</button>
    <label><input type="checkbox" checked={fail} onChange={(event) => setFail(event.target.checked)} />Fail the test action</label>
    <p>Completed: {completed}</p>
    <button onClick={() => toast({ title: 'Test feedback', body: 'Test message', duration: 800 })}>Show test toast</button>
    <Modal open={modal} title="Test dialog" onClose={() => setModal(false)} actions={<button onClick={() => setModal(false)}>Done</button>}><label htmlFor="test-field">Test field</label><input id="test-field" /></Modal>
    <ConfirmDialog open={confirmation} title="Test confirmation" onClose={() => setConfirmation(false)} onConfirm={async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (fail) throw new Error('Test action failed');
      setCompleted((value) => value + 1);
    }}>Confirm the test action.</ConfirmDialog>
  </div>;
}
