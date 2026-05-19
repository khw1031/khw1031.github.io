import { describe, expect, it } from 'vitest';
import { baseFrontmatter, postSchema } from '../src/content/schemas';

describe('baseFrontmatter', () => {
  it('accepts minimal valid frontmatter and applies defaults', () => {
    const parsed = baseFrontmatter.parse({
      title: 'hello',
      pubDate: '2026-05-18',
    });
    expect(parsed.title).toBe('hello');
    expect(parsed.pubDate).toBeInstanceOf(Date);
    expect(parsed.draft).toBe(false);
    expect(parsed.lang).toBe('ko');
    expect(parsed.tags).toEqual([]);
  });

  it('rejects an empty title', () => {
    expect(() => baseFrontmatter.parse({ title: '', pubDate: '2026-05-18' })).toThrow();
  });

  it('rejects an invalid date', () => {
    expect(() => baseFrontmatter.parse({ title: 'x', pubDate: 'not-a-date' })).toThrow();
  });

  it('rejects an unknown language', () => {
    expect(() =>
      baseFrontmatter.parse({ title: 'x', pubDate: '2026-05-18', lang: 'fr' }),
    ).toThrow();
  });
});

describe('postSchema', () => {
  it('accepts a post with tags', () => {
    const parsed = postSchema.parse({
      title: 'post',
      pubDate: '2026-05-18',
      tags: ['ts', 'astro'],
    });
    expect(parsed.tags).toEqual(['ts', 'astro']);
  });

  it('rejects empty-string tags', () => {
    expect(() => postSchema.parse({ title: 'x', pubDate: '2026-05-18', tags: [''] })).toThrow();
  });
});
