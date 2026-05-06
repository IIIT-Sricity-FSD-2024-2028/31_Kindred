/* ============================================================
   KINDRED — ADMIN USERS JS
   admin-users.js — full CRUD for user management
   ============================================================ */

var currentFilter = 'all';
var currentSearch = '';

document.addEventListener('DOMContentLoaded', function () {
  // Auth guard — only superuser can access
  var session = requireAuth(['superuser']);
  if (!session) return;

  applyRoleGating();
  // Update navbar
  var nameEl = document.querySelector('.user-name');
  var roleEl = document.querySelector('.user-role');
  var avatarEl = document.querySelector('.avatar');
  if (nameEl) nameEl.textContent = session.name;
  if (roleEl) roleEl.textContent = 'Platform Administrator';
  if (avatarEl) avatarEl.textContent = session.initials;

  renderUserStats();
  renderUsersTable();
});

// ── Escape HTML ─────────────────────────────────────────────
function escH(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Get All Users (combined) ────────────────────────────────
function getAllUsersFiltered() {
  var all = (typeof UserDB !== 'undefined') ? UserDB.getAllCombined() : MOCK_USERS.map(function(u) { return Object.assign({}, u, { source: 'system' }); });

  // Apply search
  if (currentSearch) {
    var q = currentSearch.toLowerCase();
    all = all.filter(function(u) {
      return (u.name && u.name.toLowerCase().includes(q)) ||
             (u.email && u.email.toLowerCase().includes(q)) ||
             (u.role && u.role.toLowerCase().includes(q));
    });
  }

  // Apply filter
  if (currentFilter !== 'all') {
    all = all.filter(function(u) { return u.status === currentFilter; });
  }

  return all;
}

// ── Render Stats ────────────────────────────────────────────
function renderUserStats() {
  var bar = document.getElementById('userStatsBar');
  if (!bar) return;

  var all = (typeof UserDB !== 'undefined') ? UserDB.getAllCombined() : MOCK_USERS.map(function(u) { return Object.assign({}, u, { source: 'system' }); });

  var total = all.length;
  var pending = all.filter(function(u) { return u.status === 'pending'; }).length;
  var approved = all.filter(function(u) { return u.status === 'approved'; }).length;
  var rejected = all.filter(function(u) { return u.status === 'rejected'; }).length;

  bar.innerHTML =
    '<div class="user-stat-chip">👥 Total <span class="num">' + total + '</span></div>' +
    '<div class="user-stat-chip" style="border-color:#fde68a">⏳ Pending <span class="num" style="color:#f59e0b">' + pending + '</span></div>' +
    '<div class="user-stat-chip" style="border-color:#a7f3d0">✓ Approved <span class="num" style="color:#059669">' + approved + '</span></div>' +
    '<div class="user-stat-chip" style="border-color:#fecaca">✕ Rejected <span class="num" style="color:#ef4444">' + rejected + '</span></div>';

  // Update filter counts
  var el;
  el = document.getElementById('count-all'); if (el) el.textContent = total;
  el = document.getElementById('count-pending'); if (el) el.textContent = pending;
  el = document.getElementById('count-approved'); if (el) el.textContent = approved;
  el = document.getElementById('count-rejected'); if (el) el.textContent = rejected;
}

// ── Filter Users ────────────────────────────────────────────
function filterUsers(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderUsersTable();
}

// ── Search Handler ──────────────────────────────────────────
function searchUsersHandler() {
  currentSearch = (document.getElementById('searchUsers') || {}).value || '';
  renderUsersTable();
}

// ── Render Users Table ──────────────────────────────────────
function renderUsersTable() {
  var tbody = document.getElementById('userTableBody');
  if (!tbody) return;

  var users = getAllUsersFiltered();

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">No users found matching your criteria</div></div></td></tr>';
    return;
  }

  var roleLabels = { superuser: 'Platform Admin', admin: 'Org Admin', volunteer: 'Volunteer', donor: 'Donor', beneficiary: 'Beneficiary' };

  var html = '';
  users.forEach(function(u) {
    var roleLabel = roleLabels[u.role] || u.role;
    var status = u.status || 'approved';
    var regDate = u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (u.joined || '—');
    var avatarBg = u.avatar || '#6366f1';
    var initials = u.initials || (u.name || '?').charAt(0);
    var source = u.source || 'system';

    html += '<tr data-user-id="' + u.id + '">';

    // User cell
    html += '<td><div class="user-cell">';
    html += '<div class="user-cell-avatar" style="background:' + avatarBg + '">' + initials + '</div>';
    html += '<div><div class="user-cell-name">' + escH(u.name) + '</div>';
    html += '<div class="user-cell-email">' + escH(u.email) + '</div></div>';
    html += '</div></td>';

    // Role
    html += '<td><span class="role-pill ' + u.role + '">' + roleLabel + '</span></td>';

    // Status
    html += '<td><span class="status-pill ' + status + '"><span class="dot"></span>' + status + '</span></td>';

    // Source
    html += '<td><span class="source-badge ' + source + '">' + source + '</span></td>';

    // Registered
    html += '<td><span class="user-cell-date">' + regDate + '</span></td>';

    // Actions
    html += '<td><div class="user-actions">';
    // View — always shown
    html += '<button class="user-action-btn" title="View Details" onclick="viewUser(\'' + u.id + '\', \'' + source + '\')">👁</button>';

    // Approve/Reject — pending registered users only
    if (status === 'pending' && source === 'registered') {
      html += '<button class="user-action-btn approve" title="Approve" onclick="approveUser(\'' + u.id + '\')">✓</button>';
      html += '<button class="user-action-btn reject" title="Reject" onclick="rejectUser(\'' + u.id + '\')">✕</button>';
    }
    // Edit — all users
    html += '<button class="user-action-btn" title="Edit" onclick="editUser(\'' + u.id + '\', \'' + source + '\')">✏️</button>';
    // Delete — all users (system users are guarded inside deleteUser)
    html += '<button class="user-action-btn delete" title="Delete" onclick="deleteUser(\'' + u.id + '\', \'' + escH(u.name) + '\', \'' + source + '\')">🗑</button>';

    html += '</div></td></tr>';
  });

  tbody.innerHTML = html;
}

