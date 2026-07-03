import { expect, type Page, test } from '@playwright/test';

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
    expectedCount: 5,
    sampleSlug: '/posts/20251210/',
    sampleTitleIncludes: 'Agentic',
  },
  {
    name: 'read-and-write',
    path: '/read-and-write/',
    expectedCount: 5,
    sampleSlug: '/read-and-write/251129/',
    sampleTitleIncludes: 'AI',
  },
];

const readCanvasPixels = async (page: Page, selector: string) =>
  await page.locator(selector).evaluate((node) => {
    const canvas = node as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return { width: canvas.width, height: canvas.height, sampled: 0, changed: 0 };

    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    let sampled = 0;
    let changed = 0;
    const step = Math.max(1, Math.floor(Math.min(width, height) / 80));

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const offset = (y * width + x) * 4;
        sampled += 1;
        if ((pixels[offset + 3] ?? 0) > 0) changed += 1;
      }
    }

    return { width, height, sampled, changed };
  });

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

test('post detail pages expose copy-markdown link + raw md endpoint', async ({ page, request }) => {
  for (const c of COLLECTIONS) {
    await page.goto(c.sampleSlug);
    const expectedMd = `${c.sampleSlug.replace(/\/$/, '')}/raw.md`;
    await expect(page.locator(`a[data-copy-md][href="${expectedMd}"]`)).toHaveCount(1);
    const res = await request.get(expectedMd);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/markdown');
  }
});

test('read and write list page renders the generated hero at the top', async ({ page }) => {
  await page.goto('/read-and-write/');

  const firstSection = page.locator('main section').first();
  await expect(firstSection.locator('.read-write-three-hero')).toHaveCount(1);
  await expect(page.locator('.read-write-three-hero')).toHaveAttribute(
    'data-background',
    'transparent',
  );
  await expect(page.locator('.read-write-three-canvas')).toBeVisible();
  await page.waitForTimeout(250);

  const screenshot = await page.locator('.read-write-three-canvas').screenshot();
  expect(screenshot.byteLength).toBeGreaterThan(1200);

  const pixels = await readCanvasPixels(page, '.read-write-three-canvas');
  expect(pixels.width).toBeGreaterThan(0);
  expect(pixels.height).toBeGreaterThan(0);
  expect(pixels.sampled).toBeGreaterThan(0);
  expect(pixels.changed).toBeGreaterThan(40);
});

test('posts list page renders the generated hero at the top', async ({ page }) => {
  await page.goto('/posts/');

  const firstSection = page.locator('main section').first();
  await expect(firstSection.locator('.posts-job-work-time-three-hero')).toHaveCount(1);
  await expect(page.locator('.posts-job-work-time-three-hero')).toHaveAttribute(
    'data-background',
    'transparent',
  );
  await expect(page.locator('.posts-job-work-time-three-canvas')).toBeVisible();
  await page.waitForTimeout(250);

  const screenshot = await page.locator('.posts-job-work-time-three-canvas').screenshot();
  expect(screenshot.byteLength).toBeGreaterThan(1200);

  const pixels = await readCanvasPixels(page, '.posts-job-work-time-three-canvas');
  expect(pixels.width).toBeGreaterThan(0);
  expect(pixels.height).toBeGreaterThan(0);
  expect(pixels.sampled).toBeGreaterThan(0);
  expect(pixels.changed).toBeGreaterThan(40);
});
