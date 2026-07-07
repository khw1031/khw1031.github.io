import { expect, type Page, test } from '@playwright/test';

const setRange = async (page: Page, selector: string, value: string) => {
  await page.locator(selector).evaluate((input, nextValue) => {
    const range = input as HTMLInputElement;
    range.value = nextValue;
    range.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
};

const uploadSvg = async (page: Page, svg: string, name = 'sample.svg') => {
  await page.locator('#file-input').setInputFiles({
    name,
    mimeType: 'image/svg+xml',
    buffer: Buffer.from(svg),
  });
  await expect(page.locator('#download-image')).toBeEnabled();
  await expect(page.locator('#pixel-canvas')).toBeVisible();
};

const samplePixel = async (page: Page, x: number, y: number) =>
  await page.locator('#pixel-canvas').evaluate(
    (node, point) => {
      const canvas = node as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Missing canvas context.');

      const pixel = context.getImageData(point.x, point.y, 1, 1).data;
      return [pixel[0], pixel[1], pixel[2], pixel[3]];
    },
    { x, y },
  );

const strokeCanvas = async (page: Page, xRatio: number, yRatio: number) => {
  const box = await page.locator('#pixel-canvas').boundingBox();
  if (!box) throw new Error('Missing canvas box.');

  const x = box.x + box.width * xRatio;
  const y = box.y + box.height * yRatio;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.up();
};

const rightClickCanvas = async (page: Page, xRatio: number, yRatio: number) => {
  const box = await page.locator('#pixel-canvas').boundingBox();
  if (!box) throw new Error('Missing canvas box.');

  const x = box.x + box.width * xRatio;
  const y = box.y + box.height * yRatio;
  await page.mouse.click(x, y, { button: 'right' });
};

const contextMenuIsPrevented = async (page: Page, xRatio: number, yRatio: number) => {
  const box = await page.locator('#pixel-canvas').boundingBox();
  if (!box) throw new Error('Missing canvas box.');

  return await page.locator('#pixel-canvas').evaluate(
    (node, point) => {
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        button: 2,
        cancelable: true,
        clientX: point.x,
        clientY: point.y,
      });

      node.dispatchEvent(event);
      return event.defaultPrevented;
    },
    {
      x: box.x + box.width * xRatio,
      y: box.y + box.height * yRatio,
    },
  );
};

const readWebglCanvasPixels = async (page: Page, selector: string, paper = [246, 247, 242]) =>
  await page.locator(selector).evaluate((node, paperColor) => {
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
    const background = paperColor;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const offset = (y * width + x) * 4;
        const alpha = pixels[offset + 3] ?? 0;
        const red = pixels[offset] ?? 0;
        const green = pixels[offset + 1] ?? 0;
        const blue = pixels[offset + 2] ?? 0;
        const distance =
          Math.abs(red - background[0]) +
          Math.abs(green - background[1]) +
          Math.abs(blue - background[2]);

        sampled += 1;
        if (alpha > 0 && distance > 24) changed += 1;
      }
    }

    return { width, height, sampled, changed };
  }, paper);

const readThreeCanvasPixels = async (page: Page, paper = [246, 247, 242]) =>
  await readWebglCanvasPixels(page, '#three-scene', paper);

const read2dCanvasStats = async (page: Page, selector: string) =>
  await page.locator(selector).evaluate((node) => {
    const canvas = node as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) {
      return { width: canvas.width, height: canvas.height, sampled: 0, changed: 0, unique: 0 };
    }

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const first = [pixels[0] ?? 0, pixels[1] ?? 0, pixels[2] ?? 0];
    const colors = new Set<string>();
    let sampled = 0;
    let changed = 0;
    const step = Math.max(1, Math.floor(Math.min(canvas.width, canvas.height) / 80));

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const offset = (y * canvas.width + x) * 4;
        const red = pixels[offset] ?? 0;
        const green = pixels[offset + 1] ?? 0;
        const blue = pixels[offset + 2] ?? 0;
        const alpha = pixels[offset + 3] ?? 0;
        const distance =
          Math.abs(red - first[0]) + Math.abs(green - first[1]) + Math.abs(blue - first[2]);

        sampled += 1;
        if (alpha > 0 && distance > 20) changed += 1;
        colors.add(`${red >> 4}:${green >> 4}:${blue >> 4}:${alpha >> 6}`);
      }
    }

    return { width: canvas.width, height: canvas.height, sampled, changed, unique: colors.size };
  });

