/* ============================================================
   KINDRED — ORG ADMIN CRUD JS
   Handles Volunteers, Programs, Incoming Requests
   Admins: Create & Edit only (no Delete — superuser only)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  var session = requireAuth(['admin']);
  if (!session) return;

  applyRoleGating();

  // Check if this org admin is still pending approval
  if (session.status === 'pending') {
    showAdminPendingOverlay();
    return; // Block all further initialization
  }

  updateOrgNavbar(session);

  // Sign out
  document.querySelectorAll('[data-signout]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); signOut(); });
  });

  // Page-specific init
  if (document.getElementById('volTableBody'))     initVolunteersPage();
  if (document.getElementById('programsGrid'))     initProgramsPage();
  if (document.getElementById('incomingList'))     initIncomingPage();
  if (document.getElementById('beneficiaryReqList')) initIncomingPage();
  if (document.getElementById('orgAdminTitle'))    initOrgOverviewPage();
  if (document.getElementById('resPendingList'))   initResourcesPage();
  if (document.getElementById('resOverviewList'))  { renderResourceDonations(); renderResourceStats(); }
});

function updateOrgNavbar(session) {
  var nameEl     = document.querySelector('.user-name, #navUserName');
  var roleEl     = document.querySelector('.user-role, #navUserRole');
  var avatarEl   = document.querySelector('.user-avatar, #navUserInitials');
  if (nameEl)   nameEl.textContent   = session.name;
  if (roleEl)   roleEl.textContent   = 'Org Admin';
  if (avatarEl) avatarEl.textContent = session.initials;
}

// ============================================================
//  VOLUNTEERS PAGE
// ============================================================
function initVolunteersPage() {
  renderVolTable();

  var addBtn = document.querySelector('.btn-add-volunteer, [data-add-volunteer]');
  if (addBtn) addBtn.addEventListener('click', function () { openVolModal(); });

  var searchInput = document.getElementById('volunteerSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = this.value.toLowerCase();
      document.querySelectorAll('#volTableBody tr').forEach(function (row) {
        var text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }
}

function renderVolTable() {
  var tbody = document.getElementById('volTableBody');
  if (!tbody) return;

  // Merge VolDB + registered volunteers from UserDB
  var vols = VolDB.getAll();
  if (typeof UserDB !== 'undefined') {
    var registered = UserDB.getAll().filter(function(u) {
      return u.role === 'volunteer' && u.status === 'approved';
    });
    registered.forEach(function(u) {
      var already = vols.some(function(v) { return v.email === u.email; });
      if (!already) {
        vols.push({
          id: u.id, name: u.name, email: u.email,
          phone: u.phone || '—', role: 'Registered Volunteer',
          status: 'active', hours: 0, rating: '—', source: 'registered'
        });
      }
    });
  }

  if (vols.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:32px;color:#9ca3af">No volunteers yet. Add one above.</td></tr>';
    return;
  }
  var html = '';
  vols.forEach(function (v) {
    var statusClass = v.status === 'active' ? 'active' : 'inactive';
    html += '<tr class="volunteer-row" data-vol-id="' + v.id + '">';
    html += '<td><div style="display:flex;align-items:center;gap:10px">';
    html += '<div class="user-avatar" style="width:34px;height:34px;border-radius:50%;background:#6366f1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;flex-shrink:0">' + v.name.charAt(0) + '</div>';
    html += '<div><div class="vol-name" style="font-weight:600;font-size:.88rem">' + escHtml(v.name) + '</div>';
    html += '<div style="font-size:.76rem;color:#9ca3af">' + escHtml(v.email) + '</div></div></div></td>';
    html += '<td class="vol-role">' + escHtml(v.role) + '</td>';
    html += '<td><span class="status-badge ' + statusClass + '">' + v.status + '</span></td>';
    html += '<td>' + (v.hours || 0) + ' hrs</td>';
    
    // Count active tasks for this volunteer
    var taskCount = 0;
    if (typeof TaskDB !== 'undefined') {
      taskCount = TaskDB.getByVolunteer(v.email).filter(function(t) { return t.status !== 'completed'; }).length;
    }
    html += '<td>' + taskCount + '</td>';
    
    html += '<td><div class="action-btns">';
    html += '<button class="action-btn" title="View" onclick="viewVol(\'' + v.id + '\')">👁</button>';
    html += '<button class="action-btn" title="Edit" onclick="openVolModal(\'' + v.id + '\')">✏️</button>';
    html += '<button class="action-btn" title="Assign Task" style="background:#ecfdf5;color:#059669;border-color:#a7f3d0" onclick="openTaskModal(\'' + escHtml(v.name) + '\',\'' + escHtml(v.email) + '\')">📋 Task</button>';
    html += '<button class="action-btn" title="Delete" style="border-color:#fecaca" onclick="deleteVol(\'' + v.id + '\',\'' + escHtml(v.name) + '\')">🗑️</button>';
    html += '</div></td></tr>';
  });
  tbody.innerHTML = html;
}

function viewVol(id) {
  var v = VolDB.getById(id);
  if (!v) return;
  showInfoModal('Volunteer Details',
    '<div style="display:grid;gap:10px;font-size:.9rem;">' +
    '<div><strong>Name:</strong> ' + escHtml(v.name) + '</div>' +
    '<div><strong>Email:</strong> ' + escHtml(v.email) + '</div>' +
    '<div><strong>Phone:</strong> ' + escHtml(v.phone || '—') + '</div>' +
    '<div><strong>Role:</strong> ' + escHtml(v.role) + '</div>' +
    '<div><strong>Status:</strong> ' + v.status + '</div>' +
    '<div><strong>Joined:</strong> ' + v.joined + '</div>' +
    '<div><strong>Hours Logged:</strong> ' + v.hours + '</div>' +
    '<div><strong>Rating:</strong> ' + v.rating + '</div>' +
    '</div>'
  );
}

function openVolModal(id) {
  var vol = id ? VolDB.getById(id) : null;
  var isEdit = !!vol;
  var modal = '<div class="modal-overlay" id="volModal" style="display:flex">' +
    '<div class="modal-box" style="width:500px;max-width:95vw">' +
    '<div class="modal-header"><h3>' + (isEdit ? 'Edit Volunteer' : 'Add Volunteer') + '</h3>' +
    '<button class="modal-close-btn" onclick="closeVolModal()">×</button></div>' +
    '<div class="modal-body"><form id="volForm" onsubmit="submitVolForm(event,' + (id ? "'" + id + "'" : 'null') + ')" novalidate>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Full Name <span class="req">*</span></label>' +
    '<input type="text" id="vf-name" value="' + (vol ? escHtml(vol.name) : '') + '" placeholder="e.g. Priya Singh"/>' +
    '<p class="field-error" id="vf-name-err"></p></div>' +
    '<div class="field"><label>Role <span class="req">*</span></label>' +
    '<input type="text" id="vf-role" value="' + (vol ? escHtml(vol.role) : '') + '" placeholder="e.g. Field Coordinator"/>' +
    '<p class="field-error" id="vf-role-err"></p></div>' +
    '</div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Email <span class="req">*</span></label>' +
    '<input type="email" id="vf-email" value="' + (vol ? escHtml(vol.email) : '') + '" placeholder="volunteer@email.com"/>' +
    '<p class="field-error" id="vf-email-err"></p></div>' +
    '<div class="field"><label>Phone</label>' +
    '<input type="text" id="vf-phone" value="' + (vol ? escHtml(vol.phone || '') : '') + '" placeholder="+91 99887 76655"/>' +
    '</div></div>' +

    '<div class="field"><label>Status</label>' +
    '<select id="vf-status">' +
    ['active','inactive'].map(function(s){ return '<option value="' + s + '"' + (vol && vol.status === s ? ' selected' : '') + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>'; }).join('') +
    '</select></div>' +

    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeVolModal()">Cancel</button>' +
    '<button type="submit" class="btn-modal-save">' + (isEdit ? 'Save Changes' : 'Add Volunteer') + '</button>' +
    '</div></form></div></div></div>';

  var existing = document.getElementById('volModal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modal);
  document.body.style.overflow = 'hidden';
  document.getElementById('vf-name').focus();
}

function closeVolModal() {
  var m = document.getElementById('volModal'); if (m) m.remove();
  document.body.style.overflow = '';
}

function submitVolForm(e, id) {
  e.preventDefault();
  var nameEl  = document.getElementById('vf-name');
  var roleEl  = document.getElementById('vf-role');
  var emailEl = document.getElementById('vf-email');
  var phoneEl = document.getElementById('vf-phone');

  ['vf-name-err','vf-role-err','vf-email-err'].forEach(function(eid){ showFieldError(eid, ''); });
  [nameEl, roleEl, emailEl, phoneEl].forEach(function(el){ if(el) el.style.borderColor = ''; });

  var valid = true;
  if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
    nameEl.style.borderColor = '#ef4444';
    showFieldError('vf-name-err', 'Full name is required (min 2 chars)');
    valid = false;
  }
  if (!roleEl.value.trim()) {
    roleEl.style.borderColor = '#ef4444';
    showFieldError('vf-role-err', 'Role is required');
    valid = false;
  }
  if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
    emailEl.style.borderColor = '#ef4444';
    showFieldError('vf-email-err', 'Valid email is required');
    valid = false;
  }
  // Strict 10-digit phone validation
  if (phoneEl && phoneEl.value.trim()) {
    var pDigits = phoneEl.value.trim().replace(/\D/g, '');
    if (pDigits.length === 12 && pDigits.indexOf('91') === 0) pDigits = pDigits.slice(2);
    if (pDigits.length !== 10 || !/^[6-9]\d{9}$/.test(pDigits)) {
      phoneEl.style.borderColor = '#ef4444';
      showFieldError('vf-email-err', 'Phone must be exactly 10 digits starting with 6-9');
      valid = false;
    }
  }
  if (!valid) return;

  var data = { name: nameEl.value.trim(), role: roleEl.value.trim(), email: emailEl.value.trim(), phone: phoneEl ? phoneEl.value.trim() : '', status: document.getElementById('vf-status').value };
  if (id) { VolDB.update(id, data); showToastMsg('Volunteer updated.', 'success'); }
  else    { VolDB.create(data);     showToastMsg('Volunteer added.', 'success'); }
  closeVolModal();
  renderVolTable();
}

// ============================================================
//  PROGRAMS PAGE
// ============================================================
function initProgramsPage() {
  renderProgramCards();
  var addBtn = document.querySelector('.btn-add-program, [data-add-program]');
  if (addBtn) addBtn.addEventListener('click', function () { openProgModal(); });
}

function renderProgramCards() {
  var grid = document.getElementById('programsGrid');
  if (!grid) return;
  var progs = ProgDB.getAll();
  if (progs.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#9ca3af">No programs yet. Create one!</div>';
    return;
  }
  var html = '';
  progs.forEach(function (p) {
    var pct = p.budget > 0 ? Math.min(100, Math.round((p.raised / p.budget) * 100)) : 0;
    var statusColor = p.status === 'active' ? '#22c55e' : (p.status === 'completed' ? '#6366f1' : '#f59e0b');
    
    // Subtask-based progress
    var taskProgress = (typeof SubtaskDB !== 'undefined') ? SubtaskDB.getProgramProgress(p.id) : 0;
    var taskProgressColor = taskProgress >= 80 ? '#10b981' : (taskProgress >= 40 ? '#f59e0b' : '#6366f1');
    
    // Assigned volunteers
    var assigned = (typeof ProgramAssignmentDB !== 'undefined') ? ProgramAssignmentDB.getByProgram(p.id) : [];
    var subtasks = (typeof SubtaskDB !== 'undefined') ? SubtaskDB.getByProgram(p.id) : [];
    
    // Pending applications count
    var pendingApps = (typeof ProgramApplicationDB !== 'undefined') ? ProgramApplicationDB.getByProgram(p.id).filter(function(a){return a.status==='pending';}).length : 0;
    
    var focusLabel = Array.isArray(p.focus) ? p.focus.join(', ') : (p.focus || '');
    
    html += '<div class="program-card" data-prog-id="' + p.id + '" style="position:relative;overflow:hidden;display:flex;flex-direction:column;min-width:0">';
    if (pendingApps > 0) {
      html += '<span style="position:absolute;top:10px;right:10px;background:#ef4444;color:#fff;font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:20px;z-index:2">' + pendingApps + ' new app' + (pendingApps>1?'s':'') + '</span>';
    }
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:10px;min-width:0">';
    html += '<div style="min-width:0;flex:1"><div style="font-weight:700;font-size:.95rem;margin-bottom:4px;word-wrap:break-word;overflow-wrap:break-word">' + escHtml(p.name) + '</div>';
    html += '<div style="font-size:.8rem;color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(focusLabel) + (p.location ? ' • 📍 ' + escHtml(p.location) : '') + '</div></div>';
    html += '<span class="status-badge" style="background:' + statusColor + '20;color:' + statusColor + ';border:1px solid ' + statusColor + '40;flex-shrink:0;white-space:nowrap">' + p.status + '</span></div>';
    html += '<p style="font-size:.83rem;color:#6b7280;margin-bottom:10px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-wrap:break-word">' + escHtml(p.description) + '</p>';
    
    // Skills tags
    if (p.requiredSkills && p.requiredSkills.length > 0) {
      html += '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;overflow:hidden;max-height:52px">';
      p.requiredSkills.forEach(function(sk) {
        html += '<span style="background:#eff6ff;color:#3b82f6;font-size:.68rem;padding:2px 8px;border-radius:20px;font-weight:600;border:1px solid #bfdbfe;white-space:nowrap;flex-shrink:0">' + escHtml(sk) + '</span>';
      });
      html += '</div>';
    }
    
    // Focus / Category tags (if array)
    if (Array.isArray(p.focus) && p.focus.length > 0) {
      html += '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;overflow:hidden;max-height:28px">';
      p.focus.forEach(function(cat) {
        html += '<span style="background:#fef3c7;color:#92400e;font-size:.68rem;padding:2px 8px;border-radius:20px;font-weight:600;border:1px solid #fcd34d;white-space:nowrap;flex-shrink:0">' + escHtml(cat) + '</span>';
      });
      html += '</div>';
    }
    
    // Task progress bar
    html += '<div style="margin-bottom:8px">';
    html += '<div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:4px;font-weight:600"><span style="color:#374151">📊 Overall Progress</span><span style="color:' + taskProgressColor + '">' + taskProgress + '%</span></div>';
    html += '<div style="background:#f3f4f6;border-radius:6px;height:8px;overflow:hidden"><div style="background:' + taskProgressColor + ';height:8px;border-radius:6px;width:' + taskProgress + '%;transition:width .5s"></div></div>';
    html += '</div>';
    
    // Funding progress
    html += '<div style="margin-bottom:8px">';
    html += '<div style="display:flex;justify-content:space-between;font-size:.72rem;margin-bottom:3px;color:#9ca3af"><span>💰 Raised ₹' + fmtNum(p.raised) + '</span><span>' + pct + '% of ₹' + fmtNum(p.budget) + '</span></div>';
    html += '<div style="background:#f3f4f6;border-radius:4px;height:4px"><div style="background:#00c9a7;height:4px;border-radius:4px;width:' + pct + '%;transition:width .5s"></div></div>';
    html += '</div>';
    
    // Assigned volunteer avatars
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap">';
    html += '<div style="display:flex;flex-shrink:0">';
    var shownCount = Math.min(assigned.length, 4);
    for (var av = 0; av < shownCount; av++) {
      var colors = ['#6366f1','#ec4899','#10b981','#f59e0b','#8b5cf6'];
      html += '<div style="width:28px;height:28px;border-radius:50%;background:' + colors[av % colors.length] + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;border:2px solid #fff;margin-left:' + (av > 0 ? '-8px' : '0') + ';position:relative;z-index:' + (10 - av) + '" title="' + escHtml(assigned[av].volunteerName) + '">' + assigned[av].volunteerName.charAt(0) + '</div>';
    }
    if (assigned.length > 4) {
      html += '<div style="width:28px;height:28px;border-radius:50%;background:#e2e8f0;color:#64748b;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;border:2px solid #fff;margin-left:-8px">+' + (assigned.length - 4) + '</div>';
    }
    html += '</div>';
    html += '<span style="font-size:.72rem;color:#64748b;white-space:nowrap">👥 ' + assigned.length + ' assigned • 📋 ' + subtasks.length + ' subtasks</span>';
    html += '</div>';
    
    html += '<div class="action-btns" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:auto">';
    html += '<button class="action-btn" title="View Details" style="background:#eff6ff;color:#3b82f6;border-color:#bfdbfe" onclick="openProgramDetail(\'' + p.id + '\')">👁 Details</button>';
    html += '<button class="action-btn" title="Edit" onclick="openProgModal(\'' + p.id + '\')">✏️ Edit</button>';
    html += '<button class="action-btn delete-btn" title="Delete" style="border-color:#fecaca;color:#ef4444" onclick="deleteProg(\'' + p.id + '\')">🗑️</button>';
    html += '</div></div>';
  });
  grid.innerHTML = html;
}

function openProgModal(id) {
  var prog = id ? ProgDB.getById(id) : null;
  var isEdit = !!prog;
  
  // Get volunteers for multi-select
  var vols = (typeof VolDB !== 'undefined') ? VolDB.getAll() : [];
  if (typeof UserDB !== 'undefined') {
    var registeredVols = UserDB.getAll().filter(function(u) { return u.role === 'volunteer' && u.status === 'approved'; });
    registeredVols.forEach(function(u) {
      if (!vols.some(function(v) { return v.email === u.email; })) {
        vols.push({ id: u.id, name: u.name, email: u.email, skills: u.skills || [] });
      }
    });
  }
  
  // Current assignments for edit mode
  var currentAssignments = isEdit && typeof ProgramAssignmentDB !== 'undefined' ? ProgramAssignmentDB.getByProgram(id) : [];
  var assignedEmails = currentAssignments.map(function(a) { return a.volunteerEmail.toLowerCase(); });
  
  var currentFocus = [];
  if (prog) {
    if (Array.isArray(prog.focus)) currentFocus = prog.focus;
    else if (typeof prog.focus === 'string' && prog.focus) currentFocus = [prog.focus];
  }
  var FOCUS_OPTIONS = ['Disaster Relief','Healthcare','Education','Food Security','Housing','Environment','Youth Empowerment','Elder Care','Child Welfare','Community Development'];
  
  var currentSkills = (prog && prog.requiredSkills) ? prog.requiredSkills : [];
  var allSkills = typeof SKILL_OPTIONS !== 'undefined' ? SKILL_OPTIONS : ['Medical Aid','Teaching','Field Work','Logistics','Community Outreach','Technology','Environment','Cooking','Counseling','Construction','Administration','Translation'];
  
  var modal = '<div class="modal-overlay" id="progModal" style="display:flex">' +
    '<div class="modal-box" style="width:600px;max-width:95vw;max-height:90vh;overflow-y:auto">' +
    '<div class="modal-header"><h3>' + (isEdit ? '✏️ Edit Program' : '📋 New Program') + '</h3>' +
    '<button class="modal-close-btn" onclick="closeProgModal()">×</button></div>' +
    '<div class="modal-body"><form id="progForm" onsubmit="submitProgForm(event,' + (id ? "'"+id+"'" : 'null') + ')" novalidate>' +

    '<div class="field"><label>Program Name <span class="req">*</span></label>' +
    '<input type="text" id="pf-name" value="' + (prog ? escHtml(prog.name) : '') + '" placeholder="e.g. Cyclone Relief Fund"/>' +
    '<p class="field-error" id="pf-name-err"></p></div>' +

    '<div class="field"><label>Description <span class="req">*</span></label>' +
    '<textarea id="pf-desc" rows="3" placeholder="Describe what this program does...">' + (prog ? escHtml(prog.description) : '') + '</textarea>' +
    '<p class="field-error" id="pf-desc-err"></p></div>' +

    '<div class="field"><label>📂 Focus Area / Categories <span class="req">*</span> <span style="font-weight:400;font-size:.75rem;color:#64748b">(select one or more)</span></label>' +
    '<div id="pf-focus-container" style="display:flex;flex-wrap:wrap;gap:6px;padding:8px;border:1px solid #e2e8f0;border-radius:8px;background:#fafbfc;max-height:130px;overflow-y:auto">' +
    FOCUS_OPTIONS.map(function(f) {
      var checked = currentFocus.indexOf(f) !== -1;
      return '<label style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:' + (checked ? '#fef3c7' : '#fff') + ';border:1px solid ' + (checked ? '#f59e0b' : '#e2e8f0') + ';border-radius:20px;font-size:.75rem;font-weight:500;cursor:pointer;transition:all .15s">' +
        '<input type="checkbox" name="pf-focus" value="' + f + '"' + (checked ? ' checked' : '') + ' style="display:none" onchange="this.parentElement.style.background=this.checked?\'#fef3c7\':\'#fff\';this.parentElement.style.borderColor=this.checked?\'#f59e0b\':\'#e2e8f0\'">' + f + '</label>';
    }).join('') +
    '</div>' +
    '<div style="display:flex;gap:8px;margin-top:6px;align-items:center">' +
    '<input type="text" id="pf-custom-focus" placeholder="Custom category..." style="flex:1;padding:7px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:.82rem;font-family:inherit;outline:none" />' +
    '<button type="button" onclick="addCustomFocus()" style="padding:7px 14px;background:#f59e0b;color:#fff;border:none;border-radius:8px;font-size:.78rem;font-weight:600;cursor:pointer;white-space:nowrap">+ Add</button>' +
    '</div>' +
    '<p class="field-error" id="pf-focus-err"></p></div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Status</label>' +
    '<select id="pf-status">' +
    ['active','completed','paused'].map(function(s){ return '<option value="' + s + '"' + (prog && prog.status === s ? ' selected' : '') + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>'; }).join('') +
    '</select></div></div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Budget (₹) <span class="req">*</span></label>' +
    '<input type="number" id="pf-budget" value="' + (prog ? prog.budget : '') + '" placeholder="e.g. 500000" min="1"/>' +
    '<p class="field-error" id="pf-budget-err"></p></div>' +
    '<div class="field"><label>Start Date</label>' +
    '<input type="date" id="pf-start" value="' + (prog ? prog.startDate || '' : '') + '"/></div>' +
    '</div>' +
    
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Location</label>' +
    '<input type="text" id="pf-location" value="' + (prog ? escHtml(prog.location || '') : '') + '" placeholder="e.g. Coastal Odisha"/></div>' +
    '<div class="field"><label>Volunteer Goal</label>' +
    '<input type="number" id="pf-volgoal" value="' + (prog ? (prog.volunteerGoal || '') : '') + '" placeholder="e.g. 50" min="1"/></div>' +
    '</div>' +
    
    '<div class="field"><label>Open for Applications?</label>' +
    '<select id="pf-openapps">' +
    '<option value="true"' + (prog && prog.openForApplications !== false ? ' selected' : '') + '>Yes — Volunteers can apply via portal</option>' +
    '<option value="false"' + (prog && prog.openForApplications === false ? ' selected' : '') + '>No — Invite only</option>' +
    '</select></div>' +
    
    // Required Skills multi-select with checkboxes
    '<div class="field"><label>🎯 Required Skills</label>' +
    '<div id="pf-skills-container" style="display:flex;flex-wrap:wrap;gap:6px;padding:8px;border:1px solid #e2e8f0;border-radius:8px;background:#fafbfc;max-height:120px;overflow-y:auto">' +
    allSkills.map(function(sk) {
      var checked = currentSkills.indexOf(sk) !== -1 ? ' checked' : '';
      return '<label style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:' + (checked ? '#eff6ff' : '#fff') + ';border:1px solid ' + (checked ? '#3b82f6' : '#e2e8f0') + ';border-radius:20px;font-size:.75rem;font-weight:500;cursor:pointer;transition:all .15s" class="skill-chip">' +
        '<input type="checkbox" name="pf-skills" value="' + sk + '"' + checked + ' style="display:none" onchange="this.parentElement.style.background=this.checked?\'#eff6ff\':\'#fff\';this.parentElement.style.borderColor=this.checked?\'#3b82f6\':\'#e2e8f0\';filterVolsBySkills()">' + sk + '</label>';
    }).join('') +
    '</div></div>' +
    
    // Assign Volunteers multi-select
    '<div class="field"><label>👥 Assign Volunteers <span style="font-weight:400;font-size:.75rem;color:#64748b">(select one or more)</span></label>' +
    '<div id="pf-vols-container" style="max-height:180px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;background:#fafbfc">' +
    vols.map(function(v) {
      var isAssigned = assignedEmails.indexOf(v.email.toLowerCase()) !== -1;
      var skillMatch = 0;
      if (currentSkills.length > 0 && v.skills) {
        var matched = v.skills.filter(function(s) { return currentSkills.indexOf(s) !== -1; }).length;
        skillMatch = Math.round((matched / currentSkills.length) * 100);
      }
      var matchBadge = skillMatch >= 70 ? '<span style="background:#dcfce7;color:#16a34a;font-size:.65rem;padding:2px 6px;border-radius:10px;font-weight:600">✓ ' + skillMatch + '% match</span>' : 
                       (skillMatch > 0 ? '<span style="background:#fef9c3;color:#ca8a04;font-size:.65rem;padding:2px 6px;border-radius:10px;font-weight:600">' + skillMatch + '% match</span>' : '');
      return '<label class="vol-assign-row" data-skills="' + (v.skills ? v.skills.join(',') : '') + '" style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-bottom:1px solid #f1f5f9;transition:background .1s' + (isAssigned ? ';background:#f0fdf4' : '') + '" onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=this.querySelector(\'input\').checked?\'#f0fdf4\':\'\'\'">' +
        '<input type="checkbox" name="pf-vols" value="' + escHtml(v.name) + '|' + escHtml(v.email) + '"' + (isAssigned ? ' checked' : '') + ' style="width:16px;height:16px;accent-color:#10b981">' +
        '<div style="width:30px;height:30px;border-radius:50%;background:#6366f1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0">' + v.name.charAt(0) + '</div>' +
        '<div style="flex:1;min-width:0"><div style="font-weight:600;font-size:.82rem;color:#1e293b">' + escHtml(v.name) + '</div>' +
        '<div style="font-size:.72rem;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(v.email) + '</div>' +
        (v.skills ? '<div style="font-size:.65rem;color:#64748b;margin-top:2px">' + v.skills.join(', ') + '</div>' : '') +
        '</div>' + matchBadge + '</label>';
    }).join('') +
    '</div></div>' +

    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeProgModal()">Cancel</button>' +
    '<button type="submit" class="btn-modal-save">' + (isEdit ? 'Save Changes' : 'Create Program') + '</button>' +
    '</div></form></div></div></div>';

  var existing = document.getElementById('progModal'); if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modal);
  document.body.style.overflow = 'hidden';
  document.getElementById('pf-name').focus();
}

function filterVolsBySkills() {
  var selectedSkills = [];
  document.querySelectorAll('input[name="pf-skills"]:checked').forEach(function(cb) {
    selectedSkills.push(cb.value);
  });
  document.querySelectorAll('.vol-assign-row').forEach(function(row) {
    var volSkills = (row.getAttribute('data-skills') || '').split(',').filter(Boolean);
    if (selectedSkills.length === 0) {
      row.style.order = '0';
      return;
    }
    var matchCount = volSkills.filter(function(s) { return selectedSkills.indexOf(s) !== -1; }).length;
    row.style.order = matchCount > 0 ? '-' + matchCount : '1';
    // Update match badge (simplified: just re-sort)
  });
  // Re-sort the container
  var container = document.getElementById('pf-vols-container');
  if (container) {
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
  }
}

function closeProgModal() {
  var m = document.getElementById('progModal'); if (m) m.remove();
  document.body.style.overflow = '';
}

function addCustomFocus() {
  var input = document.getElementById('pf-custom-focus');
  if (!input) return;
  var val = input.value.trim();
  if (!val) return;
  
  // Check if already exists
  var exists = false;
  document.querySelectorAll('input[name="pf-focus"]').forEach(function(cb) {
    if (cb.value.toLowerCase() === val.toLowerCase()) exists = true;
  });
  if (exists) { input.value = ''; return; }
  
  var container = document.getElementById('pf-focus-container');
  if (!container) return;
  
  var lbl = document.createElement('label');
  lbl.style.cssText = 'display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#fef3c7;border:1px solid #f59e0b;border-radius:20px;font-size:.75rem;font-weight:500;cursor:pointer;transition:all .15s';
  lbl.innerHTML = '<input type="checkbox" name="pf-focus" value="' + val.replace(/"/g, '&quot;') + '" checked style="display:none" onchange="this.parentElement.style.background=this.checked?\'#fef3c7\':\'#fff\';this.parentElement.style.borderColor=this.checked?\'#f59e0b\':\'#e2e8f0\'">' + val;
  container.appendChild(lbl);
  input.value = '';
}

function submitProgForm(e, id) {
  e.preventDefault();
  var nameEl   = document.getElementById('pf-name');
  var descEl   = document.getElementById('pf-desc');
  var budgetEl = document.getElementById('pf-budget');

  ['pf-name-err','pf-desc-err','pf-focus-err','pf-budget-err'].forEach(function(eid){ showFieldError(eid,''); });
  [nameEl, descEl, budgetEl].forEach(function(el){ el.style.borderColor=''; });

  var valid = true;
  if (!nameEl.value.trim() || nameEl.value.trim().length < 3) {
    nameEl.style.borderColor='#ef4444'; showFieldError('pf-name-err','Program name required (min 3 chars)'); valid=false;
  }
  if (!descEl.value.trim() || descEl.value.trim().length < 10) {
    descEl.style.borderColor='#ef4444'; showFieldError('pf-desc-err','Description required (min 10 chars)'); valid=false;
  }
  
  // Collect focus categories
  var selectedFocus = [];
  document.querySelectorAll('input[name="pf-focus"]:checked').forEach(function(cb) {
    selectedFocus.push(cb.value);
  });
  if (selectedFocus.length === 0) {
    showFieldError('pf-focus-err','Select at least one focus area / category'); valid=false;
  }
  
  if (!budgetEl.value || isNaN(budgetEl.value) || parseFloat(budgetEl.value) <= 0) {
    budgetEl.style.borderColor='#ef4444'; showFieldError('pf-budget-err','Enter a valid budget amount'); valid=false;
  }
  if (!valid) return;

  // Collect selected skills
  var selectedSkills = [];
  document.querySelectorAll('input[name="pf-skills"]:checked').forEach(function(cb) {
    selectedSkills.push(cb.value);
  });
  
  // Collect selected volunteers
  var selectedVols = [];
  document.querySelectorAll('input[name="pf-vols"]:checked').forEach(function(cb) {
    var parts = cb.value.split('|');
    selectedVols.push({ name: parts[0], email: parts[1] });
  });

  var data = { 
    name: nameEl.value.trim(), 
    description: descEl.value.trim(), 
    focus: selectedFocus, 
    status: document.getElementById('pf-status').value, 
    budget: parseFloat(budgetEl.value), 
    startDate: document.getElementById('pf-start').value,
    location: document.getElementById('pf-location').value.trim(),
    volunteerGoal: parseInt(document.getElementById('pf-volgoal').value) || 0,
    openForApplications: document.getElementById('pf-openapps').value === 'true',
    requiredSkills: selectedSkills
  };
  
  var progId;
  if (id) { 
    ProgDB.update(id, data); 
    progId = id;
    showToastMsg('Program updated.', 'success'); 
  } else { 
    var newProg = ProgDB.create(data);
    progId = newProg.id;
    showToastMsg('Program created.', 'success'); 
  }
  
  // Create/update volunteer assignments
  if (typeof ProgramAssignmentDB !== 'undefined') {
    // Remove old assignments not in the new selection
    var oldAssignments = ProgramAssignmentDB.getByProgram(progId);
    oldAssignments.forEach(function(a) {
      var stillSelected = selectedVols.some(function(v) { return v.email.toLowerCase() === a.volunteerEmail.toLowerCase(); });
      if (!stillSelected) {
        ProgramAssignmentDB.delete(a.id);
      }
    });
    // Add new assignments
    selectedVols.forEach(function(v) {
      if (!ProgramAssignmentDB.exists(progId, v.email)) {
        ProgramAssignmentDB.create({
          programId: progId,
          programName: data.name,
          volunteerEmail: v.email,
          volunteerName: v.name,
          role: 'Volunteer',
          status: 'active'
        });
      }
    });
  }
  
  closeProgModal();
  renderProgramCards();
}

// ============================================================
//  INCOMING REQUESTS PAGE
// ============================================================
function initIncomingPage() {
  renderIncomingList();
}

function renderIncomingList() {
  var container = document.getElementById('beneficiaryReqList');
  if (!container) return;
  var items = IncomingDB.getAll();
  // We'll show the latest first
  items.reverse();
  
  if (items.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#9ca3af;background:#fff;border-radius:12px;border:1px solid #f1f5f9;">No beneficiary requests yet.</div>';
    return;
  }
  
  var html = '';
  items.forEach(function (r) {
    var isPending = r.status === 'pending';
    var isAccepted = r.status === 'accepted';
    var isDeclined = r.status === 'declined';
    
    var dotClass = isPending ? 'pending' : (isAccepted ? 'completed' : '');
    var dotStyle = isDeclined ? 'width:10px;height:10px;border-radius:50%;background:#ef4444' : (dotClass ? '' : 'width:10px;height:10px;border-radius:50%;background:#d1d5db');
    if(isPending && !dotStyle) dotStyle = 'width:10px;height:10px;border-radius:50%;background:#f59e0b';
    if(isAccepted && !dotStyle) dotStyle = 'width:10px;height:10px;border-radius:50%;background:#059669';
    
    var statusClass = isPending ? 'pending' : (isAccepted ? 'completed' : '');
    var statusStyle = isDeclined ? 'background:#fef2f2;color:#ef4444' : '';

    html += '<div class="req-item" id="ben-req-' + r.id + '" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border:1px solid #f1f5f9;border-radius:12px;margin-bottom:10px;background:#fff;' + (isPending ? '' : 'opacity:0.75;') + '">';
    html += '  <div style="display:flex;align-items:center;gap:12px;flex:1;">';
    html += '    <div class="req-dot ' + dotClass + '" style="' + dotStyle + '"></div>';
    html += '    <div class="req-info">';
    html += '      <div class="req-title" style="font-weight:600;font-size:14px;color:#1e293b;margin-bottom:2px;">' + r.id + ' — ' + escHtml(r.type || 'General') + '</div>';
    html += '      <div class="req-by" style="font-size:12px;color:#64748b;">By ' + escHtml(r.name) + ' — ' + r.date + '</div>';
    html += '    </div>';
    html += '  </div>';
    html += '  <div style="display:flex;align-items:center;gap:8px;">';
    html += '    <span class="req-status ' + statusClass + '" id="' + r.id + '-status" style="' + statusStyle + '">' + r.status + '</span>';
    if (isPending) {
      html += '    <button onclick="approveBenReq(\'' + r.id + '\', \'' + r.id + '\')" style="background:#059669;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-weight:600;font-size:.78rem;cursor:pointer">✓ Approve</button>';
      html += '    <button onclick="rejectBenReq(\'' + r.id + '\', \'' + r.id + '\')" style="border:1px solid #fecaca;background:#fff;color:#ef4444;padding:6px 12px;border-radius:7px;font-weight:600;font-size:.78rem;cursor:pointer">✕ Reject</button>';
    }
    var safeDesc = (r.desc || '').replace(/'/g, "\\'");
    html += '    <button onclick="viewBenReq(\'' + r.id + '\', \'' + escHtml(r.type || 'General') + '\', \'' + escHtml(r.name) + '\', \'' + r.date + '\', \'' + safeDesc + '\')" style="border:1px solid #e2e8f0;background:#fff;color:#374151;padding:6px 12px;border-radius:7px;font-weight:600;font-size:.78rem;cursor:pointer">👁 View</button>';
    html += '  </div>';
    html += '</div>';
  });
  container.innerHTML = html;
}

function acceptIncoming(id) {
  IncomingDB.accept(id);
  showToastMsg('Request accepted — marked as in progress.', 'success');
  renderIncomingList();
}

function declineIncoming(id) {
  if (!confirm('Decline this request?')) return;
  IncomingDB.decline(id);
  showToastMsg('Request declined.', 'error');
  renderIncomingList();
}

// ============================================================
//  OVERVIEW PAGE (stats)
// ============================================================
function initOrgOverviewPage() {
  renderProgramCards();

  // Also render volunteer table with full action buttons
  if (document.getElementById('volTableBody')) {
    initVolunteersPage();
  }

  // Also render incoming requests to beneficiaryList
  if (document.getElementById('beneficiaryReqList')) {
    initIncomingPage();
  }

  // Render hour verifications
  if (document.getElementById('hourVerificationList')) {
    renderHourVerifications();
  }

  // Update stats dynamically
  var volCount = (typeof VolDB !== 'undefined') ? VolDB.getAll().length : 0;
  var progCount = (typeof ProgDB !== 'undefined') ? ProgDB.getAll().length : 0;
  var reqCount = (typeof IncomingDB !== 'undefined') ? IncomingDB.getAll().filter(function(r){ return r.status === 'pending'; }).length : 0;

  var volStat = document.querySelector('.stat-card.volunteers .stat-value');
  var progStat = document.querySelector('.stat-card.programs .stat-value');
  var reqStat = document.querySelector('.stat-card.requests .stat-value');

  if (volStat) volStat.textContent = fmtNum(volCount);
  if (progStat) progStat.textContent = fmtNum(progCount);
  if (reqStat) reqStat.textContent = fmtNum(reqCount);

  // Animate progress bars
  document.querySelectorAll('.progress-fill, .resource-fill').forEach(function (bar) {
    var target = bar.style.width;
    bar.style.width = '0%';
    requestAnimationFrame(function () {
      setTimeout(function () { bar.style.width = target; }, 80);
    });
  });

  // Draw overview charts
  setTimeout(function() {
    drawOrgVolunteerChart();
    drawOrgProgramDonut();
  }, 150);
}

// ── Org Admin Overview: Hour Verification ─────────────────────
function renderHourVerifications() {
  var container = document.getElementById('hourVerificationList');
  if (!container) return;
  if (typeof HourLogDB === 'undefined') return;

  var session = (typeof getSession === 'function') ? getSession() : null;
  // Let's get pending hour logs
  var pending = HourLogDB.getPending();
  // Filter by org if needed, but for simplicity of mock, we show all pending
  
  if (pending.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#9ca3af;background:#fff;border-radius:12px;border:1px solid #f1f5f9;">No pending hour logs to verify.</div>';
    return;
  }
  
  var html = '';
  pending.forEach(function (l) {
    html += '<div class="req-item" id="hourlog-' + l.id + '" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border:1px solid #f1f5f9;border-radius:12px;margin-bottom:10px;background:#fff;">';
    html += '<div style="display:flex;align-items:center;gap:12px;flex:1;">';
    html += '<div class="req-dot pending" style="width:10px;height:10px;border-radius:50%;background:#f59e0b;"></div>';
    html += '<div class="req-info">';
    html += '<div class="req-title" style="font-weight:600;font-size:14px;color:#1e293b;margin-bottom:2px;">' + l.activity + ' (' + l.hours + ' hrs)</div>';
    html += '<div class="req-by" style="font-size:12px;color:#64748b;">By ' + (l.volunteerName || l.volunteerEmail) + ' • ' + (l.date ? new Date(l.date).toLocaleDateString('en-IN') : 'N/A') + '</div>';
    html += '</div></div>';
    
    html += '<div style="display:flex;align-items:center;gap:8px;">';
    html += '<button onclick="approveHourLog(\'' + l.id + '\')" style="background:#059669;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-weight:600;font-size:.78rem;cursor:pointer">✓ Approve</button>';
    html += '<button onclick="rejectHourLog(\'' + l.id + '\')" style="border:1px solid #fecaca;background:#fff;color:#ef4444;padding:6px 12px;border-radius:7px;font-weight:600;font-size:.78rem;cursor:pointer">✕ Reject</button>';
    html += '</div></div>';
  });
  container.innerHTML = html;
}

function approveHourLog(id) {
  if (typeof HourLogDB !== 'undefined') {
    HourLogDB.update(id, { status: 'approved' });
    renderHourVerifications();
    // Re-render volunteer table on dashboard if it's there, to show updated hours
    if (document.getElementById('volTableBody')) {
      renderVolTable();
      // Wait, update total stat as well
      var volCount = (typeof VolDB !== 'undefined') ? VolDB.getAll().length : 0;
      var volStat = document.querySelector('.stat-card.volunteers .stat-value');
      if (volStat) volStat.textContent = fmtNum(volCount);
    }
    showToastMsg('Hour log verified and approved.', 'success');
  }
}

function rejectHourLog(id) {
  if (!confirm('Are you sure you want to reject these logged hours?')) return;
  if (typeof HourLogDB !== 'undefined') {
    HourLogDB.update(id, { status: 'rejected' });
    renderHourVerifications();
    showToastMsg('Hour log rejected.', 'error');
  }
}


// ── Org Admin Overview: Volunteer Activity Line Chart ────────
function drawOrgVolunteerChart() {
  var canvas = document.getElementById('orgVolChart');
  if (!canvas) return;
  var parent = canvas.parentElement;
  canvas.width = parent.offsetWidth || 320;
  canvas.height = 160;
  var ctx = canvas.getContext('2d');
  var w = canvas.width; var h = canvas.height;
  var pad = { top: 20, right: 20, bottom: 30, left: 40 };
  var labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  var data = [820, 940, 1050, 1100, 1190, 1240];
  var maxVal = 1400;
  var cW = w - pad.left - pad.right;
  var cH = h - pad.top - pad.bottom;

  // Grid
  ctx.strokeStyle = '#f0f4f8'; ctx.lineWidth = 1;
  for (var i = 0; i <= 4; i++) {
    var gy = pad.top + (cH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(w - pad.right, gy); ctx.stroke();
    ctx.fillStyle = '#9ca3af'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), pad.left - 6, gy + 3);
  }
  // X labels
  ctx.textAlign = 'center';
  labels.forEach(function(l, i) {
    var lx = pad.left + (cW / (labels.length - 1)) * i;
    ctx.fillStyle = '#9ca3af'; ctx.font = '10px Segoe UI';
    ctx.fillText(l, lx, h - 8);
  });
  // Gradient fill
  var grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
  grad.addColorStop(0, 'rgba(16,185,129,.25)'); grad.addColorStop(1, 'rgba(16,185,129,0)');
  ctx.beginPath();
  data.forEach(function(v, i) {
    var px = pad.left + (cW / (data.length - 1)) * i;
    var py = pad.top + cH - (v / maxVal) * cH;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.lineTo(pad.left + cW, pad.top + cH); ctx.lineTo(pad.left, pad.top + cH); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  // Line
  ctx.beginPath(); ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
  data.forEach(function(v, i) {
    var px = pad.left + (cW / (data.length - 1)) * i;
    var py = pad.top + cH - (v / maxVal) * cH;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.stroke();
  // Dots
  data.forEach(function(v, i) {
    var px = pad.left + (cW / (data.length - 1)) * i;
    var py = pad.top + cH - (v / maxVal) * cH;
    ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
  });
}

// ── Org Admin Overview: Program Status Donut ─────────────────
function drawOrgProgramDonut() {
  var canvas = document.getElementById('orgProgDonut');
  if (!canvas) return;
  var progs = (typeof ProgDB !== 'undefined') ? ProgDB.getAll() : [];
  var active    = progs.filter(function(p){ return p.status === 'active'; }).length;
  var completed = progs.filter(function(p){ return p.status === 'completed'; }).length;
  var paused    = progs.filter(function(p){ return p.status === 'paused'; }).length;
  var total = active + completed + paused || 1;

  canvas.width = 140; canvas.height = 140;
  var ctx = canvas.getContext('2d');
  var cx = 70; var cy = 70; var r = 52; var ir = 30;
  var segments = [
    { val: active,    color: '#10b981', label: 'Active' },
    { val: completed, color: '#6366f1', label: 'Completed' },
    { val: paused,    color: '#f59e0b', label: 'Paused' }
  ];
  var start = -Math.PI / 2;
  segments.forEach(function(seg) {
    if (seg.val === 0) return;
    var angle = (seg.val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.arc(cx, cy, ir, start + angle, start, true);
    ctx.closePath(); ctx.fillStyle = seg.color; ctx.fill();
    start += angle;
  });
  // Centre label
  ctx.fillStyle = '#1e293b'; ctx.font = 'bold 18px Segoe UI'; ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 5);
  ctx.fillStyle = '#9ca3af'; ctx.font = '10px Segoe UI';
  ctx.fillText('programs', cx, cy + 18);

  // Legend
  var legend = document.getElementById('orgProgLegend');
  if (legend) {
    legend.innerHTML = segments.map(function(s) {
      return '<div style="display:flex;align-items:center;gap:6px;font-size:.78rem;color:#374151"><span style="width:10px;height:10px;border-radius:50%;background:'+s.color+';flex-shrink:0"></span>'+s.label+' ('+s.val+')</div>';
    }).join('');
  }
}

// ============================================================
//  SHARED HELPERS (duplicated from superuser-crud.js so each file is standalone)
// ============================================================
function showFieldError(errId, msg) {
  var el = document.getElementById(errId);
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
  el.style.color = '#ef4444'; el.style.fontSize = '.75rem'; el.style.marginTop = '3px';
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtNum(n) {
  if (n >= 100000) return (n/100000).toFixed(1)+'L';
  if (n >= 1000)   return (n/1000).toFixed(0)+'K';
  return String(n);
}

function showToastMsg(msg, type) {
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  var bg    = type === 'success' ? '#0f1923' : '#7f1d1d';
  var accent= type === 'success' ? '#00c896' : '#fca5a5';
  var toast = document.createElement('div');
  toast.style.cssText = 'background:' + bg + ';color:white;padding:12px 18px;border-radius:10px;font-size:13.5px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.2);display:flex;align-items:center;gap:9px;border-left:3px solid '+accent+';max-width:340px;';
  toast.innerHTML = '<span>' + (type==='success'?'✓':'✕') + '</span><span>' + escHtml(msg) + '</span>';
  container.appendChild(toast);
  setTimeout(function(){ toast.style.opacity='0'; toast.style.transition='opacity .3s'; setTimeout(function(){ toast.remove(); }, 300); }, 3500);
}

function showInfoModal(title, bodyHtml) {
  var existing = document.getElementById('infoModal'); if (existing) existing.remove();
  var html = '<div class="modal-overlay" id="infoModal" style="display:flex"><div class="modal-box" style="width:460px;max-width:95vw">' +
    '<div class="modal-header"><h3>' + title + '</h3><button class="modal-close-btn" onclick="document.getElementById(\'infoModal\').remove();document.body.style.overflow=\'\'">×</button></div>' +
    '<div class="modal-body">' + bodyHtml + '</div>' +
    '<div class="modal-actions"><button class="btn-modal-save" onclick="document.getElementById(\'infoModal\').remove();document.body.style.overflow=\'\'">Close</button></div>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
}

// ── Pending Approval Overlay for Org Admin ──────────────────
function showAdminPendingOverlay() {
  var overlay = document.createElement('div');
  overlay.id = 'adminPendingOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(15,25,35,.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;';
  overlay.innerHTML =
    '<div style="background:#fff;border-radius:20px;padding:48px 40px;max-width:480px;width:90%;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.3);animation:modalIn .3s ease">' +
    '<div style="width:80px;height:80px;margin:0 auto 24px;background:linear-gradient(135deg,#fef3c7,#fde68a,#fbbf24);border-radius:50%;display:flex;align-items:center;justify-content:center;animation:pendingPulse 2.5s ease-in-out infinite">' +
    '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#92400e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
    '</div>' +
    '<h2 style="font-family:Sora,sans-serif;font-size:1.35rem;font-weight:700;color:#1e293b;margin-bottom:12px">Organization Under Review</h2>' +
    '<p style="color:#64748b;font-size:.92rem;line-height:1.65;margin-bottom:24px">Your organization admin account is currently under review by the Platform Administrator. You will receive access once your account is approved.</p>' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#fffbeb;border:1.5px solid #fde68a;border-radius:100px;padding:10px 22px;font-size:.85rem;font-weight:600;color:#92400e;margin-bottom:28px">' +
    '<span style="width:10px;height:10px;background:#f59e0b;border-radius:50%;animation:dotBlink 1.5s ease-in-out infinite"></span> Pending Admin Approval</div>' +
    '<div style="display:flex;gap:12px;justify-content:center">' +
    '<button onclick="signOut()" style="padding:12px 28px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-family:inherit;font-size:.9rem;font-weight:600;cursor:pointer">Sign Out</button>' +
    '<button onclick="window.location.href=\'index.html\'" style="padding:12px 28px;border:1.5px solid #e2e8f0;border-radius:10px;background:#fff;color:#64748b;font-family:inherit;font-size:.9rem;font-weight:600;cursor:pointer">Go Home</button>' +
    '</div></div>';

  if (!document.getElementById('pending-overlay-styles')) {
    var style = document.createElement('style');
    style.id = 'pending-overlay-styles';
    style.textContent = '@keyframes pendingPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}@keyframes dotBlink{0%,100%{opacity:1}50%{opacity:.3}}@keyframes modalIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}';
    document.head.appendChild(style);
  }

  document.body.appendChild(overlay);
}

// ── Delete Volunteer ─────────────────────────────────────────
function deleteVol(id, name) {
  if (!confirm('Delete volunteer "' + name + '"? This cannot be undone.')) return;
  VolDB.delete(id);
  if (typeof UserDB !== 'undefined') {
    UserDB.delete(id);
  }
  showToastMsg('Volunteer "' + name + '" removed.', 'success');
  renderVolTable();
}

function showConfirmModal(title, message, onConfirm, confirmText, cancelText) {
  var existing = document.getElementById('confirmModal'); if (existing) existing.remove();
  confirmText = confirmText || 'Confirm';
  cancelText = cancelText || 'Cancel';
  var html = '<div class="modal-overlay" id="confirmModal" style="display:flex;z-index:99999"><div class="modal-box" style="width:400px;max-width:95vw">' +
    '<div class="modal-header"><h3 style="display:flex;align-items:center;gap:8px"><span style="color:#ef4444">⚠️</span> ' + title + '</h3><button class="modal-close-btn" onclick="document.getElementById(\'confirmModal\').remove();document.body.style.overflow=\'\'">×</button></div>' +
    '<div class="modal-body" style="padding:20px;font-size:0.95rem;color:#4b5563;line-height:1.5">' + message + '</div>' +
    '<div class="modal-actions" style="border-top:1px solid #e2e8f0;padding:16px 24px;display:flex;gap:12px;justify-content:flex-end;margin:0 -24px -24px">' +
    '<button style="padding:10px 16px;border:1.5px solid #e2e8f0;border-radius:8px;background:#fff;color:#64748b;font-weight:600;cursor:pointer" onclick="document.getElementById(\'confirmModal\').remove();document.body.style.overflow=\'\'">' + cancelText + '</button>' +
    '<button id="confirmModalActionBtn" style="padding:10px 16px;border:none;border-radius:8px;background:#ef4444;color:#fff;font-weight:600;cursor:pointer">' + confirmText + '</button>' +
    '</div></div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
  document.getElementById('confirmModalActionBtn').onclick = function() {
    document.getElementById('confirmModal').remove();
    document.body.style.overflow = '';
    if (onConfirm) onConfirm();
  };
}

// ── Delete Program ───────────────────────────────────────────
function deleteProg(id, name) {
  // If name not passed, look it up
  if (!name) {
    var prog = ProgDB.getById(id);
    name = prog ? prog.name : 'this program';
  }
  showConfirmModal('Delete Program', 'Are you sure you want to delete the program "<b>' + escHtml(name) + '</b>"? This action cannot be undone.', function() {
    ProgDB.delete(id);
    // Also clean up related assignments, subtasks, applications
    if (typeof ProgramAssignmentDB !== 'undefined') {
      var assigns = ProgramAssignmentDB.getByProgram(id);
      assigns.forEach(function(a) { ProgramAssignmentDB.delete(a.id); });
    }
    if (typeof SubtaskDB !== 'undefined') {
      var subs = SubtaskDB.getByProgram(id);
      subs.forEach(function(s) { SubtaskDB.delete(s.id); });
    }
    if (typeof ProgramApplicationDB !== 'undefined') {
      var apps = ProgramApplicationDB.getByProgram(id);
      apps.forEach(function(a) { ProgramApplicationDB.delete(a.id); });
    }
    showToastMsg('Program "' + escHtml(name) + '" deleted.', 'success');
    renderProgramCards();
  }, 'Delete', 'Cancel');
}

// ── Assign Task Modal ────────────────────────────────────────
function openTaskModal(volName, volEmail) {
  var existing = document.getElementById('taskModal');
  if (existing) existing.remove();

  var progs = (typeof ProgDB !== 'undefined') ? ProgDB.getAll() : [];
  var progOptions = '<option value="">— Select Program —</option>' +
    progs.map(function(p) { return '<option value="' + escHtml(p.name) + '">' + escHtml(p.name) + '</option>'; }).join('');

  var today = new Date().toISOString().split('T')[0];
  var modal = '<div class="modal-overlay" id="taskModal" style="display:flex">' +
    '<div class="modal-box" style="width:500px;max-width:95vw">' +
    '<div class="modal-header"><h3>📋 Assign Task — ' + escHtml(volName) + '</h3>' +
    '<button class="modal-close-btn" onclick="closeTaskModal()">×</button></div>' +
    '<div class="modal-body"><form id="taskForm" onsubmit="submitTaskForm(event)" novalidate>' +
    '<input type="hidden" id="tf-vol-name" value="' + escHtml(volName) + '">' +
    '<input type="hidden" id="tf-vol-email" value="' + escHtml(volEmail) + '">' +
    '<div class="field"><label>Task Title <span class="req">*</span></label>' +
    '<input type="text" id="tf-title" placeholder="e.g. Food Distribution Drive"/>' +
    '<p class="field-error" id="tf-title-err"></p></div>' +
    '<div class="field"><label>Description</label>' +
    '<textarea id="tf-desc" rows="2" placeholder="Describe what needs to be done..."></textarea></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Program</label><select id="tf-prog">' + progOptions + '</select></div>' +
    '<div class="field"><label>Priority</label><select id="tf-priority">' +
    '<option value="normal">Normal</option>' +
    '<option value="high">High</option>' +
    '<option value="urgent">Urgent</option>' +
    '</select></div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Location</label><input type="text" id="tf-location" placeholder="e.g. Noida Sector 62"/></div>' +
    '<div class="field"><label>Due Date</label><input type="date" id="tf-date" value="' + today + '"/></div></div>' +
    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeTaskModal()">Cancel</button>' +
    '<button type="submit" class="btn-modal-save">📋 Assign Task</button>' +
    '</div></form></div></div></div>';

  document.body.insertAdjacentHTML('beforeend', modal);
  document.body.style.overflow = 'hidden';
  document.getElementById('tf-title').focus();
}

function closeTaskModal() {
  var m = document.getElementById('taskModal');
  if (m) m.remove();
  document.body.style.overflow = '';
}

function submitTaskForm(e) {
  e.preventDefault();
  var title = document.getElementById('tf-title').value.trim();
  var desc = document.getElementById('tf-desc').value.trim();
  var prog = document.getElementById('tf-prog').value;
  var priority = document.getElementById('tf-priority').value;
  var location = document.getElementById('tf-location').value.trim();
  var date = document.getElementById('tf-date').value;
  
  // If we're in the global modal, grab from the dropdown
  var volSelect = document.getElementById('tf-vol-select');
  var volName = '';
  var volEmail = '';

  if (volSelect) {
    if (!volSelect.value) {
      showFieldError('tf-title-err', 'Please select a volunteer');
      return;
    }
    var parts = volSelect.value.split('|');
    volName = parts[0];
    volEmail = parts[1];
  } else {
    volName = document.getElementById('tf-vol-name').value;
    volEmail = document.getElementById('tf-vol-email').value;
  }

  if (!title || title.length < 3) {
    showFieldError('tf-title-err', 'Task title is required (min 3 chars)');
    return;
  }
  showFieldError('tf-title-err', '');

  var session = (typeof getSession === 'function') ? getSession() : null;
  if (typeof TaskDB !== 'undefined') {
    TaskDB.create({
      title: title,
      description: desc,
      program: prog,
      priority: priority,
      location: location,
      dueDate: date,
      assignedToName: volName,
      assignedToEmail: volEmail,
      assignedBy: session ? session.name : 'Org Admin',
      assignedByOrg: session ? (session.org || 'Organization') : 'Organization',
      status: 'pending'
    });
  }

  closeTaskModal();
  showToastMsg('📋 Task assigned to ' + volName + ' successfully!', 'success');
  // Refresh volunteer table so task count updates if it's visible
  if (document.getElementById('volTableBody')) {
    renderVolTable();
  }
}

// ── Global Assign Task Modal ─────────────────────────────────
function openGlobalTaskModal() {
  var existing = document.getElementById('taskModal');
  if (existing) existing.remove();

  var progs = (typeof ProgDB !== 'undefined') ? ProgDB.getAll() : [];
  var progOptions = '<option value="">— Select Program —</option>' +
    progs.map(function(p) { return '<option value="' + escHtml(p.name) + '">' + escHtml(p.name) + '</option>'; }).join('');

  var vols = (typeof VolDB !== 'undefined') ? VolDB.getAll() : [];
  if (typeof UserDB !== 'undefined') {
    var registeredVols = UserDB.getAll().filter(function(u) { return u.role === 'volunteer' && u.status === 'approved'; });
    registeredVols.forEach(function(u) {
      if (!vols.some(function(v) { return v.email === u.email; })) {
        vols.push({ name: u.name, email: u.email });
      }
    });
  }
  
  var volOptions = '<option value="">— Select Volunteer —</option>' +
    vols.map(function(v) { return '<option value="' + escHtml(v.name) + '|' + escHtml(v.email) + '">' + escHtml(v.name) + ' (' + escHtml(v.email) + ')</option>'; }).join('');

  var today = new Date().toISOString().split('T')[0];
  var modal = '<div class="modal-overlay" id="taskModal" style="display:flex">' +
    '<div class="modal-box" style="width:500px;max-width:95vw">' +
    '<div class="modal-header"><h3>📋 Assign Task to Volunteer</h3>' +
    '<button class="modal-close-btn" onclick="closeTaskModal()">×</button></div>' +
    '<div class="modal-body"><form id="taskForm" onsubmit="submitTaskForm(event)" novalidate>' +
    
    '<div class="field"><label>Assign To <span class="req">*</span></label>' +
    '<select id="tf-vol-select">' + volOptions + '</select></div>' +
    
    '<div class="field"><label>Task Title <span class="req">*</span></label>' +
    '<input type="text" id="tf-title" placeholder="e.g. Food Distribution Drive"/>' +
    '<p class="field-error" id="tf-title-err"></p></div>' +
    '<div class="field"><label>Description</label>' +
    '<textarea id="tf-desc" rows="2" placeholder="Describe what needs to be done..."></textarea></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Program</label><select id="tf-prog">' + progOptions + '</select></div>' +
    '<div class="field"><label>Priority</label><select id="tf-priority">' +
    '<option value="normal">Normal</option>' +
    '<option value="high">High</option>' +
    '<option value="urgent">Urgent</option>' +
    '</select></div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Location</label><input type="text" id="tf-location" placeholder="e.g. Noida Sector 62"/></div>' +
    '<div class="field"><label>Due Date</label><input type="date" id="tf-date" value="' + today + '"/></div></div>' +
    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeTaskModal()">Cancel</button>' +
    '<button type="submit" class="btn-modal-save">📋 Assign Task</button>' +
    '</div></form></div></div></div>';

  document.body.insertAdjacentHTML('beforeend', modal);
  document.body.style.overflow = 'hidden';
  document.getElementById('tf-vol-select').focus();
}

// ============================================================
//  PROGRAM DETAIL MODAL — Full view with subtasks & progress
// ============================================================
function openProgramDetail(progId) {
  var prog = ProgDB.getById(progId);
  if (!prog) return;
  
  var assigned = (typeof ProgramAssignmentDB !== 'undefined') ? ProgramAssignmentDB.getByProgram(progId) : [];
  var subtasks = (typeof SubtaskDB !== 'undefined') ? SubtaskDB.getByProgram(progId) : [];
  var totalProgress = (typeof SubtaskDB !== 'undefined') ? SubtaskDB.getProgramProgress(progId) : 0;
  var pendingApps = (typeof ProgramApplicationDB !== 'undefined') ? ProgramApplicationDB.getByProgram(progId).filter(function(a){return a.status==='pending';}) : [];
  
  var statusColor = prog.status === 'active' ? '#22c55e' : (prog.status === 'completed' ? '#6366f1' : '#f59e0b');
  var progressColor = totalProgress >= 80 ? '#10b981' : (totalProgress >= 40 ? '#f59e0b' : '#6366f1');
  
  var html = '<div class="modal-overlay" id="progDetailModal" style="display:flex">' +
    '<div class="modal-box" style="width:720px;max-width:95vw;max-height:90vh;overflow-y:auto">' +
    '<div class="modal-header" style="border-bottom:2px solid #f1f5f9;padding-bottom:16px">' +
    '<div><h3 style="margin:0 0 4px 0">' + escHtml(prog.name) + '</h3>' +
    '<div style="display:flex;gap:8px;align-items:center">' +
    '<span style="background:' + statusColor + '20;color:' + statusColor + ';font-size:.72rem;padding:3px 10px;border-radius:20px;font-weight:600;border:1px solid ' + statusColor + '40">' + prog.status + '</span>' +
    '<span style="font-size:.78rem;color:#94a3b8">' + escHtml(Array.isArray(prog.focus) ? prog.focus.join(', ') : (prog.focus || '')) + '</span>' +
    (prog.location ? '<span style="font-size:.78rem;color:#94a3b8">📍 ' + escHtml(prog.location) + '</span>' : '') +
    '</div></div>' +
    '<button class="modal-close-btn" onclick="closeProgramDetail()">×</button></div>' +
    '<div class="modal-body" style="padding:0">' +
    
    // Overall progress
    '<div style="padding:20px;background:linear-gradient(135deg,#f8fafc,#f0f9ff);border-bottom:1px solid #e2e8f0">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
    '<span style="font-weight:700;font-size:.9rem;color:#1e293b">📊 Overall Progress</span>' +
    '<span style="font-weight:800;font-size:1.2rem;color:' + progressColor + '">' + totalProgress + '%</span></div>' +
    '<div style="background:#e2e8f0;border-radius:8px;height:12px;overflow:hidden">' +
    '<div style="background:' + progressColor + ';height:12px;border-radius:8px;width:' + totalProgress + '%;transition:width .6s ease"></div></div>' +
    '<div style="display:flex;gap:16px;margin-top:12px;font-size:.78rem;color:#64748b">' +
    '<span>👥 ' + assigned.length + ' / ' + (prog.volunteerGoal || '∞') + ' volunteers</span>' +
    '<span>📋 ' + subtasks.length + ' subtasks</span>' +
    '<span>💰 ₹' + fmtNum(prog.raised) + ' / ₹' + fmtNum(prog.budget) + '</span>' +
    '</div></div>';
  
  // Skills
  if (prog.requiredSkills && prog.requiredSkills.length > 0) {
    html += '<div style="padding:12px 20px;border-bottom:1px solid #f1f5f9">' +
      '<div style="font-size:.78rem;font-weight:600;color:#64748b;margin-bottom:6px">🎯 Required Skills</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap">';
    prog.requiredSkills.forEach(function(sk) {
      html += '<span style="background:#eff6ff;color:#3b82f6;font-size:.7rem;padding:3px 10px;border-radius:20px;font-weight:600;border:1px solid #bfdbfe">' + escHtml(sk) + '</span>';
    });
    html += '</div></div>';
  }
  
  // Assigned Volunteers with individual progress
  html += '<div style="padding:16px 20px;border-bottom:1px solid #f1f5f9">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
    '<div style="font-weight:700;font-size:.9rem;color:#1e293b">👥 Assigned Volunteers</div>' +
    '</div>';
  
  if (assigned.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:#94a3b8;font-size:.85rem">No volunteers assigned yet.</div>';
  } else {
    assigned.forEach(function(a) {
      var volSubtasks = subtasks.filter(function(s) { return s.assignedToEmail && s.assignedToEmail.toLowerCase() === a.volunteerEmail.toLowerCase(); });
      var volProgress = 0;
      if (volSubtasks.length > 0) {
        volProgress = Math.round(volSubtasks.reduce(function(sum, s) { return sum + (s.progress || 0); }, 0) / volSubtasks.length);
      }
      var volProgressColor = volProgress >= 80 ? '#10b981' : (volProgress >= 40 ? '#f59e0b' : '#6366f1');
      var completedCount = volSubtasks.filter(function(s) { return s.status === 'completed'; }).length;
      
      html += '<div style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #f1f5f9;border-radius:10px;margin-bottom:8px;background:#fafbfc">' +
        '<div style="width:36px;height:36px;border-radius:50%;background:#6366f1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;flex-shrink:0">' + a.volunteerName.charAt(0) + '</div>' +
        '<div style="flex:1;min-width:0">' +
        '<div style="font-weight:600;font-size:.85rem;color:#1e293b">' + escHtml(a.volunteerName) + '</div>' +
        '<div style="font-size:.72rem;color:#94a3b8">' + escHtml(a.role) + ' • ' + completedCount + '/' + volSubtasks.length + ' subtasks done</div>' +
        '</div>' +
        '<div style="text-align:right;min-width:80px">' +
        '<div style="font-weight:700;font-size:.9rem;color:' + volProgressColor + '">' + volProgress + '%</div>' +
        '<div style="background:#e2e8f0;border-radius:4px;height:5px;width:80px;margin-top:3px"><div style="background:' + volProgressColor + ';height:5px;border-radius:4px;width:' + volProgress + '%"></div></div>' +
        '</div></div>';
    });
  }
  html += '</div>';
  
  // Subtasks
  html += '<div style="padding:16px 20px;border-bottom:1px solid #f1f5f9">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
    '<div style="font-weight:700;font-size:.9rem;color:#1e293b">📋 Subtasks</div>' +
    '<button onclick="openAddSubtaskModal(\'' + progId + '\')" style="background:#6366f1;color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:.78rem;font-weight:600;cursor:pointer">+ Add Subtask</button></div>';
  
  if (subtasks.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:#94a3b8;font-size:.85rem">No subtasks yet. Add subtasks to track progress.</div>';
  } else {
    subtasks.forEach(function(st) {
      var stColor = st.status === 'completed' ? '#10b981' : (st.status === 'in-progress' ? '#f59e0b' : '#94a3b8');
      var stBg = st.status === 'completed' ? '#f0fdf4' : (st.status === 'in-progress' ? '#fffbeb' : '#f8fafc');
      html += '<div style="padding:10px 12px;border:1px solid #f1f5f9;border-radius:8px;margin-bottom:6px;background:' + stBg + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
        '<div style="font-weight:600;font-size:.82rem;color:#1e293b">' + escHtml(st.title) + '</div>' +
        '<span style="font-size:.7rem;padding:3px 8px;border-radius:20px;background:' + stColor + '20;color:' + stColor + ';font-weight:600;text-transform:capitalize">' + st.status + '</span></div>' +
        (st.description ? '<div style="font-size:.75rem;color:#64748b;margin-bottom:6px">' + escHtml(st.description) + '</div>' : '') +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<span style="font-size:.72rem;color:#94a3b8">Assigned: ' + escHtml(st.assignedToName || 'Unassigned') + '</span>' +
        '<div style="display:flex;align-items:center;gap:6px"><div style="background:#e2e8f0;border-radius:4px;height:5px;width:60px"><div style="background:' + stColor + ';height:5px;border-radius:4px;width:' + (st.progress || 0) + '%"></div></div>' +
        '<span style="font-size:.72rem;font-weight:600;color:' + stColor + '">' + (st.progress || 0) + '%</span></div></div></div>';
    });
  }
  html += '</div>';
  
  // Pending Applications
  if (pendingApps.length > 0) {
    html += '<div style="padding:16px 20px">' +
      '<div style="font-weight:700;font-size:.9rem;color:#1e293b;margin-bottom:12px">📬 Pending Applications (' + pendingApps.length + ')</div>';
    pendingApps.forEach(function(app) {
      html += '<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid #fef3c7;border-radius:8px;margin-bottom:6px;background:#fffbeb">' +
        '<div style="width:32px;height:32px;border-radius:50%;background:#f59e0b;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0">' + (app.volunteerName || 'V').charAt(0) + '</div>' +
        '<div style="flex:1;min-width:0">' +
        '<div style="font-weight:600;font-size:.82rem">' + escHtml(app.volunteerName) + '</div>' +
        '<div style="font-size:.72rem;color:#64748b">' + (app.skills ? app.skills.join(', ') : 'No skills listed') + '</div>' +
        (app.message ? '<div style="font-size:.72rem;color:#92400e;margin-top:2px;font-style:italic">"' + escHtml(app.message) + '"</div>' : '') +
        '</div>' +
        '<div style="display:flex;gap:6px">' +
        '<button onclick="approveApplication(\'' + app.id + '\',\'' + progId + '\')" style="background:#059669;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:.72rem;font-weight:600;cursor:pointer">✓ Approve</button>' +
        '<button onclick="rejectApplication(\'' + app.id + '\',\'' + progId + '\')" style="border:1px solid #fecaca;background:#fff;color:#ef4444;padding:5px 10px;border-radius:6px;font-size:.72rem;font-weight:600;cursor:pointer">✕ Reject</button>' +
        '</div></div>';
    });
    html += '</div>';
  }
  
  html += '</div></div></div>';
  
  var existing = document.getElementById('progDetailModal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
}

function closeProgramDetail() {
  var m = document.getElementById('progDetailModal');
  if (m) m.remove();
  document.body.style.overflow = '';
}

// ── Add Subtask Modal ────────────────────────────────────────
function openAddSubtaskModal(progId) {
  var prog = ProgDB.getById(progId);
  if (!prog) return;
  var assigned = (typeof ProgramAssignmentDB !== 'undefined') ? ProgramAssignmentDB.getByProgram(progId) : [];
  
  var volOptions = '<option value="">— Select Volunteer —</option>' +
    assigned.map(function(a) { return '<option value="' + escHtml(a.volunteerName) + '|' + escHtml(a.volunteerEmail) + '">' + escHtml(a.volunteerName) + '</option>'; }).join('');
  
  var html = '<div class="modal-overlay" id="addSubtaskModal" style="display:flex;z-index:10001">' +
    '<div class="modal-box" style="width:460px;max-width:95vw">' +
    '<div class="modal-header"><h3>📋 Add Subtask — ' + escHtml(prog.name) + '</h3>' +
    '<button class="modal-close-btn" onclick="closeAddSubtask()">×</button></div>' +
    '<div class="modal-body">' +
    '<div class="field"><label>Subtask Title <span class="req">*</span></label>' +
    '<input type="text" id="st-title" placeholder="e.g. Distribute food packages"/></div>' +
    '<div class="field"><label>Description</label>' +
    '<textarea id="st-desc" rows="2" placeholder="Describe what needs to be done..."></textarea></div>' +
    '<div class="field"><label>Assign To</label>' +
    '<select id="st-assign">' + volOptions + '</select></div>' +
    '<input type="hidden" id="st-progid" value="' + progId + '">' +
    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeAddSubtask()">Cancel</button>' +
    '<button type="button" class="btn-modal-save" onclick="submitSubtask()">Add Subtask</button>' +
    '</div></div></div></div>';
  
  var existing = document.getElementById('addSubtaskModal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function closeAddSubtask() {
  var m = document.getElementById('addSubtaskModal');
  if (m) m.remove();
}

function submitSubtask() {
  var title = document.getElementById('st-title').value.trim();
  var desc = document.getElementById('st-desc').value.trim();
  var assignVal = document.getElementById('st-assign').value;
  var progId = document.getElementById('st-progid').value;
  
  if (!title || title.length < 3) {
    alert('Subtask title is required (min 3 chars)');
    return;
  }
  
  var assignName = '', assignEmail = '';
  if (assignVal) {
    var parts = assignVal.split('|');
    assignName = parts[0];
    assignEmail = parts[1];
  }
  
  if (typeof SubtaskDB !== 'undefined') {
    SubtaskDB.create({
      programId: progId,
      title: title,
      description: desc,
      assignedToEmail: assignEmail,
      assignedToName: assignName,
      status: 'pending',
      progress: 0
    });
  }
  
  closeAddSubtask();
  closeProgramDetail();
  openProgramDetail(progId);
  renderProgramCards();
  showToastMsg('Subtask added successfully!', 'success');
}

// ── Application Review ──────────────────────────────────────
function approveApplication(appId, progId) {
  if (typeof ProgramApplicationDB !== 'undefined') {
    ProgramApplicationDB.approve(appId);
    showToastMsg('Application approved — volunteer assigned!', 'success');
    closeProgramDetail();
    openProgramDetail(progId);
    renderProgramCards();
    if (typeof renderVolAppReview === 'function') renderVolAppReview();
  }
}

function rejectApplication(appId, progId) {
  if (!confirm('Reject this application?')) return;
  if (typeof ProgramApplicationDB !== 'undefined') {
    ProgramApplicationDB.reject(appId);
    showToastMsg('Application rejected.', 'error');
    closeProgramDetail();
    openProgramDetail(progId);
    renderProgramCards();
    if (typeof renderVolAppReview === 'function') renderVolAppReview();
  }
}

// ── Volunteer Application Review (for org admin overview) ──
function renderVolAppReview() {
  var container = document.getElementById('volAppReviewList');
  if (!container) return;
  if (typeof ProgramApplicationDB === 'undefined') return;
  
  var pending = ProgramApplicationDB.getPending();
  
  if (pending.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:30px;color:#9ca3af;background:#fff;border-radius:12px;border:1px solid #f1f5f9;">No pending volunteer applications.</div>';
    return;
  }
  
  var html = '';
  pending.forEach(function(app) {
    html += '<div style="display:flex;align-items:center;gap:12px;padding:14px 18px;border:1px solid #fef3c7;border-radius:12px;margin-bottom:10px;background:#fffbeb">' +
      '<div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;flex-shrink:0">' + (app.volunteerName || 'V').charAt(0) + '</div>' +
      '<div style="flex:1;min-width:0">' +
      '<div style="font-weight:600;font-size:14px;color:#1e293b">' + escHtml(app.volunteerName) + ' → <span style="color:#6366f1">' + escHtml(app.programName) + '</span></div>' +
      '<div style="font-size:12px;color:#64748b">' + (app.skills ? '🎯 ' + app.skills.join(', ') : '') + ' • Applied ' + (app.appliedAt || 'recently') + '</div>' +
      (app.message ? '<div style="font-size:12px;color:#92400e;margin-top:2px;font-style:italic">"' + escHtml(app.message) + '"</div>' : '') +
      '</div>' +
      '<div style="display:flex;gap:6px">' +
      '<button onclick="approveApplication(\'' + app.id + '\',\'' + app.programId + '\')" style="background:#059669;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-weight:600;font-size:.78rem;cursor:pointer">✓ Approve</button>' +
      '<button onclick="rejectApplication(\'' + app.id + '\',\'' + app.programId + '\')" style="border:1px solid #fecaca;background:#fff;color:#ef4444;padding:6px 12px;border-radius:7px;font-weight:600;font-size:.78rem;cursor:pointer">✕ Reject</button>' +
      '</div></div>';
  });
  container.innerHTML = html;
}

// ============================================================
//  RESOURCE DONATIONS MANAGEMENT (Org Admin)
// ============================================================
function initResourcesPage() {
  renderResourceDonations();
  renderResourceStats();
}

function renderResourceStats() {
  if (typeof ResourceDonationDB === 'undefined') return;
  
  var all = ResourceDonationDB.getAll();
  var pending = all.filter(function(d){ return d.status === 'submitted'; }).length;
  var active = all.filter(function(d){ return d.status === 'pending_pickup' || d.status === 'in_transit'; }).length;
  var delivered = all.filter(function(d){ return d.status === 'delivered' || d.status === 'completed'; }).length;
  var totalItems = all.reduce(function(sum, d){ return sum + d.items.reduce(function(s, it){ return s + it.quantity; }, 0); }, 0);

  // Update stat cards if they exist
  var statVol = document.querySelector('.stat-card.volunteers .stat-value');
  var statProg = document.querySelector('.stat-card.programs .stat-value');
  var statRes = document.querySelector('.stat-card.resources .stat-value');
  var statReq = document.querySelector('.stat-card.requests .stat-value');

  if (statRes) statRes.textContent = fmtNum(totalItems);
  if (statReq) statReq.textContent = pending;
  
  // Update dynamic stats on overview
  var resDonationStat = document.getElementById('resDonationCount');
  if (resDonationStat) resDonationStat.textContent = all.length;
  var resPendingStat = document.getElementById('resPendingCount');
  if (resPendingStat) resPendingStat.textContent = pending;
}

function renderResourceDonations() {
  if (typeof ResourceDonationDB === 'undefined') return;
  
  var pendingContainer = document.getElementById('resPendingList');
  var activeContainer = document.getElementById('resActiveList');
  var completedContainer = document.getElementById('resCompletedList');
  
  var all = ResourceDonationDB.getAll();
  var pending = all.filter(function(d){ return d.status === 'submitted'; });
  var active = all.filter(function(d){ return d.status === 'pending_pickup' || d.status === 'in_transit'; });
  var completed = all.filter(function(d){ return d.status === 'delivered' || d.status === 'completed'; });
  
  // Render pending
  if (pendingContainer) {
    if (pending.length === 0) {
      pendingContainer.innerHTML = '<div style="text-align:center;padding:30px;color:#9ca3af;background:#fff;border-radius:12px;border:1px solid #f1f5f9;">No pending resource donations.</div>';
    } else {
      pendingContainer.innerHTML = pending.map(function(d) {
        return buildResourceCard(d, 'pending');
      }).join('');
    }
  }
  
  // Render active
  if (activeContainer) {
    if (active.length === 0) {
      activeContainer.innerHTML = '<div style="text-align:center;padding:30px;color:#9ca3af;background:#fff;border-radius:12px;border:1px solid #f1f5f9;">No active pickups.</div>';
    } else {
      activeContainer.innerHTML = active.map(function(d) {
        return buildResourceCard(d, 'active');
      }).join('');
    }
  }
  
  // Render completed
  if (completedContainer) {
    if (completed.length === 0) {
      completedContainer.innerHTML = '<div style="text-align:center;padding:30px;color:#9ca3af;background:#fff;border-radius:12px;border:1px solid #f1f5f9;">No completed donations yet.</div>';
    } else {
      completedContainer.innerHTML = completed.slice(0, 10).map(function(d) {
        return buildResourceCard(d, 'completed');
      }).join('');
    }
  }
  
  // Also render overview summary if on overview page
  var overviewResList = document.getElementById('resOverviewList');
  if (overviewResList) {
    if (pending.length === 0 && active.length === 0) {
      overviewResList.innerHTML = '<div style="text-align:center;padding:30px;color:#9ca3af;background:#fff;border-radius:12px;border:1px solid #f1f5f9;">No pending resource donations.</div>';
    } else {
      var summary = pending.concat(active).slice(0, 5);
      overviewResList.innerHTML = summary.map(function(d) {
        return buildResourceCard(d, d.status === 'submitted' ? 'pending' : 'active');
      }).join('');
    }
  }
}

function buildResourceCard(d, mode) {
  var icon = (typeof RESOURCE_CATEGORY_ICONS !== 'undefined' ? RESOURCE_CATEGORY_ICONS[d.category] : '📦') || '📦';
  var color = (typeof RESOURCE_CATEGORY_COLORS !== 'undefined' ? RESOURCE_CATEGORY_COLORS[d.category] : '#64748b') || '#64748b';
  var statusIdx = (typeof RESOURCE_STATUS_FLOW !== 'undefined') ? RESOURCE_STATUS_FLOW.indexOf(d.status) : 0;
  var statusLabels = ['Submitted', 'Volunteer Assigned', 'In Transit', 'Delivered', 'Completed'];
  var statusColors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#059669'];
  var currentLabel = statusLabels[statusIdx] || d.status;
  var currentColor = statusColors[statusIdx] || '#64748b';
  
  var itemsHtml = d.items.map(function(it) {
    return '<span style="display:inline-flex;align-items:center;gap:3px;background:#f1f5f9;padding:2px 8px;border-radius:14px;font-size:.7rem;font-weight:600;color:#475569;">' + escHtml(it.name) + ' × ' + it.quantity + '</span>';
  }).join(' ');
  
  // Progress timeline (compact)
  var timeline = '<div style="display:flex;align-items:center;gap:0;margin:10px 0 6px;">';
  for (var si = 0; si < 5; si++) {
    var done = si <= statusIdx;
    var dotColor = done ? statusColors[si] : '#e2e8f0';
    var lineColor = (si < statusIdx) ? statusColors[si] : '#e2e8f0';
    timeline += '<div style="display:flex;flex-direction:column;align-items:center;flex:' + (si < 4 ? '1' : '0') + ';">';
    timeline += '<div style="width:' + (done ? '18px' : '12px') + ';height:' + (done ? '18px' : '12px') + ';border-radius:50%;background:' + dotColor + ';display:flex;align-items:center;justify-content:center;z-index:1;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.08);">';
    if (done) timeline += '<span style="color:#fff;font-size:.5rem;font-weight:700;">✓</span>';
    timeline += '</div>';
    timeline += '<div style="font-size:.52rem;color:' + (done ? '#374151' : '#cbd5e1') + ';font-weight:' + (done ? '600' : '400') + ';margin-top:2px;white-space:nowrap;">' + statusLabels[si] + '</div>';
    timeline += '</div>';
    if (si < 4) timeline += '<div style="flex:1;height:2px;background:' + lineColor + ';margin:0 -2px;margin-top:-10px;border-radius:2px;"></div>';
  }
  timeline += '</div>';
  
  // Action buttons
  var actionsHtml = '';
  if (mode === 'pending') {
    actionsHtml = '<div style="display:flex;gap:6px;margin-top:10px;">' +
      '<button onclick="openAssignPickupModal(\'' + d.id + '\')" style="flex:1;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:.78rem;font-weight:600;cursor:pointer;">👤 Assign Volunteer</button>' +
      ((!d.programId || !d.programName) ? '<button onclick="openAllocateProgramModal(\'' + d.id + '\')" style="background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;padding:8px 14px;border-radius:8px;font-size:.78rem;font-weight:600;cursor:pointer;">📋 Allocate</button>' : '') +
      '</div>';
  } else if (mode === 'active') {
    actionsHtml = '<div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:8px 12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">' +
      '<div style="width:28px;height:28px;border-radius:50%;background:#6366f1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;">' + (d.assignedVolunteerName ? d.assignedVolunteerName.charAt(0) : '?') + '</div>' +
      '<div style="flex:1;"><div style="font-size:.78rem;font-weight:600;color:#1e40af;">Volunteer: ' + escHtml(d.assignedVolunteerName || 'Unassigned') + '</div>' +
      '<div style="font-size:.68rem;color:#6b7280;">' + (d.status === 'in_transit' ? '🚗 In transit since ' + (d.pickedUpAt ? new Date(d.pickedUpAt).toLocaleDateString('en-IN') : '') : '⏳ Awaiting pickup') + '</div></div>';
    if (d.status === 'delivered') {
      actionsHtml += '<button onclick="markResCompleted(\'' + d.id + '\')" style="background:#059669;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-size:.75rem;font-weight:600;cursor:pointer;">✓ Mark Complete</button>';
    }
    actionsHtml += '</div>';
  }
  
  return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;margin-bottom:12px;box-shadow:0 2px 6px rgba(0,0,0,.03);transition:all .2s;" onmouseover="this.style.boxShadow=\'0 4px 16px rgba(0,0,0,.08)\'" onmouseout="this.style.boxShadow=\'0 2px 6px rgba(0,0,0,.03)\'">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">' +
    '<div style="display:flex;align-items:center;gap:10px;"><div style="width:40px;height:40px;border-radius:10px;background:' + color + '15;display:flex;align-items:center;justify-content:center;font-size:1.15rem;">' + icon + '</div>' +
    '<div><div style="font-weight:700;font-size:.88rem;color:#1e293b;">' + escHtml(d.category) + '</div>' +
    '<div style="font-size:.72rem;color:#94a3b8;">By ' + escHtml(d.donorName) + ' • ' + new Date(d.createdAt).toLocaleDateString('en-IN') + (d.programName ? ' • 📋 ' + escHtml(d.programName) : '') + '</div></div></div>' +
    '<span style="background:' + currentColor + '18;color:' + currentColor + ';font-size:.68rem;padding:3px 10px;border-radius:20px;font-weight:600;border:1px solid ' + currentColor + '30;white-space:nowrap;">' + currentLabel + '</span></div>' +
    '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;">' + itemsHtml + '</div>' +
    '<div style="font-size:.75rem;color:#64748b;">📍 ' + escHtml(d.pickupAddress) + '</div>' +
    '<div style="font-size:.72rem;color:#94a3b8;margin-top:2px;">📅 ' + d.pickupDate + ' • ⏰ ' + escHtml(d.pickupTimeSlot || '') + '</div>' +
    timeline + actionsHtml + '</div>';
}

// ── Assign Volunteer to Pickup ──────────────────────────────
function openAssignPickupModal(donationId) {
  var donation = ResourceDonationDB.getById(donationId);
  if (!donation) return;
  
  var vols = (typeof VolDB !== 'undefined') ? VolDB.getAll() : [];
  if (typeof UserDB !== 'undefined') {
    var registeredVols = UserDB.getAll().filter(function(u) { return u.role === 'volunteer' && u.status === 'approved'; });
    registeredVols.forEach(function(u) {
      if (!vols.some(function(v) { return v.email === u.email; })) {
        vols.push({ id: u.id, name: u.name, email: u.email });
      }
    });
  }
  
  var volOptions = '<option value="">— Select Volunteer —</option>' +
    vols.map(function(v) {
      return '<option value="' + escHtml(v.name) + '|' + escHtml(v.email) + '">' + escHtml(v.name) + ' (' + escHtml(v.email) + ')</option>';
    }).join('');
  
  var html = '<div class="modal-overlay" id="assignPickupModal" style="display:flex;z-index:10001">' +
    '<div class="modal-box" style="width:460px;max-width:95vw">' +
    '<div class="modal-header"><h3>👤 Assign Volunteer for Pickup</h3>' +
    '<button class="modal-close-btn" onclick="closeAssignPickup()">×</button></div>' +
    '<div class="modal-body">' +
    '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:16px;">' +
    '<div style="font-weight:700;font-size:.88rem;color:#1e293b;margin-bottom:4px;">' + escHtml(donation.category) + ' Donation</div>' +
    '<div style="font-size:.78rem;color:#64748b;">By ' + escHtml(donation.donorName) + ' • ' + donation.items.length + ' item(s)</div>' +
    '<div style="font-size:.75rem;color:#94a3b8;margin-top:4px;">📍 ' + escHtml(donation.pickupAddress) + '</div>' +
    '<div style="font-size:.75rem;color:#94a3b8;">📅 ' + donation.pickupDate + ' • ⏰ ' + escHtml(donation.pickupTimeSlot || '') + '</div></div>' +
    '<div class="field"><label>Select Volunteer <span class="req">*</span></label>' +
    '<select id="ap-vol-select">' + volOptions + '</select>' +
    '<p class="field-error" id="ap-vol-err"></p></div>' +
    '<input type="hidden" id="ap-donation-id" value="' + donationId + '">' +
    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeAssignPickup()">Cancel</button>' +
    '<button type="button" class="btn-modal-save" onclick="submitPickupAssignment()">👤 Assign & Notify</button>' +
    '</div></div></div></div>';
  
  var existing = document.getElementById('assignPickupModal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
}

function closeAssignPickup() {
  var m = document.getElementById('assignPickupModal');
  if (m) m.remove();
  document.body.style.overflow = '';
}

function submitPickupAssignment() {
  var volSelect = document.getElementById('ap-vol-select');
  var donationId = document.getElementById('ap-donation-id').value;
  
  if (!volSelect.value) {
    showFieldError('ap-vol-err', 'Please select a volunteer');
    return;
  }
  
  var parts = volSelect.value.split('|');
  var volName = parts[0];
  var volEmail = parts[1];
  
  ResourceDonationDB.assignVolunteer(donationId, volName, volEmail);
  
  closeAssignPickup();
  renderResourceDonations();
  renderResourceStats();
  showToastMsg('📦 Volunteer ' + volName + ' assigned for pickup!', 'success');
}

// ── Allocate Resource to Program ────────────────────────────
function openAllocateProgramModal(donationId) {
  var donation = ResourceDonationDB.getById(donationId);
  if (!donation) return;
  
  var progs = (typeof ProgDB !== 'undefined') ? ProgDB.getAll().filter(function(p){ return p.status === 'active'; }) : [];
  var progOptions = '<option value="">— Select Program —</option>' +
    progs.map(function(p) {
      return '<option value="' + p.id + '|' + escHtml(p.name) + '">' + escHtml(p.name) + '</option>';
    }).join('');
  
  var html = '<div class="modal-overlay" id="allocateProgModal" style="display:flex;z-index:10001">' +
    '<div class="modal-box" style="width:420px;max-width:95vw">' +
    '<div class="modal-header"><h3>📋 Allocate to Program</h3>' +
    '<button class="modal-close-btn" onclick="closeAllocateProg()">×</button></div>' +
    '<div class="modal-body">' +
    '<div class="field"><label>Select Program <span class="req">*</span></label>' +
    '<select id="alloc-prog-select">' + progOptions + '</select>' +
    '<p class="field-error" id="alloc-prog-err"></p></div>' +
    '<input type="hidden" id="alloc-donation-id" value="' + donationId + '">' +
    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeAllocateProg()">Cancel</button>' +
    '<button type="button" class="btn-modal-save" onclick="submitAllocateProgram()">📋 Allocate</button>' +
    '</div></div></div></div>';
  
  var existing = document.getElementById('allocateProgModal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
}

function closeAllocateProg() {
  var m = document.getElementById('allocateProgModal');
  if (m) m.remove();
  document.body.style.overflow = '';
}

function submitAllocateProgram() {
  var progSelect = document.getElementById('alloc-prog-select');
  var donationId = document.getElementById('alloc-donation-id').value;
  
  if (!progSelect.value) {
    showFieldError('alloc-prog-err', 'Please select a program');
    return;
  }
  
  var parts = progSelect.value.split('|');
  var progId = parts[0];
  var progName = parts[1];
  
  ResourceDonationDB.allocateToProgram(donationId, progId, progName);
  
  closeAllocateProg();
  renderResourceDonations();
  showToastMsg('📋 Resource allocated to ' + progName + '!', 'success');
}

function markResCompleted(donationId) {
  ResourceDonationDB.markCompleted(donationId);
  renderResourceDonations();
  renderResourceStats();
  showToastMsg('✓ Resource donation marked as completed!', 'success');
}

