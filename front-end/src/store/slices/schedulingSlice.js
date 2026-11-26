import { createRepositorySlice } from '../repositorySlice.js';

const schedulingSlice = createRepositorySlice('scheduling');
export const schedulingThunks = schedulingSlice.thunks;
export const schedulingActions = schedulingSlice.actions;
export default schedulingSlice.reducer;
