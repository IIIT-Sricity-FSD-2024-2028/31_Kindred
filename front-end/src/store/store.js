import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { repositoryReducers } from './registry.js';
import auth from './slices/authSlice.js';
import ui from './slices/uiSlice.js';
import sync from './slices/syncSlice.js';
import { createApiClient } from '../services/api.js';
import preferences, { cardsSaved, navigationSelected, registrationSaved } from './slices/preferencesSlice.js';
import { bindReduxStorage } from '../services/storage.js';
import { resolveReferences } from './normalization.js';
import { isRepositoryAction, isConfirmedWrite } from './repositorySlice.js';
import { sessionScope } from './repositories.js';

export function createAppStore({ preloadedState, api } = {}) {
  let store;
  const client = api || createApiClient({ getSession: () => store?.getState().auth.session });
  const reduce = combineReducers({ ...repositoryReducers, auth, ui, sync, preferences });
  const broadcastConfirmedWrites = () => next => action => {
    const result = next(action);
    if (isConfirmedWrite(action)) {
      try { localStorage.setItem('kindred_data_revision', `${Date.now()}:${Math.random()}`); }
      catch { /* Focus refresh and polling still synchronize other tabs. */ }
    }
    return result;
  };
  store = configureStore({
    reducer: (state, action) => state && isRepositoryAction(action) && action.type.endsWith('/fulfilled') && action.payload.scope !== sessionScope(state) ? state : reduce(state, action), preloadedState,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: { extraArgument: { api: client } } }).concat(broadcastConfirmedWrites),
    devTools: import.meta.env?.DEV ?? true,
  });
  return store;
}
export const store = createAppStore();
const navigationRepositories = { kindred_edit_program: 'programs', kindred_last_program: 'programs', kindred_last_request: 'incoming', kindred_resource_program_request: 'fulfillment' };
bindReduxStorage({
  handles: key => key.startsWith('kindred_react_cards:') || key === 'kindred_registration' || Object.hasOwn(navigationRepositories, key),
  read: (key, fallback) => {
    if (key.startsWith('kindred_react_cards:')) return store.getState().preferences.cards[key.split(':')[1]] || fallback;
    if (key === 'kindred_registration') return store.getState().preferences.registration || fallback;
    const selection = store.getState().preferences.navigation[key];
    return selection ? resolveReferences({ $entity: selection.repository, id: selection.id }, store.getState()) || fallback : fallback;
  },
  write: (key, value, kind) => {
    if (key === 'kindred_registration') {
      store.dispatch(registrationSaved(value));
      try { globalThis[kind].setItem(key, JSON.stringify(value)); } catch { /* Keep Redux usable without storage. */ }
    } else if (key.startsWith('kindred_react_cards:')) {
      try { globalThis[kind].setItem(key, JSON.stringify(value)); }
      catch { return false; }
      store.dispatch(cardsSaved({ email: key.split(':')[1], cards: value }));
    } else store.dispatch(navigationSelected({ key, selection: value?.id ? { repository: navigationRepositories[key], id: value.id } : null }));
    return true;
  },
});
