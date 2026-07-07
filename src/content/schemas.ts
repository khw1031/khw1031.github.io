import { z } from 'zod';

const isoDate = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v : new Date(v)))
  .refine((d) => !Number.isNaN(d.getTime()), { message: 'Invalid date' });

export const baseFrontmatter = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  pubDate: isoDate,
  updatedDate: isoDate.optional(),
  tags: z.array(z.string().min(1)).default([]),
  draft: z.boolean().default(false),
  lang: z.enum(['ko', 'en']).default('ko'),
  canonical: z.url().optional(),
  ogImage: z.string().optional(),
  // Body-content hash stamped by the /lint tooling; used to detect when
  // AI-derived fields (description/summary/tags) have gone stale. Not rendered.
  lintHash: z.string().optional(),
});

export const postSchema = baseFrontmatter;
export const readAndWriteSchema = baseFrontmatter;

// Wiki is the OKF-conformant reference library. OKF's single required field is
// `type` (e.g. 'Category' for hubs, 'Reference' for leaf cards). `resource` is
// the canonical URL of the concept the doc describes (optional). title/pubDate
// stay required (inherited) because the site still renders and sorts by them.
export const wikiSchema = baseFrontmatter.extend({
  type: z.string().min(1),
  resource: z.url().optional(),
});
