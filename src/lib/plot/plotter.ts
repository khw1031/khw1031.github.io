import { Parser } from 'expr-eval';

// General expression plotter. The string you pass IS the thing that gets sampled
// and drawn — there is no separate decorative equation. Given `y = 2*x` it samples
// x over a domain and plots the line; given a recurrence it iterates the map.

const parser = new Parser({
  operators: {
    assignment: false,
    conditional: false,
    logical: false,
    comparison: false,
    in: false,
  },
});

const CONSTANTS = { pi: Math.PI, tau: Math.PI * 2, e: Math.E };

const cache = new Map<string, ReturnType<typeof parser.parse>>();

const compile = (expression: string) => {
  const cached = cache.get(expression);
  if (cached) return cached;
  const parsed = parser.parse(expression);
  cache.set(expression, parsed);
  return parsed;
};

export type Vec3 = { x: number; y: number; z: number };
export type PlotMode = 'function' | 'parametric' | 'map';

export type PlotSpec = {
  mode: PlotMode;
  samples?: number;
  // Optional parameter sweep: repeats the plot for `param` across a range so a
  // single equation becomes a family of curves (e.g. sin(a*x) for a = 1..8).
  sweep?: { param: string; from: number; to: number; steps: number };
  fn?: { y: string; z?: string; domainX: [number, number] };
  parametric?: { x: string; y: string; z?: string; domainT: [number, number] };
  map?: {
    x0: string;
    y0: string;
    z0?: string;
    nextX: string;
    nextY: string;
    nextZ?: string;
    renderX?: string;
    renderY?: string;
    renderZ?: string;
    iterations: number;
    seeds?: number;
    // Overlay N rotated copies of the attractor (about the Y axis) so the cloud
    // builds a symmetric 3D volume instead of a single sheet.
    instances?: number;
  };
};

export type PlotCurve = { points: Vec3[]; sweep: number };
export type PlotResult = {
  curves: PlotCurve[];
  bounds: { min: Vec3; max: Vec3 };
  pointCount: number;
  dropped: number;
};

const HUGE = 1e6;
const isFinitePoint = (point: Vec3) =>
  Number.isFinite(point.x) &&
  Number.isFinite(point.y) &&
  Number.isFinite(point.z) &&
  Math.abs(point.x) < HUGE &&
  Math.abs(point.y) < HUGE &&
  Math.abs(point.z) < HUGE;

const clampInt = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.round(value)));

const evalNum = (expression: string, scope: Record<string, number>): number => {
  const value = compile(expression).evaluate({ ...CONSTANTS, ...scope });
  return typeof value === 'number' ? value : Number.NaN;
};

// Break a raw point list into finite segments so asymptotes (e.g. tan(x)) do not
// draw a giant spike across the view; each finite run becomes its own polyline.
const splitFinite = (raw: Vec3[]): Vec3[][] => {
  const segments: Vec3[][] = [];
  let current: Vec3[] = [];
  for (const point of raw) {
    if (isFinitePoint(point)) {
      current.push(point);
    } else if (current.length >= 2) {
      segments.push(current);
      current = [];
    } else {
      current = [];
    }
  }
  if (current.length >= 2) segments.push(current);
  return segments;
};

const sweepValues = (sweep: PlotSpec['sweep']): Array<number | null> => {
  if (!sweep) return [null];
  const steps = Math.max(1, Math.round(sweep.steps));
  return Array.from({ length: steps }, (_, index) =>
    steps <= 1 ? sweep.from : sweep.from + (sweep.to - sweep.from) * (index / (steps - 1)),
  );
};

