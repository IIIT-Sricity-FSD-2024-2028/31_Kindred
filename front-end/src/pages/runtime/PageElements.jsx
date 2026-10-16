import { useEffect, useRef, useState } from 'react';
import { usePage } from './PageContext.js';
import Modal from '../../components/ui/Modal.jsx';
import DashboardTabs from '../../components/navigation/DashboardTabs.jsx';
import PageRegions from '../../components/pages/PageRegions.jsx';

export { default as PageField } from './PageField.jsx';

export function PageModal({ name, children }) {
  const ui = usePage();
  const title = { 'donation-modal-overlay': 'Donate', resourceDonationModal: 'Donate Resources', 'resource-donate-modal': 'Donate Resources', 'request-modal': 'Submit New Request', checkoutModal: 'Checkout', shopDetailModal: 'Product Details', addProductModal: 'Add Product', applyModal: 'Apply to Program', logHoursModal: 'Log Volunteer Hours', addTaskModal: 'Add Task', 'broadcast-modal': 'Request Broadcast', inboxDetailOverlay: 'Submission Details' }[name] || 'Details';
  return <Modal open={ui.state.modal === name} title={title} busy={ui.state.busy} onClose={() => ui.update({ modal: null, error: '' })} preserveContent>
    {ui.state.error && <p className="page-action-error modal-error" role="alert">{ui.state.error}</p>}
    {children}
  </Modal>;
}

export function PageTabs() {
  const ui = usePage();
  const panelId = (id) => ui.path === '/donor-dashboard.html' ? 'tab-'+({ mypayments: 'payments', savedcards: 'cards' }[id] || id) : ui.path === '/org-admin.html' ? 'org-panel-'+id : ui.path === '/platform-admin.html' ? 'panel-'+id : ui.path === '/incoming.html' ? 'incoming-panel' : 'beneficiary-panel';
  return <DashboardTabs items={ui.tabs} activeId={ui.activeTab} onChange={ui.changeTab} panelId={panelId} />;
}
export function PageRegion({ name }) { return <PageRegions name={name} />; }

export function PageChart({ name }) {
  const ui = usePage();
  const records = name.toLowerCase().includes('vol') ? ui.data('volunteers') : ui.data('programs');
  const active = records.filter((r) => r.status === 'active').length;
  const pending = records.filter((r) => r.status === 'pending').length;
  const complete = records.length-active-pending;
  return <figure className="react-data-chart" aria-label="Record status chart">
    <svg viewBox="0 0 400 190" role="img" aria-label={`${records.length} records: ${active} active, ${pending} pending, ${complete} other`}>
      {[['Active',active,'#10b981'],['Pending',pending,'#f59e0b'],['Other',complete,'#6366f1']].map(([label,value,color],i) => <g key={label}><rect x={50+i*115} y={155-(value/Math.max(records.length,1))*120} width="55" height={Math.max(2,(value/Math.max(records.length,1))*120)} fill={color} rx="5"/><text x={77+i*115} y="178" textAnchor="middle" fontSize="12">{label} ({value})</text></g>)}
    </svg>
  </figure>;
}

export function AnimatedCounter({ target }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame, start;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      function step(timestamp) {
        start ??= timestamp;
        const progress = Math.min((timestamp-start)/1500,1);
        setCount(Math.floor((1-Math.pow(1-progress,3))*target));
        if (progress < 1) frame = requestAnimationFrame(step);
      }
      frame = requestAnimationFrame(step);
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [target]);
  return <div className="impact-number" data-target={target} ref={ref}>{count.toLocaleString()}</div>;
}
