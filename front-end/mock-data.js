/* ============================================================
   KINDRED — MOCK DATA STORE
   mock-data.js — simulates backend with in-memory CRUD
   ============================================================ */

// ── Utility ─────────────────────────────────────────────────
function generateId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// ── Organizations ────────────────────────────────────────────
var DB_ORGANIZATIONS = (function() {
  var orig = [
    { id: 'org_001', name: 'HopeConnect', joined: 'Jan 2024', focus: 'Disaster Relief', status: 'active', volunteers: 1240, beneficiaries: 15400, rating: 4.8, color: '#6366f1', email: 'contact@hopeconnect.org', phone: '+91 98765 43210', city: 'Mumbai' },
    { id: 'org_002', name: 'MyTrust Foundation', joined: 'Feb 2024', focus: 'Community Development', status: 'active', volunteers: 1850, beneficiaries: 12800, rating: 4.7, color: '#ec4899', email: 'info@mytrust.org', phone: '+91 98765 43211', city: 'Delhi' },
    { id: 'org_003', name: 'GreenEarth Initiative', joined: 'Mar 2024', focus: 'Environment', status: 'active', volunteers: 990, beneficiaries: 8200, rating: 4.6, color: '#22c55e', email: 'hello@greenearth.org', phone: '+91 98765 43212', city: 'Bengaluru' },
    { id: 'org_004', name: 'EduBridge', joined: 'Feb 2024', focus: 'Education', status: 'active', volunteers: 2130, beneficiaries: 32000, rating: 4.9, color: '#f59e0b', email: 'info@edubridge.org', phone: '+91 98765 43213', city: 'Chennai' },
    { id: 'org_005', name: 'MedReach', joined: 'Nov 2024', focus: 'Healthcare', status: 'active', volunteers: 760, beneficiaries: 6800, rating: 4.5, color: '#ef4444', email: 'support@medreach.org', phone: '+91 98765 43214', city: 'Hyderabad' },
    { id: 'org_006', name: 'FoodFirst Alliance', joined: 'Apr 2024', focus: 'Food Security', status: 'active', volunteers: 1580, beneficiaries: 22000, rating: 4.7, color: '#14b8a6', email: 'help@foodfirst.org', phone: '+91 98765 43215', city: 'Kolkata' },
    { id: 'org_007', name: 'ShelterHope', joined: 'Jul 2024', focus: 'Housing', status: 'pending', volunteers: 430, beneficiaries: 3200, rating: 3.9, color: '#8b5cf6', email: 'info@shelterhope.org', phone: '+91 98765 43216', city: 'Pune' },
    { id: 'org_008', name: 'CareBridge', joined: 'Aug 2024', focus: 'Elder Care', status: 'active', volunteers: 520, beneficiaries: 4100, rating: 4.3, color: '#06b6d4', email: 'care@carebridge.org', phone: '+91 98765 43217', city: 'Ahmedabad' },
    { id: 'org_009', name: 'GlobalAid Network', joined: 'Jan 2024', focus: 'International Aid', status: 'active', volunteers: 3200, beneficiaries: 45000, rating: 4.8, color: '#84cc16', email: 'global@globalaid.org', phone: '+91 98765 43218', city: 'New Delhi' },
    { id: 'org_010', name: 'PathFinders', joined: 'Sep 2024', focus: 'Youth Empowerment', status: 'active', volunteers: 980, beneficiaries: 7600, rating: 4.4, color: '#f97316', email: 'reach@pathfinders.org', phone: '+91 98765 43219', city: 'Jaipur' },
    { id: 'org_011', name: 'EcoTrust Foundation', joined: 'Oct 2024', focus: 'Sustainability', status: 'suspended', volunteers: 870, beneficiaries: 5200, rating: 4.2, color: '#10b981', email: 'eco@ecotrust.org', phone: '+91 98765 43220', city: 'Chandigarh' },
    { id: 'org_012', name: 'BrightFutures', joined: 'Jan 2024', focus: 'Child Welfare', status: 'active', volunteers: 1120, beneficiaries: 9800, rating: 4.6, color: '#a855f7', email: 'bright@brightfutures.org', phone: '+91 98765 43221', city: 'Lucknow' }
  ];
  try {
    var stored = localStorage.getItem('kindred_organizations');
    if (stored) { var parsed = JSON.parse(stored); if (Array.isArray(parsed) && parsed.length > 0) return parsed; }
  } catch(e) {}
  return orig;
})();

function _persistOrgs() { try { localStorage.setItem('kindred_organizations', JSON.stringify(DB_ORGANIZATIONS)); } catch(e){} }

// ── Volunteers (for Org Admin) ────────────────────────────────
// ── Predefined Skill Categories ─────────────────────────────
var SKILL_OPTIONS = ['Medical Aid','Teaching','Field Work','Logistics','Community Outreach','Technology','Environment','Cooking','Counseling','Construction','Administration','Translation'];

var DB_VOLUNTEERS = [
  { id: 'vol_001', name: 'Priya Singh', email: 'volunteer@kindred.org', phone: '+91 99887 76655', role: 'Field Coordinator', org: 'HopeConnect', status: 'active', joined: '2024-01-15', hours: 320, rating: 4.9, skills: ['Field Work','Community Outreach','Logistics'] },
  { id: 'vol_002', name: 'Amit Sharma', email: 'amit.sharma@email.com', phone: '+91 99887 76656', role: 'Medical Volunteer', org: 'HopeConnect', status: 'active', joined: '2024-02-10', hours: 210, rating: 4.7, skills: ['Medical Aid','Counseling','Field Work'] },
  { id: 'vol_003', name: 'Sunita Rao', email: 'sunita.rao@email.com', phone: '+91 99887 76657', role: 'Education Specialist', org: 'HopeConnect', status: 'active', joined: '2024-01-20', hours: 180, rating: 4.8, skills: ['Teaching','Administration','Community Outreach'] },
  { id: 'vol_004', name: 'Kiran Patel', email: 'kiran.patel@email.com', phone: '+91 99887 76658', role: 'Logistics Officer', org: 'HopeConnect', status: 'inactive', joined: '2024-03-05', hours: 90, rating: 4.2, skills: ['Logistics','Construction','Technology'] },
  { id: 'vol_005', name: 'Deepak Kumar', email: 'deepak.kumar@email.com', phone: '+91 99887 76659', role: 'Community Outreach', org: 'HopeConnect', status: 'active', joined: '2024-01-08', hours: 450, rating: 4.9, skills: ['Community Outreach','Cooking','Field Work','Environment'] },
  { id: 'vol_006', name: 'Anjali Mehta', email: 'anjali.mehta@email.com', phone: '+91 99887 76660', role: 'Field Coordinator', org: 'HopeConnect', status: 'active', joined: '2024-04-01', hours: 130, rating: 4.5, skills: ['Field Work','Translation','Teaching'] }
];

