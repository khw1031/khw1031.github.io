import { expect, test } from '@playwright/test';

test.describe('capture logs', () => {
  test('logs landing exposes the capture-log entry point', async ({ page }) => {
    const response = await page.goto('/logs/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('main a[href="/logs/capture/"]')).toHaveCount(1);
  });

  test('capture-log index is reachable by direct URL', async ({ page }) => {
    const response = await page.goto('/logs/capture/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h2')).toHaveText('Capture logs');
  });
});
