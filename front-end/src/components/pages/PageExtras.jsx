import AnimatedPaymentCard from './AnimatedPaymentCard.jsx';
import PublicOrganizationFunding from './PublicOrganizationFunding.jsx';
import WorkflowPanels from './WorkflowPanels.jsx';
import Modal from '../ui/Modal.jsx';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import { usePage } from '../../pages/runtime/PageContext.js';
import { executeConfirmation } from '../../services/workflow.js';
import PageField from '../../pages/runtime/PageField.jsx';

function EditorField({ field, label, type = 'text', options, required = true }) {
  const spec = { id: field, required, type: options || type === 'textarea' ? undefined : type, 'aria-label': label };
  return <div className="field"><label htmlFor={field}>{label}</label><PageField as={options ? 'select' : type === 'textarea' ? 'textarea' : 'input'} field={field} spec={spec}>{options && <><option value="">Select...</option>{options.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</>}</PageField></div>;
}
function Editor() {
  const ui = usePage(), editor = ui.state.editor;
  if (!editor) return null;
  const task = editor.type === 'task', org = editor.type === 'organization', replacement = editor.type === 'replacement', allocate = editor.type === 'resourceAllocation', volunteer = editor.type === 'volunteer';
  const custom = { user: 'saveUser', cardDonation: 'executeDonation', orgProfile: 'saveOrgProfile', listingRequest: 'submitListingRequest', announcement: 'sendAnnouncement', subtask: 'saveSubtask', taskNotes: 'saveTaskNotes' }[editor.type];
  const submit = custom || (task ? 'saveTask' : org ? 'saveOrganization' : volunteer ? 'saveVolunteer' : replacement ? 'saveReplacement' : allocate ? 'saveAllocation' : 'saveAssignment');
  const programId = task ? ui.values['editor-program'] : editor.record?.programId;
  const members = ui.data('assignments').filter((a) => a.programId === programId && a.status === 'active');
  const volunteers = task || editor.type === 'subtask'
    ? members.map((a) => ({ email: a.volunteerEmail, name: a.volunteerName }))
    : ui.data('volunteers').filter((v) => !ui.session.org || v.org === ui.session.org);
  const replacementVolunteers = ui.data('deliveryVolunteers');
  return <Modal open title={editor.title} className={editor.type === 'cardDonation' ? 'inline-card-donation-dialog' : editor.type === 'replacement' || editor.type === 'replacementAssignment' ? 'replacement-dialog' : ''} busy={ui.state.busy} onClose={() => ui.update({ editor: null, error: '' })}>
    <form noValidate data-react-form aria-busy={ui.state.busy} onSubmit={(event) => { event.preventDefault(); ui.action(submit); }}>
      {ui.state.error && <p role="alert" className="page-action-error">{ui.state.error}</p>}
      {editor.type === 'user' ? <><EditorField field="editor-name" label="Full Name" /><EditorField field="editor-email" label="Email" type="email" /><EditorField field="editor-phone" label="Phone" required={false} /><EditorField field="editor-role" label="Role" options={['admin','volunteer','donor','beneficiary','seller'].map((v) => [v,v])} /><EditorField field="editor-org" label="Organization" required={false} /><EditorField field="editor-password" label={editor.record ? 'New Password (leave blank to keep current)' : 'Password'} type="password" required={!editor.record} />{editor.record && <p className="field-hint">Approval status is changed only through the confirmed Approve or Reject actions.</p>}</> :
      editor.type === 'cardDonation' ? <><AnimatedPaymentCard /><p className="donation-recipient">Recipient: <strong>{ui.state.donationOrg}</strong></p><p className="payment-demo-note">Card payment demo. Your donation is recorded against this organization; no money is charged or settled.</p><EditorField field="custom-amount" label="Donation Amount (INR)" type="number" /><EditorField field="donor-name" label="Donor Name" /><EditorField field="donor-email" label="Donor Email" type="email" /><EditorField field="card-number" label="Card Number" /><EditorField field="card-holder-name" label="Card Holder Name" /><EditorField field="card-expiry" label="Expiry (MM/YY)" /><EditorField field="card-cvv" label="CVV" type="password" /><p className="field-hint">Use demo card 4111 1111 1111 1111, a future expiry, and a 3-digit CVV.</p></> :
      editor.type === 'replacementAssignment' ? <><p className="replacement-help">{editor.record.assignedVolunteerEmail ? `Currently assigned to ${editor.record.assignedVolunteerName || editor.record.assignedVolunteerEmail}. Choose an active volunteer to reassign this pickup and delivery.` : 'Choose an active volunteer to collect the returned item and deliver its replacement.'}</p><EditorField field="editor-volunteer" label="Assign Volunteer" options={replacementVolunteers.map((v) => [v.email,`${v.name} (${v.email})`])} /><p className="field-hint">Only active volunteers are available.</p></> :
      editor.type === 'listingRequest' ? <><p>Submit your bank details for platform admin review. Your organization appears in the public directory after approval.</p><EditorField field="op-bankAccountName" label="Bank Account Holder Name" /><EditorField field="op-bankAccountNumber" label="Bank Account Number" /><EditorField field="op-bankIfsc" label="Bank IFSC Code" /><label>Organization Photo (optional)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => ui.selectFile('op-image',e.target.files[0])} /></label></> :
      editor.type === 'orgProfile' ? <><EditorField field="op-upiId" label="UPI ID" required={false} /><EditorField field="op-bankAccountName" label="Account Name" required={false} /><EditorField field="op-bankAccountNumber" label="Account Number" required={false} /><EditorField field="op-bankIfsc" label="IFSC" required={false} /><EditorField field="op-neededResources" label="Resources Required" type="textarea" required={false} /><label>Organization Image<input type="file" accept="image/*" onChange={(e) => ui.selectFile('op-image',e.target.files[0])} /></label></> :
      editor.type === 'announcement' ? <><EditorField field="announce-target" label="Recipient" options={[["all","Everyone"],...['volunteer','donor','beneficiary','admin','seller'].map((r) => ['role:'+r,'All '+r+'s']),...ui.data('users').map((u) => ['email:'+u.email,`${u.name} — ${u.email}`])]} /><EditorField field="announce-title" label="Title" /><EditorField field="announce-message" label="Message" type="textarea" /></> :
      editor.type === 'taskNotes' ? <EditorField field="editor-notes" label="Progress Notes" type="textarea" /> :
      editor.type === 'subtask' ? <><p className="field-hint">Only accepted members of this program are shown.{!volunteers.length && ' Invite volunteers and wait for acceptance first.'}</p><EditorField field="editor-title" label="Subtask Title" /><EditorField field="editor-description" label="Description" type="textarea" required={false} /><EditorField field="editor-volunteer" label="Assigned Volunteer" options={volunteers.map((v) => [v.email,v.name])} /></> :
      org ? <><EditorField field="editor-name" label="Organization Name" /><EditorField field="editor-focus" label="Focus Area" /><EditorField field="editor-email" label="Email" type="email" /><EditorField field="editor-phone" label="Phone" /><EditorField field="editor-city" label="City" /></> : volunteer ? <><EditorField field="editor-name" label="Full Name" /><EditorField field="editor-email" label="Email" type="email" /><EditorField field="editor-phone" label="Phone" /><EditorField field="editor-volunteer-role" label="Volunteer Role" /><EditorField field="editor-volunteer-skills" label="Skills (comma separated)" required={false} /></> : replacement ? <><EditorField field="editor-reason" label="Reason" options={['Damaged','Wrong Item','Defective','Other'].map((v) => [v,v])} /><EditorField field="editor-description" label="Description" type="textarea" /><label className="replacement-photo-field">Photo proof of the issue<input type="file" accept="image/png,image/jpeg,image/webp" required onChange={(e) => ui.selectFile('replacement-photo',e.target.files?.[0])} /><small>Upload a clear PNG, JPG or WebP photo (up to 5 MB).</small></label></> : <>
        {task && <><EditorField field="editor-title" label="Task Title" /><EditorField field="editor-description" label="Description" type="textarea" required={false} /></>}
        {(task || allocate) && <EditorField field="editor-program" label="Program" options={ui.data('programs').filter((p) => !ui.session.org || p.org === ui.session.org).map((p) => [p.id,p.name])} />}
        {!allocate && <EditorField field="editor-volunteer" label="Volunteer" options={volunteers.map((v) => [v.email,`${v.name} (${v.email})`])} />}
        {task && <p className="field-hint">Only volunteers who accepted an invitation to the selected program can be assigned tasks.{programId && !volunteers.length && ' No accepted volunteers yet.'}</p>}
        {task && <><EditorField field="editor-priority" label="Priority" options={['low','medium','high'].map((v) => [v,v])} /><EditorField field="editor-date" label="Due Date" type="date" required={false} /><EditorField field="editor-location" label="Location" required={false} /></>}
      </>}
      <div className="modal-actions"><button type="button" className="btn-modal-cancel" disabled={ui.state.busy} onClick={() => ui.update({ editor: null })}>Cancel</button><button type="submit" className="btn-modal-save" disabled={ui.state.busy}>{ui.state.busy ? 'Saving…' : 'Save'}</button></div>
    </form>
  </Modal>;
}

