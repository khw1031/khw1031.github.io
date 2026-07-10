import { type CollectionEntry, getCollection } from 'astro:content';
import { getLabItems } from './labs';
import { readingTime } from './reading-time';

export type ListableCollection =
  | 'posts'
  | 'read-and-write'
  | 'notes'
  | 'inbox'
  | 'wiki'
  | 'specs'
  | 'idea';

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
  wiki: 'Wiki',
  specs: 'Specs',
  idea: 'Idea',
};

// Timeline scope: home "Recent", the archive, tags, and RSS. Kept to the
// chronological blog collections (+ labs, added in getPublicItems). wiki, notes,
// inbox and specs are deliberately absent — wiki is a category-tree reference
// library, not a dated timeline, and notes/inbox/specs are unlisted.
export const COLLECTION_ORDER: ListableCollection[] = ['posts', 'read-and-write'];

// Search scope: which collections enter the pagefind index (+ sitemap +
// robots-allowed). This is COLLECTION_ORDER plus wiki — wiki is public and
// searchable but stays out of the timeline surfaces above. notes/inbox/specs are
// in neither scope (unlisted). The pagefind gate lives in the layouts:
// PostLayout keys off COLLECTION_ORDER, WikiLayout marks wiki bodies directly.
export const SEARCHABLE_COLLECTIONS: ListableCollection[] = [...COLLECTION_ORDER, 'wiki'];

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

// KST formatting has no astro:content dependency, so it lives in ./kst and is
// re-exported here for existing callers (`formatDate` from './collections').
export { formatDate } from './kst';
