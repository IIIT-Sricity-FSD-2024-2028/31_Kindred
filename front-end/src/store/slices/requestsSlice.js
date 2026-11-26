import { createRepositorySlice } from '../repositorySlice.js';

const requestsSlice = createRepositorySlice('requests');
export const fetchRequests = requestsSlice.thunks.read;
export const createRequests = requestsSlice.thunks.create;
export const deleteRequests = requestsSlice.thunks.delete;
export const updateRequests = requestsSlice.thunks.update;
export const requestsThunks = requestsSlice.thunks;
export const requestsActions = requestsSlice.actions;
export default requestsSlice.reducer;
