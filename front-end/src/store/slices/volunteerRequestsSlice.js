import { createRepositorySlice } from '../repositorySlice.js';

const volunteerRequestsSlice = createRepositorySlice('volunteerRequests');
export const createVolunteerRequests = volunteerRequestsSlice.thunks.create;
export const fetchVolunteerRequests = volunteerRequestsSlice.thunks.read;
export const deleteVolunteerRequests = volunteerRequestsSlice.thunks.delete;
export const updateVolunteerRequests = volunteerRequestsSlice.thunks.update;
export const volunteerRequestsThunks = volunteerRequestsSlice.thunks;
export const volunteerRequestsActions = volunteerRequestsSlice.actions;
export default volunteerRequestsSlice.reducer;
