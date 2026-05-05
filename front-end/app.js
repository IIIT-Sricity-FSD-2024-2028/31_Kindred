/* ============================================
   KINDRED — SHARED JavaScript
   ============================================ */

// ---- Navbar User Dropdown ----
function initUserDropdown() {
  const btn = document.getElementById('userBtn');
  const menu = document.getElementById('userDropdown');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', () => menu.classList.remove('open'));
}

// ---- Get Involved Dropdown ----
function initGetInvolvedDropdown() {
  const btn = document.getElementById('getInvolvedBtn');
  const menu = document.getElementById('getInvolvedMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', () => menu.classList.remove('open'));
}

// ---- Tab Navigation ----
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const page = PAGES[target];
      if (page) window.location.href = page;
    });
  });
}

// ---- Accept & Respond buttons ----
function initRequestButtons() {
  document.querySelectorAll('.accept-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.request-item');
      const id = item?.dataset.id;

      // Replace button with "Accepted" badge
      const actionsDiv = this.parentElement;
      actionsDiv.innerHTML = `<span class="accepted-badge">✓ Accepted - In Progress</span>`;

      // Update left border
      if (item) item.style.borderLeftColor = 'var(--accent)';

      // Decrement incoming badge
      const badge = document.querySelector('.tab-badge');
      if (badge) {
        let count = parseInt(badge.textContent);
        if (!isNaN(count) && count > 0) {
          count--;
          badge.textContent = count;
          const tabBtn = badge.closest('.tab-btn');
          if (tabBtn) {
            const label = tabBtn.childNodes[0].textContent.replace(/\s*\d+.*/, '').trim();
            tabBtn.childNodes[0].textContent = label + ' ';
            if (count === 0) badge.remove();
          }
        }
      }

      showToast(`Request accepted and marked as in progress.`);
    });
  });
}

// ---- Toast notification ----
function showToast(msg, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      display: flex; flex-direction: column; gap: 8px;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${type === 'success' ? '#0f1923' : '#ef4444'};
    color: white;
    padding: 12px 18px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    display: flex; align-items: center; gap: 9px;
    animation: slideUp 0.25s ease;
    max-width: 320px;
    border-left: 3px solid ${type === 'success' ? '#00c896' : '#fca5a5'};
  `;

  toast.innerHTML = `<span>${type === 'success' ? '✓' : '!'}</span><span>${msg}</span>`;
  container.appendChild(toast);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ---- Search filter for volunteers table ----
function initVolunteerSearch() {
  const input = document.getElementById('volunteerSearch');
  if (!input) return;

  input.addEventListener('input', function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.volunteer-row').forEach(row => {
      const name = row.querySelector('.vol-name')?.textContent.toLowerCase() || '';
      const role = row.querySelector('.vol-role')?.textContent.toLowerCase() || '';
      row.style.display = (name.includes(q) || role.includes(q)) ? '' : 'none';
    });
  });
}

// ---- Progress bar animation ----
function animateProgressBars() {
  document.querySelectorAll('.progress-fill, .resource-fill').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      setTimeout(() => { bar.style.width = target; }, 80);
    });
  });
}

// ---- Page routing map (update paths as needed) ----
const PAGES = {
  overview: 'overview.html',
  volunteers: 'volunteers.html',
  programs: 'programs.html',
  resources: 'resources.html',
  requests: 'requests.html',
  incoming: 'incoming.html',
  'create-program': 'create-program.html',
  'program-success': 'program-success.html',
};

// ---- View Details modal ----
function initViewDetails() {
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.request-item');
      const id = item?.querySelector('.request-id')?.textContent || 'Request';
      const desc = item?.querySelector('.request-desc')?.textContent || '';
      showToast(`Viewing: ${id}`);
    });
  });
}

// ---- DOMContentLoaded ----
document.addEventListener('DOMContentLoaded', () => {
  initUserDropdown();
  initGetInvolvedDropdown();
  initTabs();
  initRequestButtons();
  initVolunteerSearch();
  animateProgressBars();
  initViewDetails();
});
