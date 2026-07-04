import { type CollectionEntry, getCollection } from 'astro:content';
import { getLabItems } from './labs';
import { readingTime } from './reading-time';

export type ListableCollection = 'posts' | 'read-and-write' | 'notes' | 'inbox';

export interface PostListItem {
  href: string;
  title: string;
  pubDate: Date;
  /** Short description shown under the title in listings; absent for labs. */
  description?: string;
  /** Topical tags from frontmatter; absent for labs. */
  tags?: string[];
  /** Omitted for non-collection items such as labs. */
  readingMinutes?: number;
  /** Distinguishes labs from collection entries in shared list UI. */
  kind?: 'post' | 'lab';
  /** Optional source label shown in mixed lists (e.g. the archive). */
  label?: string;
}

export const COLLECTION_LABELS: Record<ListableCollection, string> = {
  posts: 'Posts',
  'read-and-write': 'Read & Write',
  notes: 'Notes',
  inbox: 'Inbox',
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
    description: entry.data.description,
    tags: entry.data.tags,
    readingMinutes: readingTime(entryBody(entry)).minutes,
  };
}

export async function getListItems(collection: ListableCollection): Promise<PostListItem[]> {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return entries
    .map((entry) => entryToItem(collection, entry))
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

// Public, listed content merged for the home "Recent" list and the archive:
// the COLLECTION_ORDER collections plus labs. Notes and inbox are intentionally
// excluded (they are unlisted — also absent from the sitemap and search index).
async function getPublicItems(): Promise<PostListItem[]> {
  const collections = await Promise.all(
    COLLECTION_ORDER.map((c) =>
      getListItems(c).then((items) =>
        items.map((item) => ({ ...item, kind: 'post' as const, label: COLLECTION_LABELS[c] })),
      ),
    ),
  );
  return [...collections.flat(), ...getLabItems().map((item) => ({ ...item, label: 'Labs' }))].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
  );
}

export async function getRecentAcrossCollections(limit: number): Promise<PostListItem[]> {
  // Recent keeps its compact look: no source label; labs are marked via `kind`.
  return (await getPublicItems()).slice(0, limit).map(({ label: _label, ...item }) => item);
}

export async function getArchiveItems(): Promise<PostListItem[]> {
  return getPublicItems();
}

export interface TagCount {
  tag: string;
  count: number;
}

// Tags are aggregated only over the public scope (getPublicItems): the
// COLLECTION_ORDER collections, non-draft. Labs carry no tags, and notes/inbox
// are unlisted, so neither contributes here — same rule as the archive/search.
export async function getTagIndex(): Promise<TagCount[]> {
  const counts = new Map<string, number>();
  for (const item of await getPublicItems()) {
    for (const tag of item.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getItemsByTag(tag: string): Promise<PostListItem[]> {
  return (await getPublicItems()).filter((item) => (item.tags ?? []).includes(tag));
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
