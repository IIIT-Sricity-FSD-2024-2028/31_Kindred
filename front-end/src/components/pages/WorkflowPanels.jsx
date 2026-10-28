import Modal from '../ui/Modal.jsx';
import FulfillmentPanel from './FulfillmentPanel.jsx';
import { usePage } from '../../pages/runtime/PageContext.js';

const money = (n) => `INR ${Number(n || 0).toLocaleString('en-IN')}`;
const ready = {
  tasks: ['in-progress', 'pending_review'], subtasks: ['pending', 'in-progress'],
  orders: ['in_transit'], replacements: ['replacement_in_transit'],
  'resource-donations': ['in_transit'], incoming: ['assigned'], 'hour-logs': ['pending', 'rejected'],
};

function WorkProofs() {
  const ui = usePage(), admin = ui.session?.role === 'admin';
  const proofs = ui.data('proofs').filter(p => p.collection !== 'deliveries');
  const collections = [['tasks','tasks'],['subtasks','subtasks'],['orders','orders'],['replacements','replacements'],['resources','resource-donations'],['incoming','incoming'],['hours','hour-logs']];
  const work = collections.flatMap(([key,collection]) => ui.data(key).filter((r) => {
    if (ui.data('deliveries').some(d => d.sourceId === r.id && d.kind === ({orders:'order',resources:'collection'}[key]) && d.status !== 'cancelled')) return false;
    const email = r.assignedToEmail || r.assignedVolunteerEmail || r.volunteerEmail;
    return String(email || '').toLowerCase() === ui.session.email.toLowerCase() && ready[collection].includes(r.deliveryStatus || r.status);
  }).map((record) => ({ collection, record })));
  return <section className="workflow-section" aria-label="Work proof verification">
    <h2>{admin ? 'Verify Volunteer Work & Deliveries' : 'Work & Delivery Proof'}</h2>
    <p>Upload an image for each completed task, subtask, delivery or hour log. Completion is recorded after the responsible organization admin verifies it.</p>
    {ui.collections.proofs?.error && <p role="alert">{ui.collections.proofs.error} <button onClick={ui.refresh}>Retry</button></p>}
    {!admin && work.map(({ collection, record }) => {
      const proof = [...proofs].reverse().find((p) => p.collection === collection && p.recordId === record.id);
      return <article className="page-record-card" key={`${collection}/${record.id}`}><h3>{record.title || record.productTitle || record.category || record.type || record.description}</h3><p>{collection.replaceAll('-',' ')} · {record.programName || 'Organization work'}</p>{proof && <p>Proof: <strong>{proof.status}</strong></p>}{!proof || proof.status === 'rejected' ? <button className="btn-primary-sm" onClick={() => ui.action('openWorkProof',[collection,record.id])}>{proof ? 'Upload New Proof' : 'Upload Completion Proof'}</button> : <p>Awaiting organization verification.</p>}</article>;
    })}
    {proofs.filter((p) => admin || p.status === 'approved').map((p) => <article className="page-record-card proof-review-card" key={p.id}><div className="page-record-heading"><h3>{p.title}</h3><span className={`status-badge ${p.status}`}>{p.status}</span></div><p>{p.organization} · {p.volunteerEmail}</p><a className="proof-image-link" href={p.image} target="_blank" rel="noreferrer"><img className="work-proof-image" src={p.image} alt={`Completion proof for ${p.title}`} /><span>Open full-size proof image ↗</span></a>{admin && p.status === 'pending' && <div className="page-record-actions"><button className="btn-approve" onClick={() => ui.action('mutateRecord',['proofs',p.id,'approve'])}>Verify Proof & Complete</button><button className="btn-reject" onClick={() => ui.action('mutateRecord',['proofs',p.id,'reject'])}>Reject Proof</button></div>}</article>)}
    {!work.length && !proofs.length && <p className="page-empty">No work proofs awaiting submission or review.</p>}
  </section>;
}

