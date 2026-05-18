export interface LegacyFrontmatter {
  title?: unknown;
  publishedAt?: unknown;
  updatedAt?: unknown;
  description?: unknown;
  summary?: unknown;
  wip?: unknown;
  lang?: unknown;
  tags?: unknown;
  [key: string]: unknown;
}

export interface NewFrontmatter {
  title: string;
  pubDate: string;
  updatedDate?: string;
  description?: string;
  summary?: string;
  draft?: boolean;
  lang?: string;
  tags?: string[];
}

function requireString(value: unknown, key: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`legacy frontmatter is missing ${key}`);
  }
  return value;
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function convertLegacyFrontmatter(legacy: LegacyFrontmatter): NewFrontmatter {
  const title = requireString(legacy.title, 'title');
  const pubDate = requireString(legacy.publishedAt, 'publishedAt');

  const out: NewFrontmatter = { title, pubDate };

  const updatedAt = nonEmptyString(legacy.updatedAt);
  if (updatedAt && updatedAt !== pubDate) {
    out.updatedDate = updatedAt;
  }

  const description = nonEmptyString(legacy.description);
  if (description) {
    out.description = description;
  }

  const summary = nonEmptyString(legacy.summary);
  if (summary) {
    out.summary = summary;
  }

  if (legacy.wip === true) {
    out.draft = true;
  }

  const lang = nonEmptyString(legacy.lang);
  if (lang) {
    out.lang = lang;
  }

  if (Array.isArray(legacy.tags) && legacy.tags.length > 0) {
    const tags = legacy.tags.filter((t): t is string => typeof t === 'string' && t.length > 0);
    if (tags.length > 0) {
      out.tags = tags;
    }
  }

  return out;
}
