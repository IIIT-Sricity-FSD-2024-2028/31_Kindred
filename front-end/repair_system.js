const fs = require('fs');
const path = require('path');

const DIR = '.';

const PREMIUM_NAV_CSS = `
/* ===== PREMIUM NAVBAR ===== */
.navbar {
  height: 72px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 1px rgba(0,0,0,0.02);
  font-family: 'Inter', -apple-system, sans-serif;
  width: 100%;
}

.navbar-brand {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 800;
  color: #1a3b5c;
  text-decoration: none;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

.navbar-links {
  display: flex;
  gap: 32px;
  align-items: center;
  margin: 0 auto;
  list-style: none;
  padding: 0;
}

.navbar-links a {
  text-decoration: none;
  color: #475569;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
}

.navbar-links a:hover, .navbar-links a.nav-active {
  color: #1a3b5c;
}

.navbar-links a.nav-active {
  font-weight: 700;
}

.navbar-links a.nav-active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #1a3b5c;
  border-radius: 2px;
}

.navbar-auth {
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
}

.btn-nav-signin {
  color: #1a3b5c;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 22px;
  border: 1.5px solid #1a3b5c;
  border-radius: 8px;
  transition: all 0.2s;
  background: transparent;
  display: inline-block;
  text-decoration: none;
}

.btn-nav-signin:hover {
  background: rgba(26, 59, 92, 0.05);
}

.btn-nav-signup {
  background: #1a3b5c;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  padding: 11px 26px;
  border-radius: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(26, 59, 92, 0.2);
  display: inline-block;
  text-decoration: none;
}

.btn-nav-signup:hover {
  background: #2563a8;
  color: #ffffff;
  transform: translateY(-1px);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px 6px 6px;
  background: #f8fafc;
  border-radius: 50px;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  text-decoration: none;
}

.navbar-user:hover { background: #f1f5f9; }

.navbar-user .avatar {
  width: 34px;
  height: 34px;
  background: #1a3b5c;
  color: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
}

.navbar-user .user-info { display: flex; flex-direction: column; }
.navbar-user .user-name { font-size: 13px; font-weight: 700; color: #1a3b5c; line-height: 1.2; }
.navbar-user .user-role { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

.hidden { display: none !important; }


/* ===== PREMIUM FOOTER ===== */
.premium-footer {
    background: #1a3b5c !important;
    color: #ffffff !important;
    padding: 80px 0 40px !important;
    font-family: 'Inter', sans-serif !important;
    margin-top: auto !important;
}

.footer-container {
    max-width: 1200px !important;
    margin: 0 auto !important;
    padding: 0 40px !important;
    display: grid !important;
    grid-template-columns: 2fr 1fr 1fr 1fr !important;
    gap: 60px !important;
}

.footer-brand .footer-logo {
    font-family: 'Playfair Display', serif !important;
    font-size: 32px !important;
    font-weight: 800 !important;
    margin-bottom: 20px !important;
    display: block !important;
    color: #fff !important;
}

.footer-brand p {
    color: #cbd5e1 !important;
    font-size: 15px !important;
    line-height: 1.7 !important;
    margin-bottom: 24px !important;
}

.footer-section h4 {
    color: #ffffff !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 1.5px !important;
    margin-bottom: 24px !important;
    margin-top: 0 !important;
}

.footer-links {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
}

.footer-links li {
    margin-bottom: 14px !important;
}

.footer-links a {
    color: #cbd5e1 !important;
    text-decoration: none !important;
    font-size: 14px !important;
    transition: color 0.2s !important;
}

.footer-links a:hover {
    color: #ffffff !important;
}

.footer-bottom {
    max-width: 1200px !important;
    margin: 60px auto 0 !important;
    padding: 32px 40px 0 !important;
    border-top: 1px solid rgba(255,255,255,0.1) !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    color: #94a3b8 !important;
    font-size: 13px !important;
}
`;

