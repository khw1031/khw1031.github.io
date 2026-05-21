import { describe, expect, it } from 'vitest';
import { coverLetter } from '../src/data/cover-letter';
import { cv } from '../src/data/cv';
import { portfolio } from '../src/data/portfolio';
import { sideProjects } from '../src/data/side-projects';
import { detailContentSchema, detailSchema, documentPageSchema } from '../src/data/types';

describe('detailContentSchema', () => {
  it('accepts a title-only entry', () => {
    const parsed = detailContentSchema.parse({ title: '프론트엔드 부트캠프' });
    expect(parsed.title).toBe('프론트엔드 부트캠프');
    expect(parsed.description).toEqual([]);
  });

  it('accepts a description-only entry (legacy Keywords-less blocks)', () => {
    const parsed = detailContentSchema.parse({
      description: ['Swagger의 정보를 받아오는 MCP Server를 개발해서 오픈소스화'],
    });
    expect(parsed.description).toHaveLength(1);
  });

  it('rejects an empty entry with neither title nor description', () => {
    expect(() => detailContentSchema.parse({})).toThrow();
  });
});

describe('detailSchema', () => {
  it('requires a non-empty title', () => {
    expect(() => detailSchema.parse({ title: '', period: '2017' })).toThrow();
  });

  it('rejects an empty period when supplied', () => {
    expect(() => detailSchema.parse({ title: 'x', period: '' })).toThrow();
  });

  it('allows omitting period entirely (side-project use case)', () => {
    const parsed = detailSchema.parse({ title: 'ai-library', subtitle: 'oss tools' });
    expect(parsed.period).toBeUndefined();
    expect(parsed.subtitle).toBe('oss tools');
  });

  it('defaults content to an empty array', () => {
    const parsed = detailSchema.parse({ title: 'Udacity', period: '2016 (수료)' });
    expect(parsed.content).toEqual([]);
  });
});

describe('cv data', () => {
  it('parses with the document page schema', () => {
    expect(() => documentPageSchema.parse(cv)).not.toThrow();
  });

  it('uses the Builder title in the page and summary heading', () => {
    expect(cv.title).toBe('김현우 · AI Workflow & Developer Productivity Builder');
    expect(cv.sections[0]?.details[0]?.title).toBe('AI Workflow & Developer Productivity Builder');
  });

  it('starts with a summary section before career details', () => {
    expect(cv.sections[0]?.title).toBe('요약');
    expect(cv.sections[1]?.title).toBe('경력 사항');
  });

  it('includes the 경력 사항 section after summary', () => {
    const careers = cv.sections.find((s) => s.title === '경력 사항');
    expect(careers).toBeDefined();
    expect(careers?.details.length).toBeGreaterThan(0);
  });

  it('highlights recent AI workflow achievements in Hanssem career', () => {
    const careers = cv.sections.find((s) => s.title === '경력 사항');
    const hanssem = careers?.details.find((d) => d.title === '(주)한샘');
    const titles = hanssem?.content.map((item) => item.title) ?? [];
    expect(titles.slice(0, 3)).toEqual([
      'Feature Workflow Skill 설계 및 사내 표준화',
      'Hanssem AI Toolkit / Frontend AI Library 구축',
      '인테리어 플래너 AI 활용 개발',
    ]);
  });

  it('does not expose career move reasons in public cv data', () => {
    const careers = cv.sections.find((s) => s.title === '경력 사항');
    for (const d of careers?.details ?? []) {
      expect(d.ect).toBeUndefined();
    }
  });

  it('every detail in 경력 사항 has a period', () => {
    const careers = cv.sections.find((s) => s.title === '경력 사항');
    expect(careers).toBeDefined();
    for (const d of careers?.details ?? []) {
      expect(d.period).toBeTruthy();
    }
  });

  it('has technology keywords', () => {
    expect(cv.keywords.length).toBeGreaterThan(0);
  });
});

describe('cover-letter data', () => {
  it('parses with the document page schema', () => {
    expect(() => documentPageSchema.parse(coverLetter)).not.toThrow();
  });

  it('has at least 소개 and 핵심 역량 sections', () => {
    const titles = coverLetter.sections.map((s) => s.title);
    expect(titles).toContain('소개');
    expect(titles).toContain('핵심 역량');
  });
});

describe('side project data', () => {
  it('includes glowed as an open source developer tool project', () => {
    const glowed = sideProjects.find((project) => project.title === 'glowed');

    expect(glowed).toBeDefined();
    expect(glowed?.role).toBe('Open Source / Go TUI');
  });
});

describe('portfolio data', () => {
  it('parses with the document page schema', () => {
    expect(() => documentPageSchema.parse(portfolio)).not.toThrow();
  });

  it('hides contact info', () => {
    expect(portfolio.hideContact).toBe(true);
  });

  it('highlights AI workflow projects before legacy projects', () => {
    const projects = portfolio.sections[0]?.details.map((d) => d.title) ?? [];
    expect(projects.slice(0, 3)).toEqual([
      '인테리어 플래너 AI 활용 개발',
      'Feature Workflow Skill 설계 및 사내 표준화',
      'Hanssem AI Toolkit / Frontend AI Library 구축',
    ]);
  });
});
