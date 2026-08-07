import { describe, expect, it } from 'vitest';
import { listingDate, sortByRecency } from '../src/lib/listing';

/**
 * Listings order by the last time a document changed, not by when it was first
 * published — an updated document is recent news even if its pubDate is old.
 *
 * These cases pin that rule for every surface that shares the comparator
 * (`getListItems` per-collection lists, and the merged home/archive/tags list).
 * RSS is deliberately NOT included: a feed item carries pubDate as its own date,
 * so ordering it by updatedDate would contradict the dates it publishes.
 */

const d = (iso: string) => new Date(iso);

type Item = { title: string; pubDate: Date; updatedDate?: Date };
const item = (title: string, pubDate: string, updatedDate?: string): Item => ({
  title,
  pubDate: d(pubDate),
  ...(updatedDate ? { updatedDate: d(updatedDate) } : {}),
});

const titles = (items: Item[]) => sortByRecency(items).map((i) => i.title);

describe('listingDate', () => {
  it('is pubDate when the document was never updated', () => {
    expect(listingDate(item('a', '2026-07-21'))).toEqual(d('2026-07-21'));
  });

  it('is updatedDate when present', () => {
    expect(listingDate(item('a', '2026-07-21', '2026-08-06'))).toEqual(d('2026-08-06'));
  });

  it('is updatedDate even when it precedes pubDate', () => {
    // Nonsense frontmatter, but the field is authored by hand — take it at face
    // value rather than silently picking the later of the two, so a wrong date
    // shows up in the listing where an author can see it.
    expect(listingDate(item('a', '2026-07-21', '2026-01-01'))).toEqual(d('2026-01-01'));
  });
});

describe('sortByRecency', () => {
  it('puts an updated old document above a newer untouched one', () => {
    expect(
      titles([
        item('newer-untouched', '2026-07-23'),
        item('older-updated', '2026-07-21', '2026-08-06'),
      ]),
    ).toEqual(['older-updated', 'newer-untouched']);
  });

  it('orders untouched documents by pubDate, newest first', () => {
    expect(titles([item('old', '2026-07-09'), item('new', '2026-07-23')])).toEqual(['new', 'old']);
  });

  it('interleaves updated and untouched documents on one axis', () => {
    expect(
      titles([
        item('pub-0723', '2026-07-23'),
        item('upd-0806', '2026-07-21', '2026-08-06'),
        item('pub-0709', '2026-07-09'),
        item('upd-0715', '2026-07-01', '2026-07-15'),
      ]),
    ).toEqual(['upd-0806', 'pub-0723', 'upd-0715', 'pub-0709']);
  });

  it('keeps input order for same-date documents', () => {
    // Stability matters: /idea/ has many entries sharing one pubDate, and a
    // non-deterministic tie-break would reshuffle the list on unrelated edits.
    expect(
      titles([
        item('first', '2026-07-21'),
        item('second', '2026-07-21'),
        item('third', '2026-07-21'),
      ]),
    ).toEqual(['first', 'second', 'third']);
  });

  it('does not mutate the input array', () => {
    const items = [item('a', '2026-07-09'), item('b', '2026-07-23')];
    sortByRecency(items);
    expect(items.map((i) => i.title)).toEqual(['a', 'b']);
  });
});
