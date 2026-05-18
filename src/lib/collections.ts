import { type CollectionEntry, getCollection } from 'astro:content';
import { readingTime } from './reading-time';

export type ListableCollection = 'posts' | 'read-and-write';

export interface PostListItem {
  href: string;
  title: string;
  pubDate: Date;
  readingMinutes: number;
}

export const COLLECTION_LABELS: Record<ListableCollection, string> = {
  posts: 'Posts',
  'read-and-write': 'Read & Write',
};

export const COLLECTION_ORDER: ListableCollection[] = ['posts', 'read-and-write'];

function entryBody(entry: CollectionEntry<ListableCollection>): string {
  return 'body' in entry && typeof entry.body === 'string' ? entry.body : '';
}

function entryToItem(
  collection: ListableCollection,
  entry: CollectionEntry<ListableCollection>,
): PostListItem {
  return {
    href: `/${collection}/${entry.id}/`,
    title: entry.data.title,
    pubDate: entry.data.pubDate,
    readingMinutes: readingTime(entryBody(entry)).minutes,
  };
}

export async function getListItems(collection: ListableCollection): Promise<PostListItem[]> {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return entries
    .map((entry) => entryToItem(collection, entry))
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

export async function getRecentAcrossCollections(limit: number): Promise<PostListItem[]> {
  const all = await Promise.all(COLLECTION_ORDER.map((c) => getListItems(c)));
  return all
    .flat()
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .slice(0, limit);
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
