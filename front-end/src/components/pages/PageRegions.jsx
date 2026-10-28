import { Link } from '../../routes/navigation.jsx';
import PageField from '../../pages/runtime/PageField.jsx';
import { usePage } from '../../pages/runtime/PageContext.js';
import { API_BASE_URL } from '../../services/api.js';
import { hasBankDetails } from '../../services/organizations.js';
import { filterRecords } from '../../services/pageData.js';
import { OrganizationCards, ProgramCards, ProductCards, ProductDetail, Testimonials } from './PublicRegions.jsx';

const money = (n) => '₹'+Number(n || 0).toLocaleString('en-IN');
const skills = ['Medical Aid','Teaching','Field Work','Logistics','Community Outreach','Technology','Environment','Cooking','Counseling','Construction','Administration','Translation'];
const categories = ['Food & Nutrition','Medical Aid','Shelter & Housing','Disaster Relief','Education','Livelihood','Women & Children','Environment','Healthcare','Youth Empowerment','Community Development'];

function Action({ name, args, children, className = 'action-btn', disabled = false }) {
  const ui = usePage();
  const label = typeof children === 'string' ? children.toLowerCase() : '';
  const variant = /delete|reject|decline|remove/.test(label) ? 'danger'
    : /accept|approve|resolve|complete|activate/.test(label) ? 'success'
      : /edit|assign|allocate|update|notes/.test(label) ? 'edit'
        : /view|detail|report/.test(label) ? 'view' : 'neutral';
  return <button type="button" className={`${className} action-${variant}`} disabled={ui.state.busy || disabled} onClick={() => ui.action(name,args)}>{children}</button>;
}
function Mutate({ collection, id, operation, children }) { return <Action name="mutateRecord" args={[collection,id,operation]} className={['approve','accept','resolve','complete'].includes(operation) ? 'btn-approve' : ['reject','decline','delete'].includes(operation) ? 'btn-reject' : 'action-btn'}>{children || operation}</Action>; }
function Empty({ table, children = 'No records found.' }) { return table ? <tr><td colSpan={20} className="page-empty">{children}</td></tr> : <p className="page-empty">{children}</p>; }
function CollectionState({ collection, table, children, empty }) {
  const ui = usePage(), result = ui.collections[collection];
  if (ui.jobs[collection] && (!result || result.loading && !ui.data(collection).length)) return <Empty table={table}><span role="status">Loading…</span></Empty>;
  if (result?.error) return <Empty table={table}><span role="alert">{result.error}</span> <button type="button" onClick={ui.refresh}>Retry</button></Empty>;
  return children?.length === 0 ? <Empty table={table}>{empty || 'No records found.'}</Empty> : children;
}

