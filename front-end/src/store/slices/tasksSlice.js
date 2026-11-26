import { createRepositorySlice } from '../repositorySlice.js';

const tasksSlice = createRepositorySlice('tasks');
export const createTasks = tasksSlice.thunks.create;
export const fetchTasks = tasksSlice.thunks.read;
export const updateTasks = tasksSlice.thunks.update;
export const deleteTasks = tasksSlice.thunks.delete;
export const tasksThunks = tasksSlice.thunks;
export const tasksActions = tasksSlice.actions;
export default tasksSlice.reducer;