function ProgramListingReviews() {
  const ui = usePage();
  return <section className="workflow-section" aria-label="Program listing requests"><h2>Public Program Listing Requests</h2>{ui.data('programs').filter((p) => p.listingStatus === 'pending').map((p) => <article className="page-record-card" key={p.id}><h3>{p.name}</h3><p>{p.org} · {p.location}</p><p>{p.description}</p>{p.image && <img className="work-proof-image" src={p.image} alt={`${p.name} proposed photo`} />}<div className="page-record-actions"><button className="btn-approve" onClick={() => ui.action('mutateRecord',['programs',p.id,'approve-listing'])}>Accept Program Listing</button><button className="btn-reject" onClick={() => ui.action('mutateRecord',['programs',p.id,'reject-listing'])}>Reject Program Listing</button></div></article>)}</section>;
}

function VolunteerProgress() {
  const ui = usePage();
  const assignments = ui.data('assignments').filter((a) => ['active','pending'].includes(a.status));
  return <section className="workflow-section volunteer-progress-workflow" aria-label="Volunteer progress">
    <div className="volunteer-progress-heading"><div><span className="volunteer-progress-eyebrow">Your impact</span><h2>Volunteer Progress</h2></div><p>Track accepted programs, assigned tasks, and reported progress.</p></div>
    {!assignments.length && <p className="page-empty">No program memberships yet.</p>}
    {assignments.map((assignment) => {
      const tasks = ui.data('tasks').filter((t) => t.programId === assignment.programId && t.assignedToEmail?.toLowerCase() === assignment.volunteerEmail.toLowerCase());
      const subtasks = ui.data('subtasks').filter((t) => t.programId === assignment.programId && t.assignedToEmail?.toLowerCase() === assignment.volunteerEmail.toLowerCase());
      const work = [...tasks, ...subtasks];
      const done = tasks.filter((t) => t.status === 'completed').length + subtasks.filter((t) => Number(t.progress) >= 100).length;
      const progress = work.length ? Math.round(done / work.length * 100) : 0;
      return <article className="volunteer-program-card" key={assignment.id}>
        <div className="volunteer-program-card-heading"><div><span className="volunteer-program-label">{assignment.status === 'active' ? 'Active program' : 'Invitation'}</span><h3>{assignment.programName}</h3></div><span className={assignment.status === 'active' ? 'volunteer-member-badge' : 'volunteer-task-status'}>{assignment.status === 'active' ? assignment.role || 'Volunteer' : 'Pending'}</span></div>
        {assignment.status === 'active' ? <>
          <div className="volunteer-program-progress-label"><span>Work completed</span><strong>{progress}%</strong></div><div className="volunteer-program-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${progress}%` }} /></div>
          <p className="volunteer-program-work-summary">{work.length ? `${done} of ${work.length} assigned ${work.length === 1 ? 'task' : 'tasks'} completed` : 'No tasks assigned yet.'}</p>
          {tasks.map((task) => <div className="volunteer-program-task" key={task.id}><span>{task.title}</span><span className={`volunteer-task-status status-${task.status}`}>{task.status.replaceAll('_',' ')}</span></div>)}
          {subtasks.map((task) => <div className="volunteer-program-task" key={task.id}><span>{task.title}</span><span className="volunteer-task-status">{Number(task.progress || 0)}%</span></div>)}
          {subtasks.length > 0 && <div className="page-record-actions volunteer-program-actions"><button className="action-btn" onClick={() => ui.action('openProgressReport',[assignment.programId])}>Report Progress</button></div>}
        </> : <div className="page-record-actions volunteer-program-actions"><button className="btn-approve" onClick={() => ui.action('respondProgramInvitation',[assignment.id,'accepted'])}>Accept Invitation</button><button className="btn-reject" onClick={() => ui.action('respondProgramInvitation',[assignment.id,'declined'])}>Decline Invitation</button></div>}
      </article>;
    })}
  </section>;
}

