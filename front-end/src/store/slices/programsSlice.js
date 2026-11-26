import { createRepositorySlice } from '../repositorySlice.js';

const programsSlice = createRepositorySlice('programs');
export const createPrograms = programsSlice.thunks.create;
export const fetchPrograms = programsSlice.thunks.read;
export const updatePrograms = programsSlice.thunks.update;
export const deletePrograms = programsSlice.thunks.delete;
export const programsThunks = programsSlice.thunks;
export const programsActions = programsSlice.actions;
export default programsSlice.reducer;
