function togglePass(id, btn) {
  const inp = document.getElementById(id);
  const isPass = inp.type === 'password';
  inp.type = isPass ? 'text' : 'password';
  btn.innerHTML = isPass
    ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function checkStrength(val) {
  const bar   = document.getElementById('strength-bar');
  const label = document.getElementById('strength-label');
  let score = 0;
  if (val.length >= 8)            score++;
  if (/[A-Z]/.test(val))          score++;
  if (/[0-9]/.test(val))          score++;
  if (/[^A-Za-z0-9]/.test(val))   score++;

  const map = [
    { w:'0%',   bg:'#e5e9f0', txt:'' },
    { w:'25%',  bg:'#ef4444', txt:'Weak' },
    { w:'50%',  bg:'#f59e0b', txt:'Fair' },
    { w:'75%',  bg:'#3b82f6', txt:'Good' },
    { w:'100%', bg:'#10b981', txt:'Strong' },
  ];
  bar.style.width      = map[score].w;
  bar.style.background = map[score].bg;
  label.textContent    = map[score].txt;
  label.style.color    = map[score].bg;
}

function resetPassword() {
  const pass  = document.getElementById('rp-pass');
  const pass2 = document.getElementById('rp-pass2');
  const errEl = document.getElementById('rp-error');

  pass.style.borderColor  = '';
  pass2.style.borderColor = '';
  errEl.style.display     = 'none';

  let valid = true;

  if (!pass.value || pass.value.length < 8) {
    pass.style.borderColor = '#ef4444';
    errEl.textContent = 'Password must be at least 8 characters';
    errEl.style.display = 'block';
    valid = false;
  } else if (pass.value !== pass2.value) {
    pass2.style.borderColor = '#ef4444';
    errEl.textContent = 'Passwords do not match';
    errEl.style.display = 'block';
    valid = false;
  }

  if (valid) window.location = 'reset-success.html';
}

document.addEventListener('DOMContentLoaded', () => {
  // Show role in badge
  const role = new URLSearchParams(window.location.search).get('role') || 'volunteer';
  const roleMap = {
    platform:'Platform Administrator', org:'Organization Admin',
    volunteer:'Volunteer', donor:'Donor', beneficiary:'Beneficiary'
  };
  const badge = document.getElementById('rp-role-badge');
  if (badge) badge.textContent = roleMap[role] || role;
});
