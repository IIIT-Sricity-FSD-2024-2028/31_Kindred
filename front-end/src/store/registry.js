import schedulingReducer, { schedulingThunks } from './slices/schedulingSlice.js';
import participationReducer, { participationThunks } from './slices/participationSlice.js';
import usersReducer, { usersThunks } from './slices/usersSlice.js';
import organizationsReducer, { organizationsThunks } from './slices/organizationsSlice.js';
import volunteersReducer, { volunteersThunks } from './slices/volunteersSlice.js';
import programsReducer, { programsThunks } from './slices/programsSlice.js';
import requestsReducer, { requestsThunks } from './slices/requestsSlice.js';
import incomingReducer, { incomingThunks } from './slices/incomingSlice.js';
import tasksReducer, { tasksThunks } from './slices/tasksSlice.js';
import hourLogsReducer, { hourLogsThunks } from './slices/hourLogsSlice.js';
import resourceDonationsReducer, { resourceDonationsThunks } from './slices/resourceDonationsSlice.js';
import programAssignmentsReducer, { programAssignmentsThunks } from './slices/programAssignmentsSlice.js';
import programApplicationsReducer, { programApplicationsThunks } from './slices/programApplicationsSlice.js';
import subtasksReducer, { subtasksThunks } from './slices/subtasksSlice.js';
import sellersReducer, { sellersThunks } from './slices/sellersSlice.js';
import productsReducer, { productsThunks } from './slices/productsSlice.js';
import ordersReducer, { ordersThunks } from './slices/ordersSlice.js';
import donationsReducer, { donationsThunks } from './slices/donationsSlice.js';
import notificationsReducer, { notificationsThunks } from './slices/notificationsSlice.js';
import replacementsReducer, { replacementsThunks } from './slices/replacementsSlice.js';
import volunteerRequestsReducer, { volunteerRequestsThunks } from './slices/volunteerRequestsSlice.js';
import fulfillmentReducer, { fulfillmentThunks } from './slices/fulfillmentSlice.js';
import proofsReducer, { proofsThunks } from './slices/proofsSlice.js';

export const repositoryReducers = {
  scheduling: schedulingReducer,
  participation: participationReducer,
  users: usersReducer,
  organizations: organizationsReducer,
  volunteers: volunteersReducer,
  programs: programsReducer,
  requests: requestsReducer,
  incoming: incomingReducer,
  tasks: tasksReducer,
  hourLogs: hourLogsReducer,
  resourceDonations: resourceDonationsReducer,
  programAssignments: programAssignmentsReducer,
  programApplications: programApplicationsReducer,
  subtasks: subtasksReducer,
  sellers: sellersReducer,
  products: productsReducer,
  orders: ordersReducer,
  donations: donationsReducer,
  notifications: notificationsReducer,
  replacements: replacementsReducer,
  volunteerRequests: volunteerRequestsReducer,
  fulfillment: fulfillmentReducer,
  proofs: proofsReducer,
};
export const repositoryThunks = {
  scheduling: schedulingThunks,
  participation: participationThunks,
  users: usersThunks,
  organizations: organizationsThunks,
  volunteers: volunteersThunks,
  programs: programsThunks,
  requests: requestsThunks,
  incoming: incomingThunks,
  tasks: tasksThunks,
  hourLogs: hourLogsThunks,
  resourceDonations: resourceDonationsThunks,
  programAssignments: programAssignmentsThunks,
  programApplications: programApplicationsThunks,
  subtasks: subtasksThunks,
  sellers: sellersThunks,
  products: productsThunks,
  orders: ordersThunks,
  donations: donationsThunks,
  notifications: notificationsThunks,
  replacements: replacementsThunks,
  volunteerRequests: volunteerRequestsThunks,
  fulfillment: fulfillmentThunks,
  proofs: proofsThunks,
};
