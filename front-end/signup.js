/* ============================================================
   KINDRED — SIGNUP PAGE JS  (matches actual field IDs)
   Full validation for all 4 role forms
   ============================================================ */

// ── Role tab switching ───────────────────────────────────────
function selectRole(btn, role) {
  document.querySelectorAll('.role-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  ['org','volunteer','donor','beneficiary'].forEach(function(r){
    var el = document.getElementById('form-' + r);
    if (el) el.style.display = (r === role) ? 'block' : 'none';
  });
}

// ── Gender selection ─────────────────────────────────────────
function selectGender(btn) {
  btn.closest('.gender-group, .gender-grid').querySelectorAll('.gender-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
}

// ── Password toggle ──────────────────────────────────────────
function togglePass(id, btn) {
  var inp = document.getElementById(id);
  if (!inp) return;
  var isPass = inp.type === 'password';
  inp.type = isPass ? 'text' : 'password';
  btn.innerHTML = isPass
    ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

// ── Shared validation helpers ────────────────────────────────
function setErr(inputId, msg) {
  var inp = document.getElementById(inputId);
  if (inp) inp.style.borderColor = '#ef4444';
  // Try to show an error element next to the field
  var errEl = document.getElementById(inputId + '-err');
  if (!errEl) {
    // Create inline error if not present
    errEl = document.createElement('p');
    errEl.id = inputId + '-err';
    errEl.style.cssText = 'color:#ef4444;font-size:.74rem;margin:3px 0 0;';
    if (inp && inp.parentNode) inp.parentNode.appendChild(errEl);
  }
  if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
}

function clearErr(inputId) {
  var inp = document.getElementById(inputId);
  if (inp) inp.style.borderColor = '';
  var errEl = document.getElementById(inputId + '-err');
  if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
}

function validateEmail(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }

// Strict Indian phone validation — returns { valid, message }
function validatePhone(val) {
  if (!val || !val.trim()) return { valid: true, message: '' }; // phone is optional
  var digits = val.replace(/\D/g, '');
  // Strip +91 prefix or leading 0
  if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
  if (digits.length === 11 && digits.charAt(0) === '0')   digits = digits.slice(1);
  // Must be exactly 10 digits
  if (digits.length !== 10)                return { valid: false, message: 'Phone number must be exactly 10 digits' };
  // Only numeric
  if (!/^\d{10}$/.test(digits))           return { valid: false, message: 'Only digits (0–9) allowed — no spaces, dashes or letters' };
  // Must start with 6, 7, 8 or 9
  if (!/^[6-9]/.test(digits))             return { valid: false, message: 'Phone number must start with 6, 7, 8, or 9' };
  // All identical digits
  if (/^(\d)\1{9}$/.test(digits))         return { valid: false, message: 'Invalid number — all digits cannot be the same (e.g. 9999999999)' };
  // Obvious dummy sequences
  var dummy = ['1234567890','0123456789','9876543210','1111111111','1234512345'];
  if (dummy.indexOf(digits) !== -1)       return { valid: false, message: 'Please enter a real phone number — dummy patterns are not accepted' };
  // Repeated 2-digit block (e.g. 1212121212)
  if (/^(\d{2})\1{4}$/.test(digits))      return { valid: false, message: 'Invalid number — sequential repeated pattern detected' };
  // Repeated 3-digit block (e.g. 123123123x)
  if (/^(\d{3})\1{2}\d/.test(digits))     return { valid: false, message: 'Invalid number — sequential repeated pattern detected' };
  return { valid: true, message: '', digits: digits };
}
function validatePass(val) {
  if (val.length < 8)          return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(val))      return 'Must include at least one uppercase letter';
  if (!/[0-9]/.test(val))      return 'Must include at least one number';
  if (!/[^A-Za-z0-9]/.test(val)) return 'Must include at least one special character';
  return null; // valid
}

// ── Check if email already registered ────────────────────────
function isEmailTaken(email) {
  // Check MOCK_USERS
  for (var i = 0; i < MOCK_USERS.length; i++) {
    if (MOCK_USERS[i].email === email) return true;
  }
  // Check registered users
  if (typeof UserDB !== 'undefined') {
    var existing = UserDB.getByEmail(email);
    if (existing) return true;
  }
  return false;
}

function validatePair(nameId, emailId, phoneId, passId, pass2Id, role, successUrl) {
  var name  = document.getElementById(nameId);
  var email = document.getElementById(emailId);
  var phone = document.getElementById(phoneId);
  var pass  = document.getElementById(passId);
  var pass2 = document.getElementById(pass2Id);

  [nameId, emailId, phoneId, passId, pass2Id].forEach(clearErr);

  var valid = true;

  if (!name || !name.value.trim() || name.value.trim().length < 2) {
    setErr(nameId, 'Full name is required (min 2 characters)'); valid = false;
  }
  if (!email || !email.value.trim()) {
    setErr(emailId, 'Email address is required'); valid = false;
  } else if (!validateEmail(email.value.trim())) {
    setErr(emailId, 'Please enter a valid email address'); valid = false;
  } else if (isEmailTaken(email.value.trim())) {
    setErr(emailId, 'This email is already registered'); valid = false;
  }
  // Phone (required, 10 digits)
  if (!phone || !phone.value.trim()) {
    setErr(phoneId, 'Phone number is required (10 digits)'); valid = false;
  } else {
    var phoneResult = validatePhone(phone.value.trim());
    if (!phoneResult.valid) {
      setErr(phoneId, phoneResult.message); valid = false;
    }
  }
  if (!pass || !pass.value) {
    setErr(passId, 'Password is required'); valid = false;
  } else {
    var passErr = validatePass(pass.value);
    if (passErr) { setErr(passId, passErr); valid = false; }
  }
  if (!pass2 || !pass2.value) {
    setErr(pass2Id, 'Please confirm your password'); valid = false;
  } else if (pass && pass2.value !== pass.value) {
    setErr(pass2Id, 'Passwords do not match'); valid = false;
  }

  if (valid) {
    // Register user in the system
    var userData = {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone ? phone.value.trim() : '',
      password: pass.value,
      role: role
    };

    // POST to backend API, fallback to local
    if (typeof apiPost === 'function') {
      apiPost('/users/register', userData).then(function(res) {
        if (res.ok && res.body.data) {
          // Also save locally for immediate session access
          if (typeof UserDB !== 'undefined') UserDB.create(res.body.data);
        } else {
          // Fallback to local create
          if (typeof UserDB !== 'undefined') UserDB.create(userData);
        }
        window.location.href = successUrl;
      });
    } else {
      if (typeof UserDB !== 'undefined') UserDB.create(userData);
      setTimeout(function() { window.location.href = successUrl; }, 400);
    }
  }
  return valid;
}

// ── Form Submit Functions ────────────────────────────────────
function submitOrg() {
  var orgName = document.getElementById('org-name');
  var orgFocus= document.getElementById('org-focus');
  var orgAdmin= document.getElementById('org-admin');
  var orgEmail= document.getElementById('org-email');
  var orgPass = document.getElementById('org-pass');
  var orgPass2= document.getElementById('org-pass2');

  ['org-name','org-focus','org-admin','org-email','org-pass','org-pass2'].forEach(clearErr);

  var valid = true;
  if (!orgName || !orgName.value.trim() || orgName.value.trim().length < 2) {
    setErr('org-name', 'Organization name is required'); valid = false;
  }
  if (!orgFocus || !orgFocus.value.trim()) {
    setErr('org-focus', 'Focus area is required'); valid = false;
  }
  if (!orgAdmin || !orgAdmin.value.trim() || orgAdmin.value.trim().length < 2) {
    setErr('org-admin', 'Admin name is required'); valid = false;
  }
  if (!orgEmail || !orgEmail.value.trim()) {
    setErr('org-email', 'Email is required'); valid = false;
  } else if (!validateEmail(orgEmail.value.trim())) {
    setErr('org-email', 'Enter a valid email address'); valid = false;
  } else if (isEmailTaken(orgEmail.value.trim())) {
    setErr('org-email', 'This email is already registered'); valid = false;
  }
  if (!orgPass || !orgPass.value) {
    setErr('org-pass', 'Password is required'); valid = false;
  } else {
    var pe = validatePass(orgPass.value);
    if (pe) { setErr('org-pass', pe); valid = false; }
  }
  if (!orgPass2 || !orgPass2.value) {
    setErr('org-pass2', 'Please confirm your password'); valid = false;
  } else if (orgPass && orgPass2.value !== orgPass.value) {
    setErr('org-pass2', 'Passwords do not match'); valid = false;
  }

  if (valid) {
    var orgData = {
      name: orgAdmin.value.trim(),
      email: orgEmail.value.trim(),
      password: orgPass.value,
      role: 'admin',
      org: orgName.value.trim()
    };

    var btn = document.querySelector('#form-org .btn');
    if (btn) { btn.textContent = '✓ Registering…'; btn.disabled = true; btn.style.background = '#10b981'; }

    // POST to backend API, fallback to local
    if (typeof apiPost === 'function') {
      apiPost('/users/register', orgData).then(function(res) {
        if (res.ok && res.body.data) {
          if (typeof UserDB !== 'undefined') UserDB.create(res.body.data);
        } else {
          orgData.orgFocus = orgFocus.value.trim();
          orgData.status = 'pending';
          if (typeof UserDB !== 'undefined') UserDB.create(orgData);
        }
        window.location.href = 'registration-pending.html';
      });
    } else {
      orgData.orgFocus = orgFocus.value.trim();
      orgData.status = 'pending';
      if (typeof UserDB !== 'undefined') UserDB.create(orgData);
      setTimeout(function() { window.location.href = 'registration-pending.html'; }, 500);
    }
  }
}

function submitVolunteer() {
  validatePair('vol-name','vol-email','vol-phone','vol-pass','vol-pass2', 'volunteer', 'registration-pending.html');
}

function submitDonor() {
  validatePair('don-name','don-email','don-phone','don-pass','don-pass2', 'donor', 'otp-verify.html');
}

function submitBeneficiary() {
  var benName  = document.getElementById('ben-name');
  var benEmail = document.getElementById('ben-email');
  var benPhone = document.getElementById('ben-phone');
  var benPass  = document.getElementById('ben-pass');
  var benPass2 = document.getElementById('ben-pass2');

  ['ben-name','ben-email','ben-phone','ben-pass','ben-pass2'].forEach(clearErr);

  var valid = true;
  if (!benName || !benName.value.trim() || benName.value.trim().length < 2) {
    setErr('ben-name', 'Full name is required'); valid = false;
  }
  if (!benEmail || !benEmail.value.trim()) {
    setErr('ben-email', 'Email is required'); valid = false;
  } else if (!validateEmail(benEmail.value.trim())) {
    setErr('ben-email', 'Enter a valid email address'); valid = false;
  } else if (isEmailTaken(benEmail.value.trim())) {
    setErr('ben-email', 'This email is already registered'); valid = false;
  }
  if (benPhone && benPhone.value.trim()) {
    var bpResult = validatePhone(benPhone.value.trim());
    if (!bpResult.valid) {
      setErr('ben-phone', bpResult.message); valid = false;
    }
  }
  if (!benPass || !benPass.value) {
    setErr('ben-pass', 'Password is required'); valid = false;
  } else {
    var pe2 = validatePass(benPass.value);
    if (pe2) { setErr('ben-pass', pe2); valid = false; }
  }
  if (!benPass2 || !benPass2.value) {
    setErr('ben-pass2', 'Please confirm your password'); valid = false;
  } else if (benPass && benPass2.value !== benPass.value) {
    setErr('ben-pass2', 'Passwords do not match'); valid = false;
  }

  if (valid) {
    var benData = {
      name: benName.value.trim(),
      email: benEmail.value.trim(),
      phone: benPhone ? benPhone.value.trim() : '',
      password: benPass.value,
      role: 'beneficiary'
    };

    var btn2 = document.querySelector('#form-beneficiary .btn-green-solid');
    if (btn2) { btn2.textContent = '✓ Processing…'; btn2.disabled = true; btn2.style.background = '#10b981'; }

    // POST to backend API
    if (typeof apiPost === 'function') {
      apiPost('/users/register', benData).then(function(res) {
        if (res.ok && res.body.data) {
          if (typeof UserDB !== 'undefined') UserDB.create(res.body.data);
        } else {
          benData.status = 'approved';
          if (typeof UserDB !== 'undefined') UserDB.create(benData);
        }
        window.location.href = 'otp-verify.html';
      });
    } else {
      benData.status = 'approved';
      if (typeof UserDB !== 'undefined') UserDB.create(benData);
      setTimeout(function() { window.location.href = 'otp-verify.html'; }, 500);
    }
  }
}
