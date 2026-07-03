import { describe, expect, it } from 'vitest';
import {
  countLivingNeighbors,
  countPopulation,
  createEmptyGrid,
  defaultLifeCols,
  defaultLifeRows,
  lifePatterns,
  nextGeneration,
  placePattern,
} from '../src/lib/game-of-life';

describe('game of life', () => {
  it('rotates a blinker oscillator', () => {
    const grid = placePattern(5, 5, lifePatterns.blinker);

    expect(nextGeneration(grid)).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });

  it('treats cells outside the grid as dead instead of wrapping edges', () => {
    const grid = createEmptyGrid(3, 3);
    grid[0][0] = 1;
    grid[0][2] = 1;
    grid[2][0] = 1;

    const next = nextGeneration(grid);

    expect(countLivingNeighbors(grid, 2, 2)).toBe(0);
    expect(next[2][2]).toBe(0);
  });

  it('places the glider gun without clipping on the default lab grid', () => {
    const grid = placePattern(defaultLifeRows, defaultLifeCols, lifePatterns['glider-gun']);

    expect(countPopulation(grid)).toBe(lifePatterns['glider-gun'].cells.length);
  });

  it('includes methuselah patterns whose population changes over time', () => {
    let grid = placePattern(defaultLifeRows, defaultLifeCols, lifePatterns.acorn);
    const initialPopulation = countPopulation(grid);

    for (let generation = 0; generation < 24; generation += 1) {
      grid = nextGeneration(grid);
    }

    expect(countPopulation(grid)).not.toBe(initialPopulation);
  });
});
