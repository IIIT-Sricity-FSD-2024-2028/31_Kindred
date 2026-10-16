import { createApiClient } from './api.js';
import { readSession } from './session.js';

export const apiClient = createApiClient({ getSession: readSession });
export const authService = {
  signIn: ({ email, password, role }, options) => apiClient.post('/users/signin', { email, password, role }, options),
};
