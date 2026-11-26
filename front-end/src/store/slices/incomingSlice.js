import { createRepositorySlice } from '../repositorySlice.js';

const incomingSlice = createRepositorySlice('incoming');
export const createIncoming = incomingSlice.thunks.create;
export const fetchIncoming = incomingSlice.thunks.read;
export const updateIncoming = incomingSlice.thunks.update;
export const deleteIncoming = incomingSlice.thunks.delete;
export const incomingThunks = incomingSlice.thunks;
export const incomingActions = incomingSlice.actions;
export default incomingSlice.reducer;
