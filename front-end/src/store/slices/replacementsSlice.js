import { createRepositorySlice } from '../repositorySlice.js';

const replacementsSlice = createRepositorySlice('replacements');
export const createReplacements = replacementsSlice.thunks.create;
export const fetchReplacements = replacementsSlice.thunks.read;
export const updateReplacements = replacementsSlice.thunks.update;
export const replacementsThunks = replacementsSlice.thunks;
export const replacementsActions = replacementsSlice.actions;
export default replacementsSlice.reducer;
