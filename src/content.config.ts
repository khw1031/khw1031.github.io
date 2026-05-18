import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  baseFrontmatter,
  coverLetterSchema,
  cvSchema,
  portfolioSchema,
  postSchema,
  readAndWriteSchema,
} from './content/schemas';

const md = (folder: string) => ({
  pattern: '**/*.md',
  base: `./src/content/${folder}`,
});

export const collections = {
  posts: defineCollection({ loader: glob(md('posts')), schema: postSchema }),
  cv: defineCollection({ loader: glob(md('cv')), schema: cvSchema }),
  portfolio: defineCollection({ loader: glob(md('portfolio')), schema: portfolioSchema }),
  'cover-letter': defineCollection({
    loader: glob(md('cover-letter')),
    schema: coverLetterSchema,
  }),
  'read-and-write': defineCollection({
    loader: glob(md('read-and-write')),
    schema: readAndWriteSchema,
  }),
};

export { baseFrontmatter };
