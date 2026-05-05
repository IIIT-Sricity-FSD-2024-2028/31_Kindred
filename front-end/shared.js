/* ===== KINDRED — SHARED JS ===== */

// ── Navbar dropdown ─────────────────────────────────────────
function initDropdown() {
  const trigger = document.querySelector('[data-dropdown-trigger]');
  const menu = document.querySelector('[data-dropdown-menu]');
  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('visible');
    trigger.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', () => {
    menu.classList.remove('visible');
    if(trigger) trigger.setAttribute('aria-expanded', false);
  });
}

// ── Custom Confirmation Modal ───────────────────────────────
let confirmCallback = null;
function customConfirm(msg, onConfirm) {
  confirmCallback = onConfirm;
  let modal = document.getElementById('confirmModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-box" style="width:400px; transform: scale(0.9); transition: transform 0.2s ease;">
        <div class="modal-header"><h3>Confirmation</h3><button class="modal-close-btn" onclick="closeModal('confirmModal')">×</button></div>
        <div class="modal-body"><p id="confirmMsg" style="font-size:1.05rem"></p></div>
        <div class="modal-actions">
          <button class="btn-cancel" onclick="closeModal('confirmModal')">Cancel</button>
          <button class="btn-confirm" id="confirmBtnAction" style="background:#ef4444; color:white; border:none; padding:8px 20px; border-radius:6px; font-weight:600; cursor:pointer">Confirm</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById('confirmBtnAction').addEventListener('click', () => {
      if(confirmCallback) confirmCallback();
      closeModal('confirmModal');
    });
  }
  document.getElementById('confirmMsg').textContent = msg;
  openModal('confirmModal');
  setTimeout(() => { modal.querySelector('.modal-box').style.transform = 'scale(1)'; }, 10);
}

// ── Tab switching ────────────────────────────────────────────
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('[data-tab-content]').forEach(c => {
        c.style.display = c.dataset.tabContent === target ? '' : 'none';
      });
    });
  });
}

// ── Toast notifications ──────────────────────────────────────
function showToast({ type = 'info', title, body, duration = 4000 }) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === 'success'
        ? `<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#dcfce7"/><path stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 12l3 3 5-5"/></svg>`
        : `<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#dbeafe"/><path stroke="#2563eb" stroke-width="2" d="M12 8v4m0 4h.01"/></svg>`
      }
    </div>
    <div>
      <div class="toast-title">${title}</div>
      <div class="toast-body">${body}</div>
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ── Modal helpers ────────────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
}

// ── Generic read-only info modal ─────────────────────────────
function showInfoModal(title, bodyHtml) {
  var modal = document.getElementById('kindredInfoModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'kindredInfoModal';
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;backdrop-filter:blur(3px);';
    modal.innerHTML =
      '<div style="background:#fff;border-radius:20px;box-shadow:0 24px 64px rgba(0,0,0,.18);width:100%;max-width:520px;overflow:hidden;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px 16px;border-bottom:1px solid #f1f5f9;">' +
          '<h3 id="kindredInfoModalTitle" style="margin:0;font-size:1rem;font-weight:700;color:#1e293b;"></h3>' +
          '<button id="kindredInfoModalClose" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:#9ca3af;line-height:1;padding:0 4px;">×</button>' +
        '</div>' +
        '<div id="kindredInfoModalBody" style="padding:20px 24px 24px;max-height:65vh;overflow-y:auto;"></div>' +
      '</div>';
    document.body.appendChild(modal);
    document.getElementById('kindredInfoModalClose').addEventListener('click', function() {
      modal.style.display = 'none'; document.body.style.overflow = '';
    });
    modal.addEventListener('click', function(e) {
      if (e.target === modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
    });
  }
  document.getElementById('kindredInfoModalTitle').textContent = title;
  document.getElementById('kindredInfoModalBody').innerHTML = bodyHtml;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}


function initModalClose() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
}

