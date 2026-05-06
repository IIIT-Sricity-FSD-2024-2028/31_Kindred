/* ============================================================
   KINDRED — SUPERUSER CRUD JS
   Handles Organizations, Requests, platform-level operations
   with full CRUD, validation, and role-gated UI
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  // Auth guard — only superuser can access these pages
  var session = requireAuth(['superuser']);
  if (!session) return;

  // Update navbar user info
  applyRoleGating();
  updateNavUserInfo(session);

  // Sign out binding
  document.querySelectorAll('[data-signout]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); signOut(); });
  });

  // Render tables / lists if elements exist
  if (document.getElementById('orgTableBody'))       renderOrgTable();
  if (document.getElementById('requestsList'))       renderRequestsList();
  if (document.getElementById('emergencyRequests'))  renderEmergencyPanel();
  if (document.getElementById('pendingUsersList'))   renderPendingUsers();

  // Initialize Charts
  if (document.getElementById('lineChart'))  drawLineChart();
  if (document.getElementById('donutChart')) drawDonutChart();
  if (document.getElementById('barChart'))   drawBarChart();
  if (document.getElementById('analyticsContent')) renderAnalytics();

  // Redraw line chart on resize
  window.addEventListener('resize', function () {
    if (document.getElementById('lineChart')) drawLineChart();
  });

  // Add Org button
  var addOrgBtn = document.querySelector('.btn-add-org, [data-add-org]');
  if (addOrgBtn) addOrgBtn.addEventListener('click', function () { openOrgModal(); });

  // Search
  var searchInput = document.getElementById('searchOrgs');
  if (searchInput) {
    searchInput.addEventListener('input', function () { renderOrgTable(this.value); });
  }

  // Status filter
  var statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', function () { renderOrgTable(null, this.value); });
  }
});

// ── Update Navbar User Info ──────────────────────────────────
function updateNavUserInfo(session) {
  var nameEl     = document.querySelector('.user-name');
  var roleEl     = document.querySelector('.user-role');
  var avatarEl   = document.querySelector('.avatar');
  if (nameEl)   nameEl.textContent   = session.name;
  if (roleEl)   roleEl.textContent   = 'Platform Administrator';
  if (avatarEl) avatarEl.textContent = session.initials;
}

// ── Render Org Table ─────────────────────────────────────────
function renderOrgTable(search, statusFilterVal) {
  var tbody = document.getElementById('orgTableBody');
  if (!tbody) return;

  var data = search ? OrgDB.search(search) : OrgDB.getAll();
  if (statusFilterVal && statusFilterVal !== 'all') {
    data = data.filter(function (o) { return o.status === statusFilterVal; });
  }

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:#9ca3af;">No organizations found.</td></tr>';
    return;
  }

  var html = '';
  data.forEach(function (org) {
    var statusClass = org.status === 'active' ? 'active' : (org.status === 'suspended' ? 'suspended' : 'pending');
    html += '<tr data-org-id="' + org.id + '">';
    html += '<td><div class="org-info"><div class="org-avatar" style="background:' + org.color + '">' + org.name.charAt(0) + '</div>';
    html += '<div><div class="org-name">' + escHtml(org.name) + '</div><div class="org-joined">Joined ' + org.joined + '</div></div></div></td>';
    html += '<td>' + escHtml(org.focus) + '</td>';
    html += '<td><span class="status-badge ' + statusClass + '">' + org.status + '</span></td>';
    html += '<td>' + Number(org.volunteers).toLocaleString() + '</td>';
    html += '<td>' + Number(org.beneficiaries).toLocaleString() + '</td>';
    html += '<td>' + org.rating + '</td>';
    html += '<td><div class="action-btns">';
    html += '<button class="action-btn" title="View" onclick="viewOrg(\'' + org.id + '\')">👁</button>';
    html += '<button class="action-btn" title="Edit" onclick="openOrgModal(\'' + org.id + '\')">✏️</button>';
    // Delete only for superuser
    html += '<button class="action-btn delete-btn" title="Delete" onclick="deleteOrg(\'' + org.id + '\', \'' + escHtml(org.name) + '\')">🗑</button>';
    html += '</div></td></tr>';
  });
  tbody.innerHTML = html;

  // Update org count badge
  var countEl = document.querySelector('.stat-value[data-stat="orgs"]');
  if (countEl) countEl.textContent = DB_ORGANIZATIONS.length;
}

// ── View Org (modal / toast) ──────────────────────────────────
function viewOrg(id) {
  var org = OrgDB.getById(id);
  if (!org) return;
  showInfoModal('Organization Details',
    '<div style="display:grid;gap:10px;font-size:.9rem;">' +
    '<div><strong>Name:</strong> ' + escHtml(org.name) + '</div>' +
    '<div><strong>Focus:</strong> ' + escHtml(org.focus) + '</div>' +
    '<div><strong>Status:</strong> ' + org.status + '</div>' +
    '<div><strong>City:</strong> ' + escHtml(org.city || '—') + '</div>' +
    '<div><strong>Email:</strong> ' + escHtml(org.email || '—') + '</div>' +
    '<div><strong>Phone:</strong> ' + escHtml(org.phone || '—') + '</div>' +
    '<div><strong>Volunteers:</strong> ' + Number(org.volunteers).toLocaleString() + '</div>' +
    '<div><strong>Beneficiaries:</strong> ' + Number(org.beneficiaries).toLocaleString() + '</div>' +
    '<div><strong>Rating:</strong> ' + org.rating + '</div>' +
    '</div>'
  );
}

// ── Delete Org ────────────────────────────────────────────────
function deleteOrg(id, name) {
  if (!confirm('Delete "' + name + '"?\n\nThis action cannot be undone.')) return;
  var success = OrgDB.delete(id);
  if (success) {
    showToastMsg('Organization "' + name + '" deleted.', 'success');
    renderOrgTable();
  } else {
    showToastMsg('Could not delete organization.', 'error');
  }
}

// ── Add / Edit Org Modal ──────────────────────────────────────
function openOrgModal(id) {
  var org = id ? OrgDB.getById(id) : null;
  var isEdit = !!org;

  var modalHtml = '<div class="modal-overlay" id="orgModal" style="display:flex">' +
    '<div class="modal-box" style="width:520px;max-width:95vw">' +
    '<div class="modal-header"><h3>' + (isEdit ? 'Edit Organization' : 'Add Organization') + '</h3>' +
    '<button class="modal-close-btn" onclick="closeOrgModal()">×</button></div>' +
    '<div class="modal-body">' +
    '<form id="orgForm" onsubmit="submitOrgForm(event,' + (id ? '\\\'' + id + '\\\'' : 'null') + ')" novalidate>' +

    '<div class="field"><label>Organization Name <span class="req">*</span></label>' +
    '<input type="text" id="of-name" value="' + (org ? escHtml(org.name) : '') + '" placeholder="e.g. HopeConnect"/>' +
    '<p class="field-error" id="of-name-err"></p></div>' +

    '<div class="field"><label>Focus Area <span class="req">*</span></label>' +
    '<select id="of-focus"><option value="">Select focus area</option>' +
    ['Disaster Relief','Community Development','Environment','Education','Healthcare','Food Security','Housing','Elder Care','International Aid','Youth Empowerment','Sustainability','Child Welfare'].map(function(f){
      return '<option value="' + f + '"' + (org && org.focus === f ? ' selected' : '') + '>' + f + '</option>';
    }).join('') +
    '</select><p class="field-error" id="of-focus-err"></p></div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>Email <span class="req">*</span></label>' +
    '<input type="email" id="of-email" value="' + (org ? escHtml(org.email || '') : '') + '" placeholder="contact@org.org"/>' +
    '<p class="field-error" id="of-email-err"></p></div>' +
    '<div class="field"><label>Phone</label>' +
    '<input type="text" id="of-phone" value="' + (org ? escHtml(org.phone || '') : '') + '" placeholder="+91 98765 43210"/>' +
    '<p class="field-error" id="of-phone-err"></p></div>' +
    '</div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
    '<div class="field"><label>City</label>' +
    '<input type="text" id="of-city" value="' + (org ? escHtml(org.city || '') : '') + '" placeholder="e.g. Mumbai"/>' +
    '</div>' +
    '<div class="field"><label>Status <span class="req">*</span></label>' +
    '<select id="of-status">' +
    ['active','pending','suspended'].map(function(s){
      return '<option value="' + s + '"' + (org && org.status === s ? ' selected' : (!org && s === 'pending' ? ' selected' : '')) + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>';
    }).join('') +
    '</select></div></div>' +

    '<div class="modal-actions">' +
    '<button type="button" class="btn-modal-cancel" onclick="closeOrgModal()">Cancel</button>' +
    '<button type="submit" class="btn-modal-save">' + (isEdit ? 'Save Changes' : 'Add Organization') + '</button>' +
    '</div></form></div></div></div>';

  var existing = document.getElementById('orgModal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow = 'hidden';
  document.getElementById('of-name').focus();
}

function closeOrgModal() {
  var modal = document.getElementById('orgModal');
  if (modal) modal.remove();
  document.body.style.overflow = '';
}

function submitOrgForm(e, id) {
  e.preventDefault();
  var name   = document.getElementById('of-name');
  var focus  = document.getElementById('of-focus');
  var email  = document.getElementById('of-email');
  var phone  = document.getElementById('of-phone');

  var valid = true;

  // Clear previous errors
  ['of-name-err','of-focus-err','of-email-err','of-phone-err'].forEach(function(eid){
    var el = document.getElementById(eid);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  });
  [name, focus, email, phone].forEach(function(el){ if (el) el.style.borderColor = ''; });

  if (!name.value.trim()) {
    name.style.borderColor = '#ef4444';
    showFieldError('of-name-err', 'Organization name is required');
    valid = false;
  } else if (name.value.trim().length < 3) {
    name.style.borderColor = '#ef4444';
    showFieldError('of-name-err', 'Name must be at least 3 characters');
    valid = false;
  }

  if (!focus.value) {
    focus.style.borderColor = '#ef4444';
    showFieldError('of-focus-err', 'Please select a focus area');
    valid = false;
  }

  if (!email.value.trim()) {
    email.style.borderColor = '#ef4444';
    showFieldError('of-email-err', 'Email is required');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    email.style.borderColor = '#ef4444';
    showFieldError('of-email-err', 'Enter a valid email address');
    valid = false;
  }

  if (phone.value.trim()) {
    var pDigits = phone.value.trim().replace(/\D/g, '');
    if (pDigits.length === 12 && pDigits.indexOf('91') === 0) pDigits = pDigits.slice(2);
    if (pDigits.length !== 10 || !/^[6-9]\d{9}$/.test(pDigits)) {
      phone.style.borderColor = '#ef4444';
      showFieldError('of-phone-err', 'Phone must be exactly 10 digits and start with 6–9');
      valid = false;
    }
  }

  if (!valid) return;

  var data = {
    name:   name.value.trim(),
    focus:  focus.value,
    email:  email.value.trim(),
    phone:  document.getElementById('of-phone').value.trim(),
    city:   document.getElementById('of-city').value.trim(),
    status: document.getElementById('of-status').value
  };

  if (id) {
    OrgDB.update(id, data);
    showToastMsg('Organization updated successfully.', 'success');
  } else {
    OrgDB.create(data);
    showToastMsg('Organization added successfully.', 'success');
  }

  closeOrgModal();
  renderOrgTable();
}

// ── Requests Panel ────────────────────────────────────────────
function renderRequestsList() {
  var container = document.getElementById('requestsList');
  if (!container) return;

  var requests = ReqDB.getAll();
  var pending  = requests.filter(function (r) { return r.status === 'pending'; });

  // Update badge
  var badge = document.getElementById('requestBadge');
  if (badge) badge.textContent = pending.length + ' pending';
  var tabEl = document.getElementById('tab-requests');
  if (tabEl) tabEl.textContent = 'Requests (' + pending.length + ')';

  if (requests.length === 0) {
    container.innerHTML = '<p style="color:#9ca3af;text-align:center;padding:24px">No requests found.</p>';
    return;
  }

  var html = '';
  requests.forEach(function (r) {
    var isPending = r.status === 'pending';
    var priorityColor = r.priority === 'high' ? '#ef4444' : '#f59e0b';
    html += '<div class="request-card" id="rc-' + r.id + '" style="border-left:4px solid ' + (isPending ? priorityColor : '#d1d5db') + ';padding:16px 20px;margin-bottom:12px;background:#fff;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:flex-start;gap:16px;' + (!isPending ? 'opacity:.65' : '') + '">';
    html += '<div style="flex:1">';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">';
    html += '<span style="font-size:.75rem;font-weight:700;color:#9ca3af">' + r.id + '</span>';
    html += '<span style="font-size:.72rem;font-weight:600;padding:2px 8px;border-radius:20px;background:' + priorityColor + '20;color:' + priorityColor + '">' + (r.priority || 'normal').toUpperCase() + '</span>';
    html += '</div>';
    html += '<div style="font-weight:600;font-size:.92rem;margin-bottom:4px">' + escHtml(r.org) + ' — ' + escHtml(r.type) + '</div>';
    html += '<div style="font-size:.83rem;color:#6b7280;margin-bottom:4px">' + escHtml(r.description) + '</div>';
    html += '<div style="font-size:.75rem;color:#9ca3af">📅 ' + r.date + '</div>';
    html += '</div>';
    if (isPending) {
      html += '<div class="request-actions" style="display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap">';
      html += '<button class="btn-approve" onclick="approveReq(\'' + r.id + '\')" style="background:#059669;color:#fff;border:none;padding:7px 14px;border-radius:8px;font-weight:600;font-size:.82rem;cursor:pointer">✓ Approve</button>';
      html += '<button class="btn-reject" onclick="rejectReq(\'' + r.id + '\')" style="border:1px solid #fecaca;background:#fff;color:#ef4444;padding:7px 14px;border-radius:8px;font-weight:600;font-size:.82rem;cursor:pointer">✕ Reject</button>';
      html += '<button onclick="viewReqDetails(\'' + r.id + '\')" style="border:1px solid #e2e8f0;background:#fff;color:#374151;padding:7px 14px;border-radius:8px;font-weight:600;font-size:.82rem;cursor:pointer">👁 View Details</button>';
      html += '</div>';
    } else {
      html += '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">';
      html += '<span class="status-badge ' + r.status + '">' + r.status + '</span>';
      html += '<button onclick="viewReqDetails(\'' + r.id + '\')" style="border:1px solid #e2e8f0;background:#fff;color:#374151;padding:6px 12px;border-radius:8px;font-weight:600;font-size:.78rem;cursor:pointer">👁 View</button>';
      html += '</div>';
    }
    html += '</div>';
  });
  container.innerHTML = html;

}

function approveReq(id) {
  ReqDB.approve(id);
  showToastMsg('Request ' + id + ' approved successfully.', 'success');
  renderRequestsList();
}

function rejectReq(id) {
  if (!confirm('Reject request ' + id + '? This action cannot be undone.')) return;
  ReqDB.reject(id);
  showToastMsg('Request ' + id + ' rejected.', 'error');
  renderRequestsList();
}

function viewReqDetails(id) {
  var r = ReqDB.getById(id);
  if (!r) return;
  var statusColor = r.status === 'approved' ? '#059669' : (r.status === 'rejected' ? '#ef4444' : '#f59e0b');
  var priorityColor = r.priority === 'high' ? '#ef4444' : '#f59e0b';
  showInfoModal('NGO Request — ' + r.id,
    '<div style="display:grid;gap:12px;font-size:.9rem;">'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+
    '<div><strong style="color:#64748b;font-size:.78rem;display:block;margin-bottom:2px">ORGANIZATION</strong><span style="font-weight:600">' + escHtml(r.org) + '</span></div>'+
    '<div><strong style="color:#64748b;font-size:.78rem;display:block;margin-bottom:2px">REQUEST TYPE</strong><span>' + escHtml(r.type) + '</span></div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+
    '<div><strong style="color:#64748b;font-size:.78rem;display:block;margin-bottom:2px">STATUS</strong><span style="display:inline-flex;padding:3px 10px;border-radius:100px;font-size:.75rem;font-weight:600;background:'+statusColor+'20;color:'+statusColor+';border:1px solid '+statusColor+'40">' + r.status + '</span></div>'+
    '<div><strong style="color:#64748b;font-size:.78rem;display:block;margin-bottom:2px">PRIORITY</strong><span style="display:inline-flex;padding:3px 10px;border-radius:100px;font-size:.75rem;font-weight:600;background:'+priorityColor+'20;color:'+priorityColor+'">' + (r.priority||'normal').toUpperCase() + '</span></div>'+
    '</div>'+
    '<div><strong style="color:#64748b;font-size:.78rem;display:block;margin-bottom:4px">DESCRIPTION</strong><p style="margin:0;color:#374151;line-height:1.6">' + escHtml(r.description) + '</p></div>'+
    (r.contact ? '<div><strong style="color:#64748b;font-size:.78rem;display:block;margin-bottom:2px">CONTACT</strong><span>' + escHtml(r.contact) + '</span></div>' : '')+
    (r.phone ? '<div><strong style="color:#64748b;font-size:.78rem;display:block;margin-bottom:2px">PHONE</strong><span>' + escHtml(r.phone) + '</span></div>' : '')+
    (r.city ? '<div><strong style="color:#64748b;font-size:.78rem;display:block;margin-bottom:2px">CITY</strong><span>' + escHtml(r.city) + '</span></div>' : '')+
    '<div><strong style="color:#64748b;font-size:.78rem;display:block;margin-bottom:2px">DATE SUBMITTED</strong><span>' + r.date + '</span></div>'+
    '</div>'
  );
}

// ── Emergency Panel ───────────────────────────────────────────
function renderEmergencyPanel() {
  var container = document.getElementById('emergencyRequests');
  if (!container) return;
  var items = [
    { id: 'ER-2401', title: 'Cyclone Relief', location: 'Odisha', severity: 'high',   label: 'High Priority' },
    { id: 'ER-2702', title: 'Medical Emergency', location: 'Bihar',   severity: 'high',   label: 'High Priority' },
    { id: 'ER-0203', title: 'Flood Damage',    location: 'Assam',  severity: 'medium', label: 'Medium' }
  ];
  var html = '';
  items.forEach(function (er) {
    var dotClass = er.severity === 'high' ? 'red' : 'orange';
    html += '<div class="emergency-card ' + er.severity + '">';
    html += '<div class="emergency-info"><h4>' + er.id + ' · ' + er.title + '</h4>';
    html += '<p><span class="emergency-dot ' + dotClass + '"></span>' + er.location + '</p></div>';
    html += '<span class="emergency-priority ' + er.severity + '">' + er.label + '</span>';
    html += '</div>';
  });
  container.innerHTML = html;
}

// ── Analytics Page Rendering ──────────────────────────────────
function renderAnalytics() {
  var container = document.getElementById('analyticsContent');
  if (!container) return;

  var html = '<div class="analytics-grid">' +
    '<div class="section-card">' +
      '<div class="section-card-header">' +
        '<h2>Monthly Donation Trends</h2>' +
        '<div class="chart-actions">' +
          '<button class="btn-chart-range">Last 6 Months ▾</button>' +
        '</div>' +
      '</div>' +
      '<div class="chart-container-large">' +
        '<canvas id="donationTrendChart"></canvas>' +
      '</div>' +
    '</div>' +
    '<div class="section-card">' +
      '<div class="section-card-header">' +
        '<h2>Volunteer Growth by Region</h2>' +
        '<div class="chart-actions">' +
          '<button class="btn-chart-range">India South ▾</button>' +
        '</div>' +
      '</div>' +
      '<div class="chart-container-large">' +
        '<canvas id="volunteerGrowthChart"></canvas>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="insights-grid">' +
    '<div class="section-card insight">' +
      '<h3>💡 Strategic Insights</h3>' +
      '<ul class="insight-list">' +
        '<li><strong>Donor Retention:</strong> Retention rate increased by 12% following the new automated "Impact Report" emails.</li>' +
        '<li><strong>Geography:</strong> High growth in Rural Bihar; consider targeting more Tier 2 cities for volunteer recruitment.</li>' +
        '<li><strong>Crisis Response:</strong> Average response time to emergency requests dropped to 14 minutes this quarter.</li>' +
      '</ul>' +
    '</div>' +
    '<div class="section-card insight">' +
      '<h3>🎯 Quarterly Targets</h3>' +
      '<div class="target-item">' +
        '<div class="target-head"><span>NGO Onboarding</span><span>85%</span></div>' +
        '<div class="target-bar"><div class="target-fill" style="width:85%; background:#1a3b5c;"></div></div>' +
      '</div>' +
      '<div class="target-item" style="margin-top:16px">' +
        '<div class="target-head"><span>Volunteer Hours</span><span>62%</span></div>' +
        '<div class="target-bar"><div class="target-fill" style="width:62%; background:#00c9a7;"></div></div>' +
      '</div>' +
    '</div>' +
  '</div>';
  
  container.innerHTML = html;
  
  // Draw charts after insertion
  setTimeout(function() {
    drawDonationTrendChart();
    drawVolunteerGrowthChart();
  }, 100);
}

// ── Donation Trend Chart ──────────────────────────────────────
function drawDonationTrendChart() {
  var canvas = document.getElementById('donationTrendChart');
  if (!canvas) return;
  var parent = canvas.parentElement;
  canvas.width = parent.offsetWidth; canvas.height = 280;
  var ctx = canvas.getContext('2d');
  var w = canvas.width; var h = canvas.height;
  var labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  var data = [4.5, 5.2, 8.8, 6.4, 7.9, 12.5]; // In Lakhs
  var max = 15;
  var pad = 40; var cW = w - pad*2; var cH = h - pad*2;

  // Grid
  ctx.strokeStyle = '#f3f4f6'; ctx.lineWidth = 1;
  for(var i=0; i<=5; i++) {
    var y = pad + (cH/5)*i;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w-pad, y); ctx.stroke();
  }

  // Gradient
  var g = ctx.createLinearGradient(0, pad, 0, h-pad);
  g.addColorStop(0, 'rgba(0, 201, 167, 0.4)'); g.addColorStop(1, 'rgba(0, 201, 167, 0)');

  // Area
  ctx.beginPath();
  data.forEach(function(v, idx) {
    var x = pad + (cW/5)*idx;
    var y = pad + cH - (v/max)*cH;
    if(idx===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.lineTo(pad+cW, pad+cH); ctx.lineTo(pad, pad+cH); ctx.closePath();
  ctx.fillStyle = g; ctx.fill();

  // Line
  ctx.beginPath(); ctx.strokeStyle = '#00c9a7'; ctx.lineWidth = 3;
  data.forEach(function(v, idx) {
    var x = pad + (cW/5)*idx;
    var y = pad + cH - (v/max)*cH;
    if(idx===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

// ── Volunteer Growth Chart (Bar) ────────────────────────────────
function drawVolunteerGrowthChart() {
  var canvas = document.getElementById('volunteerGrowthChart');
  if (!canvas) return;
  var parent = canvas.parentElement;
  canvas.width = parent.offsetWidth; canvas.height = 280;
  var ctx = canvas.getContext('2d');
  var w = canvas.width; var h = canvas.height;
  var regions = ['North', 'South', 'East', 'West', 'Central'];
  var values = [1200, 2500, 800, 1900, 1100];
  var max = 3000;
  var pad = 40; var cW = w - pad*2; var cH = h - pad*2;

  var barW = (cW / regions.length) * 0.6;
  var gap = (cW / regions.length) * 0.4;

  regions.forEach(function(r, i) {
    var valH = (values[i] / max) * cH;
    var x = pad + (gap/2) + i*(barW + gap);
    var y = pad + cH - valH;

    // Bar
    var g = ctx.createLinearGradient(0, y, 0, y+valH);
    g.addColorStop(0, '#1a3b5c'); g.addColorStop(1, '#2c5a85');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, barW, valH);

    // Label
    ctx.fillStyle = '#9ca3af'; ctx.font = '12px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText(r, x + barW/2, h - 15);
  });
}

// ── Shared Helpers ────────────────────────────────────────────
function showFieldError(errId, msg) {
  var el = document.getElementById(errId);
  if (el) { el.textContent = msg; el.style.display = 'block'; el.style.color = '#ef4444'; el.style.fontSize = '.75rem'; el.style.marginTop = '3px'; }
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToastMsg(msg, type) {
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  var bg    = type === 'success' ? '#0f1923' : '#7f1d1d';
  var accent= type === 'success' ? '#00c896' : '#fca5a5';
  toast.style.cssText = 'background:' + bg + ';color:white;padding:12px 18px;border-radius:10px;font-family:inherit;font-size:13.5px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.2);display:flex;align-items:center;gap:9px;border-left:3px solid ' + accent + ';max-width:340px;animation:toastIn .25s ease;';
  toast.innerHTML = '<span>' + (type === 'success' ? '✓' : '✕') + '</span><span>' + escHtml(msg) + '</span>';
  container.appendChild(toast);
  var style = document.createElement('style');
  style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
  if (!document.getElementById('toast-style')) { style.id = 'toast-style'; document.head.appendChild(style); }
  setTimeout(function () { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(function () { toast.remove(); }, 300); }, 3500);
}

function showInfoModal(title, bodyHtml) {
  var existing = document.getElementById('infoModal');
  if (existing) existing.remove();
  var html = '<div class="modal-overlay" id="infoModal" style="display:flex">' +
    '<div class="modal-box" style="width:480px;max-width:95vw">' +
    '<div class="modal-header"><h3>' + title + '</h3>' +
    '<button class="modal-close-btn" onclick="document.getElementById(\'infoModal\').remove();document.body.style.overflow=\'\'">×</button></div>' +
    '<div class="modal-body">' + bodyHtml + '</div>' +
    '<div class="modal-actions"><button class="btn-modal-save" onclick="document.getElementById(\'infoModal\').remove();document.body.style.overflow=\'\'">Close</button></div>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
}

// ===== LINE CHART (Canvas) =====
function drawLineChart() {
  var canvas = document.getElementById('lineChart');
  if (!canvas) return;

  var parent = canvas.parentElement;
  canvas.width = parent.offsetWidth;
  canvas.height = 250;

  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  var padding = { top: 30, right: 30, bottom: 40, left: 50 };

  var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var data = [20, 28, 35, 42, 50, 55, 62, 70, 78, 88, 100, 120];
  var maxVal = 140;

  var chartW = w - padding.left - padding.right;
  var chartH = h - padding.top - padding.bottom;

  // Grid lines
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  for (var i = 0; i <= 5; i++) {
    var y = padding.top + (chartH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    // Y labels
    var val = Math.round(maxVal - (maxVal / 5) * i);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Segoe UI, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(val, padding.left - 10, y + 4);
  }

  // X labels
  ctx.textAlign = 'center';
  for (var j = 0; j < labels.length; j++) {
    var x = padding.left + (chartW / (labels.length - 1)) * j;
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(labels[j], x, h - 10);
  }

  // Gradient fill
  var gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  gradient.addColorStop(0, 'rgba(0, 201, 167, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 201, 167, 0)');

  ctx.beginPath();
  for (var k = 0; k < data.length; k++) {
    var px = padding.left + (chartW / (data.length - 1)) * k;
    var py = padding.top + chartH - (data[k] / maxVal) * chartH;
    if (k === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  // Fill area
  var lastX = padding.left + (chartW / (data.length - 1)) * (data.length - 1);
  var lastY = padding.top + chartH - (data[data.length - 1] / maxVal) * chartH;
  ctx.lineTo(lastX, padding.top + chartH);
  ctx.lineTo(padding.left, padding.top + chartH);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  for (var m = 0; m < data.length; m++) {
    var lx = padding.left + (chartW / (data.length - 1)) * m;
    var ly = padding.top + chartH - (data[m] / maxVal) * chartH;
    if (m === 0) ctx.moveTo(lx, ly);
    else ctx.lineTo(lx, ly);
  }
  ctx.strokeStyle = '#00c9a7';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  for (var n = 0; n < data.length; n++) {
    var dx = padding.left + (chartW / (data.length - 1)) * n;
    var dy = padding.top + chartH - (data[n] / maxVal) * chartH;
    ctx.beginPath();
    ctx.arc(dx, dy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00c9a7';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// ===== DONUT CHART (Canvas) =====
function drawDonutChart() {
  var canvas = document.getElementById('donutChart');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var size = 180;
  canvas.width = size;
  canvas.height = size;
  var cx = size / 2;
  var cy = size / 2;
  var radius = 75;
  var innerRadius = 45;

  var segments = [
    { label: 'Healthcare (25%)', value: 25, color: '#6366f1' },
    { label: 'Education (20%)', value: 20, color: '#22c55e' },
    { label: 'Environment (15%)', value: 15, color: '#f59e0b' },
    { label: 'Disaster Relief (15%)', value: 15, color: '#ef4444' },
    { label: 'Food Security (10%)', value: 10, color: '#06b6d4' },
    { label: 'Housing (8%)', value: 8, color: '#8b5cf6' },
    { label: 'Other (7%)', value: 7, color: '#9ca3af' }
  ];

  var total = 0;
  for (var i = 0; i < segments.length; i++) {
    total += segments[i].value;
  }

  var startAngle = -Math.PI / 2;
  for (var j = 0; j < segments.length; j++) {
    var sliceAngle = (segments[j].value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = segments[j].color;
    ctx.fill();
    startAngle += sliceAngle;
  }

  // Legend
  var legendContainer = document.getElementById('donutLegend');
  if (legendContainer) {
    var html = '';
    for (var k = 0; k < segments.length; k++) {
      html += '<div class="donut-legend-item"><span class="dot" style="background:' + segments[k].color + '"></span>' + segments[k].label + '</div>';
    }
    legendContainer.innerHTML = html;
  }
}

// ===== BAR CHART =====
function drawBarChart() {
  var container = document.getElementById('barChart');
  if (!container) return;

  var months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var registrations = [600, 800, 700, 950, 1100, 1400];
  var activeVols = [400, 500, 450, 700, 800, 1000];
  var maxVal = 1500;

  var html = '';
  for (var i = 0; i < months.length; i++) {
    var h1 = (registrations[i] / maxVal) * 170;
    var h2 = (activeVols[i] / maxVal) * 170;
    html += '<div class="bar-group">';
    html += '<div class="bar-bars">';
    html += '<div class="bar teal" style="height:' + h1 + 'px"></div>';
    html += '<div class="bar navy" style="height:' + h2 + 'px"></div>';
    html += '</div>';
    html += '<span class="bar-label">' + months[i] + '</span>';
    html += '</div>';
  }
  container.innerHTML = html;
}

// ── Pending Users Panel ──────────────────────────────────────
function renderPendingUsers() {
  var container = document.getElementById('pendingUsersList');
  var section   = document.getElementById('pendingUsersSection');
  if (!container) return;

  if (typeof UserDB === 'undefined') {
    if (section) section.style.display = 'none';
    return;
  }

  var pending = UserDB.getPending();
  if (pending.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }

  if (section) section.style.display = '';

  var roleLabels = { admin: 'Organization Admin', volunteer: 'Volunteer', donor: 'Donor', beneficiary: 'Beneficiary' };
  var roleColors = { admin: '#3b82f6', volunteer: '#10b981', donor: '#f59e0b', beneficiary: '#8b5cf6' };

  var html = '';
  pending.forEach(function (u) {
    var roleBg = roleColors[u.role] || '#6b7280';
    var roleLabel = roleLabels[u.role] || u.role;
    var date = u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    html += '<div class="pending-user-card" id="pu-' + u.id + '" style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border:1px solid #f1f5f9;border-radius:12px;margin-bottom:10px;background:#fff;transition:all .2s">';
    html += '<div style="display:flex;align-items:center;gap:14px">';
    html += '<div style="width:40px;height:40px;border-radius:50%;background:' + roleBg + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.82rem">' + (u.initials || 'U') + '</div>';
    html += '<div>';
    html += '<div style="font-weight:600;font-size:.92rem;color:#1e293b">' + escHtml(u.name) + '</div>';
    html += '<div style="font-size:.78rem;color:#64748b">' + escHtml(u.email) + ' · <span style="color:' + roleBg + ';font-weight:600">' + roleLabel + '</span>';
    if (u.org) html += ' · ' + escHtml(u.org);
    html += '</div>';
    html += '<div style="font-size:.72rem;color:#94a3b8">Registered ' + date + '</div>';
    html += '</div></div>';
    html += '<div style="display:flex;gap:8px">';
    html += '<button onclick="approveUserFromOverview(\'' + u.id + '\')" style="padding:7px 16px;border:none;border-radius:8px;background:#059669;color:#fff;font-weight:600;font-size:.82rem;cursor:pointer;transition:opacity .2s" onmouseover="this.style.opacity=\'.85\'" onmouseout="this.style.opacity=\'1\'">✓ Approve</button>';
    html += '<button onclick="rejectUserFromOverview(\'' + u.id + '\')" style="padding:7px 16px;border:1px solid #fecaca;border-radius:8px;background:#fff;color:#ef4444;font-weight:600;font-size:.82rem;cursor:pointer;transition:all .2s" onmouseover="this.style.background=\'#fef2f2\'" onmouseout="this.style.background=\'#fff\'">✕ Reject</button>';
    html += '</div></div>';
  });

  container.innerHTML = html;
}

function approveUserFromOverview(id) {
  if (typeof UserDB === 'undefined') return;
  UserDB.approve(id);
  showToastMsg('User approved successfully.', 'success');
  renderPendingUsers();
}

function rejectUserFromOverview(id) {
  if (typeof UserDB === 'undefined') return;
  if (!confirm('Reject this user registration?')) return;
  UserDB.reject(id);
  showToastMsg('User registration rejected.', 'error');
  renderPendingUsers();
}

// ── Admin Dashboard Charts ────────────────────────────────────

function drawLineChart() {
  var canvas = document.getElementById('lineChart');
  if (!canvas) return;
  var parent = canvas.parentElement;
  canvas.width = parent.offsetWidth || 600;
  canvas.height = 250;
  var ctx = canvas.getContext('2d');
  var w = canvas.width; var h = canvas.height;
  var pad = { top: 20, right: 20, bottom: 30, left: 40 };
  var labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  var data = [120, 150, 180, 220, 280, 310]; // example growth data
  var maxVal = 350;
  var cW = w - pad.left - pad.right;
  var cH = h - pad.top - pad.bottom;

  // Grid
  ctx.strokeStyle = '#f0f4f8'; ctx.lineWidth = 1;
  for (var i = 0; i <= 4; i++) {
    var gy = pad.top + (cH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(w - pad.right, gy); ctx.stroke();
    ctx.fillStyle = '#9ca3af'; ctx.font = '11px Segoe UI'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), pad.left - 8, gy + 4);
  }
  // X labels
  ctx.textAlign = 'center';
  labels.forEach(function(l, i) {
    var lx = pad.left + (cW / (labels.length - 1)) * i;
    ctx.fillStyle = '#9ca3af'; ctx.font = '11px Segoe UI';
    ctx.fillText(l, lx, h - 10);
  });
  // Gradient fill
  var grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
  grad.addColorStop(0, 'rgba(99,102,241,.25)'); grad.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.beginPath();
  data.forEach(function(v, i) {
    var px = pad.left + (cW / (data.length - 1)) * i;
    var py = pad.top + cH - (v / maxVal) * cH;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.lineTo(pad.left + cW, pad.top + cH); ctx.lineTo(pad.left, pad.top + cH); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  // Line
  ctx.beginPath(); ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2.5;
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
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
  });
}

function drawDonutChart() {
  var canvas = document.getElementById('donutChart');
  if (!canvas) return;
  var progs = (typeof OrgDB !== 'undefined') ? OrgDB.getAll() : [];
  var health = progs.filter(function(p){ return p.focus === 'Healthcare'; }).length || 40;
  var edu = progs.filter(function(p){ return p.focus === 'Education'; }).length || 35;
  var env = progs.filter(function(p){ return p.focus === 'Environment'; }).length || 20;
  var other = progs.filter(function(p){ return !['Healthcare','Education','Environment'].includes(p.focus); }).length || 15;
  
  var total = health + edu + env + other;

  canvas.width = 180; canvas.height = 180;
  var ctx = canvas.getContext('2d');
  var cx = 90; var cy = 90; var r = 70; var ir = 40;
  
  var segments = [
    { val: health, color: '#ef4444', label: 'Healthcare' },
    { val: edu,    color: '#3b82f6', label: 'Education' },
    { val: env,    color: '#10b981', label: 'Environment' },
    { val: other,  color: '#f59e0b', label: 'Other/Relief' }
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
  
  // Center label
  ctx.fillStyle = '#1e293b'; ctx.font = 'bold 22px Segoe UI'; ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 6);
  ctx.fillStyle = '#9ca3af'; ctx.font = '12px Segoe UI';
  ctx.fillText('Orgs', cx, cy + 22);

  // Legend
  var legend = document.getElementById('donutLegend');
  if (legend) {
    legend.innerHTML = segments.map(function(s) {
      return '<div style="display:flex;align-items:center;gap:6px;font-size:.82rem;color:#374151;margin-bottom:6px;"><span style="width:12px;height:12px;border-radius:3px;background:'+s.color+';flex-shrink:0"></span>'+s.label+' ('+s.val+')</div>';
    }).join('');
  }
}

function drawBarChart() {
  var container = document.getElementById('barChart');
  if (!container) return;
  // Simple HTML bars
  var data = [
    { label: 'Jan', val: 75, color: '#e0e7ff', fill: '#6366f1' },
    { label: 'Feb', val: 85, color: '#e0e7ff', fill: '#6366f1' },
    { label: 'Mar', val: 100, color: '#e0e7ff', fill: '#6366f1' }
  ];
  var max = 100;
  container.style.display = 'flex';
  container.style.alignItems = 'flex-end';
  container.style.justifyContent = 'space-around';
  container.style.height = '180px';
  container.style.paddingTop = '20px';
  
  var html = '';
  data.forEach(function(d) {
    var h = (d.val / max) * 140;
    html += '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">';
    html += '<div style="width:36px;height:140px;background:'+d.color+';border-radius:6px;position:relative;overflow:hidden;cursor:pointer" title="'+d.val+'k hours">';
    html += '<div style="position:absolute;bottom:0;left:0;right:0;height:'+h+'px;background:'+d.fill+';border-radius:6px;transition:height 1s ease-out"></div>';
    html += '</div>';
    html += '<div style="font-size:.75rem;font-weight:600;color:#64748b">'+d.label+'</div>';
    html += '</div>';
  });
  container.innerHTML = html;
  
  // trigger animation
  setTimeout(function() {
    var fills = container.querySelectorAll('div > div > div');
    fills.forEach(function(f) {
      var h = f.style.height;
      f.style.height = '0px';
      requestAnimationFrame(function() {
        f.style.height = h;
      });
    });
  }, 100);
}

function renderAnalytics() {
  // hook for analytics.html if needed
}


