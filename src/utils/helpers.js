import { go, sel, mapL, join, uniqueL, flatL, takeAll } from "fxjs";
import kebabCase from "lodash.kebabcase";

export function getSimplifiedPosts(posts, options = {}) {
  return posts.map(post => ({
    id: post.node.id,
    date: post.node.frontmatter.date,
    slug: post.node.fields.slug,
    tags: post.node.frontmatter.tags,
    categories: post.node.frontmatter.categories,
    title: post.node.frontmatter.title,
    description: post.node.frontmatter.description,
    ...(options.thumbnails && {
      thumbnail: post.node.frontmatter.thumbnail?.childImageSharp.fluid,
    }),
  }));
}

export const getItemsByKey = (coll, key) =>
  go(
    coll,
    mapL(sel(`node.frontmatter.${key}`)),
    flatL,
    uniqueL,
    mapL(s => ({ name: s, slug: `/${key}/${kebabCase(s)}` })),
    takeAll
  );

export const capitalize = str =>
  go(
    str.split(" "),
    mapL(([c, ..._]) => [c.toUpperCase(), ..._].join("")),
    join(" ")
  );

export const randomInt = (min = 0, max = 11) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
