import { createSlice } from '@reduxjs/toolkit';
import { isConfirmedWrite } from '../repositorySlice.js';
const syncSlice = createSlice({
  name: 'sync', initialState: { revision: 0 },
  reducers: { refreshRequested(state) { state.revision++; } },
  extraReducers: builder => builder.addMatcher(isConfirmedWrite, state => { state.revision++; }),
});
export const { refreshRequested } = syncSlice.actions;
export default syncSlice.reducer;
