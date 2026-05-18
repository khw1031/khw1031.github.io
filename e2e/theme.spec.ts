import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'light' });

test('theme toggle flips data-theme and persists across reloads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  const toggle = page.getByRole('button', { name: /toggle color theme/i });
  await toggle.click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('initial theme follows system preference when nothing is stored', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await ctx.close();
});
