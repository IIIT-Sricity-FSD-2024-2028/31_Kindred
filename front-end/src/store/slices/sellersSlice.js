import { createRepositorySlice } from '../repositorySlice.js';

const sellersSlice = createRepositorySlice('sellers');
export const createSellers = sellersSlice.thunks.create;
export const fetchSellers = sellersSlice.thunks.read;
export const updateSellers = sellersSlice.thunks.update;
export const deleteSellers = sellersSlice.thunks.delete;
export const sellersThunks = sellersSlice.thunks;
export const sellersActions = sellersSlice.actions;
export default sellersSlice.reducer;
