import { expect, test } from '@playwright/test';

interface CollectionSpec {
  name: string;
  path: string;
  expectedCount: number;
  sampleSlug: string;
  sampleTitleIncludes: string;
}

const COLLECTIONS: CollectionSpec[] = [
  {
    name: 'posts',
    path: '/posts/',
    expectedCount: 8,
    sampleSlug: '/posts/20251221/',
    sampleTitleIncludes: '회고',
  },
  {
    name: 'notes',
    path: '/notes/',
    expectedCount: 3,
    sampleSlug: '/notes/2024-fp-js/',
    sampleTitleIncludes: '함수형',
  },
  {
    name: 'cs',
    path: '/cs/',
    expectedCount: 2,
    sampleSlug: '/cs/hash/',
    sampleTitleIncludes: 'Hash',
  },
  {
    name: 'log',
    path: '/log/',
    expectedCount: 2,
    sampleSlug: '/log/20240617/',
    sampleTitleIncludes: '유튜브',
  },
  {
    name: 'read-and-write',
    path: '/read-and-write/',
    expectedCount: 5,
    sampleSlug: '/read-and-write/251129/',
    sampleTitleIncludes: 'AI',
  },
];

for (const c of COLLECTIONS) {
  test.describe(c.name, () => {
    test(`list page renders ${c.expectedCount} entries`, async ({ page }) => {
      const response = await page.goto(c.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('main ul > li')).toHaveCount(c.expectedCount);
    });

    test('list page links to a known detail slug', async ({ page }) => {
      await page.goto(c.path);
      const link = page.locator(`main a[href="${c.sampleSlug}"]`);
      await expect(link).toHaveCount(1);
    });

    test('detail page renders the title in an h1', async ({ page }) => {
      const response = await page.goto(c.sampleSlug);
      expect(response?.status()).toBe(200);
      await expect(page.locator('article h1').first()).toContainText(c.sampleTitleIncludes);
    });
  });
}

test('header nav links to every collection', async ({ page }) => {
  await page.goto('/');
  for (const c of COLLECTIONS) {
    await expect(page.locator(`header a[href="${c.path}"]`)).toHaveCount(1);
  }
});
