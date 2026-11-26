// Mirrors back-end/src/common/repositories/definitions.ts, including aggregate repositories.
export const repositoryDefinitions = {
  scheduling: { service: 'SchedulingService', endpoint: null, crud: [] },
  participation: { service: 'ParticipationService', endpoint: '/participation', crud: ['read', 'create', 'update'] },
  users: { service: 'UsersService', endpoint: '/users', crud: ['create', 'read', 'update', 'delete'] },
  organizations: { service: 'OrganizationsService', endpoint: '/organizations', crud: ['create', 'read', 'update', 'delete'] },
  volunteers: { service: 'VolunteersService', endpoint: '/volunteers', crud: ['create', 'read', 'update', 'delete'] },
  programs: { service: 'ProgramsService', endpoint: '/programs', crud: ['create', 'read', 'update', 'delete'] },
  requests: { service: 'RequestsService', endpoint: '/requests', crud: ['create', 'read', 'update', 'delete'] },
  incoming: { service: 'IncomingService', endpoint: '/incoming', crud: ['create', 'read', 'update', 'delete'] },
  tasks: { service: 'TasksService', endpoint: '/tasks', crud: ['create', 'read', 'update', 'delete'] },
  hourLogs: { service: 'HourLogsService', endpoint: '/hour-logs', crud: ['create', 'read', 'update', 'delete'] },
  resourceDonations: { service: 'ResourceDonationsService', endpoint: '/resource-donations', crud: ['create', 'read', 'update', 'delete'] },
  programAssignments: { service: 'ProgramAssignmentsService', endpoint: '/program-assignments', crud: ['create', 'read', 'update', 'delete'] },
  programApplications: { service: 'ProgramApplicationsService', endpoint: '/program-applications', crud: ['create', 'read', 'update', 'delete'] },
  subtasks: { service: 'SubtasksService', endpoint: '/subtasks', crud: ['create', 'read', 'update', 'delete'] },
  sellers: { service: 'SellersService', endpoint: '/sellers', crud: ['create', 'read', 'update', 'delete'] },
  products: { service: 'ProductsService', endpoint: '/products', crud: ['create', 'read', 'update', 'delete'] },
  orders: { service: 'OrdersService', endpoint: '/orders', crud: ['create', 'read', 'update'] },
  donations: { service: 'DonationsService', endpoint: '/donations', crud: ['create', 'read', 'update'] },
  notifications: { service: 'NotificationsService', endpoint: '/notifications', crud: ['create', 'read', 'update'] },
  replacements: { service: 'ReplacementsService', endpoint: '/replacements', crud: ['create', 'read', 'update'] },
  volunteerRequests: { service: 'VolunteerRequestsService', endpoint: '/volunteer-requests', crud: ['create', 'read', 'update', 'delete'] },
  fulfillment: { service: 'FulfillmentService', endpoint: '/fulfillment', crud: ['create', 'read', 'update'] },
  proofs: { service: 'ProofStore', endpoint: '/proofs', crud: ['create', 'read', 'update'] },
};
export function repositoryForPath(path) {
  const root = '/' + path.replace(/^\//, '').split(/[/?]/)[0];
  const entry = Object.entries(repositoryDefinitions).find(([, value]) => value.endpoint === root);
  if (!entry) throw new Error(`No repository is registered for ${root}`);
  return entry[0];
}
export const sessionScope = state => JSON.stringify([state.auth.generation, state.auth.session?.id, state.auth.session?.role, state.auth.session?.org]);

export function operationPath(repository, operation, arg = {}) {
  if (arg.path) return arg.path;
  const base = repositoryDefinitions[repository].endpoint;
  if (!base) throw new Error(`${repository} is internal; its state is changed by domain workflows.`);
  const id = arg.id == null ? null : encodeURIComponent(arg.id);
  if (repository === 'participation') {
    if (operation === 'read' && !arg.id) return '/participation/candidates';
    if (!id) throw new Error('Provide a program/membership id or an explicit participation path.');
    return operation === 'read' ? `${base}/programs/${id}/workspace`
      : operation === 'create' ? `${base}/programs/${id}/${arg.action || 'messages'}`
      : `${base}/memberships/${id}/${arg.action || 'withdraw'}`;
  }
  if (repository === 'fulfillment') return operation === 'update' ? `${base}/deliveries/${id}/action` : `${base}/deliveries`;
  if (operation === 'update') {
    if (!id) throw new Error(`Provide the ${repository} record id.`);
    const suffix = { notifications: 'read', donations: 'issue-certificate', orders: arg.action || 'delivery-status', replacements: arg.action || 'status', volunteerRequests: arg.action || 'status', incoming: arg.action, proofs: arg.decision || arg.action }[repository];
    if (['incoming', 'proofs'].includes(repository) && !suffix) throw new Error(`Provide the supported ${repository} action.`);
    if (suffix) return `${base}/${id}/${suffix}`;
  }
  return id ? `${base}/${id}` : base;
}
