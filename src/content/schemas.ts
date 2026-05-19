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
});

export const postSchema = baseFrontmatter;
export const readAndWriteSchema = baseFrontmatter;
