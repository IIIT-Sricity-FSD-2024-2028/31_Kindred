import { createRepositorySlice } from '../repositorySlice.js';

const donationsSlice = createRepositorySlice('donations');
export const createDonations = donationsSlice.thunks.create;
export const fetchDonations = donationsSlice.thunks.read;
export const updateDonations = donationsSlice.thunks.update;
export const donationsThunks = donationsSlice.thunks;
export const donationsActions = donationsSlice.actions;
export default donationsSlice.reducer;
