import { createSlice } from '@reduxjs/toolkit';
function storedRegistration() {
  try {
    const value = JSON.parse(sessionStorage.getItem('kindred_registration') || 'null');
    return value && typeof value === 'object' ? { verificationStatus: value.verificationStatus, approvalStatus: value.approvalStatus } : null;
  } catch { return null; }
}
function storedCards() {
  const cards = {};
  try {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key?.startsWith('kindred_react_cards:')) continue;
      const value = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(value)) cards[key.slice('kindred_react_cards:'.length)] = value.filter(card => card && typeof card === 'object' && !Array.isArray(card));
    }
  } catch { /* Preferences are optional; database records never come from here. */ }
  return cards;
}
const preferencesSlice = createSlice({
  name: 'preferences', initialState: { cards: storedCards(), navigation: {}, registration: storedRegistration() },
  reducers: {
    cardsSaved(state, action) { state.cards[action.payload.email] = action.payload.cards; },
    navigationSelected(state, action) { state.navigation[action.payload.key] = action.payload.selection; },
    registrationSaved(state, action) { state.registration = action.payload; },
  },
  extraReducers: builder => builder.addCase('auth/signedOut', state => { state.navigation = {}; }),
});
export const { cardsSaved, navigationSelected, registrationSaved } = preferencesSlice.actions;
export default preferencesSlice.reducer;
