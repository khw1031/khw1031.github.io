import type { PlotSpec } from './plotter';

// Concept gallery rendered by the general expression plotter. Each pattern is a
// real, named mathematical object whose equation is what gets sampled and drawn
// — there is no family template and no decorative equation. The object for each
// source word was chosen by researching what mathematical structure matches the
// concept's dynamics (see `note` + `reference`), not from a fixed mapping.

export type PlotColors = { paper: string; primary: string; secondary: string; accent: string };

export type PlotMotion = {
  yawAmplitude: number;
  yawSpeed: number;
  rollAmplitude: number;
  rollSpeed: number;
  spin?: number;
};

export type PlotView = {
  rotation: { x: number; y: number; z: number };
  zoom?: number;
  motion: PlotMotion;
};

export type PlotCandidate = {
  id: string;
  name: string;
  interpretation: string;
  role: string;
  spec: PlotSpec;
};

export type PlotPattern = {
  source: string;
  title: string;
  sourcePhrase: string;
  ariaLabel: string;
  topology: string;
  note: string;
  colors: PlotColors;
  view: PlotView;
  candidates: PlotCandidate[];
};

// Human-readable rendering of the exact expressions that are evaluated. Shown in
// the caption and the candidate list so the displayed math IS the computed math.
export const describeSpec = (spec: PlotSpec): string => {
  if (spec.mode === 'function' && spec.fn) {
    const sweep = spec.sweep
      ? `   [${spec.sweep.param} = ${spec.sweep.from}…${spec.sweep.to}]`
      : '';
    return `y = ${spec.fn.y}${sweep}`;
  }
  if (spec.mode === 'parametric' && spec.parametric) {
    const z =
      spec.parametric.z && spec.parametric.z !== '0' ? `   z(t) = ${spec.parametric.z}` : '';
    return `x(t) = ${spec.parametric.x}   y(t) = ${spec.parametric.y}${z}`;
  }
  if (spec.mode === 'map' && spec.map) {
    return `x' = ${spec.map.nextX}    y' = ${spec.map.nextY}`;
  }
  return '';
};

