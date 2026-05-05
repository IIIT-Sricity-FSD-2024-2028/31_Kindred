/* ============================================================
   KINDRED — END USER PAGE INIT
   Guards pages, renders role-based UI for volunteer/donor/beneficiary
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  var session = requireAuth(['volunteer', 'donor', 'beneficiary']);
  if (!session) return;

  applyRoleGating();

  // Update navbar user info
  var nameEl     = document.querySelector('.user-name, #navUserName, .nav-user-name');
  var roleEl     = document.querySelector('.user-role, #navUserRole, .nav-user-role');
  var initialsEl = document.querySelector('.user-avatar, #navUserInitials, .user-initials');
  if (nameEl)     nameEl.textContent     = session.name;
  if (roleEl)     roleEl.textContent     = ROLE_PERMISSIONS[session.role] ? ROLE_PERMISSIONS[session.role].label : session.role;
  if (initialsEl) {
    initialsEl.textContent   = session.initials;
    initialsEl.style.background = session.avatar;
  }

  // Role-specific greeting
  var greetEl = document.getElementById('dashGreeting');
  if (greetEl) {
    greetEl.textContent = 'Welcome back, ' + session.name.split(' ')[0] + '!';
  }

  // Wire sign-out
  document.querySelectorAll('[data-signout], .btn-signout').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); signOut(); });
  });

  // Show role-specific dashboard sections
  renderRoleDashboard(session);
});

function renderRoleDashboard(session) {
  var roleTag = document.getElementById('userRoleTag');
  if (roleTag) {
    var colors = { volunteer: '#10b981', donor: '#f59e0b', beneficiary: '#8b5cf6' };
    roleTag.textContent  = ROLE_PERMISSIONS[session.role].label;
    roleTag.style.background = (colors[session.role] || '#6366f1') + '20';
    roleTag.style.color      = colors[session.role] || '#6366f1';
    roleTag.style.border     = '1px solid ' + (colors[session.role] || '#6366f1') + '40';
  }

  // Beneficiary-only: show emergency request button
  if (session.role === 'beneficiary') {
    document.querySelectorAll('[data-role-only="beneficiary"]').forEach(function (el) {
      el.style.display = '';
    });
  }
  // Volunteer-only: show assignments
  if (session.role === 'volunteer') {
    document.querySelectorAll('[data-role-only="volunteer"]').forEach(function (el) {
      el.style.display = '';
    });
  }
  // Donor-only: show donation history
  if (session.role === 'donor') {
    document.querySelectorAll('[data-role-only="donor"]').forEach(function (el) {
      el.style.display = '';
    });
  }
}
