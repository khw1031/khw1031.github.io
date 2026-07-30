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
