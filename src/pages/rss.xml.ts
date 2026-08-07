import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { COLLECTION_ORDER, getListItems } from '../lib/collections';

export async function GET(context: APIContext): Promise<Response> {
  const all = await Promise.all(COLLECTION_ORDER.map((c) => getListItems(c)));
  // Deliberately re-sorted by pubDate, undoing the recency order getListItems
  // applies to the browsing surfaces: each item below publishes pubDate as its
  // own date, so ordering the feed by updatedDate would contradict those dates.
  // Reflecting revisions in the feed means changing what date an item carries —
  // a separate, subscriber-visible decision.
  const items = all
    .flat()
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .map((item) => ({
      title: item.title,
      link: item.href,
      pubDate: item.pubDate,
    }));

  return rss({
    title: 'thnkr',
    description: '개발 노트, 메모, 이력을 정리하는 공간',
    site: context.site ?? 'https://khw1031.github.io',
    items,
  });
}