// ── View User ───────────────────────────────────────────────
function viewUser(id, source) {
  var u = null;
  if (source === 'registered' && typeof UserDB !== 'undefined') {
    u = UserDB.getById(id);
  } else {
    u = MOCK_USERS.find(function(m) { return m.id === id; });
  }
  if (!u) return;

  var roleLabels = { superuser: 'Platform Admin', admin: 'Org Admin', volunteer: 'Volunteer', donor: 'Donor', beneficiary: 'Beneficiary' };
  var sourceBadge = source === 'registered' ? '🟢 Registered User' : '🔵 System User';
  var body = '<div style="display:grid;gap:12px;font-size:.9rem">' +
    '<div><strong>Name:</strong> ' + escH(u.name) + '</div>' +
    '<div><strong>Email:</strong> ' + escH(u.email) + '</div>' +
    '<div><strong>Role:</strong> ' + (roleLabels[u.role] || u.role) + '</div>' +
    '<div><strong>Status:</strong> ' + (u.status || 'approved') + '</div>' +
    '<div><strong>Source:</strong> ' + sourceBadge + '</div>';

  if (u.phone) body += '<div><strong>Phone:</strong> ' + escH(u.phone) + '</div>';
  if (u.org)   body += '<div><strong>Organization:</strong> ' + escH(u.org) + '</div>';
  if (u.bio)   body += '<div><strong>Bio:</strong> ' + escH(u.bio) + '</div>';
  if (u.skills && u.skills.length) body += '<div><strong>Skills:</strong> ' + u.skills.join(', ') + '</div>';
  if (u.availability) body += '<div><strong>Availability:</strong> ' + u.availability + '</div>';
  if (u.registeredAt) body += '<div><strong>Registered:</strong> ' + new Date(u.registeredAt).toLocaleString('en-IN') + '</div>';
  body += '</div>';

  showInfoModalUser('User Details — ' + escH(u.name), body);
}

// ── Approve User ────────────────────────────────────────────
function approveUser(id) {
  if (typeof UserDB === 'undefined') return;
  UserDB.approve(id);
  showToastUser('User approved successfully!', 'success');
  renderUserStats();
  renderUsersTable();
}