// ── Urgency selector ─────────────────────────────────────────
function initUrgencyBtns() {
  document.querySelectorAll('.urgency-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.urgency-group').querySelectorAll('.urgency-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

// ── Radio labels ─────────────────────────────────────────────
function initRadioLabels() {
  document.querySelectorAll('.radio-label input[type="radio"]').forEach(input => {
    input.addEventListener('change', () => {
      input.closest('.radio-group').querySelectorAll('.radio-label').forEach(l => l.classList.remove('selected'));
      if (input.checked) input.closest('.radio-label').classList.add('selected');
    });
  });
}

// ── New Request button ───────────────────────────────────────
function initNewRequest() {
  const btn = document.querySelector('.btn-new-request');
  if (btn) btn.addEventListener('click', () => openModal('request-modal'));
}

// ── Request form submission ──────────────────────────────────
function initRequestForm() {
  const form = document.getElementById('request-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    
    // Validate Phone Number
    var phone = data.get('phone');
    if (phone) {
      var pDigits = phone.replace(/\D/g, '');
      if (pDigits.length === 12 && pDigits.indexOf('91') === 0) pDigits = pDigits.slice(2);
      if (pDigits.length === 11 && pDigits.charAt(0) === '0') pDigits = pDigits.slice(1);
      
      var dummy = ['1234567890','0123456789','9876543210','1111111111','1234512345'];
      if (pDigits.length !== 10 || !/^[6-9]\d{9}$/.test(pDigits) || dummy.indexOf(pDigits) !== -1 || /^(\d)\1{9}$/.test(pDigits) || /^(\d{2})\1{4}$/.test(pDigits)) {
        alert('Please enter a valid 10-digit phone number (no dummy, sequential, or repeating sequences).');
        const phoneInput = form.querySelector('input[name="phone"]');
        if (phoneInput) phoneInput.focus();
        return;
      }
    }

    // Save to My Requests (localStorage for beneficiary dashboard)
    var newReqId = 'REQ-' + Math.floor(Math.random() * 10000);
    var newReqParams = {
      id: newReqId,
      title: (data.get('type') || 'General') + ' Assistance',
      desc: data.get('description') || 'No description provided.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Submitted',
      org: 'Pending Assignment',
      urgency: document.querySelector('.urgency-btn.selected')?.textContent || 'Medium',
      location: data.get('location') || ''
    };
    
    try {
      let myReqs = JSON.parse(localStorage.getItem('kindred_my_requests') || '[]');
      myReqs.push(newReqParams);
      localStorage.setItem('kindred_my_requests', JSON.stringify(myReqs));
    } catch(err) {}

    // POST to backend API (incoming request)
    var incomingData = {
      name: data.get('fullName') || 'Anonymous',
      type: newReqParams.title,
      desc: newReqParams.desc,
      urgency: newReqParams.urgency.toLowerCase(),
      location: newReqParams.location
    };

    if (typeof apiPost === 'function') {
      apiPost('/incoming', incomingData).then(function() {
        console.log('[API] Incoming request synced to backend');
      }).catch(function() {});
    }

    // Also save to local IncomingDB (fallback)
    if (typeof IncomingDB !== 'undefined' && typeof IncomingDB.create === 'function') {
      IncomingDB.create(incomingData);
    }

    closeModal('request-modal');
    setTimeout(() => {
      showToast({ type: 'success', title: 'Request Submitted', body: 'Your assistance request has been submitted successfully.' });
      setTimeout(()=> window.location.reload(), 1500);
    }, 200);
    form.reset();
    document.querySelectorAll('.urgency-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.radio-label').forEach(l => l.classList.remove('selected'));
  });

  const broadcastBtn = document.getElementById('broadcast-btn');
  if (broadcastBtn) {
    broadcastBtn.addEventListener('click', () => {
      closeModal('request-modal');
      openModal('broadcast-modal');
    });
  }
}

// ── Auto-dismiss inline notifications ───────────────────────
function initInlineNotifications() {
  document.querySelectorAll('.inline-notification[data-autodismiss]').forEach(n => {
    const ms = parseInt(n.dataset.autodismiss) || 5000;
    setTimeout(() => {
      n.style.transition = 'opacity 0.4s';
      n.style.opacity = '0';
      setTimeout(() => n.remove(), 400);
    }, ms);
  });
}

// ── Beneficiary Request Actions ──────────────────────────────
function viewBeneficiaryReq(id) {
  const details = {
    'REQ-2028-001': { title: 'Food Assistance', org: 'St Andrews', date: 'Oct 5, 2028', status: 'Emergency', desc: 'Family of 4 requiring basic ration kits and clean water due to proximity to the flood zone.' },
    'REQ-2028-002': { title: 'Housing Referral', org: 'Care India', date: 'Oct 3, 2028', status: 'Submitted', desc: 'Seeking temporary shelter or referral to a low-income housing program in the north district.' },
    'REQ-2028-003': { title: 'Medical Support', org: 'MedReach', date: 'Oct 1, 2028', status: 'In Progress', desc: 'Requires specialized medical checkup for elderly parent. 1 offer received from a volunteer doctor.' }
  };
  const data = details[id] || { title: 'Assistance Request', org: 'TBD', date: 'TBD', status: 'TBD', desc: 'No details available.' };
  
  // Create Modal dynamically if doesn't exist
  let modal = document.getElementById('viewRequestModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'viewRequestModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-box" style="width:480px">
        <div class="modal-header"><h3 id="m-title">Request Details</h3><button class="modal-close-btn" onclick="closeModal('viewRequestModal')">×</button></div>
        <div class="modal-body">
          <p><strong>Status:</strong> <span id="m-status"></span></p>
          <p><strong>Organization:</strong> <span id="m-org"></span></p>
          <p><strong>Date:</strong> <span id="m-date"></span></p>
          <hr style="margin:12px 0; border:none; border-top:1px solid #f3f4f6"/>
          <p id="m-desc"></p>
        </div>
        <div class="modal-actions"><button class="btn-modal-save" onclick="closeModal('viewRequestModal')">Close</button></div>
      </div>`;
    document.body.appendChild(modal);
    initModalClose(); // Re-init listeners for the new modal if needed
  }
  
  document.getElementById('m-title').textContent = data.title;
  document.getElementById('m-status').textContent = data.status;
  document.getElementById('m-org').textContent = data.org;
  document.getElementById('m-date').textContent = data.date;
  document.getElementById('m-desc').textContent = data.desc;
  
  openModal('viewRequestModal');
}

function rejectReq(id) {
  if (typeof customConfirm === 'function') {
    customConfirm('Reject request ' + id + '?', function() {
      ReqDB.reject(id);
      showToastMsg('Request ' + id + ' rejected.', 'error');
      renderRequestsList();
    });
  } else {
    if (!confirm('Reject request ' + id + '?')) return;
    ReqDB.reject(id);
    showToastMsg('Request ' + id + ' rejected.', 'error');
    renderRequestsList();
  }
}

function cancelBeneficiaryReq(btn, id) {
  customConfirm('Are you sure you want to cancel request ' + id + '?', function() {
    const card = btn.closest('.request-card');
    if (card) {
      const badge = card.querySelector('.badge');
      if (badge) {
        badge.textContent = 'Cancelled';
        badge.className = 'badge';
        badge.style.background = '#f3f4f6';
        badge.style.color = '#9ca3af';
      }
      btn.remove(); 
      card.style.opacity = '0.7';
      showToast({ type: 'info', title: 'Request Cancelled', body: 'Request ' + id + ' has been effectively cancelled.' });
    }
  });
}

// ── Initialise everything on DOMContentLoaded ────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDropdown();
  initTabs();
  initModalClose();
  initUrgencyBtns();
  initRadioLabels();
  initNewRequest();
  initRequestForm();
  initInlineNotifications();
});
