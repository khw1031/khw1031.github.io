export const aptRegistry = {
  '1': {
    title: 'apt.1',
    href: '/labs/apt/1/',
    description:
      "A corner apartment whose structure is traced from a photo, then repainted as two flat ivory masses — a sunlit face meeting a shadow face at a hard corner — under a wide empty sky in the light of Edward Hopper's Rooms by the Sea.",
    sourcePhrase:
      '사진에서 코너 아파트의 구조만 추출하고, Hopper Rooms by the Sea의 빛으로 상아색 평면 색면 재구성',
    abstraction: 'hopper mass reconstruction',
    scene: 'corner-mass',
    styleReference: {
      artist: 'Edward Hopper',
      title: 'Rooms by the Sea',
      year: 1951,
      source: 'light and palette of the 1951 painting',
    },
    credit: '구조 소스 사진: Sarguninder Singh / Unsplash (Unsplash License).',
    reproUrl: 'https://gist.github.com/khw1031/5e3f911eaf33707ac89687de6c3e8733',
  },
  '2': {
    title: 'apt.2',
    href: '/labs/apt/2/',
    description:
      "A cluster of apartment blocks in a single ivory tonal family, gathered in true 2-point perspective under a wide empty sky, with the tallest central tower picked out in amber — in the light of Edward Hopper's Rooms by the Sea.",
    sourcePhrase:
      '아이보리 한 계열로 통일한 아파트 색면 매스들이 하나의 지평선·소실점을 공유하는 2점 투시로 모인 무리. 가장 높은 중앙 타워만 앰버. 바닥 없음, 넓은 하늘. 합성.',
    abstraction: 'perspective apartment cluster — ivory with amber accent',
    scene: 'corner-variation',
    styleReference: {
      artist: 'Edward Hopper',
      title: 'Rooms by the Sea',
      year: 1951,
      source: 'light and palette of the 1951 painting',
    },
    credit: 'apt.1의 코너 매스 구도를 2점 투시 아파트 무리로 변주 (합성, 사진 미사용).',
    reproUrl: 'https://gist.github.com/khw1031/3514223ceb224a99a4f6fd899d09ef7b',
    variant: {
      seed: 1207,
      horizonY: 0.9,
      vpLeftX: -1.2,
      vpRightX: 2.2,
      skyTop: '#3c7191',
      skyLow: '#82a4b6',
      // Art-directed, back-to-front layout: an ivory tonal family (0 base, 2 warm,
      // 3 cool, 4 light) with the tallest central tower as the lone amber accent (1).
      // Order controls overlap, so a block's height never changes occlusion.
      blocks: [
        { cx: 0.9297, yT: 0.696, lx: 0.7875, rx: 1.0611, palette: 3 }, // back — cool ivory
        { cx: 0.7676, yT: 0.65, lx: 0.6507, rx: 0.9666, palette: 0 }, // beside center — base ivory
        { cx: 0.0305, yT: 0.47, lx: -0.144, rx: 0.3, palette: 4 }, // left — light ivory
        { cx: 0.363, yT: 0.21, lx: 0.17, rx: 0.57, palette: 1 }, // tallest central tower — amber
        { cx: 0.4634, yT: 0.43, lx: 0.2668, rx: 0.68, palette: 2 }, // center front — warm ivory
      ],
    },
  },
} as const;

export type AptSlug = keyof typeof aptRegistry;
export type AptEntry = (typeof aptRegistry)[AptSlug];
