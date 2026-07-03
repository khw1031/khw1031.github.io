export type LifeCell = 0 | 1;
export type LifeGrid = LifeCell[][];
export type LifePoint = readonly [row: number, col: number];

export type LifePattern = {
  title: string;
  width: number;
  height: number;
  cells: readonly LifePoint[];
};

export const defaultLifeRows = 70;
export const defaultLifeCols = 112;

export const lifePatterns = {
  blinker: {
    title: 'blinker',
    width: 3,
    height: 3,
    cells: [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  glider: {
    title: 'glider',
    width: 3,
    height: 3,
    cells: [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  },
  'r-pentomino': {
    title: 'r-pentomino',
    width: 3,
    height: 3,
    cells: [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
  },
  acorn: {
    title: 'acorn',
    width: 7,
    height: 3,
    cells: [
      [0, 1],
      [1, 3],
      [2, 0],
      [2, 1],
      [2, 4],
      [2, 5],
      [2, 6],
    ],
  },
  toad: {
    title: 'toad',
    width: 4,
    height: 4,
    cells: [
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  },
  beacon: {
    title: 'beacon',
    width: 4,
    height: 4,
    cells: [
      [0, 0],
      [0, 1],
      [1, 0],
      [2, 3],
      [3, 2],
      [3, 3],
    ],
  },
  'glider-gun': {
    title: 'glider gun',
    width: 36,
    height: 9,
    cells: [
      [4, 0],
      [5, 0],
      [4, 1],
      [5, 1],
      [4, 10],
      [5, 10],
      [6, 10],
      [3, 11],
      [7, 11],
      [2, 12],
      [8, 12],
      [2, 13],
      [8, 13],
      [5, 14],
      [3, 15],
      [7, 15],
      [4, 16],
      [5, 16],
      [6, 16],
      [5, 17],
      [2, 20],
      [3, 20],
      [4, 20],
      [2, 21],
      [3, 21],
      [4, 21],
      [1, 22],
      [5, 22],
      [0, 24],
      [1, 24],
      [5, 24],
      [6, 24],
      [2, 34],
      [3, 34],
      [2, 35],
      [3, 35],
    ],
  },
} as const satisfies Record<string, LifePattern>;

export type LifePatternKey = keyof typeof lifePatterns;

export const createEmptyGrid = (rows: number, cols: number): LifeGrid =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0 as LifeCell));

export const countPopulation = (grid: LifeGrid) =>
  grid.reduce(
    (total, row) => total + row.reduce<number>((rowTotal, cell) => rowTotal + cell, 0),
    0,
  );

export const countLivingNeighbors = (grid: LifeGrid, row: number, col: number) => {
  let count = 0;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) continue;
      if (grid[row + rowOffset]?.[col + colOffset] === 1) count += 1;
    }
  }

  return count;
};

export const nextGeneration = (grid: LifeGrid): LifeGrid =>
  grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const livingNeighbors = countLivingNeighbors(grid, rowIndex, colIndex);

      if (cell === 1) return livingNeighbors === 2 || livingNeighbors === 3 ? 1 : 0;
      return livingNeighbors === 3 ? 1 : 0;
    }),
  );

export const placePattern = (
  rows: number,
  cols: number,
  pattern: LifePattern,
  startRow = Math.floor((rows - pattern.height) / 2),
  startCol = Math.floor((cols - pattern.width) / 2),
) => {
  const grid = createEmptyGrid(rows, cols);

  for (const [row, col] of pattern.cells) {
    const nextRow = startRow + row;
    const nextCol = startCol + col;
    if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
      grid[nextRow][nextCol] = 1;
    }
  }

  return grid;
};
