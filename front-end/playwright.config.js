import { defineConfig } from '@playwright/test';
import { browserLaunchOptions } from './scripts/browser.mjs';
const frontendUrl = process.env.KINDRED_TEST_FRONTEND_URL || 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results/development',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  expect: { timeout: 10000 },
  use: {
    baseURL: frontendUrl,
    browserName: 'chromium',
    launchOptions: browserLaunchOptions(),
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run dev -- --port ${new URL(frontendUrl).port}`,
    url: frontendUrl,
    reuseExistingServer: !process.env.CI && !process.env.KINDRED_TEST_API_URL,
    timeout: 30000,
    env: { VITE_API_BASE_URL: process.env.KINDRED_TEST_API_URL || 'http://localhost:3000' },
  },
});
