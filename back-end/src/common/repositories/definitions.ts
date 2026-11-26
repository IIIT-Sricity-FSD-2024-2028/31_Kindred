// One persistent repository per existing domain service (aggregate).
export const repositoryDefinitions = {
  scheduling: 'SchedulingService', participation: 'ParticipationService', users: 'UsersService',
  organizations: 'OrganizationsService', volunteers: 'VolunteersService', programs: 'ProgramsService',
  requests: 'RequestsService', incoming: 'IncomingService', tasks: 'TasksService', hourLogs: 'HourLogsService',
  resourceDonations: 'ResourceDonationsService', programAssignments: 'ProgramAssignmentsService',
  programApplications: 'ProgramApplicationsService', subtasks: 'SubtasksService', sellers: 'SellersService',
  products: 'ProductsService', orders: 'OrdersService', donations: 'DonationsService',
  notifications: 'NotificationsService', replacements: 'ReplacementsService',
  volunteerRequests: 'VolunteerRequestsService', fulfillment: 'FulfillmentService', proofs: 'ProofStore',
} as const;