function Donations() {
  const ui = usePage(), admin = ui.session.role === 'admin';
  const donations = ui.data('donations');
  const org = ui.data('organizations').find((o) => o.name === ui.session.org);
  const balance = ui.data('balance')[0];
  return <section className="workflow-section" aria-label="Organization donations and certificates"><h2>{admin ? 'Donation Balance & Donor Thank-You Certificates' : 'My Donations & Thank-You Certificates'}</h2><p className="payment-demo-note">Card demo: these are recorded contributions, not settled bank funds.</p>
    {admin && <div className="page-record-card"><h3>{ui.session.org}</h3><p><strong>Recorded donation balance: {money(balance?.verifiedTotal ?? donations.filter((d) => d.status === 'paid').reduce((n,d) => n+d.amount,0))}</strong></p><p>Account holder: {org?.bankAccountName || 'Not configured'}</p><p>Account number: {org?.bankAccountNumber || 'Not configured'} · IFSC: {org?.bankIfsc || 'Not configured'}</p><button className="btn-outline-sm" onClick={() => ui.action('openOrgProfile')}>Edit Bank Details</button></div>}
    {ui.collections.donations?.error && <p role="alert">{ui.collections.donations.error} <button onClick={ui.refresh}>Retry</button></p>}
    {donations.map((d) => <article className="page-record-card donation-ledger-card" key={d.id}><h3>{d.org} · {money(d.amount)}</h3><p>{d.donor} · {d.email}</p><p>{d.id} · {d.date?.slice(0,10)} · {d.status}</p><p>Recipient account: {d.bankAccountName} · ending {d.bankAccountNumber?.slice(-4)} · {d.bankIfsc}</p>{admin && !d.certificateNumber && d.status === 'paid' && <button className="btn-primary-sm" onClick={() => ui.action('mutateRecord',['donations',d.id,'issue-certificate'])}>Issue Thank-You Certificate</button>}{d.certificateNumber && <button className="btn-outline-sm" onClick={() => ui.update({ modal: 'donorCertificate', donorCertificate: d })}>View Thank-You Certificate</button>}</article>)}
    {!donations.length && <p className="page-empty">No donations recorded yet.</p>}
  </section>;
}

export default function WorkflowPanels() {
  const ui = usePage(), session = ui.session;
  if (!session) return null;
  const dashboard = /dashboard|org-admin\.html|org-admin-overview|platform-admin/.test(ui.path);
  const admin = session.role === 'admin', platform = session.role === 'superuser';
  const orgAdminArea = admin && /org-admin|overview/.test(ui.path);
  const certificate = ui.state.donorCertificate;
  return <>
    {(dashboard || orgAdminArea || /resources|incoming/.test(ui.path)) && <FulfillmentPanel />}
    {dashboard && !admin && !platform && session.role !== 'volunteer' && <VolunteerProgress />}
    {(dashboard || orgAdminArea) && !platform && <WorkProofs />}
    {dashboard && !platform && <Donations />}
    {platform && ui.path === '/platform-admin.html' && ui.activeTab === 'requests' && <ProgramListingReviews />}
    <Modal open={ui.state.modal === 'workProof'} title="Upload Completion Proof" busy={ui.state.busy} onClose={() => ui.update({ modal: null })}><form onSubmit={(e) => { e.preventDefault(); ui.action('submitWorkProof'); }}><p>Upload a PNG, JPG or WebP image (up to 5 MB). The organization admin will review it.</p><label>Proof Image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => ui.selectFile('work-proof',e.target.files?.[0])} /></label>{ui.state.files['work-proof'] && <p>{ui.state.files['work-proof'].name}</p>}{ui.state.error && <p role="alert">{ui.state.error}</p>}<button className="btn-modal-save" disabled={ui.state.busy} type="submit">Submit Proof for Review</button></form></Modal>
    <Modal open={ui.state.modal === 'proofReview'} title="Organization Proof Review" onClose={() => ui.update({ modal: null })}><p>Completion requires image proof. Review pending proof cards in “Verify Volunteer Work & Deliveries” below.</p><button onClick={() => ui.update({ modal: null })}>Close</button></Modal>
    <Modal open={ui.state.modal === 'donorCertificate'} title="Donor Thank-You Certificate" className="donor-certificate-dialog" onClose={() => ui.update({ modal: null })}>{certificate && <><div className="donor-thankyou-certificate"><h2>{certificate.org}</h2><p>CERTIFICATE OF APPRECIATION</p><h1>Thank you, {certificate.donor}</h1><p>For your generous contribution of <strong>{money(certificate.amount)}</strong> to {certificate.org}.</p><p>Issued by the Organization Administrator</p><p>{certificate.certificateNumber} · {certificate.certificateIssuedAt?.slice(0,10)}</p><small>Card demo contribution · This is an appreciation certificate, not a tax receipt.</small></div><button className="btn-modal-save" onClick={() => window.print()}>Print / Save PDF</button></>}</Modal>
  </>;
}
