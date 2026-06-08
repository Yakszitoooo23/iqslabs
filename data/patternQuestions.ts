/**
 * Pattern matrix items Q6-Q26.
 * Each item: one missing cell (bottom-right), six options, unique correctIndex.
 *
 * Distribution: nested×4, corner×3, orientation×3, fill×3, block×3, line×2, grid×2, count×1
 */

import type { PatternCellData, PatternType } from './patternTypes';

export interface PatternMatrixStep {
  id: number;
  type: 'pattern_matrix';
  patternType: PatternType;
  grid: (PatternCellData | null)[][];
  options: PatternCellData[];
  correctIndex: number;
  difficulty: number;
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

/** Build 3×3 grid; null = missing (default bottom-right). */
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
      if (r === missing[0] && c === missing[1]) {
        g[r][c] = null;
      } else {
        g[r][c] = cells[i++];
      }
    }
  }
  return g;
}

function grid2(cells: PatternCellData[]): (PatternCellData | null)[][] {
  return [
    [cells[0], cells[1]],
    [cells[2], null],
  ];
}

function pm(
  id: number,
  patternType: PatternType,
  grid: (PatternCellData | null)[][],
  correct: PatternCellData,
  distractors: PatternCellData[],
  difficulty: number,
  correctIndex: number,
): PatternMatrixStep {
  const options = [...distractors];
  options.splice(correctIndex, 0, correct);
  if (options.length !== 6) {
    throw new Error(`Q${id}: expected 6 options, got ${options.length}`);
  }
  return {
    id,
    type: 'pattern_matrix',
    patternType,
    grid,
    options,
    correctIndex,
    difficulty,
  };
}

// --- Q6-Q10: easy 2×2, single rule -------------------------------------------

const q6 = pm(
  6,
  'nested',
  grid2([
    nest('square', 'circle'),
    nest('square', 'triangle'),
    nest('triangle', 'circle'),
  ]),
  nest('triangle', 'triangle'),
  [
    nest('triangle', 'square'),
    nest('square', 'square'),
    nest('circle', 'triangle'),
    nest('triangle', 'circle'),
    nest('square', 'circle'),
  ],
  1,
  2,
); // Rule: outer=row (sq,tri); inner=col (circ,tri)

const q7 = pm(
  7,
  'corner_mark',
  grid2([corner('tl'), corner('tr'), corner('bl')]),
  corner('br'),
  [corner('tl'), corner('tr'), corner('bl'), corner('tl'), corner('tr')],
  1,
  3,
); // Rule: mark rotates clockwise tl→tr→br→bl

const q8 = pm(
  8,
  'orientation',
  grid2([bird('right'), bird('down'), bird('left')]),
  bird('up'),
  [bird('right'), bird('left'), bird('down'), bird('right'), bird('left')],
  2,
  4,
); // Rule: bird rotates 90° clockwise

const q9 = pm(
  9,
  'filled_position',
  grid2([
    fill('square', 'tl'),
    fill('square', 'tr'),
    fill('square', 'bl'),
  ]),
  fill('square', 'br'),
  [
    fill('square', 'tl'),
    fill('square', 'tr'),
    fill('quarter', 'br'),
    fill('square', 'bl'),
    fill('quarter', 'bl'),
  ],
  2,
  1,
); // Rule: filled square moves clockwise through corners

const q10 = pm(
  10,
  'block_config',
  grid2([
    blocks([
      [1, 0],
      [0, 0],
    ]),
    blocks([
      [1, 1],
      [0, 0],
    ]),
    blocks([
      [1, 1],
      [1, 0],
    ]),
  ]),
  blocks([
    [1, 1],
    [1, 1],
  ]),
  [
    blocks([
      [1, 0],
      [1, 0],
    ]),
    blocks([
      [1, 1],
      [0, 1],
    ]),
    blocks([
      [0, 1],
      [1, 1],
    ]),
    blocks([
      [1, 0],
      [0, 1],
    ]),
    blocks([
      [1, 1],
      [0, 0],
    ]),
  ],
  2,
  0,
); // Rule: one additional filled cell each step (reading order)

