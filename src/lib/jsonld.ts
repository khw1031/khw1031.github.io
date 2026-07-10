import { toKSTISOString } from './kst';

export interface PersonInput {
  siteUrl: string;
}

export interface WebSiteInput {
  siteUrl: string;
}

export interface BlogPostingInput {
  title: string;
  description?: string;
  pubDate: Date;
  updatedDate?: Date;
  url: string;
  siteUrl: string;
}

const PERSON_NAME = 'khw1031';
const PERSON_URL_SAMEAS = ['https://github.com/khw1031'];

export function personJsonLd(input: PersonInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON_NAME,
    url: input.siteUrl,
    sameAs: PERSON_URL_SAMEAS,
  };
}

export function websiteJsonLd(input: WebSiteInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'thnkr',
    url: input.siteUrl,
    inLanguage: 'ko',
  };
}

export function blogPostingJsonLd(input: BlogPostingInput): Record<string, unknown> {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    datePublished: toKSTISOString(input.pubDate),
    dateModified: toKSTISOString(input.updatedDate ?? input.pubDate),
    url: input.url,
    inLanguage: 'ko',
    author: {
      '@type': 'Person',
      name: PERSON_NAME,
      url: input.siteUrl,
    },
  };
  if (input.description) {
    ld.description = input.description;
  }
  return ld;
}