// ── Reject User ─────────────────────────────────────────────
function rejectUser(id) {
  if (typeof UserDB === 'undefined') return;
  if (!confirm('Are you sure you want to reject this user?')) return;
  UserDB.reject(id);
  showToastUser('User registration rejected.', 'error');
  renderUserStats();
  renderUsersTable();
}

// ── Delete User ─────────────────────────────────────────────
function deleteUser(id, name, source) {
  if (source === 'system') {
    alert('"' + name + '" is a system account and cannot be deleted. You can only delete registered users.');
    return;
  }
  if (typeof UserDB === 'undefined') return;
  if (!confirm('Permanently delete "' + name + '"? This cannot be undone.')) return;
  UserDB.delete(id);
  showToastUser('User "' + name + '" deleted.', 'success');
  renderUserStats();
  renderUsersTable();
}

// ── Edit User Modal ─────────────────────────────────────────
function editUser(id, source) {
  var u = null;
  var isSystem = (source === 'system');
  if (isSystem) {
    u = MOCK_USERS.find(function(m){ return m.id === id; });
  } else if (typeof UserDB !== 'undefined') {
    u = UserDB.getById(id);
  }
  if (!u) { showToastUser('User not found.', 'error'); return; }

  var roleLabels = { admin: 'Organization Admin', volunteer: 'Volunteer', donor: 'Donor', beneficiary: 'Beneficiary', superuser: 'Platform Admin' };
  var existing = document.getElementById('editUserModal');
  if (existing) existing.remove();

  // Org field shown only for admin role
  var orgVal = escH(u.org || '');
  var orgField = '<div class="field" id="eu-org-wrap"><label>Organization</label><input type="text" id="eu-org" value="' + orgVal + '" placeholder="NGO / Organization name" ' + (u.role !== 'admin' ? 'style="display:none"' : '') + '/></div>';

  var systemNote = isSystem ? '<div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;font-size:.8rem;color:#92400e;margin-bottom:14px;">⚠️ This is a <strong>system account</strong>. Changes apply to the current session only and are not persisted.</div>' : '';

  var html = '<div class="modal-overlay" id="editUserModal" style="display:flex">' +
    '<div class="modal-box user-edit-modal" style="width:520px;max-width:95vw">' +
    '<div class="modal-header"><h3>Edit User — ' + escH(u.name) + '</h3>' +
    '<button class="modal-close-btn" onclick="closeEditUser()">×</button></div>' +
    '<div class="modal-body">' +
    '<form id="editUserForm" onsubmit="submitEditUser(event, \'' + id + '\', \'' + source + '\')" novalidate>' +
    systemNote +
    '<div class="field"><label>Full Name *</label><input type="text" id="eu-name" value="' + escH(u.name) + '"/></div>' +
    '<div class="field"><label>Email</label><input type="email" id="eu-email" value="' + escH(u.email) + '" ' + (isSystem ? 'readonly style="background:#f8fafc;color:#94a3b8"' : '') + '/></div>' +
    '<div class="field"><label>Phone</label><input type="text" id="eu-phone" value="' + escH(u.phone || '') + '" placeholder="+91 98765 43210"/></div>' +
    orgField +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Role</label><select id="eu-role" onchange="toggleEuOrgField(this.value)">' +
    ['admin','volunteer','donor','beneficiary'].map(function(r) {
      return '<option value="' + r + '"' + (u.role === r ? ' selected' : '') + '>' + (roleLabels[r] || r) + '</option>';
    }).join('') +
    '</select></div>' +
    '<div class="field"><label>Status</label><select id="eu-status">' +
    ['pending','approved','rejected'].map(function(s) {
      return '<option value="' + s + '"' + (u.status === s ? ' selected' : '') + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>';
    }).join('') +
    '</select></div></div>' +
    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeEditUser()">Cancel</button>' +
    '<button type="submit" class="btn-modal-save">Save Changes</button>' +
    '</div></form></div></div></div>';

  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
}

