import { createRepositorySlice } from '../repositorySlice.js';

const volunteersSlice = createRepositorySlice('volunteers');
export const createVolunteers = volunteersSlice.thunks.create;
export const fetchVolunteers = volunteersSlice.thunks.read;
export const updateVolunteers = volunteersSlice.thunks.update;
export const deleteVolunteers = volunteersSlice.thunks.delete;
export const volunteersThunks = volunteersSlice.thunks;
export const volunteersActions = volunteersSlice.actions;
export default volunteersSlice.reducer;
