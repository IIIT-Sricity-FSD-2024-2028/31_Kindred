const enc = encodeURIComponent;
const publicPages = /index|organizations|organization-details|programs|fundraising|donate|volunteer-portal|create-program|org-admin|donor-dashboard/;

// Each request uses the current user's actual role. No anonymous elevation or local
// mock fallback: an unavailable collection keeps its own error and retry state.
export function pageRequests(path, session) {
  const jobs = {};
  if (publicPages.test(path)) {
    jobs.organizations = '/organizations';
    jobs.programs = '/programs';
    if (path === '/organization-details.html') jobs.organizationTotals = '/donations/public/organizations';
  }
  if (/shop|seller-dashboard/.test(path)) jobs.products = '/products?status=approved';
  if (session?.role === 'volunteer' && /volunteer|profile/.test(path)) {
    const email = enc(session.email);
    Object.assign(jobs, {
      volunteer: `/volunteers/by-email/${email}`, tasks: `/tasks/by-volunteer/${email}`,
      hours: `/hour-logs/by-volunteer/${email}`, subtasks: `/subtasks/by-volunteer/${email}`,
      assignments: `/program-assignments/by-volunteer/${email}`,
      applications: `/program-applications/by-volunteer/${email}`,
      resources: `/resource-donations/by-volunteer/${email}`,
      orders: `/orders/by-volunteer/${email}`, replacements: `/replacements/by-volunteer/${email}`,
      volunteerRequests: '/volunteer-requests?status=open', programs: '/programs', organizations: '/organizations',
    });
  }
  if (session?.role === 'donor' && /donor-dashboard/.test(path)) {
    jobs.resources = `/resource-donations/by-donor/${enc(session.email)}`;
    jobs.orders = `/orders/by-buyer/${enc(session.email)}`;
    jobs.replacements = `/replacements/by-buyer/${enc(session.email)}`;
  }
  if (session?.role === 'beneficiary' && /beneficiary-dashboard/.test(path)) {
    jobs.incoming = `/incoming/by-beneficiary/${enc(session.email)}`;
  }
  if (session?.role === 'seller' && /seller-dashboard/.test(path)) {
    jobs.sellers = '/sellers';
    jobs.products = `/products?sellerId=${enc(session.id)}`;
    jobs.orders = `/orders?sellerId=${enc(session.id)}`;
    jobs.replacements = `/replacements/by-seller/${enc(session.id)}`;
  }
  if (['admin', 'superuser'].includes(session?.role) && /admin|overview|analytics|requests|incoming|resources|volunteers|create-program/.test(path)) {
    Object.assign(jobs, { organizations: '/organizations/manage', programs: '/programs/manage', proofs: '/proofs', volunteers: '/volunteers',
      incoming: '/incoming', tasks: '/tasks', hours: '/hour-logs', subtasks: '/subtasks',
      assignments: '/program-assignments', applications: '/program-applications',
      resources: session.role === 'admin' && session.org ? `/resource-donations/by-org/${enc(session.org)}` : '/resource-donations',
      orders: '/orders', replacements: '/replacements',
      volunteerRequests: '/volunteer-requests',
    });
    if (session.role === 'superuser') Object.assign(jobs, { users: '/users', requests: '/requests', products: '/products', sellers: '/sellers', donations: '/donations' });
    else jobs.donations = `/donations/by-org/${enc(session.org || '')}`;
  }
  if (session && !['admin','superuser'].includes(session.role) && /dashboard|programs|volunteer/.test(path)) {
    const email = enc(session.email);
    Object.assign(jobs, { assignments: `/program-assignments/by-volunteer/${email}`, applications: `/program-applications/by-volunteer/${email}`, memberPrograms: '/program-assignments/my-programs', tasks: `/tasks/by-volunteer/${email}`, subtasks: `/subtasks/by-volunteer/${email}`, hours: `/hour-logs/by-volunteer/${email}`, proofs: '/proofs', donations: `/donations/by-donor/${email}` });
    if (session.role === 'volunteer') jobs.incoming = `/incoming/by-volunteer/${email}`;
  }
  if (session?.role === 'admin' && /org-admin|overview/.test(path)) jobs.balance = `/donations/balance/${enc(session.org || '')}`;
  if (session && /dashboard|org-admin|platform-admin|resources|incoming/.test(path)) {
    jobs.deliveries = '/fulfillment/deliveries';
    if (['beneficiary','admin','superuser'].includes(session.role)) jobs.resourceRequests = '/fulfillment/requests';
    if (['admin','superuser'].includes(session.role)) jobs.inventory = '/fulfillment/inventory';
    if (['admin','superuser','seller'].includes(session.role)) jobs.deliveryVolunteers = '/fulfillment/volunteers';
    if (session.role === 'beneficiary') jobs.organizations = '/organizations';
  }
  if (['admin','superuser'].includes(session?.role) && path === '/profile.html') jobs.profile = `/users/${enc(session.id)}`;
  return jobs;
}

export function filterRecords(records, query = '', filter = 'all') {
  const text = String(query).trim().toLowerCase();
  return records.filter((row) => (!text || [row.name, row.title, row.email, row.skills, row.org, row.focus, row.description, row.desc, row.category, row.sellerName, row.type].flat().join(' ').toLowerCase().includes(text)) &&
    (filter === 'all' || [row.status, row.role, row.category, row.type?.toLowerCase()].includes(filter) || row.type?.toLowerCase().includes(filter)));
}
