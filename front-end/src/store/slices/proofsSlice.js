import { createRepositorySlice } from '../repositorySlice.js';

const proofsSlice = createRepositorySlice('proofs');
export const createProofs = proofsSlice.thunks.create;
export const fetchProofs = proofsSlice.thunks.read;
export const updateProofs = proofsSlice.thunks.update;
export const proofsThunks = proofsSlice.thunks;
export const proofsActions = proofsSlice.actions;
export default proofsSlice.reducer;
