import { createRepositorySlice } from '../repositorySlice.js';

const ordersSlice = createRepositorySlice('orders');
export const createOrders = ordersSlice.thunks.create;
export const fetchOrders = ordersSlice.thunks.read;
export const updateOrders = ordersSlice.thunks.update;
export const ordersThunks = ordersSlice.thunks;
export const ordersActions = ordersSlice.actions;
export default ordersSlice.reducer;
