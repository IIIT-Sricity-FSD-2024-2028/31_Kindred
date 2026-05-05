/* ============================================================
   KINDRED — JOIN VOLUNTEER PAGE JS
   join-volunteer.js — dedicated volunteer registration
   ============================================================ */

// ── Toggle Pass (reused from signup.js) ──────────────────────
function togglePass(id, btn) {
  var inp = document.getElementById(id);
  if (!inp) return;
  var isPass = inp.type === 'password';
  inp.type = isPass ? 'text' : 'password';
  btn.innerHTML = isPass
    ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

// ── Gender Selection ─────────────────────────────────────────
function selectGender(btn) {
  btn.closest('.gender-grid').querySelectorAll('.gender-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
}

// ── Skill Checkbox Toggle ────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.skill-check input[type="checkbox"]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      var label = cb.closest('.skill-check');
      if (cb.checked) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    });
  });
});

// ── Custom Skills Management ─────────────────────────────────
var _jvCustomSkills = [];

function addCustomSkillJV() {
  var inp = document.getElementById('jv-custom-skill');
  if (!inp) return;
  var val = inp.value.trim();
  if (!val || val.length < 2) return;
  // Normalize to title case
  val = val.charAt(0).toUpperCase() + val.slice(1);
  // Check duplicates
  var lower = val.toLowerCase();
  if (_jvCustomSkills.some(function(s){ return s.toLowerCase() === lower; })) {
    inp.value = '';
    return;
  }
  // Also check if it matches an existing checkbox
  var existingCheckboxes = document.querySelectorAll('.skill-check input[type="checkbox"]');
  var matchesExisting = false;
  existingCheckboxes.forEach(function(cb) {
    if (cb.value.toLowerCase() === lower || cb.parentElement.textContent.trim().toLowerCase() === lower) {
      cb.checked = true;
      cb.closest('.skill-check').classList.add('selected');
      matchesExisting = true;
    }
  });
  if (matchesExisting) {
    inp.value = '';
    return;
  }

  _jvCustomSkills.push(val);
  inp.value = '';
  renderJVCustomTags();
}

function removeCustomSkillJV(idx) {
  _jvCustomSkills.splice(idx, 1);
  renderJVCustomTags();
}

function renderJVCustomTags() {
  var container = document.getElementById('customSkillTags');
  if (!container) return;
  container.innerHTML = _jvCustomSkills.map(function(s, i) {
    return '<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1.5px solid #a7f3d0;border-radius:20px;font-size:.82rem;font-weight:600;color:#065f46;animation:fadeIn .2s ease">' +
      s +
      '<button type="button" onclick="removeCustomSkillJV(' + i + ')" style="background:none;border:none;color:#dc2626;cursor:pointer;font-size:14px;font-weight:700;padding:0 2px;line-height:1" title="Remove">×</button>' +
      '</span>';
  }).join('');
}

// ── Availability Selection ───────────────────────────────────
function selectAvailability(btn) {
  document.querySelectorAll('.avail-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

// ── Validation Helpers ───────────────────────────────────────
function setFieldErr(inputId, msg) {
  var inp = document.getElementById(inputId);
  if (inp) inp.style.borderColor = '#ef4444';
  var errEl = document.getElementById(inputId + '-err');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.id = inputId + '-err';
    errEl.style.cssText = 'color:#ef4444;font-size:.74rem;margin:3px 0 0;';
    if (inp && inp.parentNode) inp.parentNode.appendChild(errEl);
  }
  if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
}

function clearFieldErr(inputId) {
  var inp = document.getElementById(inputId);
  if (inp) inp.style.borderColor = '';
  var errEl = document.getElementById(inputId + '-err');
  if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
}

function validateEmail(val) { return /^[a-zA-Z0-9.\-_]+@gmail\.com$/.test(val); }

function validatePhone(val) {
  if (!val || !val.trim()) return { valid: false, message: 'Phone number is required' };
  var digits = val.replace(/\D/g, '');
  if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
  if (digits.length === 11 && digits.charAt(0) === '0')   digits = digits.slice(1);
  if (digits.length !== 10)                return { valid: false, message: 'Phone number must be exactly 10 digits' };
  if (!/^\d{10}$/.test(digits))           return { valid: false, message: 'Only digits (0–9) allowed — no letters' };
  if (!/^[6-9]/.test(digits))             return { valid: false, message: 'Must start with 6, 7, 8, or 9' };
  if (/^(\d)\1{9}$/.test(digits))         return { valid: false, message: 'Invalid number pattern' };
  var dummy = ['1234567890','0123456789','9876543210','1111111111','1234512345'];
  if (dummy.indexOf(digits) !== -1)       return { valid: false, message: 'Dummy patterns are not accepted' };
  if (/^(\d{2})\1{4}$/.test(digits))      return { valid: false, message: 'Sequential repeated pattern detected' };
  if (/^(\d{3})\1{2}\d/.test(digits))     return { valid: false, message: 'Sequential repeated pattern detected' };
  return { valid: true, message: '', digits: digits };
}
function validatePass(val) {
  if (val.length < 8)          return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(val))      return 'Must include at least one uppercase letter';
  if (!/[0-9]/.test(val))      return 'Must include at least one number';
  if (!/[^A-Za-z0-9]/.test(val)) return 'Must include at least one special character';
  return null;
}

