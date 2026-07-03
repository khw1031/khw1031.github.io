import type { PostListItem } from './collections';

export interface LabEntry {
  title: string;
  href: string;
  pubDate: Date;
}

// Single source of truth for the labs index and for merging labs into the
// home "Recent" list. Labs are hand-authored `.astro` pages (not a content
// collection), so their publish dates live here explicitly.
export const labs: LabEntry[] = [
  { title: 'game of life', href: '/labs/game-of-life/', pubDate: new Date('2026-06-25') },
  { title: 'pixelate', href: '/labs/pixelate/', pubDate: new Date('2026-06-27') },
  { title: 'edward hopper apt', href: '/labs/apt/', pubDate: new Date('2026-06-30') },
  { title: 'patterns', href: '/labs/patterns/', pubDate: new Date('2026-07-01') },
  { title: 'expression plotter', href: '/labs/plot/', pubDate: new Date('2026-07-03') },
];

export function getLabItems(): PostListItem[] {
  return [...labs]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .map((lab) => ({
      href: lab.href,
      title: lab.title,
      pubDate: lab.pubDate,
      kind: 'lab' as const,
    }));
}