export const buildPlot = (spec: PlotSpec): PlotResult => {
  const samples = clampInt(spec.samples ?? 240, 2, 4000);
  const curves: PlotCurve[] = [];
  let dropped = 0;

  const countDropped = (raw: Vec3[]) => {
    dropped += raw.length - raw.filter(isFinitePoint).length;
  };

  const sweeps = sweepValues(spec.sweep);

  for (let s = 0; s < sweeps.length; s += 1) {
    const sweepValue = sweeps[s];
    const extra: Record<string, number> =
      spec.sweep && sweepValue !== null ? { [spec.sweep.param]: sweepValue } : {};

    if (spec.mode === 'function' && spec.fn) {
      const [x0, x1] = spec.fn.domainX;
      // A swept family becomes a 3D stack: each sweep value sits on its own depth
      // plane (z = sweep value) so the pattern has volume under 360° rotation.
      const sweepDepth = spec.sweep && sweepValue !== null ? sweepValue : 0;
      const raw: Vec3[] = [];
      for (let i = 0; i < samples; i += 1) {
        const x = x0 + (x1 - x0) * (samples <= 1 ? 0 : i / (samples - 1));
        const y = evalNum(spec.fn.y, { ...extra, x });
        const z = spec.fn.z ? evalNum(spec.fn.z, { ...extra, x, y }) : sweepDepth;
        raw.push({ x, y, z });
      }
      countDropped(raw);
      for (const part of splitFinite(raw)) curves.push({ points: part, sweep: s });
      continue;
    }

    if (spec.mode === 'parametric' && spec.parametric) {
      const [t0, t1] = spec.parametric.domainT;
      const raw: Vec3[] = [];
      for (let i = 0; i < samples; i += 1) {
        const t = t0 + (t1 - t0) * (samples <= 1 ? 0 : i / (samples - 1));
        raw.push({
          x: evalNum(spec.parametric.x, { ...extra, t }),
          y: evalNum(spec.parametric.y, { ...extra, t }),
          z: spec.parametric.z ? evalNum(spec.parametric.z, { ...extra, t }) : 0,
        });
      }
      countDropped(raw);
      for (const part of splitFinite(raw)) curves.push({ points: part, sweep: s });
      continue;
    }

    if (spec.mode === 'map' && spec.map) {
      const seeds = clampInt(spec.map.seeds ?? 1, 1, 64);
      const iterations = clampInt(spec.map.iterations, 2, 400000);
      const instances = clampInt(spec.map.instances ?? 1, 1, 24);
      for (let seed = 0; seed < seeds; seed += 1) {
        let x = evalNum(spec.map.x0, { ...extra, s: seed });
        let y = evalNum(spec.map.y0, { ...extra, s: seed });
        let z = spec.map.z0 ? evalNum(spec.map.z0, { ...extra, s: seed }) : 0;
        const raw: Vec3[] = [];
        for (let n = 0; n < iterations; n += 1) {
          const scope = { ...extra, x, y, z, n, s: seed };
          raw.push({
            x: spec.map.renderX ? evalNum(spec.map.renderX, scope) : x,
            y: spec.map.renderY ? evalNum(spec.map.renderY, scope) : y,
            z: spec.map.renderZ ? evalNum(spec.map.renderZ, scope) : z,
          });
          const nx = evalNum(spec.map.nextX, scope);
          const ny = evalNum(spec.map.nextY, scope);
          const nz = spec.map.nextZ ? evalNum(spec.map.nextZ, scope) : z;
          x = nx;
          y = ny;
          z = nz;
          if (!Number.isFinite(x) || !Number.isFinite(y)) break;
        }
        countDropped(raw);
        // Overlay rotated copies about the Y axis to build a symmetric 3D volume.
        for (let k = 0; k < instances; k += 1) {
          const angle = instances <= 1 ? 0 : (k / instances) * Math.PI * 2;
          const ca = Math.cos(angle);
          const sa = Math.sin(angle);
          const rotated =
            instances <= 1
              ? raw
              : raw.map((p) => ({ x: p.x * ca - p.z * sa, y: p.y, z: p.x * sa + p.z * ca }));
          for (const part of splitFinite(rotated)) curves.push({ points: part, sweep: seed });
        }
      }
    }
  }

  const min: Vec3 = { x: Infinity, y: Infinity, z: Infinity };
  const max: Vec3 = { x: -Infinity, y: -Infinity, z: -Infinity };
  let pointCount = 0;
  for (const curve of curves) {
    for (const point of curve.points) {
      pointCount += 1;
      min.x = Math.min(min.x, point.x);
      min.y = Math.min(min.y, point.y);
      min.z = Math.min(min.z, point.z);
      max.x = Math.max(max.x, point.x);
      max.y = Math.max(max.y, point.y);
      max.z = Math.max(max.z, point.z);
    }
  }

  if (pointCount === 0) {
    return {
      curves,
      bounds: { min: { x: -1, y: -1, z: -1 }, max: { x: 1, y: 1, z: 1 } },
      pointCount: 0,
      dropped,
    };
  }

  return { curves, bounds: { min, max }, pointCount, dropped };
};