function toggleEuOrgField(role) {
  var orgWrap = document.getElementById('eu-org-wrap');
  var orgInput = document.getElementById('eu-org');
  if (!orgWrap) return;
  if (role === 'admin') {
    orgWrap.style.display = 'block';
    if (orgInput) orgInput.style.display = 'block';
  } else {
    if (orgInput) orgInput.style.display = 'none';
  }
}

function closeEditUser() {
  var modal = document.getElementById('editUserModal');
  if (modal) modal.remove();
  document.body.style.overflow = '';
}

function submitEditUser(e, id, source) {
  e.preventDefault();
  var nameEl   = document.getElementById('eu-name');
  var emailEl  = document.getElementById('eu-email');
  var phoneEl  = document.getElementById('eu-phone');
  var orgEl    = document.getElementById('eu-org');
  var roleEl   = document.getElementById('eu-role');
  var statusEl = document.getElementById('eu-status');

  var name   = (nameEl  ? nameEl.value.trim()  : '');
  var email  = (emailEl ? emailEl.value.trim() : '');
  var phone  = (phoneEl ? phoneEl.value.trim() : '');
  var org    = (orgEl   ? orgEl.value.trim()   : '');
  var role   = (roleEl  ? roleEl.value         : '');
  var status = (statusEl ? statusEl.value      : 'approved');

  if (!name) { alert('Name is required.'); return; }

  var updates = {
    name: name,
    phone: phone,
    role: role,
    status: status,
    initials: name.split(' ').map(function(w){ return w.charAt(0).toUpperCase(); }).join('').slice(0,2)
  };
  if (role === 'admin') { updates.org = org; }

  if (source === 'system') {
    // Update only the in-memory MOCK_USERS array (session lifetime)
    for (var i = 0; i < MOCK_USERS.length; i++) {
      if (MOCK_USERS[i].id === id) {
        Object.assign(MOCK_USERS[i], updates);
        break;
      }
    }
    showToastUser('System user updated (session only).', 'success');
  } else {
    if (typeof UserDB !== 'undefined') {
      updates.email = email;
      UserDB.update(id, updates);
      if (typeof UserDB.updateSession === 'function') {
        UserDB.updateSession(id);
      }
    }
    showToastUser('User updated successfully.', 'success');
  }

  closeEditUser();
  renderUserStats();
  renderUsersTable();
}

// ── Toast Helper ────────────────────────────────────────────
function showToastUser(msg, type) {
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  var bg = type === 'success' ? '#0f1923' : '#7f1d1d';
  var accent = type === 'success' ? '#00c896' : '#fca5a5';
  toast.style.cssText = 'background:' + bg + ';color:white;padding:12px 18px;border-radius:10px;font-family:inherit;font-size:13.5px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.2);display:flex;align-items:center;gap:9px;border-left:3px solid ' + accent + ';max-width:340px;animation:toastIn .25s ease;';
  toast.innerHTML = '<span>' + (type === 'success' ? '✓' : '✕') + '</span><span>' + escH(msg) + '</span>';
  container.appendChild(toast);
  if (!document.getElementById('toast-style')) {
    var style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(style);
  }
  setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(function() { toast.remove(); }, 300); }, 3500);
}

// ── Info Modal ──────────────────────────────────────────────
function showInfoModalUser(title, bodyHtml) {
  var existing = document.getElementById('infoModalUser');
  if (existing) existing.remove();
  var html = '<div class="modal-overlay" id="infoModalUser" style="display:flex">' +
    '<div class="modal-box" style="width:480px;max-width:95vw">' +
    '<div class="modal-header"><h3>' + title + '</h3>' +
    '<button class="modal-close-btn" onclick="document.getElementById(\'infoModalUser\').remove();document.body.style.overflow=\'\'">×</button></div>' +
    '<div class="modal-body">' + bodyHtml + '</div>' +
    '<div class="modal-actions"><button class="btn-modal-save" onclick="document.getElementById(\'infoModalUser\').remove();document.body.style.overflow=\'\'">Close</button></div>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
}