function RecordDetail() {
  const ui = usePage(), detail = ui.state.detail;
  const excluded = ['password','cardNumber','cvv'];
  return <Modal open={ui.state.modal === 'recordDetail'} title={detail?.name || detail?.title || detail?.type || 'Details'} onClose={() => ui.update({ modal: null, detail: null })}>
    {detail && <dl className="page-record-detail">{Object.entries(detail).filter(([key,value]) => !excluded.includes(key) && value !== null && value !== '' && (typeof value !== 'object' || Array.isArray(value))).map(([key,value]) => <div key={key}><dt>{key.replace(/([A-Z])/g,' $1')}</dt><dd>{Array.isArray(value) ? value.join(', ') : String(value)}</dd></div>)}</dl>}
    {ui.state.detailCollection === 'programs' && <><h4>Program Volunteers</h4>{ui.data('assignments').filter((a) => a.programId === detail.id && ['active','pending'].includes(a.status)).map((a) => <p key={a.id}>{a.volunteerName} — {a.status === 'active' ? 'Accepted' : 'Awaiting acceptance'}</p>)}<button className="action-btn action-edit" onClick={() => ui.action('editProgram',[detail.id])}>Manage Invitations</button><h4>Subtasks</h4>{ui.data('subtasks').filter((t) => t.programId === detail.id).map((t) => <p key={t.id}>{t.title} — {t.assignedToName} — {t.progress || 0}%</p>)}<button className="action-btn action-edit" onClick={() => ui.action('addSubtask',[detail.id])}>Add Subtask</button></>}
    <button className="btn-modal-cancel" onClick={() => ui.update({ modal: null })}>Close</button>
  </Modal>;
}

