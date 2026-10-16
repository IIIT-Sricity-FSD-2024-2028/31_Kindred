import { defineConfig } from '@playwright/test';
import { browserLaunchOptions } from './scripts/browser.mjs';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results/development',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    browserName: 'chromium',
    launchOptions: browserLaunchOptions(),
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
