import { Link } from '../../routes/navigation.jsx';

const standardExplore = [['Active Programs', '/programs.html'], ['Our Partners', '/organizations.html'], ['Donation Portal', '/donate.html']];
const information = [['About Kindred', '/about.html'], ['Contact Us', '/contact.html'], ['Emergency Help', '/emergency-request.html'], ['Give Feedback', '/feedback.html']];
const quick = [['All Organizations', '/organizations.html'], ['Beneficiary Portal', '/beneficiary-dashboard.html'], ['Donations Portal', '/donate.html'], ['Register NGO', '/register-ngo.html']];
const users = [['Donor Dashboard', '/donor-dashboard.html'], ['All Programs', '/programs.html'], ['Organization Portal', '/org-admin.html#overview']];
function Links({ items, className = 'footer-links', legalLabel = false }) {
  return <ul className={className}>{items.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}{legalLabel && <li><span className="footer-policy-label">Privacy Policy</span></li>}</ul>;
}
function LegalLabels({ className = '' }) {
  // The reference supplies no legal pages or destinations. Keep their labels
  // without creating dead buttons or inventing policy content.
  return <div className={`footer-legal-labels ${className}`}><span>Privacy Policy</span><span>Terms of Service</span></div>;
}
export default function Footer({ variant = 'premium', includeShop = false }) {
  if (variant === 'none') return null;
  if (variant === 'site') return <footer className="site-footer">
    <div className="footer-inner"><div className="footer-grid">
      <div><div className="footer-brand">Kindred</div><p className="footer-desc">Connecting individuals, volunteers, donors, and beneficiaries to create meaningful impact across communities in India.</p></div>
      <div><div className="footer-links-title">Quick Links</div><Links items={quick} /></div>
      <div><div className="footer-links-title">For Users</div><Links items={users} legalLabel /></div>
      <div><div className="footer-links-title">Contact</div><Links items={[
        ['contact@kindred.org.in', '/contact.html'], ['+91 912 345 6789', '/contact.html'], ['Connaught Place, New Delhi 110001', '/contact.html'], ['Emergency Help', '/emergency-request.html'],
      ]} /></div>
    </div><div className="footer-bottom"><span>© 2026 Kindred Platform. All rights reserved.</span><LegalLabels className="footer-bottom-links" /></div></div>
  </footer>;
  if (variant === 'classic') return <footer className="footer classic-footer">
    <div className="footer-content">
      <div className="footer-brand"><div className="footer-logo">Kindred</div><p>Connecting individuals, volunteers, donors, and beneficiaries to create meaningful impact across communities in India.</p></div>
      <div className="footer-col"><h4>Quick Links</h4><Links items={quick} className="classic-links" /></div>
      <div className="footer-col"><h4>For Users</h4><Links items={users} className="classic-links" legalLabel /></div>
      <div className="footer-col"><h4>Contact</h4><div className="footer-contact-item">✉ contact@kindred.org.in</div><div className="footer-contact-item">📞 +91 912 345 6789</div><div className="footer-contact-item">📍 New Delhi, India</div><div className="footer-contact-item"><Link to="/emergency-request.html">⚠ Emergency Help</Link></div></div>
    </div><div className="footer-bottom"><span>© 2026 Kindred Platform. All rights reserved.</span><LegalLabels className="footer-bottom-links" /></div>
  </footer>;
  const explore = [...standardExplore, ...(includeShop ? [['Artisan Shop', '/shop.html']] : []), ['Join Us', '/signup.html']];
  return <footer className="premium-footer">
    <div className="footer-container">
      <div className="footer-brand"><span className="footer-logo">Kindred</span><p>Connecting compassion with community. A unified platform for volunteers, donors, and beneficiaries across India.</p></div>
      <div className="footer-section"><h4>Explore</h4><Links items={explore} /></div>
      <div className="footer-section"><h4>Information</h4><Links items={information} /></div>
      <div className="footer-section"><h4>Contact</h4><ul className="footer-links footer-contact-list"><li>✉ contact@kindred.org.in</li><li>📞 +91 912 345 6789</li><li>📍 New Delhi, India</li></ul></div>
    </div><div className="footer-bottom"><p>© 2024 Kindred Platform. All rights reserved.</p><LegalLabels /></div>
  </footer>;
}