function VolunteerReports() {
  const ui = usePage(), program = ui.state.progressProgram, certificate = ui.state.certificateProgram;
  return <>
    <Modal open={ui.state.modal === 'progressReport'} title="Report Progress" busy={ui.state.busy} onClose={() => ui.update({ modal: null })}>
      <h4>{program?.name}</h4>
      {ui.data('subtasks').filter((t) => t.programId === program?.id && (ui.session?.role !== 'volunteer' || t.assignedToEmail?.toLowerCase() === ui.session.email.toLowerCase())).map((t) => <label className="page-progress-field" key={t.id}>{t.title} — {ui.state.progressDraft?.[t.id] || 0}%<input aria-label={`Progress: ${t.title}`} type="range" min="0" max="100" value={ui.state.progressDraft?.[t.id] || 0} onChange={(e) => ui.update({ progressDraft: { ...ui.state.progressDraft,[t.id]:Number(e.target.value) } })} /></label>)}
      {ui.state.error && <p role="alert">{ui.state.error}</p>}
      <button className="btn-modal-save" disabled={ui.state.busy} onClick={() => ui.action('saveProgressReport')}>Save Progress</button>
    </Modal>
    <Modal open={ui.state.modal === 'certificate'} title="Certificate of Completion" className="certificate-dialog" onClose={() => ui.update({ modal: null })}>
      <div className="completion-certificate"><div className="certificate-logo">Kindred</div><h1>CERTIFICATE OF COMPLETION</h1><h3>PROUDLY PRESENTED TO</h3><h2>{ui.session?.name}</h2><p>For successfully completing all assigned subtasks and dedicating their time to the<br /><strong>{certificate?.name}</strong><br />program organized by <strong>{certificate?.org}</strong>.</p><div className="certificate-signatures"><div>Organization Admin<br />{certificate?.org}</div><div>Platform Admin<br />Kindred India</div></div></div>
      <button className="btn-modal-save" onClick={() => window.print()}>Print / Save PDF</button>
    </Modal>
  </>;
}

