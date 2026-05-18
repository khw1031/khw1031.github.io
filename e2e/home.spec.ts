import { expect, test } from '@playwright/test';

test('home renders the site heading', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('khw1031');
});