test('pixelate lab uploads an image and renders pixel blocks', async ({ page }) => {
  await page.goto('/labs/pixelate/');

  await expect(page.locator('main h1')).toContainText('Pixelate');
  await expect(page.locator('#download-image')).toBeDisabled();

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">',
    '<rect width="4" height="8" fill="#ff0000"/>',
    '<rect x="4" width="4" height="8" fill="#0000ff"/>',
    '</svg>',
  ].join('');

  await uploadSvg(page, svg, 'split.svg');
  await setRange(page, '#block-size', '2');

  await expect(page.locator('#pixel-canvas')).toHaveJSProperty('width', 8);
  await expect(page.locator('#pixel-canvas')).toHaveJSProperty('height', 8);
  await expect(page.locator('#download-image')).toBeEnabled();
  await expect(page.locator('#pixelate-status')).toContainText('split · 8x8 · block 2px');

  const left = await samplePixel(page, 1, 1);
  const right = await samplePixel(page, 6, 1);

  expect(left[0]).toBeGreaterThan(200);
  expect(left[2]).toBeLessThan(60);
  expect(right[2]).toBeGreaterThan(200);
  expect(right[0]).toBeLessThan(60);
});

test('pixelate lab starts uploaded images without pixel art conversion', async ({ page }) => {
  await page.goto('/labs/pixelate/');

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">',
    '<rect width="8" height="8" fill="#ffffff"/>',
    '<rect x="3" y="3" width="1" height="1" fill="#000000"/>',
    '</svg>',
  ].join('');

  await uploadSvg(page, svg, 'raw.svg');
  await expect(page.locator('#block-size')).toHaveValue('1');
  await expect(page.locator('#pixelate-status')).toContainText('block 1px');

  const detail = await samplePixel(page, 3, 3);
  const neighbor = await samplePixel(page, 4, 3);

  expect(detail[0]).toBeLessThan(40);
  expect(neighbor[0]).toBeGreaterThan(220);
});

test('pixelate lab keeps the canvas hit area aligned for tall images', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 760 });
  await page.goto('/labs/pixelate/');

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="64" viewBox="0 0 4 64">',
    '<rect width="4" height="64" fill="#ffffff"/>',
    '<rect y="32" width="4" height="32" fill="#000000"/>',
    '</svg>',
  ].join('');

  await uploadSvg(page, svg, 'tall.svg');

  const box = await page.locator('#pixel-canvas').boundingBox();
  if (!box) throw new Error('Missing canvas box.');

  const intrinsic = await page.locator('#pixel-canvas').evaluate((node) => {
    const canvas = node as HTMLCanvasElement;
    return { width: canvas.width, height: canvas.height };
  });

  expect(Math.abs(box.width / box.height - intrinsic.width / intrinsic.height)).toBeLessThan(0.01);
});

test('pixelate lab applies color filters to the rendered canvas', async ({ page }) => {
  await page.goto('/labs/pixelate/');

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">',
    '<rect width="8" height="8" fill="#ff0000"/>',
    '</svg>',
  ].join('');

  await uploadSvg(page, svg, 'red.svg');
  const before = await samplePixel(page, 2, 2);

  await setRange(page, '#brightness', '0.5');
  const after = await samplePixel(page, 2, 2);

  expect(before[0]).toBeGreaterThan(220);
  expect(after[0]).toBeLessThan(before[0]);
  expect(after[0]).toBeLessThan(160);
});

test('pixelate lab changes dither mode through segmented controls', async ({ page }) => {
  await page.goto('/labs/pixelate/');

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">',
    '<linearGradient id="g" x1="0" x2="1">',
    '<stop offset="0" stop-color="#000000"/>',
    '<stop offset="1" stop-color="#ffffff"/>',
    '</linearGradient>',
    '<rect width="16" height="16" fill="url(#g)"/>',
    '</svg>',
  ].join('');

  await uploadSvg(page, svg, 'gradient.svg');
  await setRange(page, '#block-size', '8');
  await expect(page.locator('#pixelate-status')).toContainText('dither bayer');

  for (const mode of ['blue-noise', 'atkinson', 'floyd', 'random', 'none']) {
    await page.locator(`input[name="dither"][value="${mode}"]`).check();
    await expect(page.locator('#pixelate-status')).toContainText(`dither ${mode}`);
  }
});

