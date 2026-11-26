import { createRepositorySlice } from '../repositorySlice.js';

const resourceDonationsSlice = createRepositorySlice('resourceDonations');
export const createResourceDonations = resourceDonationsSlice.thunks.create;
export const fetchResourceDonations = resourceDonationsSlice.thunks.read;
export const updateResourceDonations = resourceDonationsSlice.thunks.update;
export const deleteResourceDonations = resourceDonationsSlice.thunks.delete;
export const resourceDonationsThunks = resourceDonationsSlice.thunks;
export const resourceDonationsActions = resourceDonationsSlice.actions;
export default resourceDonationsSlice.reducer;