// ── Create User Modal ──────────────────────────────────────
function openCreateUserModal() {
  var existing = document.getElementById('createUserModal');
  if (existing) existing.remove();

  var html = '<div class="modal-overlay" id="createUserModal" style="display:flex">' +
    '<div class="modal-box user-edit-modal" style="width:540px;max-width:95vw">' +
    '<div class="modal-header"><h3>Add New User</h3>' +
    '<button class="modal-close-btn" onclick="closeCreateUserModal()">×</button></div>' +
    '<div class="modal-body">' +
    '<form id="createUserForm" onsubmit="submitCreateUser(event)" novalidate>' +
    '<div class="field"><label>Full Name *</label><input type="text" id="cu-name" placeholder="e.g. Priya Singh"/></div>' +
    '<div class="field"><label>Email *</label><input type="email" id="cu-email" placeholder="user@example.com"/></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Phone</label><input type="text" id="cu-phone" placeholder="9876543210" maxlength="10"/><p id="cu-phone-err" style="color:#ef4444;font-size:.75rem;display:none;margin:3px 0 0;"></p></div>' +
    '<div class="field"><label>Role *</label><select id="cu-role" onchange="toggleCuOrgField(this.value)">' +
    '<option value="volunteer">Volunteer</option>' +
    '<option value="donor">Donor</option>' +
    '<option value="beneficiary">Beneficiary</option>' +
    '<option value="admin">Organization Admin</option>' +
    '</select></div></div>' +
    '<div class="field" id="cu-org-wrap" style="display:none"><label>Organization Name *</label><input type="text" id="cu-org" placeholder="NGO / Organization name"/></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Password *</label><input type="password" id="cu-pass" placeholder="Min 8 chars"/></div>' +
    '<div class="field"><label>Status</label><select id="cu-status">' +
    '<option value="approved">Approved</option>' +
    '<option value="pending">Pending</option>' +
    '</select></div></div>' +
    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeCreateUserModal()">Cancel</button>' +
    '<button type="submit" class="btn-modal-save">Create User</button>' +
    '</div></form></div></div></div>';

  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
  document.getElementById('cu-name').focus();
}

function toggleCuOrgField(role) {
  var wrap = document.getElementById('cu-org-wrap');
  if (wrap) wrap.style.display = (role === 'admin') ? 'block' : 'none';
}

function closeCreateUserModal() {
  var modal = document.getElementById('createUserModal');
  if (modal) modal.remove();
  document.body.style.overflow = '';
}

function submitCreateUser(e) {
  e.preventDefault();
  var name = document.getElementById('cu-name').value.trim();
  var email = document.getElementById('cu-email').value.trim();
  var phone = document.getElementById('cu-phone').value.trim();
  var role = document.getElementById('cu-role').value;
  var pass = document.getElementById('cu-pass').value;
  var status = document.getElementById('cu-status').value;
  var phoneErr = document.getElementById('cu-phone-err');

  if (!name || name.length < 2) { alert('Full name is required (min 2 characters).'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address.'); return; }
  if (!pass || pass.length < 8) { alert('Password must be at least 8 characters.'); return; }

  // Phone validation
  if (phone) {
    if (typeof Validate !== 'undefined' && Validate.phone) {
      var phoneResult = Validate.phone(phone);
      if (!phoneResult.valid) {
        if (phoneErr) { phoneErr.textContent = phoneResult.message; phoneErr.style.display = 'block'; }
        return;
      }
    }
  }
  if (phoneErr) phoneErr.style.display = 'none';

  // Check if email already exists
  if (typeof UserDB !== 'undefined') {
    var existingUser = UserDB.getByEmail(email);
    if (existingUser) { alert('This email is already registered.'); return; }
  }
  for (var i = 0; i < MOCK_USERS.length; i++) {
    if (MOCK_USERS[i].email === email) { alert('This email is already registered.'); return; }
  }

  var org = '';
  if (role === 'admin') {
    var orgEl = document.getElementById('cu-org');
    org = orgEl ? orgEl.value.trim() : '';
    if (!org) { alert('Organization name is required for Organization Admin role.'); return; }
  }

  if (typeof UserDB !== 'undefined') {
    UserDB.create({
      name: name,
      email: email,
      phone: phone,
      password: pass,
      role: role,
      status: status,
      org: org
    });
  }

  closeCreateUserModal();
  showToastUser('User "' + name + '" created successfully.', 'success');
  renderUserStats();
  renderUsersTable();
}
