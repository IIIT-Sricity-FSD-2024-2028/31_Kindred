/* ============================================================
   KINDRED — NAV CONTROLLER
   nav-controller.js — include on EVERY page (after auth.js)
   Handles: navigation links, auth gating, dynamic navbar,
            sign-out, back buttons
   ============================================================ */

(function () {
  'use strict';

  // ── Page Classification ──────────────────────────────────
  var currentPage = location.pathname.split('/').pop() || 'index.html';

  // Protected pages and their allowed roles
  var PROTECTED_PAGES = {
    'overview.html':                    ['superuser'],
    'requests.html':                    ['superuser'],
    'analytics.html':                   ['superuser'],
    'admin-users.html':                 ['superuser'],
    'org-admin-overview.html':          ['admin'],
    'org-admin-programs.html':          ['admin'],
    'org-admin-requests.html':          ['admin'],
    'org-admin-organizations.html':     ['admin', 'donor'],
    'volunteers.html':                  ['admin'],
    'resources.html':                   ['admin'],
    'incoming.html':                    ['admin'],
    'create-program.html':              ['admin'],
    'program-success.html':             ['admin'],
    'beneficiary-dashboard.html':       ['beneficiary'],
    'volunteer-dashboard.html':         ['volunteer'],
    'donor-dashboard.html':             ['donor'],
    'profile.html':                     ['admin', 'volunteer', 'donor', 'beneficiary'],
    'page2-new-request-modal.html':     ['volunteer', 'donor', 'beneficiary'],
    'page5-connected-notification.html':['volunteer', 'donor', 'beneficiary']
  };

  // Auth-flow pages
  var AUTH_PAGES = [
    'signin.html', 'signup.html', 'demo-login.html',
    'forgot-password.html', 'forgot-otp.html', 'reset-password.html',
    'reset-success.html', 'otp-verify.html', 'phone-entry.html', 'ngo-success.html',
    'registration-pending.html', 'join-volunteer.html'
  ];

  var NAV_LINKS = {
    'Home':          'index.html',
    'Organizations': 'organizations.html',
    'Programs':      'programs.html',
    'Donate':        'donate.html',
    'Contact':       'contact.html'
  };

  // ── Auth Guard ───────────────────────────────────────────
  function runAuthGuard() {
    if (AUTH_PAGES.indexOf(currentPage) !== -1) return;
    var session = (typeof getSession === 'function') ? getSession() : null;
    var protectedConfig = PROTECTED_PAGES[currentPage];
    if (protectedConfig) {
      if (!session) { window.location.href = 'signin.html'; return; }
      if (protectedConfig.indexOf(session.role) === -1) {
        window.location.href = session.dashboard || 'index.html';
        return;
      }
    }
  }

  // ── Fix Navigation Links ─────────────────────────────────
  function fixNavLinks() {
    var allNavLinks = document.querySelectorAll('.navbar-links a, .navbar-nav a, .footer-links a');
    allNavLinks.forEach(function (link) {
      var text = link.textContent.trim();
      if (NAV_LINKS[text] && (link.getAttribute('href') === '#' || !link.getAttribute('href'))) {
        link.setAttribute('href', NAV_LINKS[text]);
      }
    });
  }

  // ── Dynamic Navbar: Auth State ───────────────────────────
  function updateNavbarAuthState() {
    var session = (typeof getSession === 'function') ? getSession() : null;
    var navbarAuth = document.querySelector('.navbar-auth');
    var navbarUser = document.querySelector('.navbar-user');

    if (navbarAuth && navbarUser) {
      if (session) {
        navbarAuth.classList.add('hidden');
        navbarUser.classList.remove('hidden');
        var avatar = navbarUser.querySelector('.avatar');
        var userName = navbarUser.querySelector('.user-name');
        var userRole = navbarUser.querySelector('.user-role');
        if (avatar) { avatar.textContent = session.initials; avatar.style.background = session.avatar; }
        if (userName) userName.textContent = session.name;
        if (userRole) userRole.textContent = getRoleLabel(session.role);
        ensureUserDropdown(navbarUser, session);
      } else {
        navbarAuth.classList.remove('hidden');
        navbarUser.classList.add('hidden');
      }
    }
  }

  // ── Ensure dropdown on user widget ───────────────────────
  function ensureUserDropdown(userEl, session) {
    if (userEl.querySelector('.nav-dropdown')) return;
    userEl.style.position = 'relative';
    var dd = document.createElement('div');
    dd.className = 'nav-dropdown';
    dd.style.cssText = 'display:none;position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.12);min-width:210px;z-index:9999;padding:8px 0;';
    var dashLink = session.dashboard || 'index.html';

    var profileItem = '';
    if (session.role !== 'superuser') {
      profileItem = '<a href="profile.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:.85rem;color:#374151;text-decoration:none;">👤 My Profile</a>';
    }

    dd.innerHTML =
      '<div style="padding:10px 16px 8px;border-bottom:1px solid #f1f5f9;margin-bottom:4px;">' +
        '<div style="font-size:.82rem;font-weight:700;color:#1e293b;">' + (session.name || 'User') + '</div>' +
        '<div style="font-size:.74rem;color:#94a3b8;margin-top:2px;">' + getRoleLabel(session.role) + '</div>' +
      '</div>' +
      profileItem +
      '<a href="' + dashLink + '" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:.85rem;color:#374151;text-decoration:none;">📋 My Dashboard</a>' +
      '<a href="index.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:.85rem;color:#374151;text-decoration:none;">🏠 Home</a>' +
      '<hr style="border:none;border-top:1px solid #f1f5f9;margin:4px 0"/>' +
      '<button id="navSignOutBtn" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:10px 16px;font-size:.85rem;color:#ef4444;background:none;border:none;cursor:pointer;font-family:inherit;">🚪 Sign Out</button>';
    userEl.appendChild(dd);
    userEl.addEventListener('click', function (e) {
      if (e.target.closest('#navSignOutBtn')) return;
      if (e.target.tagName === 'A') return;
      dd.style.display = (dd.style.display === 'block') ? 'none' : 'block';
    });
    var soBtn = dd.querySelector('#navSignOutBtn');
    if (soBtn) soBtn.onclick = function() { globalSignOut(); };
    document.addEventListener('click', function (e) { if (!userEl.contains(e.target)) dd.style.display = 'none'; });
  }

  function getRoleLabel(role) {
    var labels = { superuser: 'Platform Administrator', admin: 'Organization Admin', volunteer: 'Volunteer', donor: 'Donor', beneficiary: 'Beneficiary' };
    return labels[role] || role;
  }

  function fixActionButtons() {
    var session = (typeof getSession === 'function') ? getSession() : null;
    document.querySelectorAll('.btn-campaign-donate, [class*="donate"]').forEach(function (btn) {
      if (btn.tagName === 'A' && (btn.getAttribute('href') === '#' || !btn.getAttribute('href'))) btn.setAttribute('href', 'donate.html');
    });
  }

  function highlightActiveNav() {
    var links = document.querySelectorAll('.navbar-links a, .navbar-nav a');
    links.forEach(function (link) {
      link.classList.remove('nav-active');
      var href = link.getAttribute('href');
      if (href && href === currentPage) link.classList.add('nav-active');
    });
  }

  function globalSignOut() {
    if (typeof signOut === 'function') { signOut(); } 
    else { sessionStorage.removeItem('kindred_session'); window.location.href = 'signin.html'; }
  }

  runAuthGuard();
  document.addEventListener('DOMContentLoaded', function () {
    fixNavLinks();
    updateNavbarAuthState();
    fixActionButtons();
    highlightActiveNav();
  });

})();