function OrganizationRows({ records }) {
  const ui = usePage();
  return records.map((o) => <tr key={o.id}><td><div className="org-info"><img className="org-avatar ngo-fallback-image" src={o.image || '/images/ngo-placeholder.svg'} alt={`${o.name} NGO`} /><div><div className="org-name">{o.name}</div><div className="org-joined">Joined {o.joined}</div></div></div></td><td>{[o.focus].flat().join(', ')}</td><td><span className={`status-badge ${o.status}`}>{o.status}</span></td><td>{o.volunteers}</td><td>{o.beneficiaries}</td><td>{o.rating || '—'}</td><td><div className="action-btns"><Link className="action-btn action-view" to={`/organization-details.html?id=${o.id}`}>View</Link><Action name="openOrgModal" args={[o.id]}>Edit</Action>{ui.session?.role === 'superuser' && <Mutate collection="organizations" id={o.id} operation="delete">Delete</Mutate>}</div></td></tr>);
}
function UserRows({ records }) {
  const ui = usePage(), platform = ui.path === '/platform-admin.html';
  return records.map((u) => <tr key={u.id}><td><strong>{u.name}</strong>{!platform && <div>{u.email}</div>}</td>{platform ? <><td>{u.email}</td><td>{u.role}</td><td>{u.org || '—'}</td><td><span className={`status-badge ${u.status}`}>{u.status}</span></td></> : <><td>{u.role}</td><td><span className={`status-badge ${u.status}`}>{u.status}</span></td><td>{u.org || 'Registration'}</td><td>{u.registeredAt?.slice(0,10) || '—'}</td></>}<td><div className="action-btns"><Action name="showDetail" args={['users',u.id]}>View</Action><Action name="openUserEditor" args={[u.id]}>Edit</Action>{u.status !== 'approved' && <Mutate collection="users" id={u.id} operation="approve">Approve</Mutate>}{u.status !== 'rejected' && <Mutate collection="users" id={u.id} operation="reject">Reject</Mutate>}<Mutate collection="users" id={u.id} operation="delete">Delete</Mutate></div></td></tr>);
}
function VolunteerRows({ records, region }) {
  const ui = usePage(), overview = region === 'orgOverviewVolunteersBody', orgTable = region === 'orgVolunteersTableBody';
  return records.map((v) => <tr className={`volunteer-row status-${v.status}`} key={v.id}><td><strong>{v.name}</strong><div>{v.email}</div></td><td>{v.role}</td>{overview || orgTable ? <><td>{(v.skills || []).join(', ')}</td><td>{v.hours || 0}</td>{orgTable && <td><span className={`status-badge ${v.status}`}>{v.status}</span></td>}</> : <><td><span className={`status-badge ${v.status}`}>{v.status}</span></td><td>{v.hours || 0}</td><td>{ui.data('tasks').filter((t) => t.assignedToEmail === v.email && t.status !== 'completed').length}</td></>}{!overview && <td><div className="action-btns">{v.membershipOnly ? <Action name="openGlobalTaskModal" args={[v.email]}>+ Assign Task</Action> : <><Action name="showDetail" args={['volunteers',v.id]}>Details</Action><Action name="openVolunteerEditor" args={[v.id]}>Edit</Action><Mutate collection="volunteers" id={v.id} operation="delete">Delete</Mutate><Action name="openGlobalTaskModal" args={[v.id]}>+ Assign Task</Action></>}</div></td>}</tr>);
}
function IncomingCards({ records, registration = false }) {
  const ui = usePage();
  return records.map((r) => <article className={ui.path === '/incoming.html' ? `request-card request-item priority-${r.urgency || 'medium'} status-${r.status}` : `request-card status-${r.status}`} key={r.id} data-record-id={r.id}><div className="request-info"><div className="request-id">{r.id}</div><h4>{r.type}</h4><strong>{r.name || r.org}</strong><p className="request-desc">{r.desc || r.description}</p><p className="request-meta">{r.location || r.city} • {r.date}</p></div><div className="request-badges"><span className={`status-badge ${r.status}`}>{r.status}</span></div><div className="action-btns"><Action name="showDetail" args={[registration ? 'requests' : 'incoming',r.id]}>Details</Action>{r.status === 'pending' && <><Mutate collection={registration ? 'requests' : 'incoming'} id={r.id} operation={registration ? 'approve' : 'accept'}>{registration ? 'Approve' : 'Accept'}</Mutate><Mutate collection={registration ? 'requests' : 'incoming'} id={r.id} operation={registration ? 'reject' : 'decline'}>{registration ? 'Reject' : 'Decline'}</Mutate></>}{!registration && ['admin','superuser'].includes(ui.session?.role) && r.status === 'accepted' && <><Action name="assignIncoming" args={[r.id]}>Assign Volunteer</Action><Mutate collection="incoming" id={r.id} operation="resolve">Resolve</Mutate></>}</div></article>);
}
function OrganizationCertificate({ organization }) {
  if (!organization.certificateUrl) return <p className="certificate-missing">No registration certificate is attached.</p>;
  const url = organization.certificateUrl;
  let trustedUpload = false;
  try { const parsed = new URL(url); trustedUpload = parsed.origin === new URL(API_BASE_URL).origin && parsed.pathname.startsWith('/uploads/'); } catch { /* Keep untrusted values as plain links only. */ }
  const isImage = trustedUpload && /\.(png|jpe?g)(?:[?#]|$)/i.test(url);
  const isPdf = trustedUpload && /\.pdf(?:[?#]|$)/i.test(url);
  return <div className="organization-certificate-preview">
    <div className="organization-certificate-heading"><strong>Registration certificate</strong><a href={url} target="_blank" rel="noreferrer">{organization.certificateName || 'Open certificate'}</a></div>
    {isImage ? <a href={url} target="_blank" rel="noreferrer"><img src={url} alt={`${organization.name} registration certificate`} /></a> : isPdf ? <iframe src={url} title={`${organization.name} registration certificate`} loading="lazy" /> : <p className="certificate-missing">Preview is unavailable. Open the certificate link above.</p>}
  </div>;
}
function InboxRows({ records }) {
  const ui = usePage(), platform = ui.path === '/platform-admin.html';
  return records.map((r) => <tr key={r.id}><td>{r.type}</td><td>{r.name}</td><td>{r.desc}</td><td>{r.date}</td>{!platform && <td><span className={`status-badge ${r.status}`}>{r.status}</span></td>}<td><div className="action-btns"><Action name="showDetail" args={['incoming',r.id]}>View</Action>{r.status !== 'resolved' && <Mutate collection="incoming" id={r.id} operation="resolve">Resolve</Mutate>}</div></td></tr>);
}
function ResourceCards({ records, table }) {
  const ui = usePage();
  const admin = ['admin','superuser'].includes(ui.session?.role), volunteer = ui.session?.role === 'volunteer';
  return records.filter(r => r.category !== 'Shop Delivery').map((r) => {
    const shared = ui.data('deliveries').some(d => d.kind === 'collection' && d.sourceId === r.id);
    const actions = <div className="page-record-actions"><Action name="showDetail" args={['resources',r.id]}>Details</Action>{admin && ['submitted','pending_pickup'].includes(r.status) && <a href="#resource-deliveries" className="action-btn resource-assign">Arrange Collection</a>}{admin && <Action name="allocateResource" args={[r.id]} className="action-btn resource-allocate">Allocate to Program</Action>}{!shared && (admin || volunteer) && r.status === 'pending_pickup' && <Mutate collection="resource-donations" id={r.id} operation="start-pickup">Start Pickup</Mutate>}{!shared && (admin || volunteer) && r.status === 'in_transit' && <Mutate collection="resource-donations" id={r.id} operation="mark-delivered">Mark Delivered</Mutate>}{admin && r.status === 'delivered' && <Mutate collection="resource-donations" id={r.id} operation="mark-completed">Mark Complete</Mutate>}</div>;
    if (table) return <tr className={`resource-row status-${r.status}`} key={r.id}><td><strong>{r.category}</strong><p>{r.description}</p>{r.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}</td><td>{r.donorName}<div>{r.donorEmail}</div></td><td>{r.pickupAddress}<div>{r.pickupDate} • {r.pickupTimeSlot}</div></td><td><span className={`status-badge ${r.status}`}>{r.status}</span><div>{r.assignedVolunteerName || 'Unassigned'}</div></td><td>{actions}</td></tr>;
    return <article className={`page-record-card resource-record-card status-${r.status}`} key={r.id} data-record-id={r.id}><div className="page-record-heading"><h3>{r.category}</h3><span className={`status-badge ${r.status}`}>{r.status.replaceAll('_',' ')}</span></div><p>{r.description}</p><p>{r.items.map((i) => `${i.name} × ${i.quantity} (${i.condition})`).join(', ')}</p><p>{r.pickupAddress}</p><p>{r.pickupDate} • {r.pickupTimeSlot}</p>{r.image&&<a href={r.image} target="_blank" rel="noreferrer">View resource photo</a>}{r.inventory&&<p>Received: {r.inventory.received} ? Reserved: {r.inventory.reserved} ? Distributed: {r.inventory.distributed}</p>}<p>{r.programName || 'Not allocated'} • {r.assignedVolunteerName || 'Awaiting volunteer assignment'}</p>{actions}</article>;
  });
}
function HoursCards({ records, review = false }) {
  return records.map((h) => <article className="page-record-card" key={h.id}><div className="page-record-heading"><h4>{h.description || 'Volunteer Hours'}</h4><span className={`status-badge ${h.status}`}>{h.status}</span></div><p>{h.volunteerName} • {h.hours} hours • {h.date}</p>{review && h.status === 'pending' && <div className="page-record-actions"><Mutate collection="hour-logs" id={h.id} operation="approve">Verify</Mutate><Mutate collection="hour-logs" id={h.id} operation="reject">Reject</Mutate></div>}</article>);
}
function ApplicationCards({ records }) {
  return records.filter((a) => a.status === 'pending').map((a) => <article className="page-record-card" key={a.id}><h4>{a.volunteerName} — {a.programName}</h4><p>{a.message || 'No message provided.'}</p><span className={`status-badge ${a.status}`}>{a.status}</span><div className="page-record-actions"><Mutate collection="program-applications" id={a.id} operation="approve">Approve</Mutate><Mutate collection="program-applications" id={a.id} operation="reject">Reject</Mutate></div></article>);
}

function ItemsEditor() {
  const ui = usePage();
  return ui.state.items.map((item) => <div key={item.id} className="rd-item-row page-donation-item">
    <div><PageField field={`item-${item.id}-name`} spec={{ 'aria-label': 'Item name', className: 'rd-item-name', placeholder: 'Item name (e.g. Rice Bags)' }} /></div>
    <div><PageField field={`item-${item.id}-quantity`} spec={{ 'aria-label': 'Quantity', className: 'rd-item-qty', type: 'number', min: '1' }} /></div>
    <div><PageField as="select" field={`item-${item.id}-condition`} spec={{ 'aria-label': 'Item condition', className: 'rd-item-condition' }}>{['New','Good','Fair'].map((condition) => <option key={condition}>{condition}</option>)}</PageField></div>
    <button className="rd-item-remove-btn" type="button" aria-label="Remove item" disabled={ui.state.busy || ui.state.items.length === 1} onClick={() => ui.update({ items: ui.state.items.filter((value) => value.id !== item.id) })}>×</button>
  </div>);
}

export default function PageRegions({ name }) {
  const ui = usePage(), { state, session } = ui;
  const query = (key) => state.searches[key] || '';
  const orgPrograms = ui.data('programs').filter((p) => session?.role !== 'admin' || p.org === session.org);
  const orgVolunteerProfiles = ui.data('volunteers').filter((v) => session?.role !== 'admin' || !session.org || v.org === session.org);
  const orgProgramIds = new Set(orgPrograms.map((p) => p.id));
  const acceptedOrgMembers = ui.data('assignments').filter((a) => a.status === 'active' && orgProgramIds.has(a.programId));
  const orgVolunteers = [...orgVolunteerProfiles];
  for (const member of acceptedOrgMembers) {
    const existingIndex = orgVolunteers.findIndex((v) => v.email?.toLowerCase() === member.volunteerEmail?.toLowerCase());
    const existing = existingIndex >= 0 ? orgVolunteers[existingIndex] : null;
    const loggedHours = ui.data('hours').filter((h) => h.volunteerEmail?.toLowerCase() === member.volunteerEmail?.toLowerCase()).reduce((sum, h) => sum + Number(h.hours || 0), 0);
    const profile = { ...(existing || {}), id: existing?.id || `program-member-${member.id}`, name: existing?.name || member.volunteerName, email: member.volunteerEmail, role: existing?.role || member.role || 'Volunteer', org: session?.org || member.org || '', status: 'active', skills: existing?.skills || [], hours: existing?.hours || loggedHours, membershipOnly: !existing };
    if (existingIndex >= 0) orgVolunteers[existingIndex] = profile;
    else orgVolunteers.push(profile);
  }
  const collection = (key, records, render, table = false, empty) => <CollectionState collection={key} table={table} empty={empty}>{records.length ? render(records) : []}</CollectionState>;
  if (name === 'donorWelcome') return <><div className="option-icon">♡</div><h3>Welcome, {session.name.split(' ')[0]}!</h3><p>Choose an organization below to make your next donation.</p><Link className="btn-primary block-btn" to="/donor-dashboard.html">My Donor Dashboard</Link></>;
  if (name === 'campaignsGrid' || name === 'fundraisingGrid') return collection('programs',ui.data('programs').filter((p) => p.status === 'active'),(records) => <ProgramCards records={records} campaign />);
  if (name === 'partnersGrid') return collection('organizations',ui.data('organizations').filter((o) => o.status === 'active' && o.listingStatus === 'approved').slice(0,8),(records) => <OrganizationCards records={records} partners />);
  if (name === 'testimonialsGrid') return <Testimonials />;
  if (['organizationsGrid','org-grid'].includes(name)) return collection('organizations',ui.data('organizations').filter((o) => o.status === 'active' && o.listingStatus === 'approved'),(records) => <OrganizationCards records={records} />);
  if (name === 'donate-org-grid') return collection('organizations',ui.data('organizations').filter((o) => o.status === 'active' && o.listingStatus === 'approved'),(records) => <OrganizationCards records={records} compact />);
  if (name === 'programsGrid' && ui.path === '/programs.html') return collection('programs',ui.data('programs').filter((p) => p.status === 'active' && p.listingStatus === 'approved'),(records) => <ProgramCards records={records} />);
  if (['programsGrid','orgProgramsGrid','orgOverviewPrograms'].includes(name)) return collection('programs',orgPrograms,(records) => <ProgramCards records={records} management />);
  if (name === 'donor-programs-grid') return collection('programs',ui.data('programs').filter((p) => p.status === 'active'),(records) => <ProgramCards records={records} />);
  if (name === 'orgTableBody') return collection('organizations',filterRecords(ui.data('organizations'),query('organizations')),(records) => <OrganizationRows records={records} />,true);
  if (name === 'userTableBody') return collection('users',filterRecords(ui.data('users'),query('users'),state.filters.users),(records) => <UserRows records={records} />,true);
  if (['orgOverviewVolunteersBody','orgVolunteersTableBody','volTableBody'].includes(name)) return collection('volunteers',filterRecords(orgVolunteers,query('volunteers')),(records) => <VolunteerRows records={records} region={name} />,true);
  if (name === 'inboxTableBody') return collection('incoming',filterRecords(ui.data('incoming'),query('inbox'),state.filters.inbox),(records) => <InboxRows records={records} />,true);
  if (name === 'incomingCards') return collection('incoming', filterRecords(ui.data('incoming'), query('incoming')).filter((record) => record.status === ({ 'new-requests': 'pending', accepted: 'accepted', declined: 'declined' }[ui.activeTab] || 'pending')), (records) => <IncomingCards records={records} />);
  if (['beneficiaryReqList','orgRequestsContainer','orgOverviewIncomingList'].includes(name)) return collection('incoming',filterRecords(ui.data('incoming'),query('incoming')),(records) => <IncomingCards records={records} />);
  if (['emergencyRequests','emergencyRequestsOverview','platformInboxList'].includes(name)) return collection('incoming',ui.data('incoming').filter((r) => name === 'platformInboxList' || /emergency|medical/i.test(r.type)),(records) => <IncomingCards records={records} />);
  if (['requestsList','allRequestsContainer'].includes(name)) return <>
    <PageRegions name="listingReview" />
    {collection('requests',ui.data('requests').filter((r) => r.status === 'pending'),(records) => <IncomingCards records={records} registration />)}
    {ui.data('users').filter((u) => u.status === 'pending').map((u) => <article className="request-card" key={u.id}><div><h4>{u.name}</h4><p>{u.role} • {u.email}</p></div><div className="action-btns"><Mutate collection="users" id={u.id} operation="approve">Approve</Mutate><Mutate collection="users" id={u.id} operation="reject">Reject</Mutate></div></article>)}
    {ui.data('organizations').filter((o) => o.status === 'pending').map((o) => <article className="request-card organization-approval-card" key={o.id}><div><h4>{o.name}</h4><p>{o.focus} • {o.email}</p></div><OrganizationCertificate organization={o} /><div className="action-btns"><Mutate collection="organizations" id={o.id} operation="approve">Approve</Mutate><Mutate collection="organizations" id={o.id} operation="reject">Reject</Mutate></div></article>)}
  </>;
  if (name === 'listingReview') return collection('organizations',ui.data('organizations').filter((o) => o.listingStatus === 'pending'),(records) => <section className="listing-review"><h3>Public Organization Listing Requests</h3>{records.map((o) => <article className="page-record-card" key={o.id}><h4>{o.name}</h4><p>{o.city} · {o.focus}</p><dl><dt>Account holder</dt><dd>{o.bankAccountName}</dd><dt>Account number</dt><dd>{o.bankAccountNumber}</dd><dt>IFSC</dt><dd>{o.bankIfsc}</dd></dl>{o.image && <img className="listing-photo" src={o.image} alt={`${o.name} submitted photo`} />}<div className="page-record-actions"><Mutate collection="organizations" id={o.id} operation="approve-listing">Accept Listing</Mutate><Mutate collection="organizations" id={o.id} operation="reject-listing">Reject Listing</Mutate></div></article>)}</section>,false,'No public listing requests awaiting review.');
  if (name === 'listingManager') {
    const org = ui.data('organizations').find((o) => o.name === session?.org);
    if (!org) return <CollectionState collection="organizations"><p>Organization profile not found.</p></CollectionState>;
    const bankReady = hasBankDetails(org), registered = org.status === 'active';
    const status = org.listingStatus || 'unlisted';
    return <section className="page-record-card organization-listing-manager" id="public-organization-listing"><h3>Show My Organization on the Public Directory</h3><p>Save bank details, then request platform admin approval to appear on the Organizations and Donate pages. A photo is optional.</p>
      <ol className="listing-steps"><li>Bank details: <strong>{bankReady ? 'Saved and valid' : 'Required'}</strong> <button className="btn-outline-sm" onClick={() => ui.action('openOrgProfile')}>{bankReady ? 'Edit Bank Details' : 'Update Bank Details'}</button></li><li>Organization registration: <strong>{registered ? 'Approved' : org.status}</strong>{!registered && <p>Your bank details can be saved while registration is pending. Ask the platform admin to approve your organization in Requests.</p>}</li><li>Public listing: <strong>{status}</strong></li></ol>
      {status === 'pending' ? <p>Listing request submitted. Awaiting platform admin review.</p> : status === 'approved' && bankReady && registered ? <Link className="btn-outline-sm" to={`/organization-details.html?id=${org.id}`}>View Public Listing</Link> : <button className="btn-primary-sm" disabled={state.busy || !registered || !bankReady} onClick={() => ui.action('openListingRequest')}>{status === 'rejected' ? 'Resubmit Listing Request' : 'Request Public Listing'}</button>}
      {(!bankReady || !registered) && <p>Complete the steps above to enable the listing request. You can still create private programs and invite volunteers.</p>}
    </section>;
  }
  if (name === 'payment-stats') {
    const receipts = ui.savedDonations;
    const stats = [['Total Donated', money(receipts.reduce((total, receipt) => total+Number(receipt.amount || 0),0)), 'green', '💰'], ['Transactions', receipts.length, 'blue', '📋'], ['Successful', receipts.filter((receipt) => receipt.status === 'paid').length, 'purple', '✅'], ['NGOs Supported', new Set(receipts.map((receipt) => receipt.org)).size, 'orange', '🏢']];
    return stats.map(([label,value,color,icon]) => <div className="stat-card" key={label}><div className={`stat-icon ${color}`}>{icon}</div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>);
  }
  if (name === 'orgOverviewStats') {
    const stats = [['Active Volunteers', orgVolunteers.filter((record) => record.status === 'active').length, 'green', '👥'], ['Active Programs', orgPrograms.filter((record) => record.status === 'active').length, 'blue', '📋'], ['Resources Allocated', ui.data('resources').filter((record) => record.programId).reduce((total, record) => total+record.items.reduce((sum,item) => sum+Number(item.quantity || 0),0),0), 'orange', '📦'], ['Pending Requests', ui.data('incoming').filter((record) => record.status === 'pending').length, 'red', '⚠️']];
    return stats.map(([label,value,color,icon]) => <div className="stat-card" key={label}><div className="stat-card-header"><div className={`stat-icon ${color}`}>{icon}</div><button className="stat-more" type="button" disabled={state.busy} onClick={() => ui.action('showStatistics')} aria-label={`${label} statistics`}>...</button></div><div className="stat-value">{value.toLocaleString('en-IN')}</div><div className="stat-label">{label}</div></div>);
  }
  if (['pendingUsersList','liveUserStats','userStatsBar','inboxStatsBar'].includes(name)) {
    const key = name === 'inboxStatsBar' ? 'incoming' : name === 'orgOverviewStats' ? 'programs' : name === 'payment-stats' ? null : 'users';
    const records = key ? ui.data(key) : ui.savedDonations;
    return <div className="page-inline-stats"><div><strong>{records.length}</strong><span>Total {key || 'payments on this browser'}</span></div><div><strong>{records.filter((r) => r.status === 'pending').length}</strong><span>Pending</span></div><div><strong>{records.filter((r) => ['approved','active','completed','resolved'].includes(r.status)).length}</strong><span>Active / Complete</span></div></div>;
  }
  if (name === 'shopManagementTableBody') return collection('products',filterRecords(ui.data('products'),query('shop'),state.filters.shop),(records) => records.map((p) => <tr key={p.id}><td>{p.title}</td><td>{p.category}</td><td>{p.sellerName}</td><td>{money(p.price)}</td><td>{p.quantity}</td><td><span className="status-badge">{p.status}</span></td><td><div className="action-btns"><Action name="showDetail" args={['products',p.id]}>View</Action>{p.status !== 'approved' && <Mutate collection="products" id={p.id} operation="approve">Approve</Mutate>}{p.status !== 'rejected' && <Mutate collection="products" id={p.id} operation="reject">Reject</Mutate>}<Mutate collection="products" id={p.id} operation="delete">Delete</Mutate></div></td></tr>),true);
  if (name === 'verifiedSellersList') return collection('sellers',ui.data('sellers'),(records) => records.map((s) => <article key={s.id} className={`page-record-card seller-record-card status-${s.status}`}><strong>{s.businessName}</strong><p>{s.name} • {s.email} • {s.status}</p><div className="action-btns">{s.status !== 'approved' && <Mutate collection="sellers" id={s.id} operation="approve">Approve Seller</Mutate>}{s.status !== 'rejected' && <Mutate collection="sellers" id={s.id} operation="reject">Reject Seller</Mutate>}</div></article>));
  if (['resOverviewList','resPendingList','resActiveList','resCompletedList','donor-resource-list','orgResourcesTableBody','vol-pickups-list'].includes(name)) {
    const records = ui.data('resources').filter((r) => name === 'resPendingList' ? r.status === 'submitted' : name === 'resActiveList' ? ['pending_pickup','in_transit'].includes(r.status) : name === 'resCompletedList' ? ['delivered','completed'].includes(r.status) : true);
    return collection('resources',records,(records) => <ResourceCards records={records} table={name === 'orgResourcesTableBody'} />,name === 'orgResourcesTableBody');
  }
  if (['hourVerificationList','hour-logs-list'].includes(name)) return collection('hours',ui.data('hours').filter((h) => name === 'hourVerificationList' ? h.status === 'pending' : true),(records) => <HoursCards records={records} review={name === 'hourVerificationList'} />);
  if (['programApplicationsList','volAppReviewList'].includes(name)) return collection('applications',ui.data('applications').filter((a) => orgPrograms.some((p) => p.id === a.programId)),(records) => <ApplicationCards records={records} />);
  if (['assignments-list','taskApprovalList'].includes(name)) return collection('tasks',ui.data('tasks'),(records) => records.map((t) => <article className="page-record-card" key={t.id}><h4>{t.title}</h4><p>{t.description}</p><p>{t.programName} • {t.assignedToName} • {t.status}</p><div className="page-record-actions"><Action name="showDetail" args={['tasks',t.id]}>Details</Action>{t.status === 'pending' && <Action name="updateTaskStatus" args={[t.id,'in-progress']}>{session?.role === 'volunteer' ? 'Start Task' : 'Approve Task'}</Action>}{t.status === 'in-progress' && <Action name="updateTaskStatus" args={[t.id,session?.role === 'volunteer' ? 'pending_review' : 'completed']}>{session?.role === 'volunteer' ? 'Submit for Review' : 'Mark Complete'}</Action>}{t.status === 'pending_review' && session?.role !== 'volunteer' && <Action name="updateTaskStatus" args={[t.id,'completed']}>Approve Completion</Action>}{t.status !== 'completed' && <Action name="taskNotes" args={[t.id]}>Add Notes</Action>}</div></article>));
  if (name === 'my-programs-list') return collection('assignments',ui.data('assignments'),(records) => records.map((a) => {
    const subtasks = ui.data('subtasks').filter((t) => t.programId === a.programId && (session?.role !== 'volunteer' || t.assignedToEmail?.toLowerCase() === session.email.toLowerCase()));
    const tasks = ui.data('tasks').filter((t) => t.programId === a.programId && (session?.role !== 'volunteer' || t.assignedToEmail?.toLowerCase() === session.email.toLowerCase()));
    const complete = subtasks.length > 0 && subtasks.every((t) => Number(t.progress) >= 100);
    const totalWork = tasks.length + subtasks.length;
    const completedWork = tasks.filter((t) => t.status === 'completed').length + subtasks.filter((t) => Number(t.progress) >= 100).length;
    const progress = totalWork ? Math.round(completedWork / totalWork * 100) : 0;
    if (['cancelled','declined'].includes(a.status)) return null;
    if (a.status === 'pending') return <article className="page-record-card program-invitation-card" key={a.id}><h3>{a.programName}</h3><p>You have been invited to join this program as {a.role}.</p><div className="page-record-actions"><Action name="respondProgramInvitation" args={[a.id,'accepted']}>Accept Invitation</Action><Action name="respondProgramInvitation" args={[a.id,'declined']}>Decline Invitation</Action></div></article>;
    return <article className={`page-record-card volunteer-program-card status-${a.status}`} key={a.id}>
      <div className="volunteer-program-card-heading"><div><span className="volunteer-program-label">Active program</span><h3>{a.programName}</h3></div><span className="volunteer-member-badge">{a.role || 'Volunteer'}</span></div>
      <div className="volunteer-program-progress-label"><span>Work completed</span><strong>{progress}%</strong></div>
      <div className="volunteer-program-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${progress}%` }} /></div>
      <p className="volunteer-program-work-summary">{totalWork ? `${completedWork} of ${totalWork} assigned ${totalWork === 1 ? 'task' : 'tasks'} completed` : 'No tasks assigned yet. Your organization will add tasks here.'}</p>
      {tasks.map((t) => <div className="volunteer-program-task" key={t.id}><span>{t.title}</span><span className={`volunteer-task-status status-${t.status}`}>{t.status.replaceAll('_',' ')}</span></div>)}
      {subtasks.map((t) => <div className="volunteer-program-task" key={t.id}><span>{t.title}</span><span className="volunteer-task-status">{Number(t.progress || 0)}%</span></div>)}
      <div className="page-record-actions volunteer-program-actions">{subtasks.length > 0 && <Action name="openProgressReport" args={[a.programId]}>Report Progress</Action>}{complete && <Action name="downloadCertificate" args={[a.programId]}>Download Certificate</Action>}</div>
    </article>;
  }));
  if (name === 'portalGrid') {
    const skill = ui.values['portal-skill-filter'], category = ui.values['portal-category-filter'];
    const records = filterRecords(ui.data('programs'),query('programs')).filter((p) => p.status === 'active' && p.listingStatus === 'approved' && (!skill || skill === 'all' || p.requiredSkills?.includes(skill)) && (!category || category === 'all' || [p.focus].flat().includes(category)));
    return collection('programs',records,(records) => <ProgramCards records={records} portal />);
  }
  if (name === 'apply-prog-info') return <><h3>{state.selectedProgram?.name}</h3><p>{state.selectedProgram?.org} • {state.selectedProgram?.location}</p></>;
  if (name === 'apply-skills-display') return (state.selectedProgram?.requiredSkills || []).map((s) => <span className="skill-tag" key={s}>{s}</span>);
  if (name === 'my-skills-tags') return (ui.data('volunteer')[0]?.skills || []).map((s) => <span className="skill-tag" key={s}>{s}</span>);
  if (name === 'rd-items-container') return <ItemsEditor />;
  if (['customSkillTags','pfCustomSkillTags'].includes(name)) return state.customSkills.map((skill) => <span className="skill-tag custom-skill-tag" key={skill}>{skill}<button className="remove-btn" type="button" aria-label={`Remove ${skill}`} onClick={() => ui.update({ customSkills: state.customSkills.filter((value) => value !== skill) })}>×</button></span>);
  if (['progCategoryContainer','progSkillsContainer'].includes(name)) {
    const category = name === 'progCategoryContainer', list = category ? [...new Set([...categories,...state.categories])] : skills, chosen = category ? state.categories : state.programSkills;
    return list.map((label) => <label key={label} className={`program-choice ${category ? 'category-choice' : 'skill-choice'}${chosen.includes(label) ? ' selected' : ''}`}><input type="checkbox" disabled={state.busy} checked={chosen.includes(label)} onChange={(e) => ui.update({ [category ? 'categories' : 'programSkills']: e.target.checked ? [...chosen,label] : chosen.filter((v) => v !== label) })} />{label}</label>);
  }
  if (name === 'progVolsContainer') {
    const available = filterRecords(ui.data('volunteers').filter((v) => (v.status || 'active') === 'active'), query('volunteers'));
    return collection('volunteers',available,(records) => records.map((v) => <label className={`program-volunteer${state.selectedVolunteers.includes(v.email) ? ' selected' : ''}`} key={v.id}>
      <input type="checkbox" aria-label={v.name} disabled={state.busy || ui.collections.assignments?.loading} checked={state.selectedVolunteers.includes(v.email)} onChange={(e) => ui.update({ selectedVolunteers: e.target.checked ? [...state.selectedVolunteers,v.email] : state.selectedVolunteers.filter((email) => email !== v.email) })} />
      <span className="program-volunteer-avatar">{v.name.charAt(0)}</span><span className="program-volunteer-copy"><strong>{v.name}</strong><span>{v.email}</span><small>{v.org || 'Independent volunteer'}{v.skills?.length ? ' | '+v.skills.join(', ') : ''}</small></span>
    </label>),false,'No volunteers match your search. You can create the program and invite volunteers later.');
  }
  if (name === 'shopProductsGrid') return collection('products',filterRecords(ui.data('products'),query('catalog'),state.filters.catalog),(records) => <ProductCards records={records} />);
  if (name === 'sellerProductsGrid') return collection('products',ui.data('products').filter((p) => p.sellerId === (ui.data('sellers').find((s) => s.email === session?.email)?.id || session?.id)),(records) => <ProductCards records={records} seller />);
  if (name === 'shopDetailContent') return <ProductDetail />;
  if (name === 'checkout-product-details') return <><h3>{state.product?.title}</h3><p>{money(state.product?.price)} each</p></>;
  if (name === 'saved-cards-grid') return ui.savedCards.length ? ui.savedCards.map((c) => <article className="page-record-card" key={c.id}><h3>{c.cardType}</h3><p>•••• •••• •••• {c.cardLast4}</p><p>{c.holder} • {c.expiry}</p><Action name="removeSavedCard" args={[c.id]}>Remove</Action></article>) : <Empty>No saved cards on this browser.</Empty>;
  if (['payments-list','overview-content'].includes(name)) return <>{ui.savedDonations.length ? ui.savedDonations.map((d) => <article className="payment-card page-record-card" key={d.id}><h3>{d.org}</h3><p>{money(d.amount)} • {d.status}</p><p>{d.id} • {d.date}</p><Link to={`/donate.html?org=${encodeURIComponent(d.org)}`} className="btn-outline-sm">Donate Again</Link></article>) : <Empty>No donations made on this browser. The backend does not expose donor monetary history.</Empty>}{name === 'payments-list' && <Link className="btn-primary-sm" to="/donate.html">Make a Donation</Link>}</>;
  if (name === 'beneficiaryRequests') {
    const requests = ui.data('incoming');
    return collection('incoming', requests, (records) => records.map((request) => <article className={`page-record-card beneficiary-request-card status-${request.status || 'pending'}`} key={request.id}>
      <div className="page-record-heading"><h3>{request.type || 'Assistance Request'}</h3><span className={`status-badge ${request.status || 'pending'}`}>{(request.status || 'submitted').replaceAll('_', ' ')}</span></div>
      <p>{request.desc}</p>
      <div className="beneficiary-request-meta"><span>{request.location || 'Location not provided'}</span><span>{request.date?.slice?.(0, 10) || 'Recently submitted'}</span></div>
      <Action name="showDetail" args={['incoming', request.id]}>Details</Action>
    </article>), false, 'You have not submitted any assistance requests yet.');
  }
  return <Empty>No records available.</Empty>;
}