// --- Q11-Q17: medium 3×3, single rule (row OR column) ------------------------

const q11 = pm(
  11,
  'nested',
  grid3([
    nest('circle', 'circle'),
    nest('circle', 'square'),
    nest('circle', 'triangle'),
    nest('square', 'circle'),
    nest('square', 'square'),
    nest('square', 'triangle'),
    nest('triangle', 'circle'),
    nest('triangle', 'square'),
  ]),
  nest('triangle', 'triangle'),
  [
    nest('triangle', 'square'),
    nest('square', 'triangle'),
    nest('circle', 'triangle'),
    nest('triangle', 'circle'),
    nest('square', 'square'),
  ],
  3,
  4,
); // Rule: outer fixed per row; inner cycles circle→square→triangle per column

const q12 = pm(
  12,
  'corner_mark',
  grid3([
    corner('tl'),
    corner('tl'),
    corner('tl'),
    corner('tr'),
    corner('tr'),
    corner('tr'),
    corner('br'),
    corner('br'),
  ]),
  corner('br'),
  [corner('bl'), corner('tr'), corner('br'), corner('tl'), corner('bl')],
  3,
  2,
); // Rule: mark constant within each column (cols: tl, tr, br)

const q13 = pm(
  13,
  'orientation',
  grid3([
    bird('right'),
    bird('right'),
    bird('right'),
    bird('down'),
    bird('down'),
    bird('down'),
    bird('left'),
    bird('left'),
  ]),
  bird('left'),
  [bird('up'), bird('right'), bird('down'), bird('left'), bird('up')],
  3,
  5,
); // Rule: bird facing constant per row (right, down, left)

const q14 = pm(
  14,
  'filled_position',
  grid3([
    fill('quarter', 'tl'),
    fill('quarter', 'tr'),
    fill('quarter', 'br'),
    fill('quarter', 'tl'),
    fill('quarter', 'tr'),
    fill('quarter', 'br'),
    fill('quarter', 'tl'),
    fill('quarter', 'tr'),
  ]),
  fill('quarter', 'br'),
  [
    fill('quarter', 'bl'),
    fill('quarter', 'tl'),
    fill('square', 'br'),
    fill('quarter', 'tr'),
    fill('quarter', 'br'),
  ],
  3,
  1,
); // Rule: quarter-circle corner matches column (tl, tr, br repeating)

const q15 = pm(
  15,
  'block_config',
  grid3([
    blocks([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]),
    blocks([
      [1, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]),
    blocks([
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ]),
    blocks([
      [1, 0, 0],
      [1, 0, 0],
      [0, 0, 0],
    ]),
    blocks([
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ]),
    blocks([
      [1, 1, 1],
      [1, 0, 0],
      [0, 0, 0],
    ]),
    blocks([
      [1, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]),
    blocks([
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]),
  ]),
  blocks([
    [1, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ]),
  [
    blocks([
      [1, 1, 1],
      [1, 1, 1],
      [0, 0, 0],
    ]),
    blocks([
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ]),
    blocks([
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ]),
    blocks([
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ]),
    blocks([
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ]),
  ],
  3,
  3,
); // Rule: row index = count of filled cells in top row of block

const q16 = pm(
  16,
  'line_density',
  grid3([
    lines('diverge'),
    lines('diverge'),
    lines('diverge'),
    lines('converge'),
    lines('converge'),
    lines('converge'),
    lines('parallel'),
    lines('parallel'),
  ]),
  lines('parallel'),
  [lines('dense'), lines('diverge'), lines('converge'), lines('parallel'), lines('dense')],
  3,
  0,
); // Rule: line style constant per row

const q17 = pm(
  17,
  'grid_density',
  grid3([
    gridD(3, 1),
    gridD(3, 2),
    gridD(3, 3),
    gridD(3, 2),
    gridD(3, 3),
    gridD(3, 4),
    gridD(3, 3),
    gridD(3, 4),
  ]),
  gridD(3, 5),
  [gridD(3, 4), gridD(3, 6), gridD(3, 3), gridD(3, 5), gridD(4, 5)],
  3,
  2,
); // Rule: filled dots = row + col + 1 (1-indexed positions in 3×3 subgrid)

// --- Q18-Q23: hard 3×3, Latin-style (unique per row AND column) -------------

function outerLatin(r: number, c: number): (typeof C)[number] {
  return C[(r + c) % 3];
}
function innerLatin(r: number, c: number): (typeof C)[number] {
  return C[(r + 2 * c) % 3];
}

const q18Cells: PatternCellData[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 2 && c === 2) continue;
    q18Cells.push(nest(outerLatin(r, c), innerLatin(r, c)));
  }
}

const q18 = pm(
  18,
  'nested',
  grid3(q18Cells),
  nest(outerLatin(2, 2), innerLatin(2, 2)),
  [
    nest('square', 'square'),
    nest('triangle', 'circle'),
    nest('circle', 'triangle'),
    nest('square', 'circle'),
    nest('triangle', 'triangle'),
  ],
  4,
  1,
); // outer[r][c]=(r+c)%3, inner[r][c]=(r+2c)%3, each shape once per row/col

const cornerLatin = (r: number, c: number) => corners[(r + c) % 4];

const q19Cells: PatternCellData[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 2 && c === 2) continue;
    q19Cells.push(corner(cornerLatin(r, c)));
  }
}

