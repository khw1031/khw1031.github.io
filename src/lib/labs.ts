import type { PostListItem } from './collections';

export interface LabEntry {
  title: string;
  href: string;
  pubDate: Date;
  description: string;
}

// Single source of truth for the labs index and for merging labs into the
// home "Recent" list. Labs are hand-authored `.astro` pages (not a content
// collection), so their publish dates and descriptions live here explicitly.
export const labs: LabEntry[] = [
  {
    title: 'game of life',
    href: '/labs/game-of-life/',
    pubDate: new Date('2026-06-25'),
    description:
      'Conway의 Game of Life 세포 자동자를 Three.js로 렌더링해 규칙 기반 패턴의 생성과 소멸을 관찰하는 인터랙티브 실험',
  },
  {
    title: 'pixelate',
    href: '/labs/pixelate/',
    pubDate: new Date('2026-06-27'),
    description:
      '이미지를 업로드해 브라우저에서 실시간으로 픽셀화하고 블록 크기·해상도를 조절해보는 캔버스 실험',
  },
  {
    title: 'edward hopper apt',
    href: '/labs/apt/',
    pubDate: new Date('2026-06-30'),
    description:
      'Edward Hopper의 정적인 도시 아파트 정경을 절차적으로 생성해 빛과 창문 구도를 변주하는 제너레이티브 비주얼',
  },
  {
    title: 'patterns',
    href: '/labs/patterns/',
    pubDate: new Date('2026-07-01'),
    description:
      '수식 기반으로 생성되는 반복·기하 패턴을 모아 파라미터에 따라 형태가 달라지는 과정을 살펴보는 갤러리',
  },
  {
    title: 'expression plotter',
    href: '/labs/plot/',
    pubDate: new Date('2026-07-03'),
    description: '수학 식을 입력하면 캔버스에 실시간으로 그래프를 그려주는 expr-eval 기반 수식 플로터',
  },
];

export function getLabItems(): PostListItem[] {
  return [...labs]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .map((lab) => ({
      href: lab.href,
      title: lab.title,
      pubDate: lab.pubDate,
      description: lab.description,
      kind: 'lab' as const,
    }));
}
