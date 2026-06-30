import { describe, expect, it } from 'vitest';
import { cv } from '../src/data/cv';
import { sideProjects } from '../src/data/side-projects';

describe('side-projects shared module', () => {
  it('has at least 4 entries', () => {
    expect(sideProjects.length).toBeGreaterThanOrEqual(4);
  });

  it('every entry has a url so cv can link out to it', () => {
    for (const p of sideProjects) {
      expect(p.url).toBeTruthy();
    }
  });
});

describe('cv renders the full side-projects module (not a skeleton)', () => {
  it('renders the same number of side-project entries as the shared module', () => {
    const section = cv.sections.find((s) => s.title === '사이드 프로젝트');
    expect(section).toBeDefined();
    expect(section?.details).toHaveLength(sideProjects.length);
  });

  it('preserves each shared title and url in order', () => {
    const section = cv.sections.find((s) => s.title === '사이드 프로젝트');
    expect(section?.details.map((d) => d.title)).toEqual(sideProjects.map((p) => p.title));
    expect(section?.details.map((d) => d.url)).toEqual(sideProjects.map((p) => p.url));
  });

  it('keeps full detail content (no skeleton view)', () => {
    const section = cv.sections.find((s) => s.title === '사이드 프로젝트');
    for (const d of section?.details ?? []) {
      expect(d.content.length).toBeGreaterThan(0);
    }
  });
});
