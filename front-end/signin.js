/* ============================================================
   KINDRED — SIGN IN PAGE JS
   Uses auth.js for session management & role-based routing
   ============================================================ */

function selectSignInRole(btn) {
  document.querySelectorAll('.role-list-item').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var err = document.getElementById('si-role-error');
  if (err) err.style.display = 'none';

  var roleMap = { platform: 'superuser', org: 'admin', volunteer: 'volunteer', donor: 'donor', beneficiary: 'beneficiary' };
  var roleSlug = btn.getAttribute('data-role');
  var mappedRole = roleMap[roleSlug] || roleSlug;
  var demo = getDemoCredentials(mappedRole);
  if (demo) {
    var emailEl = document.getElementById('si-email');
    var passEl  = document.getElementById('si-pass');
    if (emailEl) emailEl.value = demo.email;
    if (passEl)  passEl.value  = demo.password;
    var hint = document.getElementById('demo-hint');
    if (hint) { hint.textContent = '✓ Demo credentials loaded — click Sign In to continue.'; hint.style.display = 'block'; }
  }
}

function togglePass(id, btn) {
  var inp = document.getElementById(id);
  var isPass = inp.type === 'password';
  inp.type = isPass ? 'text' : 'password';
  btn.innerHTML = isPass
    ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

function doSignIn() {
  var roleBtn  = document.querySelector('.role-list-item.active');
  var emailEl  = document.getElementById('si-email');
  var passEl   = document.getElementById('si-pass');
  var roleErr  = document.getElementById('si-role-error');
  var emailErr = document.getElementById('si-email-error');
  var passErr  = document.getElementById('si-pass-error');
  var genErr   = document.getElementById('si-general-error');

  if (roleErr)  roleErr.style.display  = 'none';
  if (emailErr) emailErr.style.display = 'none';
  if (passErr)  passErr.style.display  = 'none';
  if (genErr)   genErr.style.display   = 'none';
  emailEl.style.borderColor = '';
  passEl.style.borderColor  = '';

  var valid = true;

  if (!roleBtn) {
    if (roleErr) roleErr.style.display = 'block';
    valid = false;
  }

  var email = emailEl.value.trim();
  if (!email) {
    emailEl.style.borderColor = '#ef4444';
    if (emailErr) { emailErr.textContent = 'Email is required'; emailErr.style.display = 'block'; }
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailEl.style.borderColor = '#ef4444';
    if (emailErr) { emailErr.textContent = 'Please enter a valid email address'; emailErr.style.display = 'block'; }
    valid = false;
  }

  var pass = passEl.value;
  if (!pass) {
    passEl.style.borderColor = '#ef4444';
    if (passErr) { passErr.textContent = 'Password is required'; passErr.style.display = 'block'; }
    valid = false;
  } else if (pass.length < 6) {
    passEl.style.borderColor = '#ef4444';
    if (passErr) { passErr.textContent = 'Password must be at least 6 characters'; passErr.style.display = 'block'; }
    valid = false;
  }

  if (!valid) return;

  var roleMap = { platform: 'superuser', org: 'admin', volunteer: 'volunteer', donor: 'donor', beneficiary: 'beneficiary' };
  var roleSlug = roleBtn.getAttribute('data-role');
  var authRole = roleMap[roleSlug] || roleSlug;

  // Show loading state
  var btnEl = document.querySelector('.btn-signin-main');
  if (btnEl) { btnEl.textContent = 'Signing in…'; btnEl.disabled = true; }

  // Try backend API first, then fallback to local auth
  var handleResult = function (result) {
    if (result.success) {
      if (btnEl) { btnEl.textContent = '✓ Signed in!'; btnEl.style.background = '#10b981'; }
      setTimeout(function () { 
        var params = new URLSearchParams(window.location.search);
        var redirect = params.get('redirect') || result.session.dashboard;
        window.location.href = redirect; 
      }, 600);
    } else {
      if (btnEl) { btnEl.textContent = 'Sign In'; btnEl.disabled = false; btnEl.style.background = ''; }
      // Handle different error types
      if (result.error === 'pending') {
        if (genErr) {
          genErr.innerHTML = '<div style="display:flex;align-items:flex-start;gap:10px">' +
            '<svg width="20" height="20" style="flex-shrink:0;margin-top:1px" fill="none" stroke="#92400e" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            '<div><strong style="display:block;margin-bottom:2px">Account Under Review</strong>' + result.message + '</div></div>';
          genErr.style.display = 'block';
          genErr.style.background = '#fffbeb';
          genErr.style.borderColor = '#fde68a';
          genErr.style.color = '#92400e';
        }
      } else if (result.error === 'rejected') {
        if (genErr) {
          genErr.innerHTML = '<div style="display:flex;align-items:flex-start;gap:10px">' +
            '<svg width="20" height="20" style="flex-shrink:0;margin-top:1px" fill="none" stroke="#991b1b" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' +
            '<div><strong style="display:block;margin-bottom:2px">Registration Not Approved</strong>' + result.message + '</div></div>';
          genErr.style.display = 'block';
          genErr.style.background = '#fef2f2';
          genErr.style.borderColor = '#fecaca';
          genErr.style.color = '#991b1b';
        }
      } else {
        if (genErr) {
          genErr.textContent = result.message || 'Invalid credentials. Select a role above to auto-fill demo credentials.';
          genErr.style.display = 'block';
          genErr.style.background = '#fef2f2';
          genErr.style.borderColor = '#fecaca';
          genErr.style.color = '#ef4444';
        }
        emailEl.style.borderColor = '#ef4444';
        passEl.style.borderColor  = '#ef4444';
      }
    }
  };

  // Use async backend sign-in if available, fallback to sync local
  if (typeof signInAsync === 'function') {
    signInAsync(authRole, email, pass).then(handleResult);
  } else {
    handleResult(signIn(authRole, email, pass));
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var existing = getSession();
  if (existing) { window.location.href = existing.dashboard; return; }

  var card = document.querySelector('.card');
  if (card && !document.getElementById('si-general-error')) {
    var errEl = document.createElement('p');
    errEl.id = 'si-general-error';
    errEl.style.cssText = 'display:none;color:#ef4444;font-size:.8rem;margin-bottom:12px;padding:8px 12px;background:#fef2f2;border-radius:8px;border:1px solid #fecaca;';
    var submitBtn = card.querySelector('.btn-signin-main');
    if (submitBtn) submitBtn.parentNode.insertBefore(errEl, submitBtn);
  }
  if (card && !document.getElementById('demo-hint')) {
    var hintEl = document.createElement('p');
    hintEl.id = 'demo-hint';
    hintEl.style.cssText = 'display:none;color:#059669;font-size:.78rem;margin-bottom:10px;padding:6px 10px;background:#ecfdf5;border-radius:6px;border:1px solid #a7f3d0;';
    var roleLabel = card.querySelector('.role-list-label');
    if (roleLabel) roleLabel.parentNode.insertBefore(hintEl, roleLabel);
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSignIn(); });

  // Patch the inline onclick to use doSignIn
  var mainBtn = document.querySelector('.btn-signin-main');
  if (mainBtn) { mainBtn.removeAttribute('onclick'); mainBtn.addEventListener('click', doSignIn); }
});
