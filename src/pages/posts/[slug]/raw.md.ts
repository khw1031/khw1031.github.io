import { type CollectionEntry, getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection('posts');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

interface Props {
  entry: CollectionEntry<'posts'>;
}

export const GET: APIRoute<Props> = ({ props }) => {
  const body = (props.entry as unknown as { body?: string }).body ?? '';
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
