const hints = {
  organizations: 'organizations', organization: 'organizations', programs: 'programs', program: 'programs',
  volunteer: 'volunteers', volunteers: 'volunteers', candidates: 'volunteers', profile: 'volunteers',
  membership: 'programAssignments', assignments: 'programAssignments', members: 'programAssignments',
  application: 'programApplications', applications: 'programApplications', tasks: 'tasks', subtasks: 'subtasks',
  hours: 'hourLogs', donations: 'donations', orders: 'orders', replacements: 'replacements',
  deliveries: 'fulfillment', inventory: 'fulfillment', requests: 'fulfillment', resources: 'resourceDonations',
  products: 'products', sellers: 'sellers', users: 'users', messages: 'participation',
};
const contextual = new Set(['eligible', 'eligibility', 'reasons', 'warnings', 'conflicts', 'available', 'blockers', 'reviewedVersion']);

export function normalizeResponse(data, owner, path) {
  const records = {}, snapshots = {};
  const initial = /\/candidates(?:\?|$)|\/fulfillment\/volunteers/.test(path) ? 'volunteers'
    : /\/program-assignments\/my-programs/.test(path) ? 'programs'
    : /\/volunteers\/me\/profile/.test(path) ? 'users' : owner;
  // These endpoints return contextual projections rather than complete records.
  const projection = /\/(?:candidates|options|catalog|brief|workspace|addresses|plan|balance)(?:\/|\?|$)|\/fulfillment\/volunteers|\/volunteers\/me\/profile|\/donations\/public\//.test(path);
  function visit(value, repository, envelope = false, root = false) {
    if (Array.isArray(value)) return value.map(item => visit(item, repository, envelope, root));
    if (!value || typeof value !== 'object') return value;
    const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, visit(item, hints[key] || repository, ['people', 'history', 'items', 'allocations'].includes(key))]));
    if (!envelope && value.id != null && !value.authToken && !('program' in value) && !('data' in value)) {
      const id = String(value.id), entity = {}, overlay = {};
      for (const [key, item] of Object.entries(result)) (contextual.has(key) ? overlay : entity)[key] = item;
      (records[repository] ||= {})[id] = { ...records[repository]?.[id], ...entity };
      if (root && !projection) (snapshots[repository] ||= []).push(id);
      return { $entity: repository, id, ...(Object.keys(overlay).length ? { overlay } : {}) };
    }
    return result;
  }
  return { records, snapshots, result: visit(data, initial, false, true) };
}

export function resolveReferences(value, state) {
  if (Array.isArray(value)) return value.map(item => resolveReferences(item, state));
  if (!value || typeof value !== 'object') return value;
  if (value.$entity) {
    const entity = state[value.$entity]?.entities[value.id];
    return entity ? resolveReferences({ ...entity, ...value.overlay }, state) : null;
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveReferences(item, state)]));
}