// ── Programs (for Org Admin) ────────────────────────────────
var DB_PROGRAMS = (function(){
  var orig = [
    { id: 'prog_001', name: 'Cyclone Relief Fund', org: 'HopeConnect', focus: 'Disaster Relief', status: 'active', startDate: '2024-01-10', endDate: '2024-06-30', budget: 1200000, raised: 850000, beneficiaries: 1500, volunteers: 120, description: 'Emergency shelter, food and medical aid for cyclone victims in coastal Odisha.', requiredSkills: ['Field Work','Medical Aid','Logistics','Construction'], volunteerGoal: 150, openForApplications: true, location: 'Coastal Odisha' },
    { id: 'prog_002', name: 'Clean Water Initiative', org: 'HopeConnect', focus: 'Healthcare', status: 'active', startDate: '2024-02-01', endDate: '2024-12-31', budget: 800000, raised: 650000, beneficiaries: 3200, volunteers: 80, description: 'Installing water purification units in 50 villages across rural Maharashtra.', requiredSkills: ['Technology','Construction','Community Outreach','Environment'], volunteerGoal: 100, openForApplications: true, location: 'Rural Maharashtra' },
    { id: 'prog_003', name: 'Skill Development Workshop', org: 'HopeConnect', focus: 'Education', status: 'completed', startDate: '2023-09-01', endDate: '2024-01-31', budget: 500000, raised: 500000, beneficiaries: 800, volunteers: 40, description: 'Vocational training for unemployed youth in digital skills and entrepreneurship.', requiredSkills: ['Teaching','Technology','Administration'], volunteerGoal: 50, openForApplications: false, location: 'Delhi NCR' }
  ];
  try {
    var s = localStorage.getItem('kindred_programs');
    if (s) { var p = JSON.parse(s); if (Array.isArray(p) && p.length > 0) return p; }
  } catch(e){}
  return orig;
})();

// ── Requests (Platform-level, for Superuser) ─────────────────
var DB_REQUESTS = (function() {
  try {
    var stored = localStorage.getItem('kindred_platform_requests');
    if (stored) { var parsed = JSON.parse(stored); if (Array.isArray(parsed) && parsed.length > 0) return parsed; }
  } catch(e) {}
  return [
    { id: 'REQ-001', org: 'ShelterHope', type: 'Organization Registration', description: 'New NGO registration request for housing assistance programs.', date: '2024-12-15', status: 'pending', priority: 'high', contact: 'info@shelterhope.org', phone: '9876543210', city: 'Pune' },
    { id: 'REQ-002', org: 'PathFinders', type: 'Budget Increase', description: 'Request to increase approved budget for youth empowerment campaign.', date: '2024-12-18', status: 'pending', priority: 'medium', contact: 'reach@pathfinders.org', phone: '8765432109', city: 'Jaipur' },
    { id: 'REQ-003', org: 'EcoTrust Foundation', type: 'Account Reinstatement', description: 'Request to reinstate suspended account after compliance review.', date: '2024-12-20', status: 'pending', priority: 'high', contact: 'eco@ecotrust.org', phone: '7654321098', city: 'Chandigarh' }
  ];
})();
function _persistRequests() { try { localStorage.setItem('kindred_platform_requests', JSON.stringify(DB_REQUESTS)); } catch(e){} }

var ReqDB = {
  getAll: function() { return DB_REQUESTS.slice(); },
  getById: function(id) { return DB_REQUESTS.find(function(r){ return r.id === id; }) || null; },
  getPending: function() { return DB_REQUESTS.filter(function(r){ return r.status === 'pending'; }); },
  approve: function(id) {
    var idx = DB_REQUESTS.findIndex(function(r){ return r.id === id; });
    if (idx === -1) return false;
    DB_REQUESTS[idx].status = 'approved';
    _persistRequests();
    return true;
  },
  reject: function(id) {
    var idx = DB_REQUESTS.findIndex(function(r){ return r.id === id; });
    if (idx === -1) return false;
    DB_REQUESTS[idx].status = 'rejected';
    _persistRequests();
    return true;
  },
  create: function(data) {
    var newReq = Object.assign({ id: 'REQ-' + String(Date.now()).slice(-4), status: 'pending', date: new Date().toISOString().split('T')[0], priority: 'medium' }, data);
    DB_REQUESTS.push(newReq);
    _persistRequests();
    return newReq;
  }
};

