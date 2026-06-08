import type { PatternCellData, PatternType } from './patternTypes';

export interface PracticeQuestion {
  id: number;
  patternType: PatternType;
  grid: (PatternCellData | null)[][];
  options: PatternCellData[];
  correctIndex: number;
  difficulty: 1 | 2 | 3 | 4;
}

const C = ['circle', 'square', 'triangle'] as const;
const corners = ['tl', 'tr', 'br', 'bl'] as const;

function nest(outer: (typeof C)[number], inner: (typeof C)[number]): PatternCellData {
  return { kind: 'nested', outer, inner };
}
function corner(c: (typeof corners)[number]): PatternCellData {
  return { kind: 'corner_marks', markCorner: c };
}
function bird(f: 'left' | 'right' | 'up' | 'down'): PatternCellData {
  return { kind: 'bird', facing: f };
}
function fill(
  shape: 'square' | 'quarter',
  c: (typeof corners)[number],
): PatternCellData {
  return { kind: 'fill_position', shape, corner: c };
}
function blocks(cells: number[][]): PatternCellData {
  return { kind: 'blocks', cells };
}
function lines(v: 'diverge' | 'converge' | 'parallel' | 'dense'): PatternCellData {
  return { kind: 'lines', variant: v };
}
function gridD(
  size: 3 | 4,
  filled: number,
  rotation: 0 | 90 | 180 | 270 = 0,
): PatternCellData {
  return { kind: 'grid_density', size, filled, rotation };
}
function countDots(n: number): PatternCellData {
  return { kind: 'count', dots: n };
}

function grid2(cells: PatternCellData[]): (PatternCellData | null)[][] {
  return [[cells[0], cells[1]], [cells[2], null]];
}

function grid3(
  cells: PatternCellData[],
  missing: [number, number] = [2, 2],
): (PatternCellData | null)[][] {
  const g: (PatternCellData | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  let i = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (r === missing[0] && c === missing[1]) g[r][c] = null;
      else g[r][c] = cells[i++];
    }
  }
  return g;
}

function pq(
  id: number,
  patternType: PatternType,
  grid: (PatternCellData | null)[][],
  correct: PatternCellData,
  distractors: PatternCellData[],
  difficulty: 1 | 2 | 3 | 4,
  correctIndex: number,
): PracticeQuestion {
  const options = [...distractors];
  options.splice(correctIndex, 0, correct);
  return { id, patternType, grid, options, correctIndex, difficulty };
}

