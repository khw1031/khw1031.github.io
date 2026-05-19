import { describe, expect, it } from 'vitest';
import { coverLetter } from '../src/data/cover-letter';
import { cv } from '../src/data/cv';
import { portfolio } from '../src/data/portfolio';
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

  it('includes the 경력 사항 section as the first block', () => {
    const first = cv.sections[0];
    expect(first?.title).toBe('경력 사항');
    expect(first?.details.length).toBeGreaterThan(0);
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

describe('portfolio data', () => {
  it('parses with the document page schema', () => {
    expect(() => documentPageSchema.parse(portfolio)).not.toThrow();
  });

  it('hides contact info', () => {
    expect(portfolio.hideContact).toBe(true);
  });

  it('lists 주요 프로젝트 as the first section', () => {
    expect(portfolio.sections[0]?.title).toBe('주요 프로젝트');
  });
});
