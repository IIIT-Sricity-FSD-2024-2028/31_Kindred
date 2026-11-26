import { createRepositorySlice } from '../repositorySlice.js';

const notificationsSlice = createRepositorySlice('notifications');
export const createNotifications = notificationsSlice.thunks.create;
export const fetchNotifications = notificationsSlice.thunks.read;
export const updateNotifications = notificationsSlice.thunks.update;
export const notificationsThunks = notificationsSlice.thunks;
export const notificationsActions = notificationsSlice.actions;
export default notificationsSlice.reducer;
