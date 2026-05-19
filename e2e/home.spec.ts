import { expect, test } from '@playwright/test';

test('home renders content from src/copy/home.md', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  const main = page.locator('main');
  await expect(main).toBeVisible();
  await expect(main).not.toBeEmpty();
});
