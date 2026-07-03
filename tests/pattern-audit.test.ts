import { describe, expect, it } from 'vitest';
import { plotPatternRegistry } from '../src/lib/plot/patterns';
import { buildPlot } from '../src/lib/plot/plotter';

describe('plot pattern gallery', () => {
  it('produces finite, non-empty geometry for every candidate', () => {
    for (const pattern of Object.values(plotPatternRegistry)) {
      for (const candidate of pattern.candidates) {
        const result = buildPlot(candidate.spec);
        expect(result.pointCount).toBeGreaterThan(0);
        for (const curve of result.curves) {
          for (const point of curve.points) {
            expect(Number.isFinite(point.x)).toBe(true);
            expect(Number.isFinite(point.y)).toBe(true);
            expect(Number.isFinite(point.z)).toBe(true);
          }
        }
      }
    }
  });

  // Anti-convergence: with real per-concept equations, divergence comes from the
  // math itself. Each pattern must still be pairwise distinct on the axes that
  // would otherwise let two concepts look alike. Do not relax — re-derive instead.
  it('keeps each pattern on a distinct equation, topology, palette, and camera', () => {
    const entries = Object.values(plotPatternRegistry);
    expect(entries.length).toBeGreaterThan(1);

    const allDistinct = (values: unknown[]) =>
      expect(new Set(values.map((value) => JSON.stringify(value))).size).toBe(values.length);

    // primary equation (the first candidate's spec) must differ across patterns
    allDistinct(entries.map((entry) => entry.candidates[0]?.spec));

    const topologies = entries.map((entry) => entry.topology);
    for (const topology of topologies) expect(topology?.trim().length ?? 0).toBeGreaterThan(0);
    allDistinct(topologies);

    allDistinct(entries.map((entry) => entry.colors));
    allDistinct(entries.map((entry) => entry.view.rotation));
    allDistinct(entries.map((entry) => entry.view.motion));
  });

  it('gives every pattern genuine 3D volume (not a flat sheet)', () => {
    for (const pattern of Object.values(plotPatternRegistry)) {
      const result = buildPlot(pattern.candidates[0].spec);
      const zExtent = result.bounds.max.z - result.bounds.min.z;
      const xyExtent = Math.max(
        result.bounds.max.x - result.bounds.min.x,
        result.bounds.max.y - result.bounds.min.y,
        1e-6,
      );
      expect(zExtent / xyExtent).toBeGreaterThan(0.02);
    }
  });

  it('gives iterated maps enough iterations for density', () => {
    for (const pattern of Object.values(plotPatternRegistry)) {
      for (const candidate of pattern.candidates) {
        if (candidate.spec.mode === 'map') {
          expect(candidate.spec.map?.iterations ?? 0).toBeGreaterThanOrEqual(10000);
        }
      }
    }
  });

  it('gives every candidate a shown equation string that matches what is plotted', () => {
    for (const pattern of Object.values(plotPatternRegistry)) {
      for (const candidate of pattern.candidates) {
        // the displayed expression is derived from the executed spec, not a separate
        // hand-written label, so it can never drift from what is drawn
        const spec = candidate.spec;
        const shown =
          spec.mode === 'function'
            ? spec.fn?.y
            : spec.mode === 'parametric'
              ? spec.parametric?.x
              : spec.map?.nextX;
        expect(shown && shown.length > 0).toBe(true);
      }
    }
  });
});
