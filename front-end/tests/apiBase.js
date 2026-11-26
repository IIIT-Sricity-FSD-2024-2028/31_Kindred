// Allows the entire browser suite to use an isolated real database/server.
export const API_BASE = process.env.KINDRED_TEST_API_URL || 'http://localhost:3000';
export const FRONTEND_BASE = process.env.KINDRED_TEST_FRONTEND_URL || 'http://127.0.0.1:5173';