function OperationalSections() {
  const ui = usePage(), { session, activeTab } = ui;
  const volunteer = session?.role === 'volunteer', admin = ['admin','superuser'].includes(session?.role), donor = session?.role === 'donor', seller = session?.role === 'seller';
  if (!/dashboard|org-admin\.html|platform-admin\.html/.test(ui.path)) return null;
  if (admin && !['resources','shop'].includes(activeTab)) return null;
  if (donor && !['resources','mypayments'].includes(activeTab)) return null;
  const orders = ui.data('orders'), replacements = ui.data('replacements');
  const transitions = { assigned: 'pickup_started', pickup_started: 'picked_up', picked_up: 'in_transit', in_transit: 'delivered' };
  const replacementTransitions = { volunteer_assigned: 'return_pickup', return_pickup: 'replacement_in_transit', replacement_in_transit: 'replaced' };
  return <div className="page-operational-sections">
    {volunteer && ui.data('volunteerRequests').length > 0 && <section><h2>Volunteer Requests</h2>{ui.data('volunteerRequests').map((r) => <article className="page-record-card" key={r.id}><h3>{r.title}</h3><p>{r.description}</p><p>{r.location} • {r.date}</p><button className="btn-approve" onClick={() => ui.action('respondVolunteerRequest',[r.id,'accepted'])}>Accept</button><button className="btn-reject" onClick={() => ui.action('respondVolunteerRequest',[r.id,'rejected'])}>Decline</button></article>)}</section>}
    {(orders.length > 0 || donor || seller) && <section className="shop-orders-section"><h2>{volunteer ? 'Assigned Deliveries' : 'Shop Orders'}</h2>{!orders.length && <p className="page-empty">No orders found.</p>}{orders.map((o) => <article className={`page-record-card order-record-card status-${o.deliveryStatus}`} key={o.id} data-order-id={o.id}><div className="page-record-heading"><h3>{o.productTitle}</h3><span className={`status-badge ${o.deliveryStatus}`}>{o.deliveryStatus.replaceAll('_',' ')}</span></div><p>{o.id} • {o.quantity} item(s) • ₹{Number(o.total).toLocaleString('en-IN')}</p><p>{o.buyerName} • {o.address}</p><div className="page-record-actions">{admin && o.deliveryStatus === 'awaiting_admin_assignment' && <a className="action-btn action-edit order-assign" href="#resource-deliveries">Arrange Delivery</a>}{!ui.data('deliveries').some(d => d.kind === 'order' && d.sourceId === o.id) && (volunteer || admin) && transitions[o.deliveryStatus] && <button className="action-btn action-success" onClick={() => ui.action('updateOrderStatus',[o.id,transitions[o.deliveryStatus]])}>{transitions[o.deliveryStatus].replaceAll('_',' ')}</button>}{donor && o.deliveryStatus === 'delivered' && <button className="action-btn action-edit" onClick={() => ui.action('requestReplacement',[o.id])}>Request Replacement</button>}</div></article>)}</section>}
    {replacements.length > 0 && <section className="replacement-requests-section"><h2>Replacement Requests</h2>{replacements.map((r) => <article className="page-record-card replacement-record-card" key={r.id}><div className="replacement-record-main"><div className="page-record-heading"><h3>{r.productTitle || r.orderId}</h3><span className={`status-badge ${r.status}`}>{r.status.replaceAll('_',' ')}</span></div><p>{r.reason} · {r.description}</p><p>Buyer: {r.buyerName}</p>{r.assignedVolunteerName && <p>Volunteer: {r.assignedVolunteerName}</p>}{r.imageUrl && <a className="replacement-proof-link" href={r.imageUrl} target="_blank" rel="noreferrer"><img className="replacement-proof-image" src={r.imageUrl} alt={`Buyer photo proof for ${r.productTitle || r.orderId}`} />View buyer photo proof</a>}</div><div className="page-record-actions replacement-actions">{(admin || seller) && ['requested','approved'].includes(r.status) && <button className="action-btn action-edit" onClick={() => ui.action('assignReplacement',[r.id])}>Assign Volunteer</button>}{(admin || seller) && r.status === 'volunteer_assigned' && <button className="action-btn action-edit" onClick={() => ui.action('assignReplacement',[r.id])}>Reassign Volunteer</button>}{admin && r.status === 'requested' && <><button className="btn-approve" onClick={() => ui.action('mutateRecord',['replacements',r.id,'approve'])}>Approve</button><button className="btn-reject" onClick={() => ui.action('mutateRecord',['replacements',r.id,'reject'])}>Reject</button></>}{volunteer && replacementTransitions[r.status] && <button className="action-btn" onClick={() => ui.action('updateReplacementStatus',[r.id,replacementTransitions[r.status]])}>{replacementTransitions[r.status].replaceAll('_',' ')}</button>}</div></article>)}</section>}
  </div>;
}

