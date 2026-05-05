/* ============================================================
   KINDRED — API CLIENT (Backend Integration Layer)
   api.js — transparently replaces mock-data.js sync methods
   with backend API calls so ALL existing frontend code works.
   Include this script AFTER mock-data.js and auth.js
   ============================================================ */

var API_BASE = 'http://localhost:3000';

// ── Helper: get current user role for RBAC header ────────────
function _getRole() {
  try {
    var sess = JSON.parse(sessionStorage.getItem('kindred_session') || 'null');
    return (sess && sess.role) ? sess.role : 'admin';
  } catch (e) { return 'admin'; }
}

// ── Core fetch wrapper ───────────────────────────────────────
function api(method, path, body) {
  var opts = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'role': _getRole()
    }
  };
  if (body && method !== 'GET') {
    opts.body = JSON.stringify(body);
  }
  return fetch(API_BASE + path, opts)
    .then(function (res) {
      return res.json().then(function (json) {
        return { status: res.status, ok: res.ok, body: json };
      });
    })
    .catch(function (err) {
      console.warn('[API] Network error on ' + method + ' ' + path + ':', err.message);
      return { status: 0, ok: false, body: { success: false, data: null, message: err.message } };
    });
}

// Shorthand helpers
function apiGet(path) { return api('GET', path); }
function apiPost(path, body) { return api('POST', path, body); }
function apiPatch(path, body) { return api('PATCH', path, body); }
function apiDelete(path) { return api('DELETE', path); }

// ══════════════════════════════════════════════════════════════
//  STRATEGY: Override WRITE methods on each *DB object so that
//  they call the backend AND update local state. READ methods
//  continue to use the in-memory arrays, which are populated
//  from the backend on page load (syncFromBackend).
//  This means ALL existing synchronous frontend code keeps
//  working — no changes needed in CRUD JS files.
// ══════════════════════════════════════════════════════════════

// ── Helper: wrap a sync write method to also call backend ────
// Returns the local result immediately (sync), and fires an
// async backend call in the background.
function _wrapWrite(origFn, apiCall) {
  return function () {
    var result = origFn.apply(this, arguments);
    // Fire backend call in background (don't block UI)
    try { apiCall.apply(null, arguments).catch(function(e){ console.warn('[API] bg write failed:', e); }); } catch(e){}
    return result;
  };
}

// ══════════════════════════════════════════════════════════════
//  REWIRE: auth.js signIn → POST /users/signin
// ══════════════════════════════════════════════════════════════
var _originalSignIn = (typeof signIn === 'function') ? signIn : null;

/**
 * Async sign-in that calls the backend.
 * Falls back to local MOCK_USERS if backend is unreachable.
 */
function signInAsync(roleSlug, email, password) {
  return apiPost('/users/signin', { email: email, password: password, role: roleSlug })
    .then(function (res) {
      if (res.ok && res.body.success) {
        var user = res.body.data;
        var session = setSession(user);
        return { success: true, session: session };
      } else {
        // Map backend error messages to frontend error types
        var msg = res.body.message || '';
        if (msg.indexOf('under review') !== -1) {
          return { success: false, error: 'pending', message: msg };
        }
        if (msg.indexOf('not approved') !== -1) {
          return { success: false, error: 'rejected', message: msg };
        }
        return { success: false, error: 'invalid', message: msg || 'Invalid email, password, or role.' };
      }
    })
    .catch(function () {
      // Fallback to local auth if backend is down
      if (_originalSignIn) return _originalSignIn(roleSlug, email, password);
      return { success: false, error: 'invalid', message: 'Backend unavailable.' };
    });
}

