import { z } from 'zod';
import { NOTE_ID_PATTERN } from '../lib/note-id';

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
  // Body-content hash stamped by the /notes-polish tooling (agent-authored
  // collections only); detects when a note's body changed since it was last
  // polished (highlight + structure). Independent of lintHash. Not rendered.
  polishHash: z.string().optional(),
  // Permanent, hand-transcribable identifier ({CATEGORY}-{YYMM}-{NNN}), stamped
  // once by scripts/stamp-note-ids.ts and never rewritten — a paper notebook
  // cites it. Optional here because posts/read-and-write are out of scope and
  // an unstamped document must still build; check-frontmatter is what requires
  // it on notes/inbox/sources/idea and enforces registry + uniqueness.
  // Rendered next to the <h1> by PostLayout.
  noteId: z
    .string()
    .regex(NOTE_ID_PATTERN, 'noteId must look like AI-2608-014 ({CATEGORY}-{YYMM}-{NNN})')
    .optional(),
});

export const postSchema = baseFrontmatter;
export const readAndWriteSchema = baseFrontmatter;
