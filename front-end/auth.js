/* ============================================================
   KINDRED — AUTH & ROLE-BASED ACCESS CONTROL
   auth.js — include on every page
   ============================================================ */

// ── Mock Users Database ──────────────────────────────────────
var MOCK_USERS = [
  {
    id: 'su_001',
    name: 'Kavita Sharma',
    email: 'super@kindred.org',
    password: 'Super@123',
    role: 'superuser',
    status: 'approved',
    initials: 'KS',
    avatar: '#6366f1',
    dashboard: 'overview.html'
  },
  {
    id: 'adm_001',
    name: 'Rajesh Verma',
    email: 'admin@hopeconnect.org',
    password: 'Admin@123',
    role: 'admin',
    org: 'HopeConnect',
    status: 'approved',
    initials: 'RV',
    avatar: '#0f1a2e',
    dashboard: 'org-admin-overview.html'
  },
  {
    id: 'vol_001',
    name: 'Priya Singh',
    email: 'volunteer@kindred.org',
    password: 'Vol@123',
    role: 'volunteer',
    status: 'approved',
    initials: 'PS',
    avatar: '#10b981',
    dashboard: 'volunteer-dashboard.html'
  },
  {
    id: 'don_001',
    name: 'Arun Patel',
    email: 'donor@kindred.org',
    password: 'Donor@123',
    role: 'donor',
    status: 'approved',
    initials: 'AP',
    avatar: '#f59e0b',
    dashboard: 'donor-dashboard.html'
  },
  {
    id: 'ben_001',
    name: 'Meena Devi',
    email: 'beneficiary@kindred.org',
    password: 'Ben@123',
    role: 'beneficiary',
    status: 'approved',
    initials: 'MD',
    avatar: '#8b5cf6',
    dashboard: 'beneficiary-dashboard.html'
  }
];

// ── Role Permissions ────────────────────────────────────────
var ROLE_PERMISSIONS = {
  superuser: {
    label: 'Platform Administrator',
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
    modules: ['organizations', 'volunteers', 'programs', 'requests', 'analytics', 'users', 'settings']
  },
  admin: {
    label: 'Organization Admin',
    canCreate: true,
    canEdit: true,
    canDelete: true,    // Admins now have full CRUD on their own resources
    canView: true,
    modules: ['volunteers', 'programs', 'resources', 'requests', 'incoming']
  },
  volunteer: {
    label: 'Volunteer',
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canView: true,
    modules: ['assignments', 'profile']
  },
  donor: {
    label: 'Donor',
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canView: true,
    modules: ['campaigns', 'payments', 'profile']
  },
  beneficiary: {
    label: 'Beneficiary',
    canCreate: true,   // Can create/submit requests
    canEdit: false,
    canDelete: false,
    canView: true,
    modules: ['requests', 'profile']
  }
};

// ── Roles that bypass approval (immediate access) ────────────
var IMMEDIATE_ACCESS_ROLES = ['donor', 'beneficiary', 'superuser'];

// ── Session Helpers ─────────────────────────────────────────
var AUTH_KEY = 'kindred_session';

function getSession() {
  try {
    var raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setSession(user) {
  var session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || 'approved',
    org: user.org || null,
    initials: user.initials,
    avatar: user.avatar,
    dashboard: user.dashboard,
    loginTime: Date.now()
  };
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
}

function clearSession() {
  sessionStorage.removeItem(AUTH_KEY);
}

function isLoggedIn() {
  return getSession() !== null;
}

function hasPermission(action) {
  var session = getSession();
  if (!session) return false;
  var perms = ROLE_PERMISSIONS[session.role];
  if (!perms) return false;
  switch (action) {
    case 'create': return perms.canCreate;
    case 'edit':   return perms.canEdit;
    case 'delete': return perms.canDelete;
    case 'view':   return perms.canView;
    default: return false;
  }
}

// ── Auth Guard ──────────────────────────────────────────────
// Call requireAuth(allowedRoles) at top of protected pages
function requireAuth(allowedRoles) {
  var session = getSession();
  if (!session) {
    window.location.href = 'signin.html';
    return null;
  }
  // Check approval status — block pending/rejected users from protected pages
  if (session.status === 'pending') {
    window.location.href = 'registration-pending.html';
    return null;
  }
  if (session.status === 'rejected') {
    clearSession();
    window.location.href = 'signin.html';
    return null;
  }
  if (allowedRoles && allowedRoles.length > 0) {
    if (allowedRoles.indexOf(session.role) === -1) {
      // Redirect to their proper dashboard
      window.location.href = session.dashboard;
      return null;
    }
  }
  return session;
}

// ── Render Role-Based UI ─────────────────────────────────────
// After DOMContentLoaded, call this to show/hide role-gated elements
// Usage: <button class="role-gate" data-roles="superuser,admin">Delete</button>
function applyRoleGating() {
  var session = getSession();
  var userRole = session ? session.role : 'guest';

  document.querySelectorAll('[data-roles]').forEach(function (el) {
    var allowed = el.getAttribute('data-roles').split(',').map(function (r) { return r.trim(); });
    if (allowed.indexOf(userRole) === -1) {
      el.style.display = 'none';
    }
  });

  // Update navbar user info dynamically if elements exist
  if (session) {
    var nameEl = document.getElementById('navUserName');
    var roleEl = document.getElementById('navUserRole');
    var initialsEl = document.getElementById('navUserInitials');
    if (nameEl) nameEl.textContent = session.name;
    if (roleEl) roleEl.textContent = ROLE_PERMISSIONS[session.role] ? ROLE_PERMISSIONS[session.role].label : session.role;
    if (initialsEl) {
      initialsEl.textContent = session.initials;
      initialsEl.style.background = session.avatar;
    }
  }
}

// ── Sign In Logic ────────────────────────────────────────────
function signIn(roleSlug, email, password) {
  // First check MOCK_USERS
  var found = null;
  for (var i = 0; i < MOCK_USERS.length; i++) {
    var u = MOCK_USERS[i];
    if (u.email === email && u.password === password && u.role === roleSlug) {
      found = u;
      break;
    }
  }

  // Also check pending/registered users (from UserDB if available)
  if (!found && typeof UserDB !== 'undefined') {
    var allRegistered = UserDB.getAll();
    for (var j = 0; j < allRegistered.length; j++) {
      var ru = allRegistered[j];
      if (ru.email === email && ru.password === password && ru.role === roleSlug) {
        found = ru;
        break;
      }
    }
  }

  if (found) {
    // Check approval status
    if (found.status === 'pending') {
      return { success: false, error: 'pending', message: 'Your account is under review by the Platform Administrator. You will be notified once approved.' };
    }
    if (found.status === 'rejected') {
      return { success: false, error: 'rejected', message: 'Your registration was not approved. Please contact support at hello@kindred.org.in for assistance.' };
    }
    var session = setSession(found);
    return { success: true, session: session };
  }
  return { success: false, error: 'invalid', message: 'Invalid email, password, or role. Please try again.' };
}

// ── Sign Out ────────────────────────────────────────────────
function signOut() {
  clearSession();
  window.location.href = 'signin.html';
}

// ── Demo Credentials Helper ─────────────────────────────────
function getDemoCredentials(role) {
  for (var i = 0; i < MOCK_USERS.length; i++) {
    if (MOCK_USERS[i].role === role) {
      return { email: MOCK_USERS[i].email, password: MOCK_USERS[i].password };
    }
  }
  return null;
}

// ── Get Status Label ─────────────────────────────────────────
function getStatusLabel(status) {
  var labels = {
    pending: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected'
  };
  return labels[status] || status;
}
