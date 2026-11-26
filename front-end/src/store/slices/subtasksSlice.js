import { createRepositorySlice } from '../repositorySlice.js';

const subtasksSlice = createRepositorySlice('subtasks');
export const createSubtasks = subtasksSlice.thunks.create;
export const fetchSubtasks = subtasksSlice.thunks.read;
export const updateSubtasks = subtasksSlice.thunks.update;
export const deleteSubtasks = subtasksSlice.thunks.delete;
export const subtasksThunks = subtasksSlice.thunks;
export const subtasksActions = subtasksSlice.actions;
export default subtasksSlice.reducer;
