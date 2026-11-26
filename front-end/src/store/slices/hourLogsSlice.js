import { createRepositorySlice } from '../repositorySlice.js';

const hourLogsSlice = createRepositorySlice('hourLogs');
export const createHourLogs = hourLogsSlice.thunks.create;
export const fetchHourLogs = hourLogsSlice.thunks.read;
export const updateHourLogs = hourLogsSlice.thunks.update;
export const deleteHourLogs = hourLogsSlice.thunks.delete;
export const hourLogsThunks = hourLogsSlice.thunks;
export const hourLogsActions = hourLogsSlice.actions;
export default hourLogsSlice.reducer;