// ── Submit Volunteer Form ────────────────────────────────────
function submitVolunteerForm() {
  var name  = document.getElementById('jv-name');
  var email = document.getElementById('jv-email');
  var phone = document.getElementById('jv-phone');
  var pass  = document.getElementById('jv-pass');
  var pass2 = document.getElementById('jv-pass2');
  var genErr = document.getElementById('jv-general-error');

  // Clear previous errors
  ['jv-name','jv-email','jv-phone','jv-pass','jv-pass2'].forEach(clearFieldErr);
  if (genErr) genErr.style.display = 'none';

  var valid = true;

  // Name
  if (!name.value.trim() || name.value.trim().length < 2) {
    setFieldErr('jv-name', 'Full name is required (min 2 characters)'); valid = false;
  }

  // Email
  if (!email.value.trim()) {
    setFieldErr('jv-email', 'Email address is required'); valid = false;
  } else if (!validateEmail(email.value.trim())) {
    setFieldErr('jv-email', 'Please enter a valid @gmail.com address'); valid = false;
  } else {
    // Check duplicate
    var taken = false;
    for (var i = 0; i < MOCK_USERS.length; i++) {
      if (MOCK_USERS[i].email === email.value.trim()) { taken = true; break; }
    }
    if (!taken && typeof UserDB !== 'undefined') {
      var existing = UserDB.getByEmail(email.value.trim());
      if (existing) taken = true;
    }
    if (taken) {
      setFieldErr('jv-email', 'This email is already registered'); valid = false;
    }
  }

  // Phone
  if (!phone.value.trim()) {
    setFieldErr('jv-phone', 'Phone number is required'); valid = false;
  } else {
    var pCheck = validatePhone(phone.value.trim());
    if (!pCheck.valid) { setFieldErr('jv-phone', pCheck.message); valid = false; }
  }

  // Gender
  var genderBtn = document.querySelector('.gender-btn.active');
  if (!genderBtn) {
    if (genErr) { genErr.textContent = 'Please select your gender'; genErr.style.display = 'block'; }
    valid = false;
  }

  // Skills (predefined + custom)
  var selectedSkills = [];
  document.querySelectorAll('.skill-check input[type="checkbox"]:checked').forEach(function(cb) {
    selectedSkills.push(cb.value);
  });
  // Merge custom skills
  if (_jvCustomSkills && _jvCustomSkills.length > 0) {
    _jvCustomSkills.forEach(function(cs) {
      if (selectedSkills.indexOf(cs) === -1) selectedSkills.push(cs);
    });
  }
  if (selectedSkills.length === 0) {
    if (genErr) {
      genErr.textContent = genErr.textContent ? genErr.textContent + ' · Please select at least one skill' : 'Please select at least one skill';
      genErr.style.display = 'block';
    }
    valid = false;
  }

  // Availability
  var availBtn = document.querySelector('.avail-btn.active');
  if (!availBtn) {
    if (genErr) {
      genErr.textContent = genErr.textContent ? genErr.textContent + ' · Please select your availability' : 'Please select your availability';
      genErr.style.display = 'block';
    }
    valid = false;
  }

  // Password
  if (!pass.value) {
    setFieldErr('jv-pass', 'Password is required'); valid = false;
  } else {
    var pe = validatePass(pass.value);
    if (pe) { setFieldErr('jv-pass', pe); valid = false; }
  }
  if (!pass2.value) {
    setFieldErr('jv-pass2', 'Please confirm your password'); valid = false;
  } else if (pass.value !== pass2.value) {
    setFieldErr('jv-pass2', 'Passwords do not match'); valid = false;
  }

  if (!valid) return;

  // Register volunteer via backend API
  var volData = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    password: pass.value,
    role: 'volunteer',
    skills: selectedSkills
  };

  // Show success state on button
  var btn = document.getElementById('btnVolSubmit');
  if (btn) {
    btn.textContent = '✓ Registering…';
    btn.disabled = true;
    btn.style.background = '#059669';
  }

  var finishRegistration = function(user) {
    if (typeof setSession === 'function' && user) setSession(user);
    if (btn) btn.textContent = '✓ Welcome to Kindred!';
    setTimeout(function() {
      window.location.href = 'volunteer-dashboard.html';
    }, 600);
  };

  if (typeof apiPost === 'function') {
    apiPost('/users/register', volData).then(function(res) {
      var user;
      if (res.ok && res.body.data) {
        user = res.body.data;
        if (typeof UserDB !== 'undefined') UserDB.create(user);
      } else {
        // Fallback: create locally
        if (typeof UserDB !== 'undefined') {
          user = UserDB.create(Object.assign(volData, { status: 'approved' }));
        }
      }
      finishRegistration(user);
    });
  } else {
    var newUser = null;
    if (typeof UserDB !== 'undefined') {
      newUser = UserDB.create(Object.assign(volData, { status: 'approved' }));
    }
    finishRegistration(newUser);
  }
}