export default function PageExtras({ inlineError = false }) {
  const ui = usePage(), confirm = ui.state.confirmation;
  // These long, centered forms already expose the error through the toast and
  // beside the invalid field. Rendering another alert as a sibling of their
  // flex layout turns it into a tall second column.
  const usesCompactFormErrors = ['/signup.html', '/join-volunteer.html', '/emergency-request.html'].includes(ui.path);
  return <>
    {ui.state.error && !inlineError && !usesCompactFormErrors && !ui.state.modal && !ui.state.editor && <p role="alert" className="page-action-error">{ui.state.error}</p>}
    {['/profile.html','/organization-details.html'].includes(ui.path) && Object.entries(ui.collections).filter(([,result]) => result.error).map(([key,result]) => <p role="alert" className="page-action-error" key={key}>{result.error} <button type="button" onClick={ui.refresh}>Retry</button></p>)}
    <OperationalSections />
    <WorkflowPanels />
    <PublicOrganizationFunding />
    {ui.session?.role === 'superuser' && ui.path === '/admin-users.html' && <button className="btn-add-org" onClick={() => ui.action('openUserEditor')}>+ Create User</button>}
    <Editor /><RecordDetail /><VolunteerReports />
    <ConfirmDialog open={Boolean(confirm)} onClose={() => ui.update({ confirmation: null })} onConfirm={async () => { if (!confirm) return; await executeConfirmation(ui.api,confirm); ui.refresh(); ui.update({ confirmation: null }); ui.toast({ type: 'success', title: 'Record updated' }); }}>{confirm?.message}</ConfirmDialog>
  </>;
}
