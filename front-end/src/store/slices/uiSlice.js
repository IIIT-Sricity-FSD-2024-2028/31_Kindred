import { createSlice } from '@reduxjs/toolkit';
const uiSlice = createSlice({
  name: 'ui', initialState: { fields: {} },
  reducers: {
    fieldSet(state, action) { state.fields[action.payload.key] = action.payload.value; },
    fieldRemoved(state, action) { delete state.fields[action.payload]; },
  },
  extraReducers: builder => builder.addCase('auth/signedOut', () => ({ fields: {} })),
});
export const { fieldSet, fieldRemoved } = uiSlice.actions;
export default uiSlice.reducer;