const NAV_HTML_TEMPLATE = `
  <nav class="navbar">
    <a href="index.html" class="navbar-brand">Kindred</a>
    <div class="navbar-links">
      <a href="index.html" data-nav="index">Home</a>
      <a href="organizations.html" data-nav="organizations">Organizations</a>
      <a href="programs.html" data-nav="programs">Programs</a>
      <a href="donate.html" data-nav="donate">Donate</a>
      <a href="contact.html" data-nav="contact">Contact</a>
    </div>
    <div class="navbar-auth">
      <a href="signin.html" class="btn-nav-signin">Sign In</a>
      <a href="signup.html" class="btn-nav-signup">Sign Up</a>
    </div>
    <div class="navbar-user hidden">
      <div class="avatar">U</div>
      <div class="user-info">
        <span class="user-name">User</span>
        <span class="user-role">Role</span>
      </div>
      <span class="chevron">▾</span>
    </div>
  </nav>
`;

const FOOTER_HTML_TEMPLATE = `
  <footer class="premium-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <span class="footer-logo">Kindred</span>
        <p>Connecting compassion with community. A unified platform for volunteers, donors, and beneficiaries across India.</p>
      </div>
      <div class="footer-section">
        <h4>Explore</h4>
        <ul class="footer-links">
          <li><a href="programs.html">Active Programs</a></li>
          <li><a href="organizations.html">Our Partners</a></li>
          <li><a href="donate.html">Donation Portal</a></li>
          <li><a href="signup.html">Join Us</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Information</h4>
        <ul class="footer-links">
          <li><a href="about.html">About Kindred</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="emergency-request.html">Emergency Help</a></li>
          <li><a href="feedback.html">Give Feedback</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Contact</h4>
        <ul class="footer-links" style="color: #cbd5e1; font-size: 14px;">
          <li style="margin-bottom: 12px;">✉ contact@kindred.org.in</li>
          <li style="margin-bottom: 12px;">📞 +91 912 345 6789</li>
          <li style="margin-bottom: 12px;">📍 New Delhi, India</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2024 Kindred Platform. All rights reserved.</p>
      <div style="display:flex; gap: 20px;">
        <a href="#" style="color:#94a3b8; text-decoration:none;">Privacy Policy</a>
        <a href="#" style="color:#94a3b8; text-decoration:none;">Terms of Service</a>
      </div>
    </div>
  </footer>
`;

function repairCSS() {
  console.log('--- Repairing style1.css ---');
  let content = fs.readFileSync('style1.css', 'utf8');
  
  // Remove existing premium blocks if rerun
  if (content.indexOf('/* ===== PREMIUM NAVBAR ===== */') !== -1) {
    const startIdx = content.indexOf('/* ===== PREMIUM NAVBAR ===== */');
    const endIdx = content.indexOf('/* ===== MAIN CONTENT ===== */');
    if (endIdx !== -1) {
        content = content.substring(0, startIdx) + content.substring(endIdx);
    }
  }

  // Prepend premium CSS after root
  const rootIdx = content.indexOf('}');
  if (rootIdx !== -1) {
    content = content.substring(0, rootIdx+1) + "\n" + PREMIUM_NAV_CSS + "\n" + content.substring(rootIdx+1);
  } else {
    content = PREMIUM_NAV_CSS + "\n" + content;
  }
  
  fs.writeFileSync('style1.css', content);
  console.log('style1.css updated.');
}

function repairHTMLFiles() {
  console.log('--- Repairing HTML Files ---');
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    let content = fs.readFileSync(path.join(DIR, file), 'utf8');
    let changed = false;

    // 1. Ensure style1.css is linked (and it's the primary style)
    if (content.indexOf('style1.css') === -1) {
      content = content.replace('</head>', '  <link rel="stylesheet" href="style1.css">\n</head>');
      changed = true;
    }
    
    // 2. Remove other conflicting styles (styles.css, styles1.css etc from head if they exist near style1)
    // Actually, safer to just keep them but style1.css overrides with !important where needed.

    // 3. Replace Navbar
    const navRegex = /<nav[^>]*>([\s\S]*?)<\/nav>/i;
    if (navRegex.test(content)) {
        const pageKey = file.replace('.html', '');
        let navHtml = NAV_HTML_TEMPLATE.replace('data-nav="' + pageKey + '"', 'data-nav="' + pageKey + '" class="nav-active"');
        content = content.replace(navRegex, navHtml);
        changed = true;
    }

    // 4. Replace Footer
    const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/i;
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, FOOTER_HTML_TEMPLATE);
        changed = true;
    }

    if (changed) {
      fs.writeFileSync(path.join(DIR, file), content);
      console.log('Fixed: ' + file);
    }
  });
}

repairCSS();
repairHTMLFiles();
console.log('--- Repair Complete ---');
