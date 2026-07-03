export const aptRegistry = {
  '1': {
    title: 'apt.1',
    href: '/labs/apt/1/',
    description:
      "A corner apartment whose structure is traced from a photo, then repainted as two flat ivory masses — a sunlit face meeting a shadow face at a hard corner — under a wide empty sky in the light of Edward Hopper's Rooms by the Sea.",
    sourcePhrase:
      '사진에서 코너 아파트의 구조만 추출하고, Hopper Rooms by the Sea의 빛으로 상아색 평면 색면 재구성',
    abstraction: 'hopper mass reconstruction',
    styleReference: {
      artist: 'Edward Hopper',
      title: 'Rooms by the Sea',
      source: 'light and palette of the 1951 painting',
    },
  },
} as const;

export type AptSlug = keyof typeof aptRegistry;
export type AptEntry = (typeof aptRegistry)[AptSlug];
