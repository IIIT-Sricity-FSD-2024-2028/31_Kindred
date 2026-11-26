import { createRepositorySlice } from '../repositorySlice.js';

const fulfillmentSlice = createRepositorySlice('fulfillment');
export const createFulfillment = fulfillmentSlice.thunks.create;
export const fetchFulfillment = fulfillmentSlice.thunks.read;
export const updateFulfillment = fulfillmentSlice.thunks.update;
export const fulfillmentThunks = fulfillmentSlice.thunks;
export const fulfillmentActions = fulfillmentSlice.actions;
export default fulfillmentSlice.reducer;
