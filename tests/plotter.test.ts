import { describe, expect, it } from 'vitest';
import { buildPlot } from '../src/lib/plot/plotter';

describe('expression plotter', () => {
  it('plots the given equation directly (y = 2x)', () => {
    const result = buildPlot({
      mode: 'function',
      samples: 11,
      fn: { y: '2*x', domainX: [-10, 10] },
    });

    expect(result.curves.length).toBe(1);
    const points = result.curves[0].points;
    expect(points.length).toBe(11);
    for (const point of points) {
      expect(point.y).toBeCloseTo(2 * point.x, 6);
    }
    expect(result.bounds.min.y).toBeCloseTo(-20, 6);
    expect(result.bounds.max.y).toBeCloseTo(20, 6);
  });

  it('turns one equation into a family via parameter sweep', () => {
    const result = buildPlot({
      mode: 'function',
      samples: 64,
      fn: { y: 'sin(a * x)', domainX: [-6.283, 6.283] },
      sweep: { param: 'a', from: 1, to: 8, steps: 8 },
    });

    expect(result.curves.length).toBe(8);
    expect(result.bounds.max.y).toBeLessThanOrEqual(1.0001);
    expect(result.bounds.min.y).toBeGreaterThanOrEqual(-1.0001);
  });

  it('splits a singularity into separate finite segments (1/x at x=0)', () => {
    const result = buildPlot({
      mode: 'function',
      samples: 401,
      fn: { y: '1 / x', domainX: [-2, 2] },
    });

    expect(result.curves.length).toBe(2);
    for (const curve of result.curves) {
      for (const point of curve.points) {
        expect(Number.isFinite(point.y)).toBe(true);
      }
    }
  });

  it('iterates a bounded recurrence map to a finite attractor', () => {
    const result = buildPlot({
      mode: 'map',
      map: {
        x0: '0.1',
        y0: '0.1',
        nextX: 'sin(1.4 * y) - cos(1.3 * x)',
        nextY: 'sin(1.1 * x) - cos(1.6 * y)',
        iterations: 1500,
        seeds: 3,
      },
    });

    expect(result.pointCount).toBeGreaterThan(1000);
    for (const bound of [result.bounds.min.x, result.bounds.max.x, result.bounds.min.y]) {
      expect(Math.abs(bound)).toBeLessThan(3);
    }
  });

  it('does not throw or emit non-finite points for a divergent map', () => {
    const result = buildPlot({
      mode: 'map',
      map: { x0: '1', y0: '1', nextX: '2 * x', nextY: '2 * y', iterations: 200, seeds: 1 },
    });

    for (const curve of result.curves) {
      for (const point of curve.points) {
        expect(Number.isFinite(point.x)).toBe(true);
        expect(Number.isFinite(point.y)).toBe(true);
      }
    }
  });
});
