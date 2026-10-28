import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../../pages/runtime/PageContext.js';

const programImages = { 'Disaster Relief': '/images/program-disaster.png', Education: '/images/program-education.png', Environment: '/images/program-environment.png', Healthcare: '/images/program-healthcare.png' };
const money = (n) => '₹'+Number(n || 0).toLocaleString('en-IN');
const compact = (n) => n >= 100000 ? (n/100000).toFixed(1)+'L' : n >= 1000 ? (n/1000).toFixed(0)+'K' : String(n);
const focusText = (focus) => [focus].flat().join(', ');

export function OrganizationCards({ records, compact: small = false, partners = false }) {
  const ui = usePage();
  return records.map((org) => partners ? <div className="partner-card" key={org.id}>
    <img className="partner-avatar ngo-fallback-image" src={org.image || '/images/ngo-placeholder.svg'} alt={`${org.name} NGO`} />
    <div><div className="partner-name"><Link to={`/organization-details.html?id=${org.id}`}>{org.name}</Link></div><div className="partner-focus">{focusText(org.focus)}</div></div>
  </div> : small ? <div className="small-org-card" key={org.id} style={{ alignItems: 'flex-start' }}>
    <img src={org.image || '/images/ngo-placeholder.svg'} alt={`${org.name} NGO`} className="donate-org-avatar ngo-fallback-image" />
    <div className="org-details" style={{ flex: 1 }}><h4>{org.name}</h4><span>{focusText(org.focus)} • {Number(org.beneficiaries || 0).toLocaleString('en-IN')} beneficiaries</span>{(org.upiId || org.bankAccountNumber) && <div style={{ fontSize: '.7rem', color: '#0f766e', marginTop: 5 }}>Payment: {org.upiId ? 'UPI '+org.upiId : 'Bank ••••'+org.bankAccountNumber.slice(-4)}</div>}{org.neededResources && <div style={{ fontSize: '.7rem', color: '#b45309', marginTop: 4 }}>Needs: {org.neededResources}</div>}</div>
    <button type="button" className="btn-outline-sm" onClick={() => ui.action('openDonation',[org.name])}>Donate</button>
  </div> : <div className="org-feature-card" key={org.id}>
    <div className="org-cover-img" style={{ backgroundImage: `url("${org.image || '/images/ngo-placeholder.svg'}")` }} />
    <div className="org-card-content"><h3>{org.name}</h3><span className="org-category">{focusText(org.focus)}</span>
      <p>{org.description || `${org.name} supports communities through ${focusText(org.focus).toLowerCase()} programs.`}</p>
      <div className="org-stats"><span className="stat"><span className="icon">📍</span>{org.city}</span><span className="stat"><span className="icon">👥</span>{Number(org.volunteers || 0).toLocaleString('en-IN')}</span><span className="stat"><span className="icon">★</span>{org.rating || '—'}</span></div>
      <Link to={`/organization-details.html?id=${org.id}`} className="btn-outline-full">View Details →</Link>
    </div>
  </div>);
}

