/**
 * Listing rules shared by the tree-shaped collections' list pages.
 *
 * Deliberately free of `astro:content` imports so a plain tsx script can use it
 * too. `scripts/check-note-visibility.ts` reports which documents a list page
 * will drop, and it must never be able to disagree with the pages themselves —
 * so both call the function below instead of each restating the rule.
 */

/**
 * Collapse a topic tree to the documents a list page shows: hubs and standalone
 * documents. Any document nested under another in the same set is dropped,
 * because its hub already links it from an auto-rendered child TOC and listing
 * both would show the same topic twice.
 *
 * Comparison is over the set passed in, so callers decide what counts as a
 * potential hub — drafts are already gone by the time `getListItems` returns,
 * and `/idea/` removes its staging area first.
 */
export function collapseToHubs<T extends { href: string }>(items: T[]): T[] {
  return items.filter(
    (item) => !items.some((other) => other !== item && item.href.startsWith(other.href)),
  );
}

/** A document's position on the listing timeline. */
export interface Dated {
  pubDate: Date;
  /** Absent until an author stamps a revision. */
  updatedDate?: Date;
}

/**
 * The date a listing orders and labels by: when the document last changed.
 *
 * `updatedDate` wins whenever it is present, even if it precedes `pubDate` —
 * the field is hand-authored, so surfacing a wrong value where an author can
 * see it beats silently picking the later of the two.
 */
export function listingDate(item: Dated): Date {
  return item.updatedDate ?? item.pubDate;
}

/**
 * Newest-changed first. Ties keep input order (`Array.prototype.sort` is
 * stable), because collections like `/idea/` have many entries sharing one
 * pubDate and a synthetic tie-break would reshuffle them on unrelated edits.
 *
 * Returns a new array; callers pass shared item lists around.
 *
 * NOT used by RSS: a feed item publishes `pubDate` as its own date, so ordering
 * the feed by `updatedDate` would contradict the dates it emits. Reflecting
 * revisions in the feed needs a date field change, which is a separate call.
 */
export function sortByRecency<T extends Dated>(items: T[]): T[] {
  return [...items].sort((a, b) => listingDate(b).valueOf() - listingDate(a).valueOf());
}
