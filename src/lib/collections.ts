import { type CollectionEntry, getCollection } from 'astro:content';
import { getLabItems } from './labs';
import { isVisibleInListing, sortByRecency } from './listing';
import { readingTime } from './reading-time';

export type ListableCollection = 'posts' | 'read-and-write' | 'notes' | 'inbox' | 'idea';

export interface PostListItem {
  href: string;
  title: string;
  pubDate: Date;
  /**
   * Last revision, when an author stamped one. Listings order and label by this
   * in preference to pubDate (see `sortByRecency`); labs never carry it.
   */
  updatedDate?: Date;
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
  idea: 'Idea',
};

// Timeline scope: home "Recent", the archive, tags, and RSS. Kept to the
// chronological blog collections (+ labs, added in getPublicItems). notes and
// inbox are deliberately absent — they are unlisted.
export const COLLECTION_ORDER: ListableCollection[] = ['posts', 'read-and-write'];

// Search scope: which collections enter the pagefind index (+ sitemap +
// robots-allowed). Currently identical to COLLECTION_ORDER, but kept separate
// because the two scopes answer different questions — a collection can be
// public and searchable without belonging on a dated timeline. notes/inbox/
// sources/idea are in neither scope (unlisted). The pagefind gate lives in
// PostLayout, which keys off this list.
export const SEARCHABLE_COLLECTIONS: ListableCollection[] = [...COLLECTION_ORDER];

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
    updatedDate: entry.data.updatedDate,
    description: entry.data.description,
    tags: entry.data.tags,
    readingMinutes: readingTime(entryBody(entry)).minutes,
  };
}

export async function getListItems(collection: ListableCollection): Promise<PostListItem[]> {
  const entries = await getCollection(collection, ({ data }) =>
    isVisibleInListing(data.draft, import.meta.env.DEV),
  );
  return sortByRecency(entries.map((entry) => entryToItem(collection, entry)));
}

// Listed content merged for the home "Recent" list and the archive: the
// COLLECTION_ORDER collections plus labs. Development includes drafts so they
// are author-visible; production excludes them. Notes and inbox are deliberately
// absent (they are unlisted — also absent from the sitemap and search index).
async function getPublicItems(): Promise<PostListItem[]> {
  const collections = await Promise.all(
    COLLECTION_ORDER.map((c) =>
      getListItems(c).then((items) =>
        items.map((item) => ({ ...item, kind: 'post' as const, label: COLLECTION_LABELS[c] })),
      ),
    ),
  );
  return sortByRecency([
    ...collections.flat(),
    ...getLabItems().map((item) => ({ ...item, label: 'Labs' })),
  ]);
}

export async function getRecentAcrossCollections(limit: number): Promise<PostListItem[]> {
  // Home "Recent" excludes labs (kind: 'lab'); labs stay in the archive, tags,
  // and RSS. Compact look: no source label.
  return (await getPublicItems())
    .filter((item) => item.kind !== 'lab')
    .slice(0, limit)
    .map(({ label: _label, ...item }) => item);
}

export async function getArchiveItems(): Promise<PostListItem[]> {
  return getPublicItems();
}

export interface TagCount {
  tag: string;
  count: number;
}

// Tags use the same listed scope as the archive: production sees only published
// COLLECTION_ORDER entries, while development also shows drafts. Labs carry no
// tags, and notes/inbox are unlisted, so neither contributes here.
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
