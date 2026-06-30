import { describe, expect, it } from 'vitest';
import { cv } from '../src/data/cv';
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
  it('rejects an empty title when supplied', () => {
    expect(() => detailSchema.parse({ title: '', period: '2017' })).toThrow();
  });

  it('allows omitting title entirely (untitled detail use case)', () => {
    const parsed = detailSchema.parse({ subtitle: '프로필 요약' });
    expect(parsed.title).toBeUndefined();
    expect(parsed.subtitle).toBe('프로필 요약');
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

  it('uses the name as the page title without a profile section', () => {
    expect(cv.title).toBe('김현우');
    expect(cv.sections.map((section) => section.title)).not.toContain('프로필');
  });

  it('starts with career details without a key achievements section', () => {
    expect(cv.sections[0]?.title).toBe('경력 사항');
    expect(cv.sections.map((section) => section.title)).not.toContain('핵심 성과');
  });

  it('includes the 경력 사항 section with Hanssem as the first career', () => {
    const careers = cv.sections.find((s) => s.title === '경력 사항');
    expect(careers).toBeDefined();
    expect(careers?.details[0]?.title).toBe('(주)한샘');
  });

  it('keeps career histories as company, role, and period entries only', () => {
    const careers = cv.sections.find((s) => s.title === '경력 사항');
    for (const d of careers?.details ?? []) {
      expect(d.title).toBeTruthy();
      expect(d.role).toBeTruthy();
      expect(d.period).toBeTruthy();
      expect(d.content).toEqual([]);
    }
  });

  it('includes the current career history with roles and insurance record periods', () => {
    const careers = cv.sections.find((s) => s.title === '경력 사항');
    const histories =
      careers?.details.map(({ title, role, period }) => ({ title, role, period })) ?? [];
    expect(histories).toEqual([
      { title: '(주)한샘', role: '프론트엔드 개발자', period: '2023.02.01 — 재직중' },
      { title: '슈퍼메이커즈', role: '프론트엔드 개발자', period: '2021.12.20 — 2022.12.31' },
      { title: '(주)한화생명', role: '프론트엔드 개발자', period: '2021.01.18 — 2021.12.25' },
      { title: '인프랩', role: '프론트엔드 개발자', period: '2018.10.01 — 2020.04.01' },
      { title: '텀블벅', role: '프론트엔드 개발자', period: '2017.07.03 — 2018.04.07' },
      { title: '현대엘엔씨(구 - 한화L&C)', role: '재무팀', period: '2014.07.01 — 2016.05.31' },
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

  it('has a 주요 프로젝트 section using the What/How/Impact structure', () => {
    const projects = cv.sections.find((s) => s.title === '주요 프로젝트');
    expect(projects).toBeDefined();
    expect(projects?.details.length).toBeGreaterThan(0);
    for (const d of projects?.details ?? []) {
      const titles = d.content.map((c) => c.title);
      expect(titles).toEqual(['What', 'How', 'Impact']);
    }
  });
});

describe('side project data', () => {
  it('includes glowed as an open source developer tool project', () => {
    const glowed = sideProjects.find((project) => project.title === 'glowed');

    expect(glowed).toBeDefined();
    expect(glowed?.role).toBe('Open Source / Go TUI');
  });
});
