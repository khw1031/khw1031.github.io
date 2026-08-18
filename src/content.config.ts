import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { baseFrontmatter, postSchema, readAndWriteSchema } from './content/schemas';

const md = (folder: string) => ({
  pattern: '**/*.md',
  base: `./src/content/${folder}`,
});

export const collections = {
  posts: defineCollection({ loader: glob(md('posts')), schema: postSchema }),
  'read-and-write': defineCollection({
    loader: glob(md('read-and-write')),
    schema: readAndWriteSchema,
  }),
  notes: defineCollection({ loader: glob(md('notes')), schema: baseFrontmatter }),
  inbox: defineCollection({ loader: glob(md('inbox')), schema: baseFrontmatter }),
  // Retired source documents. A note links here once its core decomposition
  // supersedes the full original; the original is kept verbatim as the reference.
  // Unlisted like notes/docs (out of search/sitemap/robots).
  sources: defineCollection({ loader: glob(md('sources')), schema: baseFrontmatter }),
  idea: defineCollection({ loader: glob(md('idea')), schema: baseFrontmatter }),
  // Free-form working documents (PRDs, drafts). No required frontmatter — the
  // title falls back to the first H1 or the slug at render time, so a doc can be
  // dropped in with no frontmatter at all. Unlisted like notes/idea (excluded
  // from search/sitemap/robots), and the frontmatter checker exempts it (see
  // SCHEMA_FREE in scripts/check-frontmatter.ts).
  docs: defineCollection({
    loader: glob(md('docs')),
    schema: z.object({ title: z.string().optional(), description: z.string().optional() }),
  }),
  // Log space. Unlisted like docs (dev-only footer, out of search/sitemap/robots),
  // schema-free, and intentionally exempt from lint/polish. Three kinds live here —
  // do not assume everything under logs/ is disposable staging:
  // - staging logs (logs/questions/ — `/q` output; the `/migrate` skill organizes
  //   them into study-note elsewhere and deletes them)
  // - final-form chronological logs (logs/capture/ — `/capture` output; organized
  //   when captured, append-only, no migration step)
  // - final-form logs (logs/rules/ — `/r` output; topic-organized at capture time,
  //   no migration step, never swept or deleted by `/migrate`)
  logs: defineCollection({
    loader: glob(md('logs')),
    schema: z.object({ title: z.string().optional(), description: z.string().optional() }),
  }),
  // Categorized topic-tree destination that `/q` logs get migrated into by
  // `/migrate`. Unlisted like docs, schema-free.
  'study-note': defineCollection({
    loader: glob(md('study-note')),
    schema: z.object({ title: z.string().optional(), description: z.string().optional() }),
  }),
};

export { baseFrontmatter };
