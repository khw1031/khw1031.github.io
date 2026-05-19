import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
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
};

export { baseFrontmatter };
