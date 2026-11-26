import { createRepositorySlice } from '../repositorySlice.js';

const participationSlice = createRepositorySlice('participation');
export const createParticipation = participationSlice.thunks.create;
export const fetchParticipation = participationSlice.thunks.read;
export const updateParticipation = participationSlice.thunks.update;
export const participationThunks = participationSlice.thunks;
export const participationActions = participationSlice.actions;
export default participationSlice.reducer;
