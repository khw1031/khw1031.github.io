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
    expect(ld.datePublished).toBe('2025-01-15T00:00:00.000Z');
    expect(ld.dateModified).toBe('2025-01-15T00:00:00.000Z');
  });

  it('uses updatedDate for dateModified when provided', () => {
    const ld = blogPostingJsonLd({
      title: 'Hello',
      pubDate: new Date('2025-01-15'),
      updatedDate: new Date('2025-02-01'),
      url: 'https://khw1031.github.io/posts/hello/',
      siteUrl: SITE,
    });
    expect(ld.dateModified).toBe('2025-02-01T00:00:00.000Z');
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
