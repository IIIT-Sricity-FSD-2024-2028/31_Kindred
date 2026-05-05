const fs = require('fs');
const path = require('path');

const DIR = '.';

const NAV_BASE = `  <nav class="navbar">
    <a href="index.html" class="navbar-brand">
      Kindred
    </a>
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
    <div class="navbar-user" style="display:none;">
      <div class="avatar">KS</div>
      <div class="user-info">
        <span class="user-name">User</span>
        <span class="user-role">Role</span>
      </div>
      <span class="chevron">▾</span>
    </div>
  </nav>`;

const FOOTER_HTML = `  <footer class="footer" style="background: #1a3b5c; color: #fff; padding: 60px 0 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-top: auto;">
    <div class="footer-content" style="max-width: 1200px; margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; margin-bottom: 40px;">
      <div class="footer-brand">
        <div class="footer-logo" style="font-family: 'Playfair Display', serif; font-weight: 700; font-size: 24px; margin-bottom: 16px;">
          Kindred
        </div>
        <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6; padding-right: 20px;">Connecting individuals, volunteers, donors, and beneficiaries to create meaningful impact across communities in India.</p>
      </div>
      <div class="footer-col">
        <h4 style="color: #94a3b8; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Quick Links</h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 12px;"><a href="organizations.html" style="color: #e2e8f0; text-decoration: none; font-size: 14px;">All Organizations</a></li>
          <li style="margin-bottom: 12px;"><a href="beneficiary-dashboard.html" style="color: #e2e8f0; text-decoration: none; font-size: 14px;">Beneficiary Portal</a></li>
          <li style="margin-bottom: 12px;"><a href="donate.html" style="color: #e2e8f0; text-decoration: none; font-size: 14px;">Donations Portal</a></li>
          <li style="margin-bottom: 12px;"><a href="register-ngo.html" style="color: #e2e8f0; text-decoration: none; font-size: 14px;">Register NGO</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 style="color: #94a3b8; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">For Users</h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 12px;"><a href="signin.html" style="color: #e2e8f0; text-decoration: none; font-size: 14px;">Donor Dashboard</a></li>
          <li style="margin-bottom: 12px;"><a href="programs.html" style="color: #e2e8f0; text-decoration: none; font-size: 14px;">All Programs</a></li>
          <li style="margin-bottom: 12px;"><a href="org-admin-overview.html" style="color: #e2e8f0; text-decoration: none; font-size: 14px;">Organization Portal</a></li>
          <li style="margin-bottom: 12px;"><a href="#" style="color: #e2e8f0; text-decoration: none; font-size: 14px;">Privacy Policy</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 style="color: #94a3b8; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Contact</h4>
        <div class="footer-contact-item" style="color: #e2e8f0; font-size: 14px; margin-bottom: 12px; display: flex; gap: 10px;">
          <span style="flex-shrink: 0;">✉</span> contact@kindred.org.in
        </div>
        <div class="footer-contact-item" style="color: #e2e8f0; font-size: 14px; margin-bottom: 12px; display: flex; gap: 10px;">
          <span style="flex-shrink: 0;">📞</span> +91 998 765 3210
        </div>
        <div class="footer-contact-item" style="color: #e2e8f0; font-size: 14px; margin-bottom: 12px; display: flex; gap: 10px;">
          <span style="flex-shrink: 0;">📍</span> Connaught Place, New Delhi 110001
        </div>
        <div class="footer-contact-item" style="color: #e2e8f0; font-size: 14px; margin-bottom: 12px; display: flex; gap: 10px;">
          <span style="flex-shrink: 0;">⚠</span> <a href="emergency-request.html" style="color: #ffcccc; text-decoration: none; font-weight: 600;">Emergency Help</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom" style="max-width: 1200px; margin: 0 auto; padding: 24px 32px 0; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #94a3b8; flex-wrap: wrap; gap: 16px;">
      <span>© 2028 Kindred India. All rights reserved. Registered under Societies Registration Act, 1st year.</span>
      <div class="footer-bottom-links" style="display: flex; gap: 20px;">
        <a href="#" style="color: #94a3b8; text-decoration: none;">Privacy Policy</a>
        <a href="#" style="color: #94a3b8; text-decoration: none;">Terms of Service</a>
        <a href="#" style="color: #94a3b8; text-decoration: none;">Cookie Policy</a>
      </div>
    </div>
  </footer>`;

function processFiles() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
  
  for (const file of files) {
    let content = fs.readFileSync(path.join(DIR, file), 'utf8');
    let hasChanges = false;
    
    // 1. Header Replacement
    const navRegex = /<nav class="navbar(?:-protected)?">[\s\S]*?<\/nav>/;
    if (navRegex.test(content)) {
      // Create specific nav for this page to preserve active state
      const pageKey = file.replace('.html', '');
      const target = 'data-nav="' + pageKey + '"';
      const replacement = 'data-nav="' + pageKey + '" class="nav-active"';
      let specificNav = NAV_BASE.replace(target, replacement);
      
      content = content.replace(navRegex, specificNav);
      hasChanges = true;
    }

    // 2. Footer Replacement
    const footerRegex = /<footer class="(?:\w+[- ])*footer[-\w]*\s*"[^>]*>[\s\S]*?<\/footer>/;
    if (footerRegex.test(content)) {
      content = content.replace(footerRegex, FOOTER_HTML);
      hasChanges = true;
    } else {
        const footerRegex2 = /<footer[^>]*>[\s\S]*?<\/footer>/;
        if(footerRegex2.test(content)) {
            content = content.replace(footerRegex2, FOOTER_HTML);
            hasChanges = true;
        }
    }

    // 3. Update "Join as Volunteer" buttons going to signup.html -> join-volunteer.html
    if (content.includes('href="signup.html"')) {
      const matchJoin = content.replace(/(href=")signup\.html([^>]*>[\s\S]*?Join as Volunteer)/ig, '$1join-volunteer.html$2');
      if (matchJoin !== content) {
        content = matchJoin;
        hasChanges = true;
      }
    }
    
    // 4. "Get Involved" rogue buttons if any
    const getInvRegex = /<a[^>]*Get Involved[^<]*<\/a>/gi;
    if (getInvRegex.test(content)) {
        content = content.replace(getInvRegex, '');
        hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(path.join(DIR, file), content, 'utf8');
      console.log('Fixed:', file);
    }
  }
}

processFiles();

