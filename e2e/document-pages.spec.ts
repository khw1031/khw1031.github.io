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
    sectionTitles: ['경력 사항', '사이드 프로젝트', '교육 사항'],
  },
  {
    path: '/cover-letter/',
    h1Includes: '김현우',
    expectsContact: true,
    sectionTitles: ['소개', '성장 과정', '핵심 역량'],
  },
  {
    path: '/portfolio/',
    h1Includes: '김현우',
    expectsContact: false,
    sectionTitles: ['주요 프로젝트', '사이드 프로젝트'],
  },
];

test('header exposes /cv/ as the umbrella entry', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header a[href="/cv/"]')).toHaveCount(1);
  await expect(page.locator('header a[href="/portfolio/"]')).toHaveCount(0);
  await expect(page.locator('header a[href="/cover-letter/"]')).toHaveCount(0);
});

test('/cv/ cross-links out to /portfolio/ and /cover-letter/', async ({ page }) => {
  await page.goto('/cv/');
  await expect(page.locator('main aside a[href="/portfolio/"]')).toHaveCount(1);
  await expect(page.locator('main aside a[href="/cover-letter/"]')).toHaveCount(1);
});

test('/cv/ side-project skeleton items link to /portfolio/', async ({ page }) => {
  await page.goto('/cv/');
  await expect(
    page.locator('main section:has(h2:has-text("사이드 프로젝트")) a[href="/portfolio/"]'),
  ).toHaveCount(4);
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