// ══════════════════════════════════════════════════════════════
//  REWIRE: OrgDB — Organizations
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = OrgDB.create;
  var _update  = OrgDB.update;
  var _delete  = OrgDB.delete;

  OrgDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/organizations', data);
  });
  OrgDB.update = _wrapWrite(_update, function (id, data) {
    return apiPatch('/organizations/' + id, data);
  });
  OrgDB.delete = _wrapWrite(_delete, function (id) {
    return apiDelete('/organizations/' + id);
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: VolDB — Volunteers
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = VolDB.create;
  var _update  = VolDB.update;
  var _delete  = VolDB.delete;

  VolDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/volunteers', data);
  });
  VolDB.update = _wrapWrite(_update, function (id, data) {
    return apiPatch('/volunteers/' + id, data);
  });
  VolDB.delete = _wrapWrite(_delete, function (id) {
    return apiDelete('/volunteers/' + id);
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: ProgDB — Programs
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = ProgDB.create;
  var _update  = ProgDB.update;
  var _delete  = ProgDB.delete;

  ProgDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/programs', data);
  });
  ProgDB.update = _wrapWrite(_update, function (id, data) {
    return apiPatch('/programs/' + id, data);
  });
  ProgDB.delete = _wrapWrite(_delete, function (id) {
    return apiDelete('/programs/' + id);
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: ReqDB — Platform Requests
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = ReqDB.create;
  var _approve = ReqDB.approve;
  var _reject  = ReqDB.reject;

  ReqDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/requests', data);
  });
  ReqDB.approve = _wrapWrite(_approve, function (id) {
    return apiPatch('/requests/' + id + '/approve');
  });
  ReqDB.reject = _wrapWrite(_reject, function (id) {
    return apiPatch('/requests/' + id + '/reject');
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: IncomingDB — Incoming Requests
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = IncomingDB.create;
  var _accept  = IncomingDB.accept;
  var _decline = IncomingDB.decline;

  IncomingDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/incoming', data);
  });
  IncomingDB.accept = _wrapWrite(_accept, function (id) {
    return apiPatch('/incoming/' + id + '/accept');
  });
  IncomingDB.decline = _wrapWrite(_decline, function (id) {
    return apiPatch('/incoming/' + id + '/decline');
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: UserDB — Registered Users
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = UserDB.create;
  var _update  = UserDB.update;
  var _delete  = UserDB.delete;
  var _approve = UserDB.approve;
  var _reject  = UserDB.reject;

  UserDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/users', data);
  });
  UserDB.update = _wrapWrite(_update, function (id, data) {
    return apiPatch('/users/' + id, data);
  });
  UserDB.delete = _wrapWrite(_delete, function (id) {
    return apiDelete('/users/' + id);
  });
  UserDB.approve = _wrapWrite(_approve, function (id) {
    return apiPatch('/users/' + id + '/approve');
  });
  UserDB.reject = _wrapWrite(_reject, function (id) {
    return apiPatch('/users/' + id + '/reject');
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: TaskDB — Tasks
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = TaskDB.create;
  var _update  = TaskDB.update;
  var _delete  = TaskDB.delete;

  TaskDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/tasks', data);
  });
  TaskDB.update = _wrapWrite(_update, function (id, data) {
    return apiPatch('/tasks/' + id, data);
  });
  TaskDB.delete = _wrapWrite(_delete, function (id) {
    return apiDelete('/tasks/' + id);
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: HourLogDB — Hour Logs
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = HourLogDB.create;
  var _update  = HourLogDB.update;
  var _delete  = HourLogDB.delete;

  HourLogDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/hour-logs', data);
  });
  HourLogDB.update = _wrapWrite(_update, function (id, data) {
    return apiPatch('/hour-logs/' + id, data);
  });
  HourLogDB.delete = _wrapWrite(_delete, function (id) {
    return apiDelete('/hour-logs/' + id);
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: SubtaskDB — Subtasks
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = SubtaskDB.create;
  var _update  = SubtaskDB.update;
  var _delete  = SubtaskDB.delete;

  SubtaskDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/subtasks', data);
  });
  SubtaskDB.update = _wrapWrite(_update, function (id, data) {
    return apiPatch('/subtasks/' + id, data);
  });
  SubtaskDB.delete = _wrapWrite(_delete, function (id) {
    return apiDelete('/subtasks/' + id);
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: ProgramAssignmentDB — Program Assignments
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = ProgramAssignmentDB.create;
  var _update  = ProgramAssignmentDB.update;
  var _delete  = ProgramAssignmentDB.delete;

  ProgramAssignmentDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/program-assignments', data);
  });
  ProgramAssignmentDB.update = _wrapWrite(_update, function (id, data) {
    return apiPatch('/program-assignments/' + id, data);
  });
  ProgramAssignmentDB.delete = _wrapWrite(_delete, function (id) {
    return apiDelete('/program-assignments/' + id);
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: ProgramApplicationDB — Program Applications
// ══════════════════════════════════════════════════════════════
(function () {
  var _create  = ProgramApplicationDB.create;
  var _approve = ProgramApplicationDB.approve;
  var _reject  = ProgramApplicationDB.reject;

  ProgramApplicationDB.create = _wrapWrite(_create, function (data) {
    return apiPost('/program-applications', data);
  });
  ProgramApplicationDB.approve = _wrapWrite(_approve, function (id) {
    return apiPatch('/program-applications/' + id + '/approve');
  });
  ProgramApplicationDB.reject = _wrapWrite(_reject, function (id) {
    return apiPatch('/program-applications/' + id + '/reject');
  });
})();

// ══════════════════════════════════════════════════════════════
//  REWIRE: ResourceDonationDB — Resource Donations
// ══════════════════════════════════════════════════════════════
if (typeof ResourceDonationDB !== 'undefined') {
  (function () {
    var _create          = ResourceDonationDB.create;
    var _update          = ResourceDonationDB.update;
    var _delete          = ResourceDonationDB.delete;
    var _assignVolunteer = ResourceDonationDB.assignVolunteer;
    var _startPickup     = ResourceDonationDB.startPickup;
    var _markDelivered   = ResourceDonationDB.markDelivered;
    var _markCompleted   = ResourceDonationDB.markCompleted;
    var _allocateToProgram = ResourceDonationDB.allocateToProgram;

    ResourceDonationDB.create = _wrapWrite(_create, function (data) {
      return apiPost('/resource-donations', data);
    });
    ResourceDonationDB.update = _wrapWrite(_update, function (id, data) {
      return apiPatch('/resource-donations/' + id, data);
    });
    ResourceDonationDB.delete = _wrapWrite(_delete, function (id) {
      return apiDelete('/resource-donations/' + id);
    });
    ResourceDonationDB.assignVolunteer = _wrapWrite(_assignVolunteer, function (id, volName, volEmail) {
      return apiPatch('/resource-donations/' + id, {
        assignedVolunteerEmail: volEmail,
        assignedVolunteerName: volName,
        assignedAt: new Date().toISOString(),
        status: 'pending_pickup'
      });
    });
    ResourceDonationDB.startPickup = _wrapWrite(_startPickup, function (id) {
      return apiPatch('/resource-donations/' + id, {
        status: 'in_transit',
        pickedUpAt: new Date().toISOString()
      });
    });
    ResourceDonationDB.markDelivered = _wrapWrite(_markDelivered, function (id) {
      return apiPatch('/resource-donations/' + id, {
        status: 'delivered',
        deliveredAt: new Date().toISOString()
      });
    });
    ResourceDonationDB.markCompleted = _wrapWrite(_markCompleted, function (id) {
      return apiPatch('/resource-donations/' + id, { status: 'completed' });
    });
    ResourceDonationDB.allocateToProgram = _wrapWrite(_allocateToProgram, function (id, progId, progName) {
      return apiPatch('/resource-donations/' + id, { programId: progId, programName: progName });
    });
  })();
}


// ══════════════════════════════════════════════════════════════
//  BACKEND SYNC: Load data from backend on page load
//  This replaces ALL in-memory arrays with backend data,
//  so that read operations (getAll, getById, etc.) serve
//  live backend data instead of hardcoded mock data.
// ══════════════════════════════════════════════════════════════
var _backendReady = false;

function syncFromBackend() {
  return Promise.all([
    apiGet('/users').then(function (res) {
      if (res.ok && Array.isArray(res.body.data)) {
        var backendUsers = res.body.data;
        // Update MOCK_USERS with backend versions
        backendUsers.forEach(function (bu) {
          var mockIdx = MOCK_USERS.findIndex(function (m) { return m.id === bu.id || m.email === bu.email; });
          if (mockIdx !== -1) {
            MOCK_USERS[mockIdx] = Object.assign({}, MOCK_USERS[mockIdx], bu);
          }
          // Also check registered users
          var regIdx = DB_REGISTERED_USERS.findIndex(function (r) { return r.id === bu.id || r.email === bu.email; });
          if (regIdx !== -1) {
            DB_REGISTERED_USERS[regIdx] = Object.assign({}, DB_REGISTERED_USERS[regIdx], bu);
          } else if (bu.source !== 'system') {
            // Add new backend users to local registered store
            DB_REGISTERED_USERS.push(bu);
          }
        });
      }
    }).catch(function () {}),

    apiGet('/organizations').then(function (res) {
      if (res.ok && Array.isArray(res.body.data) && res.body.data.length > 0) {
        DB_ORGANIZATIONS.length = 0;
        res.body.data.forEach(function (o) { DB_ORGANIZATIONS.push(o); });
      }
    }).catch(function () {}),

    apiGet('/programs').then(function (res) {
      if (res.ok && Array.isArray(res.body.data) && res.body.data.length > 0) {
        DB_PROGRAMS.length = 0;
        res.body.data.forEach(function (p) { DB_PROGRAMS.push(p); });
      }
    }).catch(function () {}),

    apiGet('/volunteers').then(function (res) {
      if (res.ok && Array.isArray(res.body.data) && res.body.data.length > 0) {
        DB_VOLUNTEERS_STORE.length = 0;
        res.body.data.forEach(function (v) { DB_VOLUNTEERS_STORE.push(v); });
      }
    }).catch(function () {}),

    apiGet('/incoming').then(function (res) {
      if (res.ok && Array.isArray(res.body.data)) {
        DB_INCOMING.length = 0;
        res.body.data.forEach(function (i) { DB_INCOMING.push(i); });
      }
    }).catch(function () {}),

    apiGet('/requests').then(function (res) {
      if (res.ok && Array.isArray(res.body.data)) {
        DB_REQUESTS.length = 0;
        res.body.data.forEach(function (r) { DB_REQUESTS.push(r); });
      }
    }).catch(function () {}),

    apiGet('/tasks').then(function (res) {
      if (res.ok && Array.isArray(res.body.data)) {
        DB_TASKS.length = 0;
        res.body.data.forEach(function (t) { DB_TASKS.push(t); });
      }
    }).catch(function () {}),

    apiGet('/hour-logs').then(function (res) {
      if (res.ok && Array.isArray(res.body.data)) {
        DB_HOUR_LOGS.length = 0;
        res.body.data.forEach(function (l) { DB_HOUR_LOGS.push(l); });
      }
    }).catch(function () {}),

    apiGet('/subtasks').then(function (res) {
      if (res.ok && Array.isArray(res.body.data)) {
        DB_SUBTASKS.length = 0;
        res.body.data.forEach(function (s) { DB_SUBTASKS.push(s); });
      }
    }).catch(function () {}),

    apiGet('/program-assignments').then(function (res) {
      if (res.ok && Array.isArray(res.body.data)) {
        DB_PROGRAM_ASSIGNMENTS.length = 0;
        res.body.data.forEach(function (a) { DB_PROGRAM_ASSIGNMENTS.push(a); });
      }
    }).catch(function () {}),

    apiGet('/program-applications').then(function (res) {
      if (res.ok && Array.isArray(res.body.data)) {
        DB_PROGRAM_APPLICATIONS.length = 0;
        res.body.data.forEach(function (a) { DB_PROGRAM_APPLICATIONS.push(a); });
      }
    }).catch(function () {}),

    apiGet('/resource-donations').then(function (res) {
      if (res.ok && Array.isArray(res.body.data) && typeof DB_RESOURCE_DONATIONS !== 'undefined') {
        DB_RESOURCE_DONATIONS.length = 0;
        res.body.data.forEach(function (d) { DB_RESOURCE_DONATIONS.push(d); });
      }
    }).catch(function () {})
  ]).then(function () {
    _backendReady = true;
    console.log('✅ [Kindred API] Frontend synced with backend at ' + API_BASE);
  }).catch(function () {
    console.warn('⚠️ [Kindred API] Backend sync failed — using local mock data');
  });
}

// Auto-sync when the page loads
document.addEventListener('DOMContentLoaded', function () {
  syncFromBackend();
});

console.log('🔌 [Kindred API] api.js loaded — all DB writes now proxy to backend');