test('pixelate lab changes palette method through segmented controls', async ({ page }) => {
  await page.goto('/labs/pixelate/');

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">',
    '<rect width="8" height="8" fill="#ff0000"/>',
    '<rect x="8" width="8" height="8" fill="#00ff00"/>',
    '<rect y="8" width="8" height="8" fill="#0000ff"/>',
    '<rect x="8" y="8" width="8" height="8" fill="#ffffff"/>',
    '</svg>',
  ].join('');

  await uploadSvg(page, svg, 'palette.svg');
  await setRange(page, '#block-size', '4');

  await expect(page.locator('#pixelate-status')).toContainText('palette median');

  await page.locator('input[name="palette-mode"][value="octree"]').check();
  await expect(page.locator('#pixelate-status')).toContainText('palette octree');
});

test('pixelate lab paints before pixelating without scaling old strokes too aggressively', async ({
  page,
}) => {
  await page.goto('/labs/pixelate/');
  await page.locator('input[name="dither"][value="none"]').check();
  await page.locator('#paint-color').evaluate((input) => {
    (input as HTMLInputElement).value = '#00ff00';
  });

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">',
    '<rect width="16" height="16" fill="#ffffff"/>',
    '</svg>',
  ].join('');

  await uploadSvg(page, svg, 'white.svg');
  await setRange(page, '#block-size', '4');
  await strokeCanvas(page, 0.55, 0.55);

  await expect(page.locator('#pixelate-status')).toContainText('1 stroke');
  await expect(page.locator('#undo-stroke')).toBeEnabled();

  const painted = await samplePixel(page, 8, 8);
  expect(painted[1]).toBeGreaterThan(170);
  expect(painted[0]).toBeLessThan(120);

  const outsideInitialCell = await samplePixel(page, 13, 13);
  expect(outsideInitialCell[0]).toBeGreaterThan(230);
  expect(outsideInitialCell[1]).toBeGreaterThan(230);

  await setRange(page, '#block-size', '8');
  const repixelatedPaint = await samplePixel(page, 13, 13);
  expect(repixelatedPaint[1]).toBeGreaterThan(170);
  expect(repixelatedPaint[0]).toBeLessThan(outsideInitialCell[0]);
  expect(repixelatedPaint[0]).toBeGreaterThan(painted[0]);

  await setRange(page, '#block-size', '4');

  await page.locator('#undo-stroke').click();
  const undone = await samplePixel(page, 8, 8);
  expect(undone[0]).toBeGreaterThan(230);
  expect(undone[1]).toBeGreaterThan(230);

  await page.locator('#redo-stroke').click();
  const redone = await samplePixel(page, 8, 8);
  expect(redone[1]).toBeGreaterThan(170);
  expect(redone[0]).toBeLessThan(120);
});

test('pixelate lab ignores right clicks on the canvas', async ({ page }) => {
  await page.goto('/labs/pixelate/');
  await page.locator('#paint-color').evaluate((input) => {
    (input as HTMLInputElement).value = '#00ff00';
  });

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">',
    '<rect width="16" height="16" fill="#ffffff"/>',
    '</svg>',
  ].join('');

  await uploadSvg(page, svg, 'right-click.svg');
  await rightClickCanvas(page, 0.55, 0.55);

  await expect(page.locator('#pixelate-status')).toContainText('0 strokes');
  await expect(page.locator('#undo-stroke')).toBeDisabled();
  expect(await contextMenuIsPrevented(page, 0.55, 0.55)).toBe(false);

  const pixel = await samplePixel(page, 8, 8);
  expect(pixel[0]).toBeGreaterThan(230);
  expect(pixel[1]).toBeGreaterThan(230);
  expect(pixel[2]).toBeGreaterThan(230);
});

test('labs index links to the pixelate lab', async ({ page }) => {
  await page.goto('/labs/');

  await expect(page.locator('main a[href="/labs/pixelate/"]')).toHaveCount(1);
});

test('labs index links to the game of life lab', async ({ page }) => {
  await page.goto('/labs/');

  await expect(page.locator('main a[href="/labs/game-of-life/"]')).toHaveCount(1);
});

test('labs index links to the apt lab', async ({ page }) => {
  await page.goto('/labs/');

  const link = page.locator('main a[href="/labs/apt/"]');
  await expect(link).toHaveCount(1);
  await expect(link).toContainText('edward hopper apt');
});

test('apt index links to apt.1', async ({ page }) => {
  await page.goto('/labs/apt/');

  const link = page.locator('main a[href="/labs/apt/1/"]');
  await expect(link).toHaveCount(1);
  await expect(link).toContainText('apt.1');
});

