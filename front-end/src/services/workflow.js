// Existing workflows span multiple API records. Await each write and surface
// partial failure; refresh first on retry to avoid duplicate related records.
export async function ensureAssignment(api, record, assignments) {
  const existing = assignments.find((a) => a.volunteerEmail.toLowerCase() === record.volunteerEmail.toLowerCase());
  if (existing) {
    if (['cancelled', 'declined', 'withdrawn'].includes(existing.status)) await api.patch(`/program-assignments/${encodeURIComponent(existing.id)}`, { status: 'pending' });
    return;
  }
  await api.post('/program-assignments', { ...record, status: 'pending' });
}
export async function executeConfirmation(api, confirmation) {
  const result = await api[confirmation.method](confirmation.endpoint, confirmation.body);
  // Application approval and invitation creation are one server-side decision.
  if (/^\/users\/[^/]+\/approve$/.test(confirmation.endpoint) && result.role === 'volunteer') {
    const volunteers = await api.get('/volunteers');
    if (!volunteers.some((v) => v.email.toLowerCase() === result.email.toLowerCase())) await api.post('/volunteers', { name: result.name, email: result.email, phone: result.phone || '', role: 'Volunteer', org: result.org || '', skills: result.skills || [] });
  }
  return result;
}