// ── Organizations DB ──────────────────────────────────────────
var OrgDB = {
  getAll: function() { return DB_ORGANIZATIONS.slice(); },
  getById: function(id) { return DB_ORGANIZATIONS.find(function(o){ return o.id === id; }) || null; },
  search: function(q) {
    if (!q) return DB_ORGANIZATIONS.slice();
    var lq = q.toLowerCase();
    return DB_ORGANIZATIONS.filter(function(o){ return o.name.toLowerCase().includes(lq) || o.focus.toLowerCase().includes(lq) || (o.city||'').toLowerCase().includes(lq); });
  },
  create: function(data) {
    var colors = ['#6366f1','#ec4899','#22c55e','#f59e0b','#ef4444','#14b8a6','#8b5cf6','#06b6d4'];
    var newOrg = Object.assign({ id: generateId('org'), joined: new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'}), volunteers: 0, beneficiaries: 0, rating: '—', color: colors[Math.floor(Math.random()*colors.length)], status: 'pending' }, data);
    DB_ORGANIZATIONS.push(newOrg);
    _persistOrgs();
    return newOrg;
  },
  update: function(id, data) {
    var idx = DB_ORGANIZATIONS.findIndex(function(o){ return o.id === id; });
    if (idx === -1) return null;
    DB_ORGANIZATIONS[idx] = Object.assign({}, DB_ORGANIZATIONS[idx], data);
    _persistOrgs();
    return DB_ORGANIZATIONS[idx];
  },
  delete: function(id) {
    var idx = DB_ORGANIZATIONS.findIndex(function(o){ return o.id === id; });
    if (idx === -1) return false;
    DB_ORGANIZATIONS.splice(idx, 1);
    _persistOrgs();
    return true;
  }
};

// ── Volunteers DB (Org Admin) ─────────────────────────────────
var DB_VOLUNTEERS_STORE = (function(){
  try {
    var s = localStorage.getItem('kindred_volunteers');
    if (s) { var p = JSON.parse(s); if (Array.isArray(p) && p.length > 0) return p; }
  } catch(e){}
  return DB_VOLUNTEERS.slice();
})();
function _persistVolunteers() { try { localStorage.setItem('kindred_volunteers', JSON.stringify(DB_VOLUNTEERS_STORE)); } catch(e){} }

var VolDB = {
  getAll: function() { return DB_VOLUNTEERS_STORE.slice(); },
  getById: function(id) { return DB_VOLUNTEERS_STORE.find(function(v){ return v.id === id; }) || null; },
  create: function(data) {
    var newVol = Object.assign({ id: generateId('vol'), joined: new Date().toISOString().split('T')[0], hours: 0, rating: '—', status: 'active' }, data);
    DB_VOLUNTEERS_STORE.push(newVol);
    _persistVolunteers();
    return newVol;
  },
  update: function(id, data) {
    var idx = DB_VOLUNTEERS_STORE.findIndex(function(v){ return v.id === id; });
    if (idx === -1) return null;
    DB_VOLUNTEERS_STORE[idx] = Object.assign({}, DB_VOLUNTEERS_STORE[idx], data);
    _persistVolunteers();
    return DB_VOLUNTEERS_STORE[idx];
  },
  delete: function(id) {
    var idx = DB_VOLUNTEERS_STORE.findIndex(function(v){ return v.id === id; });
    if (idx === -1) return false;
    DB_VOLUNTEERS_STORE.splice(idx, 1);
    _persistVolunteers();
    return true;
  }
};



// ── Incoming Requests (for Org Admin) ────────────────────────
var DB_INCOMING = (function () {
  try {
    var stored = localStorage.getItem('kindred_incoming_requests');
    return stored ? JSON.parse(stored) : [
      { id: 'INC-001', name: 'Ravi Kumar', type: 'Medical Assistance', desc: 'Requires urgent medical supplies for flood-affected village.', urgency: 'high', date: '2024-12-20', status: 'pending', location: 'Patna, Bihar' },
      { id: 'INC-002', name: 'Sita Devi', type: 'Food Aid', desc: 'Family of 6 requires food ration for the next month.', urgency: 'high', date: '2024-12-19', status: 'pending', location: 'Varanasi, UP' },
      { id: 'INC-003', name: 'Local School Board', type: 'Educational Material', desc: 'Requesting notebooks and stationery for 200 students.', urgency: 'medium', date: '2024-12-18', status: 'pending', location: 'Gaya, Bihar' },
      { id: 'INC-004', name: 'Village Panchayat', type: 'Infrastructure', desc: 'Request for temporary shelter materials post-flooding.', urgency: 'medium', date: '2024-12-17', status: 'pending', location: 'Darbhanga, Bihar' }
    ];
  } catch(e) { return []; }
})();
function _persistIncoming() { try { localStorage.setItem('kindred_incoming_requests', JSON.stringify(DB_INCOMING)); } catch(e){} }

var IncomingDB = {
  getAll: function () { return DB_INCOMING.slice(); },
  create: function(data) {
    var newInc = Object.assign({ id: generateId('INC'), status: 'pending', date: new Date().toISOString().split('T')[0] }, data);
    DB_INCOMING.push(newInc);
    _persistIncoming();
    return newInc;
  },
  accept: function (id) {
    var idx = DB_INCOMING.findIndex(function (r) { return r.id === id || r.id === 'BR-'+id; });
    if (idx === -1) return false;
    DB_INCOMING[idx].status = 'accepted';
    _persistIncoming();
    return true;
  },
  decline: function (id) {
    var idx = DB_INCOMING.findIndex(function (r) { return r.id === id || r.id === 'BR-'+id; });
    if (idx === -1) return false;
    DB_INCOMING[idx].status = 'declined';
    _persistIncoming();
    return true;
  },
  getPending: function () { return DB_INCOMING.filter(function (r) { return r.status === 'pending'; }); }
};

// ── DB_PROGRAMS PERSISTENCE ──────────────────────────────────
function _persistPrograms() { try { localStorage.setItem('kindred_programs', JSON.stringify(DB_PROGRAMS)); } catch(e){} }

var ProgDB = {
  getAll: function () { return DB_PROGRAMS.slice(); },
  getById: function (id) { return DB_PROGRAMS.find(function (p) { return p.id === id; }) || null; },
  create: function (data) {
    var newProg = Object.assign({ id: generateId('prog'), status: 'active', raised: 0, beneficiaries: 0, volunteers: 0 }, data);
    DB_PROGRAMS.push(newProg);
    _persistPrograms();
    return newProg;
  },
  update: function (id, data) {
    var idx = DB_PROGRAMS.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return null;
    DB_PROGRAMS[idx] = Object.assign({}, DB_PROGRAMS[idx], data);
    _persistPrograms();
    return DB_PROGRAMS[idx];
  },
  delete: function (id) {
    var idx = DB_PROGRAMS.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return false;
    DB_PROGRAMS.splice(idx, 1);
    _persistPrograms();
    return true;
  }
};

// ── Registered Users (Pending / Approved / Rejected) ────────
// Persisted to localStorage so data survives page refreshes
var DB_REGISTERED_USERS = (function () {
  try {
    var stored = localStorage.getItem('kindred_registered_users');
    return stored ? JSON.parse(stored) : [];
  } catch (e) { return []; }
})();

function _persistUsers() {
  try { localStorage.setItem('kindred_registered_users', JSON.stringify(DB_REGISTERED_USERS)); } catch (e) {}
}

var ROLE_DASHBOARDS = {
  admin: 'org-admin-overview.html',
  volunteer: 'volunteer-dashboard.html',
  donor: 'donor-dashboard.html',
  beneficiary: 'beneficiary-dashboard.html'
};

var ROLE_AVATARS = {
  admin: '#0f1a2e',
  volunteer: '#10b981',
  donor: '#f59e0b',
  beneficiary: '#8b5cf6'
};

var UserDB = {
  getAll: function () { return DB_REGISTERED_USERS.slice(); },
  getPending: function () { return DB_REGISTERED_USERS.filter(function (u) { return u.status === 'pending'; }); },
  getApproved: function () { return DB_REGISTERED_USERS.filter(function (u) { return u.status === 'approved'; }); },
  getRejected: function () { return DB_REGISTERED_USERS.filter(function (u) { return u.status === 'rejected'; }); },
  getById: function (id) { return DB_REGISTERED_USERS.find(function (u) { return u.id === id; }) || null; },
  getByEmail: function (email) { return DB_REGISTERED_USERS.find(function (u) { return u.email === email; }) || null; },

  create: function (data) {
    var initials = (data.name || '').split(' ').map(function (w) { return w.charAt(0).toUpperCase(); }).join('').slice(0, 2);
    var newUser = Object.assign({
      id: generateId('usr'),
      status: 'pending',
      initials: initials,
      avatar: ROLE_AVATARS[data.role] || '#6366f1',
      dashboard: ROLE_DASHBOARDS[data.role] || 'beneficiary-dashboard.html',
      registeredAt: new Date().toISOString()
    }, data);
    DB_REGISTERED_USERS.push(newUser);
    _persistUsers();
    return newUser;
  },

  approve: function (id) {
    var idx = DB_REGISTERED_USERS.findIndex(function (u) { return u.id === id; });
    if (idx === -1) return false;
    DB_REGISTERED_USERS[idx].status = 'approved';
    _persistUsers();
    return true;
  },

  reject: function (id) {
    var idx = DB_REGISTERED_USERS.findIndex(function (u) { return u.id === id; });
    if (idx === -1) return false;
    DB_REGISTERED_USERS[idx].status = 'rejected';
    _persistUsers();
    return true;
  },

  update: function (id, data) {
    var idx = DB_REGISTERED_USERS.findIndex(function (u) { return u.id === id; });
    if (idx === -1) return null;
    DB_REGISTERED_USERS[idx] = Object.assign({}, DB_REGISTERED_USERS[idx], data);
    _persistUsers();
    return DB_REGISTERED_USERS[idx];
  },

  delete: function (id) {
    var idx = DB_REGISTERED_USERS.findIndex(function (u) { return u.id === id; });
    if (idx === -1) return false;
    DB_REGISTERED_USERS.splice(idx, 1);
    _persistUsers();
    return true;
  },

  // Sync a registered user's changes back into the active session (sessionStorage)
  updateSession: function (id) {
    var u = DB_REGISTERED_USERS.find(function (u) { return u.id === id; });
    if (!u) return;
    try {
      var raw = sessionStorage.getItem('kindred_session');
      if (!raw) return;
      var sess = JSON.parse(raw);
      if (sess.id !== id) return; // only update if it's the current user
      // Merge safe fields
      var fields = ['name', 'email', 'phone', 'org', 'bio', 'initials', 'avatar', 'role', 'status', 'dashboard', 'skills'];
      fields.forEach(function(f) { if (u[f] !== undefined) sess[f] = u[f]; });
      sessionStorage.setItem('kindred_session', JSON.stringify(sess));
    } catch (e) {}
  },

  search: function (q) {
    if (!q) return DB_REGISTERED_USERS.slice();
    var lq = q.toLowerCase();
    return DB_REGISTERED_USERS.filter(function (u) {
      return (u.name && u.name.toLowerCase().includes(lq)) || (u.email && u.email.toLowerCase().includes(lq)) || (u.role && u.role.toLowerCase().includes(lq));
    });
  },

  // Get combined list of all users (MOCK + Registered) for admin view
  getAllCombined: function () {
    var mockMapped = MOCK_USERS.map(function (u) {
      return Object.assign({}, u, { source: 'system' });
    });
    var regMapped = DB_REGISTERED_USERS.map(function (u) {
      return Object.assign({}, u, { source: 'registered' });
    });
    return mockMapped.concat(regMapped);
  }
};

// ── Validation Helpers ───────────────────────────────────────
var Validate = {
  required: function (val) { return val !== null && val !== undefined && String(val).trim() !== ''; },
  email: function (val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); },
  phone: function (val) { return /^[+]?[\d\s\-()]{7,15}$/.test(val); },
  minLen: function (val, n) { return String(val).trim().length >= n; },
  maxLen: function (val, n) { return String(val).trim().length <= n; },
  positiveNum: function (val) { return !isNaN(val) && parseFloat(val) > 0; },
  nonemptySelect: function (val) { return val && val !== '' && val !== 'undefined'; },

  // Form field: show error if invalid
  field: function (inputEl, errorEl, rule, message) {
    var val = inputEl.value;
    var valid = rule(val);
    if (!valid) {
      inputEl.style.borderColor = '#ef4444';
      if (errorEl) { errorEl.textContent = message; errorEl.style.display = 'block'; }
    } else {
      inputEl.style.borderColor = '';
      if (errorEl) errorEl.style.display = 'none';
    }
    return valid;
  },

  // Clear all errors in a form
  clearErrors: function (formEl) {
    formEl.querySelectorAll('input, select, textarea').forEach(function (el) { el.style.borderColor = ''; });
    formEl.querySelectorAll('.field-error, .err').forEach(function (el) { el.style.display = 'none'; el.textContent = ''; });
  },

  // ── Strict Indian Phone Validation ──────────────────────────
  phone: function (val) {
    if (!val) return { valid: false, message: 'Phone number is required' };
    // Strip all non-digit chars
    var digits = val.replace(/\D/g, '');
    // Remove leading +91 or 0
    if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
    if (digits.length === 11 && digits.charAt(0) === '0') digits = digits.slice(1);
    // Must be exactly 10 digits
    if (digits.length !== 10) return { valid: false, message: 'Phone number must be exactly 10 digits' };
    // Only digits
    if (!/^\d{10}$/.test(digits)) return { valid: false, message: 'Only digits (0-9) allowed, no spaces or special characters' };
    // Must start with 6,7,8,9
    if (!/^[6-9]/.test(digits)) return { valid: false, message: 'Phone number must start with 6, 7, 8, or 9' };
    // All digits should not be identical
    if (/^(\d)\1{9}$/.test(digits)) return { valid: false, message: 'Invalid phone number — all digits cannot be the same' };
    // Reject obvious dummy patterns
    var dummyPatterns = ['1234567890','0123456789','9876543210','1111111111','1234512345'];
    if (dummyPatterns.indexOf(digits) !== -1) return { valid: false, message: 'This looks like a dummy number — please enter a real phone number' };
    // Reject sequential repeated 2-digit patterns like 1212121212, 2323232323
    if (/^(\d{2})\1{4}$/.test(digits)) return { valid: false, message: 'Invalid phone number — repeated pattern detected' };
    // Reject sequential repeated 3-digit patterns like 123123123x
    if (/^(\d{3})\1{2}/.test(digits)) return { valid: false, message: 'Invalid phone number — repeated pattern detected' };
    return { valid: true, message: '', digits: digits };
  }
};

// ============================================================
//  TASKS (Org Admin → Volunteer assignment)
//  Persisted to localStorage
// ============================================================
var DB_TASKS = (function () {
  try {
    var stored = localStorage.getItem('kindred_tasks');
    var parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
})();

function _persistTasks() {
  try { localStorage.setItem('kindred_tasks', JSON.stringify(DB_TASKS)); } catch (e) {}
}

var TaskDB = {
  getAll: function () { return DB_TASKS.slice(); },
  getById: function (id) { return DB_TASKS.find(function (t) { return t.id === id; }) || null; },
  getByVolunteer: function (email) {
    return DB_TASKS.filter(function (t) { 
      return t.assignedToEmail === email || (t.assignedToEmail && t.assignedToEmail.toLowerCase() === email.toLowerCase()); 
    });
  },
  create: function (data) {
    var newTask = Object.assign({
      id: generateId('task'),
      status: 'pending',
      createdAt: new Date().toISOString()
    }, data);
    DB_TASKS.push(newTask);
    _persistTasks();
    return newTask;
  },
  update: function (id, data) {
    var idx = DB_TASKS.findIndex(function (t) { return t.id === id; });
    if (idx === -1) return null;
    DB_TASKS[idx] = Object.assign({}, DB_TASKS[idx], data);
    _persistTasks();
    return DB_TASKS[idx];
  },
  delete: function (id) {
    var idx = DB_TASKS.findIndex(function (t) { return t.id === id; });
    if (idx === -1) return false;
    DB_TASKS.splice(idx, 1);
    _persistTasks();
    return true;
  }
};

// ============================================================
//  HOUR LOGS (Volunteer -> Org Admin Verification)
//  Persisted to localStorage
// ============================================================
var DB_HOUR_LOGS = (function () {
  try {
    var stored = localStorage.getItem('kindred_hour_logs');
    var parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
})();

function _persistHourLogs() {
  try { localStorage.setItem('kindred_hour_logs', JSON.stringify(DB_HOUR_LOGS)); } catch (e) {}
}

var HourLogDB = {
  getAll: function () { return DB_HOUR_LOGS.slice(); },
  getById: function (id) { return DB_HOUR_LOGS.find(function (l) { return l.id === id; }) || null; },
  getByVolunteer: function (email) {
    return DB_HOUR_LOGS.filter(function (l) { 
      return l.volunteerEmail === email || (l.volunteerEmail && l.volunteerEmail.toLowerCase() === email.toLowerCase()); 
    });
  },
  getPending: function () {
    return DB_HOUR_LOGS.filter(function (l) { return l.status === 'pending'; });
  },
  create: function (data) {
    var newLog = Object.assign({
      id: generateId('hlog'),
      status: 'pending',
      submittedAt: new Date().toISOString()
    }, data);
    DB_HOUR_LOGS.push(newLog);
    _persistHourLogs();
    return newLog;
  },
  update: function (id, data) {
    var idx = DB_HOUR_LOGS.findIndex(function (l) { return l.id === id; });
    if (idx === -1) return null;
    DB_HOUR_LOGS[idx] = Object.assign({}, DB_HOUR_LOGS[idx], data);
    _persistHourLogs();
    
    // If approved, add to total volunteer hours
    if (data.status === 'approved') {
      var log = DB_HOUR_LOGS[idx];
      var vol = VolDB.getAll().find(function(v) { return v.email === log.volunteerEmail; });
      if (vol) {
        VolDB.update(vol.id, { hours: (vol.hours || 0) + log.hours });
      } else {
        // Fallback to updating the basic local storage string (used for simpler volunteer profile mock)
        var key = 'vol_hours_' + log.volunteerEmail;
        var existing = parseFloat(localStorage.getItem(key) || '0');
        localStorage.setItem(key, (existing + log.hours).toString());
      }
    }
    
    return DB_HOUR_LOGS[idx];
  },
  delete: function (id) {
    var idx = DB_HOUR_LOGS.findIndex(function (l) { return l.id === id; });
    if (idx === -1) return false;
    DB_HOUR_LOGS.splice(idx, 1);
    _persistHourLogs();
    return true;
  }
};

// ============================================================
//  PROGRAM ASSIGNMENTS (Org Admin → Volunteer ↔ Program)
//  Persisted to localStorage
// ============================================================
var DB_PROGRAM_ASSIGNMENTS = (function () {
  try {
    var stored = localStorage.getItem('kindred_program_assignments');
    var parsed = stored ? JSON.parse(stored) : null;
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  // Seed with demo assignments
  return [
    { id: 'pa_001', programId: 'prog_001', programName: 'Cyclone Relief Fund', volunteerEmail: 'volunteer@kindred.org', volunteerName: 'Priya Singh', role: 'Field Coordinator', assignedAt: '2024-01-15', status: 'active' },
    { id: 'pa_002', programId: 'prog_001', programName: 'Cyclone Relief Fund', volunteerEmail: 'amit.sharma@email.com', volunteerName: 'Amit Sharma', role: 'Medical Volunteer', assignedAt: '2024-01-20', status: 'active' },
    { id: 'pa_003', programId: 'prog_002', programName: 'Clean Water Initiative', volunteerEmail: 'volunteer@kindred.org', volunteerName: 'Priya Singh', role: 'Field Coordinator', assignedAt: '2024-02-05', status: 'active' },
    { id: 'pa_004', programId: 'prog_002', programName: 'Clean Water Initiative', volunteerEmail: 'deepak.kumar@email.com', volunteerName: 'Deepak Kumar', role: 'Community Outreach', assignedAt: '2024-02-10', status: 'active' }
  ];
})();

function _persistProgramAssignments() {
  try { localStorage.setItem('kindred_program_assignments', JSON.stringify(DB_PROGRAM_ASSIGNMENTS)); } catch (e) {}
}

var ProgramAssignmentDB = {
  getAll: function () { return DB_PROGRAM_ASSIGNMENTS.slice(); },
  getByProgram: function (progId) {
    return DB_PROGRAM_ASSIGNMENTS.filter(function (a) { return a.programId === progId; });
  },
  getByVolunteer: function (email) {
    return DB_PROGRAM_ASSIGNMENTS.filter(function (a) {
      return a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase();
    });
  },
  exists: function (progId, email) {
    return DB_PROGRAM_ASSIGNMENTS.some(function (a) {
      return a.programId === progId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase();
    });
  },
  create: function (data) {
    var rec = Object.assign({ id: generateId('pa'), assignedAt: new Date().toISOString().split('T')[0], status: 'active' }, data);
    DB_PROGRAM_ASSIGNMENTS.push(rec);
    _persistProgramAssignments();
    return rec;
  },
  update: function (id, data) {
    var idx = DB_PROGRAM_ASSIGNMENTS.findIndex(function (a) { return a.id === id; });
    if (idx === -1) return null;
    DB_PROGRAM_ASSIGNMENTS[idx] = Object.assign({}, DB_PROGRAM_ASSIGNMENTS[idx], data);
    _persistProgramAssignments();
    return DB_PROGRAM_ASSIGNMENTS[idx];
  },
  delete: function (id) {
    var idx = DB_PROGRAM_ASSIGNMENTS.findIndex(function (a) { return a.id === id; });
    if (idx === -1) return false;
    DB_PROGRAM_ASSIGNMENTS.splice(idx, 1);
    _persistProgramAssignments();
    return true;
  }
};

// ============================================================
//  SUBTASKS (per Program — for granular progress tracking)
//  Persisted to localStorage
// ============================================================
var DB_SUBTASKS = (function () {
  try {
    var stored = localStorage.getItem('kindred_subtasks');
    var parsed = stored ? JSON.parse(stored) : null;
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  // Seed with demo subtasks
  return [
    { id: 'st_001', programId: 'prog_001', title: 'Set up emergency shelters', description: 'Erect 50 temporary shelters in affected zones', assignedToEmail: 'volunteer@kindred.org', assignedToName: 'Priya Singh', status: 'in-progress', progress: 65, createdAt: '2024-01-15' },
    { id: 'st_002', programId: 'prog_001', title: 'Distribute medical kits', description: 'Deliver 200 medical kits to flood-affected villages', assignedToEmail: 'amit.sharma@email.com', assignedToName: 'Amit Sharma', status: 'in-progress', progress: 40, createdAt: '2024-01-18' },
    { id: 'st_003', programId: 'prog_001', title: 'Food distribution drive', description: 'Organize and distribute food packages to 500 families', assignedToEmail: 'volunteer@kindred.org', assignedToName: 'Priya Singh', status: 'pending', progress: 0, createdAt: '2024-01-20' },
    { id: 'st_004', programId: 'prog_002', title: 'Site survey for borewells', description: 'Survey 25 villages for suitable borewell locations', assignedToEmail: 'volunteer@kindred.org', assignedToName: 'Priya Singh', status: 'completed', progress: 100, createdAt: '2024-02-05' },
    { id: 'st_005', programId: 'prog_002', title: 'Community awareness campaign', description: 'Conduct water hygiene workshops in 15 villages', assignedToEmail: 'deepak.kumar@email.com', assignedToName: 'Deepak Kumar', status: 'in-progress', progress: 55, createdAt: '2024-02-12' },
    { id: 'st_006', programId: 'prog_002', title: 'Install purification units', description: 'Install 50 water purification systems', assignedToEmail: 'deepak.kumar@email.com', assignedToName: 'Deepak Kumar', status: 'pending', progress: 10, createdAt: '2024-03-01' }
  ];
})();

function _persistSubtasks() {
  try { localStorage.setItem('kindred_subtasks', JSON.stringify(DB_SUBTASKS)); } catch (e) {}
}

var SubtaskDB = {
  getAll: function () { return DB_SUBTASKS.slice(); },
  getById: function (id) { return DB_SUBTASKS.find(function (s) { return s.id === id; }) || null; },
  getByProgram: function (progId) {
    return DB_SUBTASKS.filter(function (s) { return s.programId === progId; });
  },
  getByVolunteer: function (email) {
    return DB_SUBTASKS.filter(function (s) {
      return s.assignedToEmail && s.assignedToEmail.toLowerCase() === email.toLowerCase();
    });
  },
  getByProgramAndVolunteer: function (progId, email) {
    return DB_SUBTASKS.filter(function (s) {
      return s.programId === progId && s.assignedToEmail && s.assignedToEmail.toLowerCase() === email.toLowerCase();
    });
  },
  getProgramProgress: function (progId) {
    var subs = this.getByProgram(progId);
    if (subs.length === 0) return 0;
    var total = subs.reduce(function (sum, s) { return sum + (s.progress || 0); }, 0);
    return Math.round(total / subs.length);
  },
  create: function (data) {
    var rec = Object.assign({ id: generateId('st'), status: 'pending', progress: 0, createdAt: new Date().toISOString().split('T')[0] }, data);
    DB_SUBTASKS.push(rec);
    _persistSubtasks();
    return rec;
  },
  update: function (id, data) {
    var idx = DB_SUBTASKS.findIndex(function (s) { return s.id === id; });
    if (idx === -1) return null;
    DB_SUBTASKS[idx] = Object.assign({}, DB_SUBTASKS[idx], data);
    _persistSubtasks();
    return DB_SUBTASKS[idx];
  },
  delete: function (id) {
    var idx = DB_SUBTASKS.findIndex(function (s) { return s.id === id; });
    if (idx === -1) return false;
    DB_SUBTASKS.splice(idx, 1);
    _persistSubtasks();
    return true;
  }
};

// ============================================================
//  PROGRAM APPLICATIONS (Volunteer Portal → Org Admin Review)
//  Persisted to localStorage
// ============================================================
var DB_PROGRAM_APPLICATIONS = (function () {
  try {
    var stored = localStorage.getItem('kindred_program_applications');
    var parsed = stored ? JSON.parse(stored) : null;
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  return [];
})();

function _persistProgramApplications() {
  try { localStorage.setItem('kindred_program_applications', JSON.stringify(DB_PROGRAM_APPLICATIONS)); } catch (e) {}
}

var ProgramApplicationDB = {
  getAll: function () { return DB_PROGRAM_APPLICATIONS.slice(); },
  getByProgram: function (progId) {
    return DB_PROGRAM_APPLICATIONS.filter(function (a) { return a.programId === progId; });
  },
  getByVolunteer: function (email) {
    return DB_PROGRAM_APPLICATIONS.filter(function (a) {
      return a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase();
    });
  },
  getPending: function () {
    return DB_PROGRAM_APPLICATIONS.filter(function (a) { return a.status === 'pending'; });
  },
  hasApplied: function (progId, email) {
    return DB_PROGRAM_APPLICATIONS.some(function (a) {
      return a.programId === progId && a.volunteerEmail && a.volunteerEmail.toLowerCase() === email.toLowerCase();
    });
  },
  create: function (data) {
    var rec = Object.assign({ id: generateId('papp'), status: 'pending', appliedAt: new Date().toISOString().split('T')[0] }, data);
    DB_PROGRAM_APPLICATIONS.push(rec);
    _persistProgramApplications();
    return rec;
  },
  approve: function (id) {
    var idx = DB_PROGRAM_APPLICATIONS.findIndex(function (a) { return a.id === id; });
    if (idx === -1) return false;
    DB_PROGRAM_APPLICATIONS[idx].status = 'approved';
    _persistProgramApplications();
    // Auto-assign volunteer to the program
    var app = DB_PROGRAM_APPLICATIONS[idx];
    if (!ProgramAssignmentDB.exists(app.programId, app.volunteerEmail)) {
      ProgramAssignmentDB.create({
        programId: app.programId,
        programName: app.programName,
        volunteerEmail: app.volunteerEmail,
        volunteerName: app.volunteerName,
        role: 'Volunteer',
        status: 'active'
      });
    }
    return true;
  },
  reject: function (id) {
    var idx = DB_PROGRAM_APPLICATIONS.findIndex(function (a) { return a.id === id; });
    if (idx === -1) return false;
    DB_PROGRAM_APPLICATIONS[idx].status = 'rejected';
    _persistProgramApplications();
    return true;
  }
};

// ============================================================
//  RESOURCE DONATIONS (Donor → Org Admin → Volunteer Pickup)
//  Persisted to localStorage
// ============================================================
var RESOURCE_CATEGORIES = [
  'Clothing', 'Food', 'Medical Supplies', 'Electronics', 'Furniture',
  'Books & Stationery', 'Blankets & Bedding', 'Hygiene Kits', 'Other'
];

var RESOURCE_CATEGORY_ICONS = {
  'Clothing': '👕', 'Food': '🍱', 'Medical Supplies': '💊',
  'Electronics': '💻', 'Furniture': '🪑', 'Books & Stationery': '📚',
  'Blankets & Bedding': '🛏️', 'Hygiene Kits': '🧴', 'Other': '📦'
};

var RESOURCE_CATEGORY_COLORS = {
  'Clothing': '#8b5cf6', 'Food': '#f59e0b', 'Medical Supplies': '#ef4444',
  'Electronics': '#3b82f6', 'Furniture': '#14b8a6', 'Books & Stationery': '#6366f1',
  'Blankets & Bedding': '#ec4899', 'Hygiene Kits': '#10b981', 'Other': '#64748b'
};

var RESOURCE_STATUS_FLOW = ['submitted', 'pending_pickup', 'in_transit', 'delivered', 'completed'];

var DB_RESOURCE_DONATIONS = (function () {
  try {
    var stored = localStorage.getItem('kindred_resource_donations');
    var parsed = stored ? JSON.parse(stored) : null;
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  // Seed data
  return [
    {
      id: 'rdon_001', donorName: 'Rajesh Gupta', donorEmail: 'donor@kindred.org', donorPhone: '9876543210',
      category: 'Food', items: [
        { name: 'Rice Bags (25kg)', quantity: 10, condition: 'New' },
        { name: 'Cooking Oil (5L)', quantity: 20, condition: 'New' }
      ],
      description: 'Bulk food supplies for the cyclone relief program. All items are factory sealed.',
      pickupAddress: '42, MG Road, Sector 18, Noida, UP 201301',
      pickupDate: '2024-12-28', pickupTimeSlot: 'Morning (9AM-12PM)',
      programId: 'prog_001', programName: 'Cyclone Relief Fund',
      status: 'pending_pickup',
      assignedVolunteerEmail: 'volunteer@kindred.org', assignedVolunteerName: 'Priya Singh',
      assignedAt: '2024-12-22T10:30:00', pickedUpAt: null, deliveredAt: null,
      notes: '', createdAt: '2024-12-20T09:15:00'
    },
    {
      id: 'rdon_002', donorName: 'Anita Mehta', donorEmail: 'anita.donor@email.com', donorPhone: '8765432109',
      category: 'Blankets & Bedding', items: [
        { name: 'Warm Blankets', quantity: 50, condition: 'New' },
        { name: 'Pillows', quantity: 30, condition: 'Good' }
      ],
      description: 'Winter relief blankets and pillows for families in flood-affected areas.',
      pickupAddress: '15, Lajpat Nagar, South Delhi, 110024',
      pickupDate: '2024-12-25', pickupTimeSlot: 'Afternoon (12PM-4PM)',
      programId: 'prog_001', programName: 'Cyclone Relief Fund',
      status: 'delivered',
      assignedVolunteerEmail: 'deepak.kumar@email.com', assignedVolunteerName: 'Deepak Kumar',
      assignedAt: '2024-12-23T11:00:00', pickedUpAt: '2024-12-25T13:20:00', deliveredAt: '2024-12-25T16:45:00',
      notes: 'All items delivered to warehouse.', createdAt: '2024-12-21T14:30:00'
    },
    {
      id: 'rdon_003', donorName: 'Rajesh Gupta', donorEmail: 'donor@kindred.org', donorPhone: '9876543210',
      category: 'Medical Supplies', items: [
        { name: 'First Aid Kits', quantity: 25, condition: 'New' },
        { name: 'Bandages (Boxes)', quantity: 100, condition: 'New' },
        { name: 'ORS Packets', quantity: 500, condition: 'New' }
      ],
      description: 'Essential medical supplies for rural healthcare camps.',
      pickupAddress: '42, MG Road, Sector 18, Noida, UP 201301',
      pickupDate: '2025-01-05', pickupTimeSlot: 'Morning (9AM-12PM)',
      programId: '', programName: '',
      status: 'submitted',
      assignedVolunteerEmail: '', assignedVolunteerName: '',
      assignedAt: null, pickedUpAt: null, deliveredAt: null,
      notes: '', createdAt: '2024-12-24T08:00:00'
    }
  ];
})();

function _persistResourceDonations() {
  try { localStorage.setItem('kindred_resource_donations', JSON.stringify(DB_RESOURCE_DONATIONS)); } catch (e) {}
}

var ResourceDonationDB = {
  getAll: function () { return DB_RESOURCE_DONATIONS.slice(); },
  getById: function (id) { return DB_RESOURCE_DONATIONS.find(function (d) { return d.id === id; }) || null; },
  getByDonor: function (email) {
    return DB_RESOURCE_DONATIONS.filter(function (d) {
      return d.donorEmail && d.donorEmail.toLowerCase() === email.toLowerCase();
    });
  },
  getByVolunteer: function (email) {
    return DB_RESOURCE_DONATIONS.filter(function (d) {
      return d.assignedVolunteerEmail && d.assignedVolunteerEmail.toLowerCase() === email.toLowerCase();
    });
  },
  getByProgram: function (progId) {
    return DB_RESOURCE_DONATIONS.filter(function (d) { return d.programId === progId; });
  },
  getByStatus: function (status) {
    return DB_RESOURCE_DONATIONS.filter(function (d) { return d.status === status; });
  },
  getPending: function () {
    return DB_RESOURCE_DONATIONS.filter(function (d) { return d.status === 'submitted'; });
  },
  getActivePickups: function () {
    return DB_RESOURCE_DONATIONS.filter(function (d) {
      return d.status === 'pending_pickup' || d.status === 'in_transit';
    });
  },
  getCompleted: function () {
    return DB_RESOURCE_DONATIONS.filter(function (d) {
      return d.status === 'delivered' || d.status === 'completed';
    });
  },
  create: function (data) {
    var rec = Object.assign({
      id: generateId('rdon'), status: 'submitted',
      assignedVolunteerEmail: '', assignedVolunteerName: '',
      assignedAt: null, pickedUpAt: null, deliveredAt: null,
      notes: '', createdAt: new Date().toISOString()
    }, data);
    DB_RESOURCE_DONATIONS.push(rec);
    _persistResourceDonations();
    return rec;
  },
  update: function (id, data) {
    var idx = DB_RESOURCE_DONATIONS.findIndex(function (d) { return d.id === id; });
    if (idx === -1) return null;
    DB_RESOURCE_DONATIONS[idx] = Object.assign({}, DB_RESOURCE_DONATIONS[idx], data);
    _persistResourceDonations();
    return DB_RESOURCE_DONATIONS[idx];
  },
  delete: function (id) {
    var idx = DB_RESOURCE_DONATIONS.findIndex(function (d) { return d.id === id; });
    if (idx === -1) return false;
    DB_RESOURCE_DONATIONS.splice(idx, 1);
    _persistResourceDonations();
    return true;
  },
  assignVolunteer: function (id, volName, volEmail) {
    return this.update(id, {
      assignedVolunteerEmail: volEmail,
      assignedVolunteerName: volName,
      assignedAt: new Date().toISOString(),
      status: 'pending_pickup'
    });
  },
  startPickup: function (id) {
    return this.update(id, {
      status: 'in_transit',
      pickedUpAt: new Date().toISOString()
    });
  },
  markDelivered: function (id) {
    return this.update(id, {
      status: 'delivered',
      deliveredAt: new Date().toISOString()
    });
  },
  markCompleted: function (id) {
    return this.update(id, { status: 'completed' });
  },
  allocateToProgram: function (id, progId, progName) {
    return this.update(id, { programId: progId, programName: progName });
  },
  getStatusIndex: function (status) {
    return RESOURCE_STATUS_FLOW.indexOf(status);
  }
};
