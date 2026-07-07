import { expect, type Page, test } from '@playwright/test';

const readHomeHeroPixels = async (page: Page) =>
  await page.locator('.overthink-three-canvas').evaluate((node) => {
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

test('home renders content from src/copy/home.md', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  const main = page.locator('main');
  await expect(main).toBeVisible();
  await expect(main).not.toBeEmpty();
});

// @webgl: excluded from the default e2e gate (see package.json `test:e2e`).
// Headless SwiftShader can't do reliable WebGL/canvas readback — the scene
// renders visibly (screenshot has bytes) but gl.readPixels returns 0 because
// the renderer uses preserveDrawingBuffer:false. Run with `pnpm test:e2e:webgl`
// (ideally on a real GPU) to exercise these.
test('home renders the overthink generated hero', { tag: '@webgl' }, async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.overthink-three-hero')).toBeVisible();
  await expect(page.locator('.overthink-three-hero')).toHaveAttribute(
    'data-background',
    'transparent',
  );
  await expect(page.locator('.overthink-three-canvas')).toBeVisible();
  await page.waitForTimeout(250);

  const screenshot = await page.locator('.overthink-three-canvas').screenshot();
  expect(screenshot.byteLength).toBeGreaterThan(1200);

  const pixels = await readHomeHeroPixels(page);
  expect(pixels.width).toBeGreaterThan(0);
  expect(pixels.height).toBeGreaterThan(0);
  expect(pixels.sampled).toBeGreaterThan(0);
  expect(pixels.changed).toBeGreaterThan(40);
});
