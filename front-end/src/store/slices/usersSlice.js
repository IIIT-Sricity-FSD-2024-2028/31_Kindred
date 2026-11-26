import { createRepositorySlice } from '../repositorySlice.js';

const usersSlice = createRepositorySlice('users');
export const createUsers = usersSlice.thunks.create;
export const fetchUsers = usersSlice.thunks.read;
export const updateUsers = usersSlice.thunks.update;
export const deleteUsers = usersSlice.thunks.delete;
export const usersThunks = usersSlice.thunks;
export const usersActions = usersSlice.actions;
export default usersSlice.reducer;