const q19 = pm(
  19,
  'corner_mark',
  grid3(q19Cells),
  corner(cornerLatin(2, 2)),
  [corner('tl'), corner('tr'), corner('bl'), corner('br'), corner('tl')],
  4,
  4,
); // (r+c)%4, in 3×3 each row/col has 3 distinct corners

const dirs: ('right' | 'up' | 'left')[] = ['right', 'up', 'left'];
const birdLatin = (r: number, c: number) => dirs[(r + c) % 3];

const q20Cells: PatternCellData[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 2 && c === 2) continue;
    q20Cells.push(bird(birdLatin(r, c)));
  }
}

const q20 = pm(
  20,
  'orientation',
  grid3(q20Cells),
  bird(birdLatin(2, 2)),
  [bird('down'), bird('right'), bird('left'), bird('up'), bird('down')],
  4,
  0,
); // Each row/col contains right, up, left exactly once

const fillLatin = (r: number, c: number) => corners[(r + 2 * c) % 4];

const q21Cells: PatternCellData[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 2 && c === 2) continue;
    q21Cells.push(fill('quarter', fillLatin(r, c)));
  }
}

const q21 = pm(
  21,
  'filled_position',
  grid3(q21Cells),
  fill('quarter', fillLatin(2, 2)),
  [
    fill('quarter', 'tl'),
    fill('quarter', 'br'),
    fill('square', 'bl'),
    fill('quarter', 'tr'),
    fill('quarter', 'bl'),
  ],
  4,
  3,
); // corner = (r+2c)%4 Latin on corners

const blockPatterns: PatternCellData[] = [
  blocks([
    [1, 0],
    [0, 0],
  ]),
  blocks([
    [0, 1],
    [0, 0],
  ]),
  blocks([
    [0, 0],
    [1, 0],
  ]),
  blocks([
    [0, 0],
    [0, 1],
  ]),
  blocks([
    [1, 1],
    [0, 0],
  ]),
  blocks([
    [0, 0],
    [1, 1],
  ]),
  blocks([
    [1, 0],
    [1, 0],
  ]),
  blocks([
    [0, 1],
    [0, 1],
  ]),
  blocks([
    [1, 0],
    [0, 1],
  ]),
];

const blockLatin = (r: number, c: number) => blockPatterns[(r + 2 * c) % 3];

const q22Cells: PatternCellData[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 2 && c === 2) continue;
    q22Cells.push(blockLatin(r, c));
  }
}

