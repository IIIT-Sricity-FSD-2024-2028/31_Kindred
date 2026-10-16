import { useCallback, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from '../../routes/navigation.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useDismissable } from '../../hooks/useDismissable.js';

const ROLE_LABELS = {
  superuser: 'Platform Administrator', admin: 'Organization Admin', volunteer: 'Volunteer',
  donor: 'Donor', beneficiary: 'Beneficiary', seller: 'Seller / Artisan',
};
const links = [['Home', '/index.html'], ['Organizations', '/organizations.html'], ['Programs', '/programs.html'], ['Donate', '/donate.html'], ['Shop', '/shop.html'], ['Contact', '/contact.html']];

export default function Navbar({ showShop, variant = 'standard' }) {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismissable({ open, rootRef, triggerRef, onClose: close });
  const approved = session?.status === 'approved';
  const organization = variant === 'organization';
  const account = !approved ? <div className="navbar-auth">
    <Link to="/signin.html" className="btn-nav-signin">Sign In</Link>
    <Link to="/signup.html" className="btn-nav-signup">Sign Up</Link>
  </div> : <div ref={rootRef} className={organization ? 'user-btn' : 'navbar-user'}>
    <button ref={triggerRef} type="button" className="user-menu-trigger" aria-label={`Account: ${session.name}`} aria-expanded={open} aria-controls="account-menu" onClick={() => setOpen((value) => !value)}>
      <span className={organization ? 'user-avatar' : 'avatar'} style={organization ? undefined : { background: session.avatar }}>{session.initials}</span>
      <span className="user-info"><span className="user-name">{session.name}</span><span className="user-role">{organization ? 'Org Admin' : ROLE_LABELS[session.role]}</span></span>
      <span className={organization ? 'user-chevron' : 'chevron'} aria-hidden="true">{organization ? '?' : '▾'}</span>
    </button>
    {open && <div id="account-menu" className="nav-dropdown" role="group" aria-label="Account menu">
      <div className="account-summary"><div>{session.name}</div><small>{ROLE_LABELS[session.role]}</small></div>
      {session.role !== 'superuser' && <Link to="/profile.html" onClick={close}>👤 My Profile</Link>}
      <Link to={session.dashboard} onClick={close}>📋 My Dashboard</Link>
      <Link to="/index.html" onClick={close}>🏠 Home</Link><hr />
      <button type="button" onClick={() => { signOut(); close(); navigate('/signin.html', { replace: true }); }}>🚪 Sign Out</button>
    </div>}
  </div>;

  if (organization) return <nav className="navbar" aria-label="Main navigation">
    <Link to="/index.html" className="navbar-brand"><div className="navbar-logo"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3.81 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg></div><span className="navbar-brand-name">Kindred</span></Link>
    <ul className="navbar-nav">{[['Overview', '/org-admin-overview.html'], ['Programs', '/org-admin-programs.html'], ['Requests', '/incoming.html'], ['Volunteers', '/volunteers.html'], ['Resources', '/resources.html']].map(([label, to]) => <li key={to}><NavLink to={to} className={({ isActive }) => isActive ? 'active' : undefined}>{label}</NavLink></li>)}</ul>
    <div className="navbar-right">{account}</div>
  </nav>;

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/index.html" className="navbar-brand">Kindred</Link>
      <div className="navbar-links">
        {links.filter(([label]) => showShop || label !== 'Shop').map(([label, to]) => (
          <NavLink key={to} to={to} end className={({ isActive }) => isActive || (to === '/index.html' && location.pathname === '/') ? 'nav-active' : undefined}>{label}</NavLink>
        ))}
      </div>
      {account}
    </nav>
  );
}
