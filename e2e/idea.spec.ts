import { expect, test } from '@playwright/test';

// `/idea` is an unlisted route like `/notes` and `/specs` (URL-only, absent from
// the search index, sitemap, and robots) with one extra rule: unlike those, it
// is NOT linked in the footer either — reachable only by a direct URL. These
// checks are content-independent, so they hold even before any idea is authored.

test.describe('idea (unlisted route)', () => {
  test('/idea/ TOC is reachable and links to developed ideas and the inbox', async ({ page }) => {
    const res = await page.goto('/idea/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('main a[href="/idea/inbox/"]')).toHaveCount(1);
    await expect(page.locator('main a[href="/idea/mcp-for-apis-agents/"]')).toHaveCount(1);
  });

  test('/idea/inbox/ TOC is reachable', async ({ page }) => {
    const res = await page.goto('/idea/inbox/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('main a[href="/idea/"]')).toHaveCount(1);
  });

  test('sitemap excludes /idea', async ({ request }) => {
    const res = await request.get('/sitemap-0.xml');
    expect(res.status()).toBe(200);
    expect(await res.text()).not.toContain('/idea');
  });

  test('robots.txt disallows /idea/ for all agents', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('Disallow: /idea/');
  });

  test('footer does not link to /idea/', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[href="/idea/"]')).toHaveCount(0);
  });

  test('header nav does not link to /idea/', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header a[href="/idea/"]')).toHaveCount(0);
  });

  test('home recent list does not surface idea', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main a[href^="/idea/"]')).toHaveCount(0);
  });
});
