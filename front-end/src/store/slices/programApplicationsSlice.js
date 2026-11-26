import { createRepositorySlice } from '../repositorySlice.js';

const programApplicationsSlice = createRepositorySlice('programApplications');
export const createProgramApplications = programApplicationsSlice.thunks.create;
export const fetchProgramApplications = programApplicationsSlice.thunks.read;
export const updateProgramApplications = programApplicationsSlice.thunks.update;
export const deleteProgramApplications = programApplicationsSlice.thunks.delete;
export const programApplicationsThunks = programApplicationsSlice.thunks;
export const programApplicationsActions = programApplicationsSlice.actions;
export default programApplicationsSlice.reducer;