const q22 = pm(
  22,
  'block_config',
  grid3(q22Cells),
  blockLatin(2, 2),
  [blockPatterns[0], blockPatterns[1], blockPatterns[2], blockPatterns[4], blockPatterns[5]],
  4,
  2,
); // Three tetromino-style patterns permuted Latin-style

const lineLatin = (r: number, c: number): PatternCellData => {
  const v = ['diverge', 'converge', 'parallel'] as const;
  return lines(v[(r + c) % 3]);
};

const q23Cells: PatternCellData[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 2 && c === 2) continue;
    q23Cells.push(lineLatin(r, c));
  }
}

const q23 = pm(
  23,
  'line_density',
  grid3(q23Cells),
  lineLatin(2, 2),
  [lines('dense'), lines('diverge'), lines('converge'), lines('parallel'), lines('dense')],
  4,
  5,
); // line variant Latin per (r+c)%3

// --- Q24-Q26: hardest 3×3, combined rules -----------------------------------

const outerCombo = (r: number, c: number) => C[(r + c) % 3];
const innerCombo = (r: number, c: number) => C[(2 * r + c) % 3];

const q24Cells: PatternCellData[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 2 && c === 2) continue;
    q24Cells.push(nest(outerCombo(r, c), innerCombo(r, c)));
  }
}

const q24 = pm(
  24,
  'nested',
  grid3(q24Cells),
  nest(outerCombo(2, 2), innerCombo(2, 2)),
  [
    nest('circle', 'square'),
    nest('triangle', 'triangle'),
    nest('square', 'circle'),
    nest('triangle', 'square'),
    nest('circle', 'triangle'),
  ],
  5,
  2,
); // outer=(r+c)%3 AND inner=(2r+c)%3 (dual Latin, harder than Q18's r+2c inner)

const q25Cells: PatternCellData[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 2 && c === 2) continue;
    const filled = ((r + 1) * (c + 1)) % 7 + 1;
    const rot = ((r + c) * 90) % 360 as 0 | 90 | 180 | 270;
    q25Cells.push(gridD(3, Math.min(filled, 9), rot));
  }
}

const q25Correct = gridD(
  3,
  Math.min(((2 + 1) * (2 + 1)) % 7 + 1, 9),
  ((2 + 2) * 90) % 360 as 0 | 90 | 180 | 270,
);

const q25 = pm(
  25,
  'grid_density',
  grid3(q25Cells),
  q25Correct,
  [gridD(3, 5, 180), gridD(3, 4, 90), gridD(3, 6, 0), gridD(3, 3, 270), gridD(4, 7, 90)],
  5,
  1,
); // filled=(r+1)(c+1)%7+1, rotation=(r+c)×90°

const q26Cells: PatternCellData[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 2 && c === 2) continue;
    q26Cells.push(countDots(r + c + 1));
  }
}

const q26 = pm(
  26,
  'count_progression',
  grid3(q26Cells),
  countDots(5),
  [countDots(4), countDots(3), countDots(6), countDots(2), countDots(1)],
  5,
  0,
); // dot count = r + c + 1 → (2,2) = 5 dots

export const PATTERN_MATRIX_STEPS: PatternMatrixStep[] = [
  q6,
  q7,
  q8,
  q9,
  q10,
  q11,
  q12,
  q13,
  q14,
  q15,
  q16,
  q17,
  q18,
  q19,
  q20,
  q21,
  q22,
  q23,
  q24,
  q25,
  q26,
];

/** Matrices reordered by difficulty for Q7-Q27 in the full test. */
export function getOrderedPatternMatrixSteps(): PatternMatrixStep[] {
  const byDifficulty = (d: number) =>
    PATTERN_MATRIX_STEPS.filter((s) => s.difficulty === d).sort((a, b) => a.id - b.id);

  const ordered = [
    ...byDifficulty(1),
    ...byDifficulty(2),
    ...byDifficulty(3),
    ...byDifficulty(4),
    ...byDifficulty(5),
  ];

  return ordered.map((step, i) => ({ ...step, id: 7 + i }));
}
