import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { baseFrontmatter, postSchema, readAndWriteSchema, wikiSchema } from './content/schemas';

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
  wiki: defineCollection({ loader: glob(md('wiki')), schema: wikiSchema }),
  specs: defineCollection({ loader: glob(md('specs')), schema: baseFrontmatter }),
  idea: defineCollection({ loader: glob(md('idea')), schema: baseFrontmatter }),
};

export { baseFrontmatter };
