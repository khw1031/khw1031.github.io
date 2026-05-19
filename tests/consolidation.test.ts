import { describe, expect, it } from 'vitest';
import { coverLetter } from '../src/data/cover-letter';
import { cv } from '../src/data/cv';
import { portfolio } from '../src/data/portfolio';
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

describe('portfolio uses the shared side-projects module', () => {
  it('renders the same number of side-project entries as the shared module', () => {
    const section = portfolio.sections.find((s) => s.title === '사이드 프로젝트');
    expect(section).toBeDefined();
    expect(section?.details).toHaveLength(sideProjects.length);
  });

  it('preserves each shared title and url in order', () => {
    const section = portfolio.sections.find((s) => s.title === '사이드 프로젝트');
    expect(section?.details.map((d) => d.title)).toEqual(sideProjects.map((p) => p.title));
    expect(section?.details.map((d) => d.url)).toEqual(sideProjects.map((p) => p.url));
  });
});

describe('cv side-projects renders as a skeleton', () => {
  it('lists the same titles as the shared module', () => {
    const section = cv.sections.find((s) => s.title === '사이드 프로젝트');
    expect(section?.details.map((d) => d.title)).toEqual(sideProjects.map((p) => p.title));
  });

  it('has no detail content (skeleton view)', () => {
    const section = cv.sections.find((s) => s.title === '사이드 프로젝트');
    for (const d of section?.details ?? []) {
      expect(d.content).toEqual([]);
    }
  });
});

describe('cover-letter still parses cleanly after consolidation', () => {
  it('keeps its first section intact', () => {
    expect(coverLetter.sections[0]?.title).toBe('소개');
  });
});
