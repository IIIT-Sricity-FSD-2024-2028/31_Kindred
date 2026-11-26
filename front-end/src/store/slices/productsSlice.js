import { createRepositorySlice } from '../repositorySlice.js';

const productsSlice = createRepositorySlice('products');
export const createProducts = productsSlice.thunks.create;
export const fetchProducts = productsSlice.thunks.read;
export const updateProducts = productsSlice.thunks.update;
export const deleteProducts = productsSlice.thunks.delete;
export const productsThunks = productsSlice.thunks;
export const productsActions = productsSlice.actions;
export default productsSlice.reducer;
