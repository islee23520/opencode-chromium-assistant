import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ],
  retries: process.env.CI ? 2 : 0,
  outputDir: 'test-results',
  // Exclude Node-style unit test scripts that call process.exit() to avoid interfering with Playwright's runner
  testIgnore: ['**/*.test.js'],
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  globalSetup: require.resolve('./global-setup.js'),
  globalTeardown: require.resolve('./global-teardown.js'),
});