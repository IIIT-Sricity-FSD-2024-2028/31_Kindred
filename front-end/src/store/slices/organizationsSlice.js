import { createRepositorySlice } from '../repositorySlice.js';

const organizationsSlice = createRepositorySlice('organizations');
export const createOrganizations = organizationsSlice.thunks.create;
export const fetchOrganizations = organizationsSlice.thunks.read;
export const updateOrganizations = organizationsSlice.thunks.update;
export const deleteOrganizations = organizationsSlice.thunks.delete;
export const organizationsThunks = organizationsSlice.thunks;
export const organizationsActions = organizationsSlice.actions;
export default organizationsSlice.reducer;
