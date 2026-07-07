import { expect, test } from '@playwright/test';

// `/wiki` is the OKF reference library: PUBLIC and SEARCHABLE (unlike /notes and
// /inbox). It is present in the sitemap, allowed in robots, and its bodies carry
// `data-pagefind-body`. Its entry point is the footer only (not the header nav),
// and it stays out of the blog timeline (home "Recent", RSS, tags).

test.describe('wiki (public, searchable reference library)', () => {
  test('landing is reachable and lists top-level categories only', async ({ page }) => {
    const response = await page.goto('/wiki/');
    expect(response?.status()).toBe(200);
    // Top-level category is listed…
    await expect(page.locator('main a[href="/wiki/learning-science/"]')).toHaveCount(1);
    // …but a leaf under it is NOT surfaced at the root (progressive disclosure).
    await expect(
      page.locator('main a[href="/wiki/learning-science/retrieval-practice/"]'),
    ).toHaveCount(0);
  });

  test('hub renders an immediate-children TOC and children resolve', async ({ page }) => {
    await page.goto('/wiki/learning-science/');
    const toc = page.locator('article nav[aria-label="하위 문서"]');
    await expect(toc.locator('a[href="/wiki/learning-science/retrieval-practice/"]')).toHaveCount(
      1,
    );
    await expect(toc.locator('a[href="/wiki/learning-science/spacing/"]')).toHaveCount(1);
    await expect(toc.locator('a[href="/wiki/learning-science/interleaving/"]')).toHaveCount(1);
    const response = await page.goto('/wiki/learning-science/retrieval-practice/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('article h1').first()).toContainText('Retrieval Practice');
  });

  test('doc bodies are marked searchable (data-pagefind-body)', async ({ page }) => {
    await page.goto('/wiki/learning-science/retrieval-practice/');
    await expect(page.locator('article[data-pagefind-body]')).toHaveCount(1);
  });

  test('footer links to /wiki/ but the header does not', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[href="/wiki/"]')).toHaveCount(1);
    await expect(page.locator('header a[href="/wiki/"]')).toHaveCount(0);
  });

  test('home recent list does not surface wiki (timeline scope)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main a[href^="/wiki/"]')).toHaveCount(0);
  });

  test('sitemap includes /wiki (public)', async ({ request }) => {
    const res = await request.get('/sitemap-0.xml');
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('/wiki/');
  });

  test('robots.txt does not disallow /wiki/', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    expect(await res.text()).not.toContain('Disallow: /wiki');
  });

  test('copy-markdown raw endpoint works for wiki, including nested docs', async ({
    page,
    request,
  }) => {
    for (const slug of ['/wiki/learning-science/', '/wiki/learning-science/retrieval-practice/']) {
      await page.goto(slug);
      await expect(page.locator(`a[data-copy-md][href="${slug}raw.md"]`)).toHaveCount(1);
      const res = await request.get(`${slug}raw.md`);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('text/markdown');
    }
  });
});