export const plotPatternRegistry = {
  overthink: {
    source: 'overthink',
    title: 'overthink',
    sourcePhrase: 'overthink',
    ariaLabel: 'Clifford strange attractor plotted from the interpretation of overthink',
    topology: 'phase-space strange attractor',
    note: '수렴하지 않는 피드백',
    colors: { paper: '#f7fbff', primary: '#10232d', secondary: '#3c57b8', accent: '#d13b73' },
    view: {
      rotation: { x: -0.55, y: 0.5, z: 0 },
      zoom: 1,
      motion: { yawAmplitude: 0.14, yawSpeed: 0.00028, rollAmplitude: 0.05, rollSpeed: 0.00019 },
    },
    candidates: [
      {
        id: 'cyclic-feedback',
        name: 'cyclic feedback attractor (3D)',
        interpretation:
          '세 축이 서로의 sin을 되먹임: x′ = x + dt(sin y − b·x), y′ = y + dt(sin z − b·y), z′ = z + dt(sin x − b·z).',
        role: '어느 축도 다른 축의 입력으로 계속 되돌아가며 한 점에 정착하지 못하는 3D 궤적.',
        spec: {
          mode: 'map',
          map: {
            x0: '0.1',
            y0: '0',
            z0: '0',
            nextX: 'x + 0.06 * (sin(y) - 0.2 * x)',
            nextY: 'y + 0.06 * (sin(z) - 0.2 * y)',
            nextZ: 'z + 0.06 * (sin(x) - 0.2 * z)',
            iterations: 16000,
            seeds: 1,
            instances: 12,
          },
        },
      },
    ],
  },
  'failed-trial-constellation': {
    source: 'failed-trial-constellation',
    title: 'failed trial constellation',
    sourcePhrase: 'lab',
    ariaLabel: 'Hénon map attractor plotted from the interpretation of lab as failed trials',
    topology: 'discrete iteration attractor',
    note: '반복되는 실패 시행',
    colors: { paper: '#f8f7f1', primary: '#23313a', secondary: '#4b8f8c', accent: '#d45b3f' },
    view: {
      rotation: { x: -0.7, y: 0.35, z: 0 },
      zoom: 1,
      motion: { yawAmplitude: 0.1, yawSpeed: 0.00024, rollAmplitude: 0.03, rollSpeed: 0.00013 },
    },
    candidates: [
      {
        id: 'sensitive-trial',
        name: 'sensitive trial attractor (3D)',
        interpretation:
          '작은 차이가 궤적을 크게 갈라놓는 3D 흐름: x′ = x + dt·σ(y−x), y′ = y + dt(x(ρ−z)−y), z′ = z + dt(xy−βz).',
        role: '초기 조건에 민감해 매번 다른 경로로 접히는, 반복된 실패 시행의 기록면.',
        spec: {
          mode: 'map',
          map: {
            x0: '0.1',
            y0: '0',
            z0: '0',
            nextX: 'x + 0.006 * (10 * (y - x))',
            nextY: 'y + 0.006 * (x * (28 - z) - y)',
            nextZ: 'z + 0.006 * (x * y - 2.6667 * z)',
            iterations: 60000,
            seeds: 1,
          },
        },
      },
    ],
  },
  http: {
    source: 'http',
    title: 'http',
    sourcePhrase: 'http',
    ariaLabel: 'Fourier square-wave harmonics plotted from the interpretation of HTTP',
    topology: 'harmonic component stack',
    note: '상태 없는 독립 요청',
    colors: { paper: '#f7f8f4', primary: '#171717', secondary: '#2f78a6', accent: '#c84d35' },
    view: {
      rotation: { x: -0.5, y: 0.6, z: 0 },
      zoom: 1,
      motion: { yawAmplitude: 0.06, yawSpeed: 0.0003, rollAmplitude: 0.02, rollSpeed: 0.00012 },
    },
    candidates: [
      {
        id: 'request-harmonics',
        name: 'stateless request harmonics',
        interpretation:
          '홀수 harmonic sin((2a−1)x)/(2a−1)을 a=1…6으로 각각 그림 — 서로 상태를 공유하지 않는 독립 성분.',
        role: '각 곡선은 독립 request-response 성분이고, 진폭 감쇠(1/(2a−1))는 뒤로 갈수록 약해지는 기여다.',
        spec: {
          mode: 'function',
          samples: 400,
          fn: { y: 'sin((2 * a - 1) * x) / (2 * a - 1)', domainX: [-6.283, 6.283] },
          sweep: { param: 'a', from: 1, to: 6, steps: 6 },
        },
      },
    ],
  },
  'read-write': {
    source: 'read-write',
    title: 'read & write',
    sourcePhrase: 'read & write',
    ariaLabel: 'Lemniscate of Bernoulli plotted from the interpretation of reading and writing',
    topology: 'two-lobe transfer loop',
    note: '읽기와 쓰기의 왕복',
    colors: { paper: '#f6f7f2', primary: '#1b2430', secondary: '#3a8c8a', accent: '#c4495d' },
    view: {
      rotation: { x: -0.6, y: 0.4, z: 0 },
      zoom: 1,
      motion: { yawAmplitude: 0.3, yawSpeed: 0.0002, rollAmplitude: 0.02, rollSpeed: 0.00011 },
    },
    candidates: [
      {
        id: 'lemniscate',
        name: 'lemniscate of Bernoulli',
        interpretation: '매개변수식 x(t) = √2·cos t /(sin²t+1), y(t) = √2·cos t·sin t /(sin²t+1).',
        role: '교차점은 읽기와 쓰기가 만나는 지점, 두 lobe는 각각 입력 흡수와 출력 기록이다.',
        spec: {
          mode: 'parametric',
          samples: 600,
          parametric: {
            x: '(1.41421356 * cos(t)) / (sin(t) * sin(t) + 1)',
            y: '(1.41421356 * cos(t) * sin(t)) / (sin(t) * sin(t) + 1)',
            z: '0.5 * sin(2 * t)',
            domainT: [0, 6.283],
          },
        },
      },
    ],
  },
  'time-caged-archive': {
    source: 'time-caged-archive',
    title: 'time-caged archive',
    sourcePhrase: 'posts + job + work + time',
    ariaLabel:
      'Quantized staircase lattice plotted from the interpretation of posts, job, work, and time',
    topology: 'quantized staircase lattice',
    note: '칸으로 갇힌 시간',
    colors: { paper: '#f5f7ef', primary: '#1d3944', secondary: '#8a6f33', accent: '#bd352f' },
    view: {
      rotation: { x: -0.68, y: 0.55, z: 0 },
      zoom: 1,
      motion: { yawAmplitude: 0.28, yawSpeed: 0.0003, rollAmplitude: 0.04, rollSpeed: 0.00012 },
    },
    candidates: [
      {
        id: 'staircase-lattice',
        name: 'quantized time lattice',
        interpretation: '계단 함수 y = floor(x) + a 를 a=−4…4로 쌓아 격자를 만든다.',
        role: '각 계단은 칸으로 갇힌 시간, 쌓인 층은 기록/일/작업이 같은 격자에 배치된 아카이브다.',
        spec: {
          mode: 'function',
          samples: 500,
          fn: { y: 'floor(x) + a', domainX: [-5.5, 5.5] },
          sweep: { param: 'a', from: -4, to: 4, steps: 9 },
        },
      },
    ],
  },
  'guarded-little-orbits': {
    source: 'guarded-little-orbits',
    title: 'guarded little orbits',
    sourcePhrase: 'protected independent orbits',
    ariaLabel:
      'Hypotrochoid spirograph plotted from protected independent orbits within a boundary',
    topology: 'bounded rolling-orbit rosette',
    note: '담장 안의 작은 궤도',
    colors: { paper: '#17131c', primary: '#f0dcc8', secondary: '#cf8f6b', accent: '#f5c451' },
    view: {
      rotation: { x: -0.45, y: 0.45, z: 0 },
      zoom: 1,
      motion: {
        yawAmplitude: 0,
        yawSpeed: 0.0002,
        rollAmplitude: 0.02,
        rollSpeed: 0.00015,
        spin: 0.0001,
      },
    },
    candidates: [
      {
        id: 'hypotrochoid',
        name: 'hypotrochoid (spirograph)',
        interpretation:
          'R=5, r=3, d=5 롤링: x = (R−r)cos t + d·cos((R−r)/r·t), y = (R−r)sin t − d·sin((R−r)/r·t).',
        role: '큰 원은 보호 경계, 그 안을 구르는 작은 원의 궤적은 각자 중심을 가진 작은 독립 궤도다.',
        spec: {
          mode: 'parametric',
          samples: 1400,
          parametric: {
            x: '2 * cos(t) + 5 * cos((2 / 3) * t)',
            y: '2 * sin(t) - 5 * sin((2 / 3) * t)',
            z: '0.9 * sin(3 * t)',
            domainT: [0, 18.85],
          },
        },
      },
    ],
  },
} satisfies Record<string, PlotPattern>;

export type PlotPatternEntry = (typeof plotPatternRegistry)[keyof typeof plotPatternRegistry];
