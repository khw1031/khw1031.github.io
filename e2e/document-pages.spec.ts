import { expect, test } from '@playwright/test';

interface DocSpec {
  path: string;
  h1Includes: string;
  expectsContact: boolean;
  sectionTitles: string[];
}

const DOCS: DocSpec[] = [
  {
    path: '/cv/',
    h1Includes: '김현우',
    expectsContact: true,
    sectionTitles: ['경력 사항', '주요 프로젝트', '사이드 프로젝트', '교육 사항'],
  },
];

test('every document page exposes a copy-markdown link', async ({ page }) => {
  for (const doc of DOCS) {
    await page.goto(doc.path);
    const expectedHref = `${doc.path.replace(/\/$/, '')}.md`;
    await expect(page.locator(`a[data-copy-md][href="${expectedHref}"]`)).toHaveCount(1);
  }
});

test('document raw markdown endpoint serves text/markdown', async ({ request }) => {
  for (const doc of DOCS) {
    const mdUrl = `${doc.path.replace(/\/$/, '')}.md`;
    const res = await request.get(mdUrl);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/markdown');
    const body = await res.text();
    expect(body).toContain('김현우');
  }
});

test('header exposes /cv/ as the umbrella entry', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header a[href="/cv/"]')).toHaveCount(1);
  await expect(page.locator('header a[href="/portfolio/"]')).toHaveCount(0);
  await expect(page.locator('header a[href="/cover-letter/"]')).toHaveCount(0);
});

test('removed /portfolio/ and /cover-letter/ pages 404', async ({ request }) => {
  for (const path of ['/portfolio/', '/cover-letter/']) {
    const res = await request.get(path);
    expect(res.status()).toBe(404);
  }
});

test('cv projects use the What/How/Impact structure in markdown export', async ({ request }) => {
  const res = await request.get('/cv.md');
  const body = await res.text();
  expect(body).toContain('#### What');
  expect(body).toContain('#### How');
  expect(body).toContain('#### Impact');
});

for (const doc of DOCS) {
  test.describe(doc.path, () => {
    test('renders 200 with the document heading', async ({ page }) => {
      const response = await page.goto(doc.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('main h1').first()).toContainText(doc.h1Includes);
    });

    test('renders every section heading', async ({ page }) => {
      await page.goto(doc.path);
      for (const title of doc.sectionTitles) {
        await expect(page.locator(`main h2:has-text("${title}")`)).toHaveCount(1);
      }
    });

    test('contact block follows the hideContact flag', async ({ page }) => {
      await page.goto(doc.path);
      const contact = page.locator('main a[href="mailto:khw1031@gmail.com"]');
      await expect(contact).toHaveCount(doc.expectsContact ? 1 : 0);
    });
  });
}
