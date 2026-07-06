import { expect, test } from '@playwright/test';

// `/notes` is a private, URL-only collection: accessible by direct URL but
// intentionally absent from navigation, RSS, sitemap, and robots.txt.

test.describe('notes (private route)', () => {
  test('list page is reachable by direct URL', async ({ page }) => {
    const response = await page.goto('/notes/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('article, main')).toBeVisible();
  });

  test('detail page is reachable by direct URL and renders title', async ({ page }) => {
    const response = await page.goto('/notes/web-worker/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('article h1').first()).toContainText('Web Worker');
  });

  test('hub page renders child notes as a TOC and children resolve', async ({ page }) => {
    await page.goto('/notes/browser-page-load/');
    const tocLink = page.locator(
      'article nav[aria-label="하위 문서"] a[href="/notes/browser-page-load/dns-resolution/"]',
    );
    await expect(tocLink).toHaveCount(1);
    const response = await page.goto('/notes/browser-page-load/dns-resolution/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('article h1').first()).toContainText('DNS Resolution');
  });

  test('list page shows hubs and standalone notes but not children', async ({ page }) => {
    await page.goto('/notes/');
    await expect(page.locator('main a[href="/notes/browser-page-load/"]')).toHaveCount(1);
    await expect(
      page.locator('main a[href="/notes/browser-page-load/dns-resolution/"]'),
    ).toHaveCount(0);
  });

  test('header nav does not link to /notes/', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header a[href="/notes/"]')).toHaveCount(0);
  });

  test('home recent list does not surface notes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main a[href^="/notes/"]')).toHaveCount(0);
  });

  test('sitemap excludes /notes', async ({ request }) => {
    const res = await request.get('/sitemap-0.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).not.toContain('/notes');
  });

  test('robots.txt disallows /notes/ for all agents', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('Disallow: /notes/');
  });

  test('copy-markdown raw endpoint works for notes, including nested notes', async ({
    page,
    request,
  }) => {
    for (const slug of ['/notes/browser-page-load/', '/notes/browser-page-load/dns-resolution/']) {
      await page.goto(slug);
      await expect(page.locator(`a[data-copy-md][href="${slug}raw.md"]`)).toHaveCount(1);
      const res = await request.get(`${slug}raw.md`);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('text/markdown');
    }
  });
});