/** Practice-only bank, distinct from main test (data/patternQuestions.ts). */
export const PRACTICE_QUESTION_BANK: PracticeQuestion[] = [
  // Easy 2×2 (diff 1-2)
  pq(
    101,
    'nested',
    grid2([
      nest('circle', 'square'),
      nest('circle', 'triangle'),
      nest('square', 'square'),
    ]),
    nest('square', 'triangle'),
    [
      nest('square', 'square'),
      nest('triangle', 'triangle'),
      nest('circle', 'circle'),
      nest('triangle', 'square'),
      nest('circle', 'triangle'),
    ],
    1,
    2,
  ), // outer=column (circ,sq); inner=column (sq,tri)

  pq(
    102,
    'corner_mark',
    grid2([corner('tr'), corner('br'), corner('bl')]),
    corner('tl'),
    [corner('tr'), corner('br'), corner('bl'), corner('tr'), corner('br')],
    1,
    0,
  ), // counter-clockwise tr→br→bl→tl

  pq(
    103,
    'orientation',
    grid2([bird('up'), bird('left'), bird('down')]),
    bird('right'),
    [bird('up'), bird('left'), bird('down'), bird('up'), bird('left')],
    2,
    3,
  ), // CCW rotation

  pq(
    104,
    'filled_position',
    grid2([
      fill('quarter', 'tr'),
      fill('quarter', 'br'),
      fill('quarter', 'bl'),
    ]),
    fill('quarter', 'tl'),
    [
      fill('quarter', 'tr'),
      fill('square', 'tl'),
      fill('quarter', 'br'),
      fill('quarter', 'bl'),
      fill('square', 'tr'),
    ],
    2,
    1,
  ), // quarter moves CCW

  pq(
    105,
    'block_config',
    grid2([
      blocks([
        [1, 1],
        [1, 0],
      ]),
      blocks([
        [1, 1],
        [0, 0],
      ]),
      blocks([
        [1, 0],
        [0, 0],
      ]),
    ]),
    blocks([
      [0, 0],
      [0, 0],
    ]),
    [
      blocks([
        [1, 0],
        [0, 1],
      ]),
      blocks([
        [0, 1],
        [0, 0],
      ]),
      blocks([
        [1, 1],
        [1, 1],
      ]),
      blocks([
        [1, 0],
        [0, 0],
      ]),
      blocks([
        [0, 1],
        [1, 0],
      ]),
    ],
    2,
    4,
  ), // one cell removed each step

  pq(
    106,
    'nested',
    grid2([
      nest('triangle', 'circle'),
      nest('square', 'circle'),
      nest('circle', 'circle'),
    ]),
    nest('circle', 'circle'),
    [
      nest('circle', 'square'),
      nest('triangle', 'square'),
      nest('square', 'triangle'),
      nest('circle', 'triangle'),
      nest('triangle', 'triangle'),
    ],
    1,
    0,
  ), // outer cycles tri→sq→circ; inner fixed circle

  // Medium 3×3 (diff 3)
  pq(
    107,
    'nested',
    grid3([
      nest('circle', 'triangle'),
      nest('square', 'triangle'),
      nest('triangle', 'triangle'),
      nest('circle', 'square'),
      nest('square', 'square'),
      nest('triangle', 'square'),
      nest('circle', 'circle'),
      nest('square', 'circle'),
    ]),
    nest('triangle', 'circle'),
    [
      nest('triangle', 'square'),
      nest('square', 'triangle'),
      nest('circle', 'triangle'),
      nest('triangle', 'triangle'),
      nest('square', 'circle'),
    ],
    3,
    2,
  ), // inner fixed per column; outer cycles per row

  pq(
    108,
    'corner_mark',
    grid3([
      corner('bl'),
      corner('bl'),
      corner('bl'),
      corner('tl'),
      corner('tl'),
      corner('tl'),
      corner('tr'),
      corner('tr'),
    ]),
    corner('tr'),
    [corner('br'), corner('tl'), corner('tr'), corner('bl'), corner('br')],
    3,
    5,
  ), // mark constant per column (bl, tl, tr)

  pq(
    109,
    'orientation',
    grid3([
      bird('up'),
      bird('up'),
      bird('up'),
      bird('left'),
      bird('left'),
      bird('left'),
      bird('down'),
      bird('down'),
    ]),
    bird('down'),
    [bird('right'), bird('up'), bird('left'), bird('down'), bird('right')],
    3,
    0,
  ), // bird facing per row

  pq(
    110,
    'filled_position',
    grid3([
      fill('square', 'bl'),
      fill('square', 'tl'),
      fill('square', 'tr'),
      fill('square', 'bl'),
      fill('square', 'tl'),
      fill('square', 'tr'),
      fill('square', 'bl'),
      fill('square', 'tl'),
    ]),
    fill('square', 'tr'),
    [
      fill('square', 'br'),
      fill('quarter', 'tr'),
      fill('square', 'tl'),
      fill('square', 'bl'),
      fill('square', 'tr'),
    ],
    3,
    4,
  ), // corner cycles bl→tl→tr per column

  pq(
    111,
    'block_config',
    grid3([
      blocks([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 1],
      ]),
      blocks([
        [0, 0, 0],
        [0, 0, 1],
        [0, 0, 1],
      ]),
      blocks([
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
      ]),
      blocks([
        [0, 0, 0],
        [0, 0, 0],
        [1, 0, 0],
      ]),
      blocks([
        [0, 0, 0],
        [0, 0, 1],
        [1, 0, 0],
      ]),
      blocks([
        [0, 0, 1],
        [0, 0, 1],
        [1, 0, 0],
      ]),
      blocks([
        [0, 0, 0],
        [0, 0, 0],
        [1, 1, 0],
      ]),
      blocks([
        [0, 0, 0],
        [0, 0, 1],
        [1, 1, 0],
      ]),
    ]),
    blocks([
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 0],
    ]),
    [
      blocks([
        [1, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
      ]),
      blocks([
        [0, 0, 1],
        [1, 0, 0],
        [1, 1, 0],
      ]),
      blocks([
        [0, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
      ]),
      blocks([
        [0, 0, 1],
        [0, 0, 0],
        [1, 1, 1],
      ]),
      blocks([
        [1, 0, 0],
        [0, 0, 1],
        [1, 1, 0],
      ]),
    ],
    3,
    1,
  ), // bottom row fills left-to-right by column index

  pq(
    112,
    'line_density',
    grid3([
      lines('parallel'),
      lines('parallel'),
      lines('parallel'),
      lines('dense'),
      lines('dense'),
      lines('dense'),
      lines('diverge'),
      lines('diverge'),
    ]),
    lines('diverge'),
    [lines('converge'), lines('parallel'), lines('dense'), lines('diverge'), lines('converge')],
    3,
    3,
  ),

  pq(
    113,
    'grid_density',
    grid3([
      gridD(3, 3),
      gridD(3, 4),
      gridD(3, 5),
      gridD(3, 4),
      gridD(3, 5),
      gridD(3, 6),
      gridD(3, 5),
      gridD(3, 6),
    ]),
    gridD(3, 7),
    [gridD(3, 6), gridD(3, 8), gridD(3, 5), gridD(3, 7), gridD(4, 7)],
    3,
    2,
  ), // filled = row + col + 2

  // Hard (diff 4)
  pq(
    114,
    'nested',
    grid3(
      (() => {
        const cells: PatternCellData[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (r === 2 && c === 2) continue;
            cells.push(nest(C[(r + 2 * c) % 3], C[(2 * r + c) % 3]));
          }
        }
        return cells;
      })(),
    ),
    nest(C[(2 + 2 * 2) % 3], C[(2 * 2 + 2) % 3]),
    [
      nest('square', 'square'),
      nest('triangle', 'circle'),
      nest('circle', 'triangle'),
      nest('square', 'triangle'),
      nest('triangle', 'square'),
    ],
    4,
    0,
  ),

  pq(
    115,
    'corner_mark',
    grid3(
      (() => {
        const cells: PatternCellData[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (r === 2 && c === 2) continue;
            cells.push(corner(corners[(r + 2 * c) % 4]));
          }
        }
        return cells;
      })(),
    ),
    corner(corners[(2 + 2 * 2) % 4]),
    [corner('tl'), corner('tr'), corner('bl'), corner('br'), corner('tl')],
    4,
    2,
  ),

  pq(
    116,
    'orientation',
    grid3(
      (() => {
        const dirs = ['up', 'left', 'down'] as const;
        const cells: PatternCellData[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (r === 2 && c === 2) continue;
            cells.push(bird(dirs[(r + 2 * c) % 3]));
          }
        }
        return cells;
      })(),
    ),
    bird('up'),
    [bird('down'), bird('right'), bird('left'), bird('up'), bird('down')],
    4,
    0,
  ),

  pq(
    117,
    'filled_position',
    grid3(
      (() => {
        const cells: PatternCellData[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (r === 2 && c === 2) continue;
            cells.push(fill('quarter', corners[(r + c + 1) % 4]));
          }
        }
        return cells;
      })(),
    ),
    fill('quarter', corners[(2 + 2 + 1) % 4]),
    [
      fill('quarter', 'tl'),
      fill('quarter', 'br'),
      fill('square', 'bl'),
      fill('quarter', 'tr'),
      fill('quarter', 'bl'),
    ],
    4,
    1,
  ),

  pq(
    118,
    'block_config',
    grid3(
      (() => {
        const patterns = [
          blocks([
            [0, 1],
            [0, 0],
          ]),
          blocks([
            [1, 0],
            [0, 0],
          ]),
          blocks([
            [0, 0],
            [1, 0],
          ]),
        ];
        const cells: PatternCellData[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (r === 2 && c === 2) continue;
            cells.push(patterns[(r + c) % 3]);
          }
        }
        return cells;
      })(),
    ),
    blocks([
      [1, 0],
      [0, 0],
    ]),
    [
      blocks([
        [0, 1],
        [0, 0],
      ]),
      blocks([
        [0, 0],
        [1, 0],
      ]),
      blocks([
        [1, 1],
        [0, 0],
      ]),
      blocks([
        [0, 0],
        [0, 1],
      ]),
      blocks([
        [1, 0],
        [1, 0],
      ]),
    ],
    4,
    0,
  ),

  pq(
    119,
    'line_density',
    grid3(
      (() => {
        const variants = ['parallel', 'dense', 'converge'] as const;
        const cells: PatternCellData[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (r === 2 && c === 2) continue;
            cells.push(lines(variants[(r + 2 * c) % 3]));
          }
        }
        return cells;
      })(),
    ),
    lines('parallel'),
    [lines('converge'), lines('dense'), lines('diverge'), lines('parallel'), lines('dense')],
    4,
    3,
  ),

  pq(
    120,
    'count_progression',
    grid3(
      (() => {
        const cells: PatternCellData[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (r === 2 && c === 2) continue;
            cells.push(countDots(r * 3 + c + 1));
          }
        }
        return cells;
      })(),
    ),
    countDots(9),
    [countDots(8), countDots(7), countDots(10), countDots(6), countDots(5)],
    4,
    2,
  ), // dots = r*3+c+1 → (2,2) = 9
];
