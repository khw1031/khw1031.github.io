import { describe, expect, it } from 'vitest';
import { blogPostingJsonLd, personJsonLd, websiteJsonLd } from '../src/lib/jsonld';

const SITE = 'https://khw1031.github.io/';

describe('personJsonLd', () => {
  it('emits a Person schema with sameAs', () => {
    const ld = personJsonLd({ siteUrl: SITE });
    expect(ld['@type']).toBe('Person');
    expect(ld.url).toBe(SITE);
    expect(Array.isArray(ld.sameAs)).toBe(true);
  });
});

describe('websiteJsonLd', () => {
  it('emits a WebSite schema with korean language', () => {
    const ld = websiteJsonLd({ siteUrl: SITE });
    expect(ld['@type']).toBe('WebSite');
    expect(ld.inLanguage).toBe('ko');
  });
});

describe('blogPostingJsonLd', () => {
  it('emits a BlogPosting schema with ISO dates', () => {
    const ld = blogPostingJsonLd({
      title: 'Hello',
      pubDate: new Date('2025-01-15'),
      url: 'https://khw1031.github.io/posts/hello/',
      siteUrl: SITE,
    });
    expect(ld['@type']).toBe('BlogPosting');
    expect(ld.headline).toBe('Hello');
    // KST offset (+09:00), not toISOString()'s UTC — 2025-01-15T00:00:00Z is
    // 2025-01-15 09:00 in KST, so the calendar date matches the page's
    // formatDate() rendering instead of drifting a day on the UTC side.
    expect(ld.datePublished).toBe('2025-01-15T09:00:00+09:00');
    expect(ld.dateModified).toBe('2025-01-15T09:00:00+09:00');
  });

  it('uses updatedDate for dateModified when provided', () => {
    const ld = blogPostingJsonLd({
      title: 'Hello',
      pubDate: new Date('2025-01-15'),
      updatedDate: new Date('2025-02-01'),
      url: 'https://khw1031.github.io/posts/hello/',
      siteUrl: SITE,
    });
    expect(ld.dateModified).toBe('2025-02-01T09:00:00+09:00');
  });

  it('omits description when empty', () => {
    const ld = blogPostingJsonLd({
      title: 'Hello',
      pubDate: new Date('2025-01-15'),
      url: 'https://khw1031.github.io/posts/hello/',
      siteUrl: SITE,
    });
    expect('description' in ld).toBe(false);
  });

  it('includes description when provided', () => {
    const ld = blogPostingJsonLd({
      title: 'Hello',
      description: 'A short summary',
      pubDate: new Date('2025-01-15'),
      url: 'https://khw1031.github.io/posts/hello/',
      siteUrl: SITE,
    });
    expect(ld.description).toBe('A short summary');
  });
});