// @webgl: excluded from the default e2e gate (see package.json `test:e2e`).
// These generative canvas/Three.js scene tests are unreliable in headless
// SwiftShader — WebGL readback returns 0 (preserveDrawingBuffer:false) and the
// scenes drift; run with `pnpm test:e2e:webgl`. (apt.1 is a 2D canvas but is
// grouped here as the same generative-scene class.)
test('apt.1 renders a nonblank apartment scene', { tag: '@webgl' }, async ({ page }) => {
  await page.goto('/labs/apt/1/');

  await expect(page.locator('main h1')).toContainText('apt.1');
  await expect(page.locator('#apt-canvas')).toBeVisible();
  await expect(page.locator('#apt-canvas')).toHaveAttribute('data-rendered', /^(true|fallback)$/);
  await expect(page.locator('.apt-workbench form')).toHaveCount(0);
  await expect(page.locator('.apt-workbench input')).toHaveCount(0);

  const stats = await read2dCanvasStats(page, '#apt-canvas');
  expect(stats.width).toBe(900);
  expect(stats.height).toBe(1200);
  expect(stats.sampled).toBeGreaterThan(0);
  expect(stats.changed).toBeGreaterThan(600);
  expect(stats.unique).toBeGreaterThan(16);
});

test('apt.1 keeps a vertical apartment-photo composition', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 760 });
  await page.goto('/labs/apt/1/');

  const box = await page.locator('#apt-canvas').boundingBox();
  if (!box) throw new Error('Missing apt canvas box.');

  expect(box.height / box.width).toBeGreaterThan(1.25);
  expect(box.y + box.height).toBeLessThanOrEqual(760);
});

test('game of life lab renders a Three.js simulation and steps a blinker', {
  tag: '@webgl',
}, async ({ page }) => {
  await page.goto('/labs/game-of-life/');

  await expect(page.locator('main h1')).toContainText('Game of Life');
  await expect(page.locator('#life-scene')).toBeVisible();
  await expect(page.locator('#life-edge')).toContainText('edge dead');

  const stageBox = await page.locator('.life-stage').boundingBox();
  const edgeBox = await page.locator('#life-edge').boundingBox();
  if (!stageBox || !edgeBox) throw new Error('Missing life stage or readout box.');
  expect(edgeBox.y + edgeBox.height).toBeLessThanOrEqual(stageBox.y);
  expect(stageBox.x + stageBox.width - (edgeBox.x + edgeBox.width)).toBeLessThan(24);

  await page.locator('#life-pattern').selectOption('blinker');
  await expect(page.locator('#life-generation')).toContainText('generation 0');
  await expect(page.locator('#life-population')).toContainText('population 3');

  await page.locator('#life-step').click();
  await expect(page.locator('#life-generation')).toContainText('generation 1');
  await expect(page.locator('#life-population')).toContainText('population 3');

  await page.locator('#life-toggle').click();
  await expect(page.locator('#life-toggle-label')).toContainText('pause');
  await expect
    .poll(async () => Number(await page.locator('.life-stage').getAttribute('data-generation')))
    .toBeGreaterThan(1);
  await page.locator('#life-toggle').click();
  await expect(page.locator('#life-toggle-label')).toContainText('run');
});

test('game of life canvas is nonblank across viewports', { tag: '@webgl' }, async ({ page }) => {
  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/labs/game-of-life/');
    await expect(page.locator('#life-scene')).toBeVisible();
    await page.waitForFunction(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('#life-scene');
      return Boolean(canvas && canvas.width > 0 && canvas.height > 0);
    });
    await page.waitForTimeout(250);

    const screenshot = await page.locator('#life-scene').screenshot();
    expect(screenshot.byteLength).toBeGreaterThan(1200);

    const pixels = await readWebglCanvasPixels(page, '#life-scene', [247, 247, 242]);
    expect(pixels.width).toBeGreaterThan(0);
    expect(pixels.height).toBeGreaterThan(0);
    expect(pixels.sampled).toBeGreaterThan(0);
    expect(pixels.changed).toBeGreaterThan(40);
  }
});

test('patterns index links to the read and write pattern', async ({ page }) => {
  await page.goto('/labs/patterns/');

  const link = page.locator('main a[href="/labs/patterns/read-write/"]');
  await expect(link).toHaveCount(1);
  await expect(link).toContainText('read & write');
});

