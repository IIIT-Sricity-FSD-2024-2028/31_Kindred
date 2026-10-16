import { defineConfig } from '@playwright/test';
import developmentConfig from './playwright.config.js';

export default defineConfig({
  ...developmentConfig,
  testDir: './tests/production',
  outputDir: './test-results/production',
  use: { ...developmentConfig.use, baseURL: 'http://127.0.0.1:4173' },
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
