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
  // Optional opt-in for line patterns: sweeps with index < colorSplit are drawn
  // in the primary (→secondary) hue, sweeps >= colorSplit in the accent hue. This
  // gives a hard two-tone split instead of the default continuous primary→accent
  // gradient. Omitted on every other pattern, so their coloring is unchanged.
  colorSplit?: number;
  // Optional per-pattern line opacity (default 0.9). Lower it to make dense,
  // overlapping strokes read as finer/thinner lines. Omitted elsewhere so those
  // patterns keep the default opacity.
  lineOpacity?: number;
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
  'resonant-weave': {
    source: 'resonant-weave',
    title: 'resonant weave',
    sourcePhrase: 'vibe coding club',
    ariaLabel:
      'Damped harmonograph curve plotted from vibe coding club as coupled oscillators phase-locking into a shared groove',
    topology: 'resonant harmonograph weave',
    note: '공명하며 감기는 club의 vibe',
    colors: { paper: '#0d0b1f', primary: '#4de1ff', secondary: '#a06bff', accent: '#ff5db1' },
    view: {
      rotation: { x: -0.38, y: 0.62, z: 0.12 },
      zoom: 1,
      motion: { yawAmplitude: 0.22, yawSpeed: 0.00022, rollAmplitude: 0.06, rollSpeed: 0.00017 },
    },
    candidates: [
      {
        id: 'harmonograph',
        name: 'damped harmonograph (coupled oscillators)',
        interpretation:
          '감쇠 리사주: x = e^(−dt)(sin 2.005t + sin(3t+π/2)), y = e^(−dt)(sin(3.003t+π/4) + sin 2t), z = 0.9·e^(−dt)·sin(5t+π/3).',
        role: '주파수 2·3·5의 세 성분이 근접-공명으로 beat를 만들고, 감쇠 포락선이 하나의 그루브로 감겨 정착한다.',
        spec: {
          mode: 'parametric',
          samples: 3000,
          parametric: {
            x: 'exp(-0.005 * t) * sin(2.005 * t) + exp(-0.005 * t) * sin(3 * t + pi / 2)',
            y: 'exp(-0.005 * t) * sin(3.003 * t + pi / 4) + exp(-0.005 * t) * sin(2 * t)',
            z: '0.9 * exp(-0.004 * t) * sin(5 * t + pi / 3)',
            domainT: [0, 150],
          },
        },
      },
    ],
  },
  'coupled-club-graph': {
    source: 'coupled-club-graph',
    title: 'coupled club graph',
    sourcePhrase: 'vibe coding club',
    ariaLabel:
      'Modular multiplication chord graph plotted from vibe coding club as members wired by resonant coupling',
    topology: 'modular chord network',
    note: '엮여 공명하는 club',
    colors: { paper: '#0b1020', primary: '#ff5db1', secondary: '#4de1ff', accent: '#b6ff5c' },
    view: {
      rotation: { x: -0.52, y: 0.28, z: -0.15 },
      zoom: 1,
      motion: {
        yawAmplitude: 0,
        yawSpeed: 0.0002,
        rollAmplitude: 0.03,
        rollSpeed: 0.00014,
        spin: 0.00007,
      },
    },
    candidates: [
      {
        id: 'modular-chord',
        name: 'modular multiplication chord graph (N=48, ×2)',
        interpretation:
          '원 위 48개 노드 k를 엣지 규칙 j = (2·k) mod 48으로 잇는다: x = (1−t)cos(τk/48) + t·cos(τj/48), y = 동일한 sin, z = 0.55·sin(πt)·cos(τk/48).',
        role: '노드는 각 꼭짓점, 현(chord)은 결합 규칙. 엣지들이 겹치며 만드는 카디오이드 포락선이 집단의 형상이다.',
        spec: {
          mode: 'parametric',
          samples: 40,
          parametric: {
            x: '(1 - t) * cos(tau * k / 48) + t * cos(tau * ((2 * k) % 48) / 48)',
            y: '(1 - t) * sin(tau * k / 48) + t * sin(tau * ((2 * k) % 48) / 48)',
            z: '0.55 * sin(pi * t) * cos(tau * k / 48)',
            domainT: [0, 1],
          },
          sweep: { param: 'k', from: 0, to: 47, steps: 48 },
        },
      },
    ],
  },
  'vibe-coded-club': {
    source: 'vibe-coded-club',
    title: 'vibe coded club',
    sourcePhrase: 'vibe coding club',
    ariaLabel:
      'Round-pipe lettermark extruded into depth, surrounded by crackling lightning and jazzy looping filaments',
    topology: 'tubular lettermark in a diagonal filament band',
    note: '둥근 파이프 글자 + 대각선 번개·재즈 밴드',
    colors: { paper: '#0a0714', primary: '#ffcf3a', secondary: '#ffcf3a', accent: '#ffcf3a' },
    colorSplit: 112,
    lineOpacity: 0.5,
    view: {
      rotation: { x: -0.28, y: 0.45, z: 0.05 },
      zoom: 1,
      motion: { yawAmplitude: 0.4, yawSpeed: 0.00018, rollAmplitude: 0.04, rollSpeed: 0.00012 },
    },
    candidates: [
      {
        id: 'tube-decor',
        name: 'round-pipe lettermark + electric-jazz band',
        interpretation:
          'k=0…111: 각 글자 획(floor(k/28))을 반경 0.34 원형 단면 튜브로 감싼다 — k%28을 단면 둘레각 φ로 써서 둥근 파이프(풍선) 표면을 28줄로 채운다. k=112…151: 필라멘트 40가닥의 중심을 대각선 (3.9u,1.7u)에 두고 수직으로 ±1.3 흩뿌려 두꺼운 밴드로 군집시키고, 2:3 리사주 루프(재즈 스윙)+삼각파 지터 asin(sin(26t))(잔 번개)를 얹는다.',
        role: '둥근 파이프로 채운 입체 글자와, 좌하→우상 대각선으로 두껍게 군집한 필라멘트(즉흥적으로 감기는 재즈 곡선 + 지지직 튀는 잔 번개)를 모두 같은 노랑 얇은 선으로 그린다.',
        spec: {
          mode: 'parametric',
          samples: 200,
          parametric: {
            x: '(1 - floor(k / 112)) * ((1 - floor(floor(k / 28) / 2)) * (-2.6 + 0.75 * (-(1 - (floor(k / 28) % 2)) * (1 - t) + (floor(k / 28) % 2) * t) + 0.34 * cos(tau * (k % 28) / 28) * (2 * (1 - 2 * (floor(k / 28) % 2)) / 2.136)) + floor(floor(k / 28) / 2) * (2.6 * (floor(k / 28) % 2) + (0.95 + 0.34 * cos(tau * (k % 28) / 28)) * cos(0.9 + t * (2 * pi - 1.8)))) + floor(k / 112) * (3.9 * (((k - 112) / 39) * 2 - 1) - 0.52 * sin(2.4 * (k - 112)) + (1.2 + 0.4 * sin(1.7 * (k - 112))) * sin(2 * t * tau + 0.5 * (k - 112)) + 0.14 * (2 / pi) * asin(sin(26 * t + 3 * (k - 112))))',
            y: '(1 - floor(k / 112)) * ((1 - floor(floor(k / 28) / 2)) * ((1 - 2 * t) * (1 - 2 * (floor(k / 28) % 2)) + 0.34 * cos(tau * (k % 28) / 28) * (0.75 / 2.136)) + floor(floor(k / 28) / 2) * ((0.95 + 0.34 * cos(tau * (k % 28) / 28)) * sin(0.9 + t * (2 * pi - 1.8)))) + floor(k / 112) * (1.7 * (((k - 112) / 39) * 2 - 1) + 1.19 * sin(2.4 * (k - 112)) + (1.0 + 0.3 * cos(1.3 * (k - 112))) * sin(3 * t * tau + 0.9 * (k - 112)) + 0.14 * (2 / pi) * asin(sin(31 * t + 2 * (k - 112))))',
            z: '(1 - floor(k / 112)) * (0.34 * sin(tau * (k % 28) / 28)) + floor(k / 112) * (1.2 * sin(t * tau * 1.5 + (k - 112)))',
            domainT: [0, 1],
          },
          sweep: { param: 'k', from: 0, to: 151, steps: 152 },
        },
      },
    ],
  },
} satisfies Record<string, PlotPattern>;

export type PlotPatternEntry = (typeof plotPatternRegistry)[keyof typeof plotPatternRegistry];