export function ProgramCards({ records, campaign = false, portal = false, management = false }) {
  const ui = usePage();
  return records.map((p) => {
    const fundingPercentage = Math.min(100, Math.round(Number(p.raised || 0)/Math.max(Number(p.budget),1)*100));
    const percentage = campaign ? fundingPercentage : Math.min(100, Number(p.taskProgress || 0));
    const color = ['#00c9a7','#3b82f6','#8b5cf6','#059669'][records.indexOf(p)%4];
    const application = ui.data('applications').find((a) => a.programId === p.id);
    if (campaign) return <div className="campaign-card" key={p.id}><div className="campaign-org"><div className="campaign-org-avatar" style={{ background: '#6366f1' }}>{p.org?.[0]}</div><span className="campaign-org-name">{p.org}</span></div>
      <div className="campaign-title">{p.name}</div><div className="campaign-desc">{p.description}</div><div className="campaign-progress-bar"><div className="campaign-progress-fill" style={{ width: percentage+'%', background: color }} /></div>
      <div className="campaign-progress-info"><span><strong>₹{compact(p.raised || 0)}</strong> raised</span><span>{percentage}% of ₹{compact(p.budget || 0)}</span></div>
      <Link to={`/donate.html?org=${encodeURIComponent(p.org)}`} className="btn-campaign-donate" style={{ background: color }}>💛 Donate Now</Link>
    </div>;
    if (management || portal) return <article className={portal ? 'portal-card' : `program-card status-${p.status}`} key={p.id} data-program-id={p.id}>
      <div className="program-header"><h3>{p.name}</h3><span className={`status-badge ${p.status}`}>{p.status}</span></div>
      {management && <p className="field-hint">Public listing: {p.listingStatus || 'unlisted'}</p>}<p className="program-org">{p.org} • {focusText(p.focus)}</p><p>{p.description}</p><p>📍 {p.location || '—'}</p>
      <div className="program-stats"><span>👥 {p.volunteers || 0}/{p.volunteerGoal || 0} volunteers</span><span>Tasks {p.completedTasks || 0}/{p.totalTasks || 0} complete</span><span>Budget {money(p.budget)}</span><span>Donations {money(p.raised)}</span></div>
      <div className="program-task-progress-label"><span>Task progress</span><strong>{percentage}%</strong></div>
      <div className="progress-bar-bg"><div className="progress-bar-fill bg-cyan" style={{ width: percentage+'%' }} /></div>
      <div className="page-skill-tags">{(p.requiredSkills || []).map((skill) => <span key={skill} className="skill-tag">{skill}</span>)}</div>
      <div className="page-record-actions">
        {portal && <button className="btn-primary-sm" disabled={Boolean(application) || p.openForApplications === false || p.status !== 'active'} onClick={() => ui.action('applyToProgram',[p.id])}>{application ? `Application ${application.status}` : p.openForApplications === false ? 'Applications Closed' : 'Apply Now'}</button>}
        {management && <><button className="action-btn action-view" onClick={() => ui.action('showDetail',['programs',p.id])}>Details</button><button className="action-btn action-edit" onClick={() => ui.action('openGlobalTaskModal',[p.id])}>Assign Task</button><button className={`action-btn ${p.status === 'active' ? 'action-danger' : 'action-success'}`} onClick={() => ui.action('setProgramStatus',[p.id,p.status === 'active' ? 'paused' : 'active'])}>{p.status === 'active' ? 'Delist' : 'Activate'}</button><button className="action-btn action-edit" onClick={() => ui.action('editProgram',[p.id])}>Edit</button><button className="action-btn action-danger" onClick={() => ui.action('mutateRecord',['programs',p.id,'delete'])}>Delete</button></>}
        {!management && !portal && <Link className="btn-outline-full" to={`/donate.html?org=${encodeURIComponent(p.org)}`}>Support Program →</Link>}
      </div>
    </article>;
    return <div className="program-feature-card" key={p.id}>
      <div className="prog-cover-img" style={{ backgroundImage: `url("${p.image || programImages[[p.focus].flat()[0]] || '/images/program-disaster.png'}")` }}><span className={`status-pill ${p.status === 'active' ? 'active-pill' : ''}`}>{p.status}</span></div>
      <div className="prog-card-content"><div className="prog-header"><div className="prog-titles"><h3>{p.name}</h3><span className="prog-ngo">by {p.org}</span></div></div>
        <p>{p.description}</p><div className="page-record-actions"><button type="button" className="program-donate-button" onClick={() => ui.action('openDonation',[p.org,p.id])}>Donate</button><button type="button" className="btn-outline-sm" onClick={() => ui.action('joinPublicProgram',[p.id])}>Join as Volunteer</button></div><div className="org-stats"><span className="stat">📍 {p.location}</span><span className="stat">👥 {p.volunteers} volunteers</span></div>
        <div className="prog-progress"><div className="progress-labels"><span>Progress</span><span>{percentage}%</span></div><div className="progress-bar-bg"><div className="progress-bar-fill bg-cyan" style={{ width: percentage+'%' }} /></div></div>
      </div>
    </div>;
  });
}

export function Testimonials() {
  const testimonials = [
    { text: "Joining Kindred as a volunteer has been a transformative experience. I've been able to contribute to disaster relief efforts and see real impact in communities.", name: 'Arjun Mehta', role: 'Volunteer, Mumbai', color: '#6366f1' },
    { text: 'As an NGO, Kindred helped us connect with over 500 volunteers in just 3 months. The platform is incredibly well-designed and easy to use.', name: 'Priya Sharma', role: 'NGO Admin, Delhi', color: '#00c9a7' },
    { text: "I've donated to multiple campaigns on Kindred and love how transparent the fund utilization reports are. I know my money is making a real difference.", name: 'Rajesh Patel', role: 'Donor, Ahmedabad', color: '#f59e0b' },
  ];
  return testimonials.map((t) => <div className="testimonial-card" key={t.name}><div className="testimonial-quote">"</div><p className="testimonial-text">{t.text}</p><div className="testimonial-author"><div className="testimonial-avatar" style={{ background: t.color }}>{t.name[0]}</div><div><div className="testimonial-name">{t.name}</div><div className="testimonial-role">{t.role}</div><div className="testimonial-stars">★★★★★</div></div></div></div>);
}

export function ProductCards({ records, seller = false }) {
  const ui = usePage();
  return records.map((p) => <article className="shop-product-card" key={p.id}>
    {p.photos?.[0] ? <img src={p.photos[0]} alt={p.title} className="shop-product-photo" /> : <div className="shop-product-placeholder">🎁</div>}
    <div className="shop-product-copy"><div className="shop-product-meta"><span>{p.category}</span><span>By <strong>{p.sellerName}</strong></span></div><h3>{p.title}</h3><p>{p.description}</p>{seller && <p>{p.quantity} in stock • {p.status}</p>}</div>
    <div className="shop-product-actions"><strong>{money(p.price)}</strong>{seller ? <><button className="action-btn action-edit" onClick={() => ui.action('editProduct',[p.id])}>Edit</button><button className="action-btn action-danger" onClick={() => ui.action('mutateRecord',['products',p.id,'delete'])}>Delete</button></> : <button className="btn-buy" onClick={() => ui.action('openProductDetailModal',[p.id])}>View Details →</button>}</div>
  </article>);
}

export function ProductDetail() {
  const ui = usePage(), p = ui.state.product;
  if (!p) return null;
  return <>{p.photos?.[0] && <img src={p.photos[0]} alt={p.title} className="shop-detail-photo" />}<span className="status-badge">{p.category}</span><h2>{p.title}</h2><h3>{money(p.price)}</h3><p>Sold & Handcrafted by: <strong>{p.sellerName}</strong></p><p>{p.description}</p><p>{p.quantity} available</p><button className="btn-buy" style={{ width: '100%', padding: 12 }} disabled={p.quantity < 1} onClick={() => ui.action('openCheckoutModal',[p.id])}>🛍️ Buy Now</button></>;
}
