import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { readSession, writeSession, clearSession } from '../../services/session.js';

export const signIn = createAsyncThunk('auth/signIn', async (credentials, { extra, rejectWithValue }) => {
  try { return writeSession(await extra.api.post('/users/signin', credentials)); }
  catch (error) { return rejectWithValue(error.message); }
});
const authSlice = createSlice({
  name: 'auth', initialState: { session: readSession(), generation: 0, status: 'idle', error: null },
  reducers: {
    sessionChanged(state, action) { state.session = action.payload; state.generation++; },
    signedOut(state) { state.session = null; state.generation++; state.error = null; state.status = 'idle'; },
    sessionPatched(state, action) { if (state.session) state.session = { ...state.session, ...action.payload }; },
  },
  extraReducers: builder => builder
    .addCase(signIn.pending, state => { state.status = 'pending'; state.error = null; })
    .addCase(signIn.fulfilled, (state, action) => { state.session = action.payload; state.generation++; state.status = 'succeeded'; })
    .addCase(signIn.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || action.error.message; }),
});
export const { sessionChanged, signedOut, sessionPatched } = authSlice.actions;
export const signOut = () => dispatch => { clearSession(); dispatch(signedOut()); };
export const updateSession = patch => (dispatch, getState) => {
  const session = getState().auth.session;
  if (!session) return;
  const next = writeSession({ ...session, ...patch, id: session.id, role: session.role, status: session.status, authToken: session.authToken });
  dispatch(sessionPatched(next));
};
export default authSlice.reducer;
