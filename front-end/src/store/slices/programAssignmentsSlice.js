import { createRepositorySlice } from '../repositorySlice.js';

const programAssignmentsSlice = createRepositorySlice('programAssignments');
export const createProgramAssignments = programAssignmentsSlice.thunks.create;
export const fetchProgramAssignments = programAssignmentsSlice.thunks.read;
export const updateProgramAssignments = programAssignmentsSlice.thunks.update;
export const deleteProgramAssignments = programAssignmentsSlice.thunks.delete;
export const programAssignmentsThunks = programAssignmentsSlice.thunks;
export const programAssignmentsActions = programAssignmentsSlice.actions;
export default programAssignmentsSlice.reducer;
