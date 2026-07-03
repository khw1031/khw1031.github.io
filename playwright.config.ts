import { defineConfig, devices } from '@playwright/test';

const host = process.env.PLAYWRIGHT_HOST ?? '127.0.0.1';
const port = Number(process.env.PLAYWRIGHT_PORT ?? 4321);
const baseURL = `http://${host}:${port}`;
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === '1' && !process.env.CI;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `pnpm preview --host ${host} --port ${port}`,
    url: baseURL,
    reuseExistingServer,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