test('patterns index links to the failed trial constellation pattern', async ({ page }) => {
  await page.goto('/labs/patterns/');

  const link = page.locator('main a[href="/labs/patterns/failed-trial-constellation/"]');
  await expect(link).toHaveCount(1);
  await expect(link).toContainText('failed trial constellation');
});

test('patterns index links to the http pattern', async ({ page }) => {
  await page.goto('/labs/patterns/');

  const link = page.locator('main a[href="/labs/patterns/http/"]');
  await expect(link).toHaveCount(1);
  await expect(link).toContainText('http');
});

test('http pattern page renders protocol gate controls', { tag: '@webgl' }, async ({ page }) => {
  await page.goto('/labs/patterns/http/');

  await expect(page.locator('main h1')).toContainText('http');
  await expect(page.locator('#three-scene')).toBeVisible();
  await expect(page.locator('.formula-option')).toHaveCount(1);
  await expect(page.locator('#formula-caption')).toContainText('검은 gate');

  await page.waitForFunction(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#three-scene');
    return Boolean(canvas && canvas.width > 0 && canvas.height > 0);
  });
});

test('http pattern canvas is nonblank across viewports', { tag: '@webgl' }, async ({ page }) => {
  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/labs/patterns/http/');
    await expect(page.locator('#three-scene')).toBeVisible();
    await page.waitForTimeout(250);

    const screenshot = await page.locator('#three-scene').screenshot();
    expect(screenshot.byteLength).toBeGreaterThan(1200);

    const pixels = await readThreeCanvasPixels(page, [247, 248, 244]);
    expect(pixels.width).toBeGreaterThan(0);
    expect(pixels.height).toBeGreaterThan(0);
    expect(pixels.sampled).toBeGreaterThan(0);
    expect(pixels.changed).toBeGreaterThan(40);
  }
});

test('read and write pattern page renders formula controls', { tag: '@webgl' }, async ({
  page,
}) => {
  await page.goto('/labs/patterns/read-write/');

  await expect(page.locator('main h1')).toContainText('read & write');
  await expect(page.locator('#three-scene')).toBeVisible();
  await expect(page.locator('.formula-option')).toHaveCount(2);
  await expect(page.locator('#formula-caption')).toContainText('청록 리본은 읽기 입력');

  await page.waitForFunction(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#three-scene');
    return Boolean(canvas && canvas.width > 0 && canvas.height > 0);
  });
});

test('read and write pattern canvas is nonblank across viewports', { tag: '@webgl' }, async ({
  page,
}) => {
  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/labs/patterns/read-write/');
    await expect(page.locator('#three-scene')).toBeVisible();
    await page.waitForTimeout(250);

    const screenshot = await page.locator('#three-scene').screenshot();
    expect(screenshot.byteLength).toBeGreaterThan(1200);

    const pixels = await readThreeCanvasPixels(page);
    expect(pixels.width).toBeGreaterThan(0);
    expect(pixels.height).toBeGreaterThan(0);
    expect(pixels.sampled).toBeGreaterThan(0);
    expect(pixels.changed).toBeGreaterThan(40);
  }
});

test('failed trial constellation pattern page renders formula controls', { tag: '@webgl' }, async ({
  page,
}) => {
  await page.goto('/labs/patterns/failed-trial-constellation/');

  await expect(page.locator('main h1')).toContainText('failed trial constellation');
  await expect(page.locator('#three-scene')).toBeVisible();
  await expect(page.locator('.formula-option')).toHaveCount(2);
  await expect(page.locator('#formula-caption')).toContainText('청록 표면은 측정 잔차');

  await page.waitForFunction(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#three-scene');
    return Boolean(canvas && canvas.width > 0 && canvas.height > 0);
  });
});

test('failed trial constellation pattern canvas is nonblank across viewports', {
  tag: '@webgl',
}, async ({ page }) => {
  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/labs/patterns/failed-trial-constellation/');
    await expect(page.locator('#three-scene')).toBeVisible();
    await page.waitForTimeout(250);

    const screenshot = await page.locator('#three-scene').screenshot();
    expect(screenshot.byteLength).toBeGreaterThan(1200);

    const pixels = await readThreeCanvasPixels(page, [248, 247, 241]);
    expect(pixels.width).toBeGreaterThan(0);
    expect(pixels.height).toBeGreaterThan(0);
    expect(pixels.sampled).toBeGreaterThan(0);
    expect(pixels.changed).toBeGreaterThan(40);
  }
});
