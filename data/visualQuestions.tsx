import { MatrixCell } from '@/components/MatrixGrid';
import { ShapeType } from '@/components/NestedShape';

export type QuestionCategory = 'pattern' | 'verbal' | 'numeric' | 'spatial' | 'logic';

export interface VisualQuestion {
  id: number;
  category: QuestionCategory;
  /** 3×3 matrix; null marks the missing cell */
  grid: (MatrixCell | null)[][];
  missingRow: number;
  missingCol: number;
  options: MatrixCell[];
  correctIndex: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Short rule description for internal reference */
  rule: string;
}

const SHAPES: ShapeType[] = ['circle', 'square', 'triangle'];

function cellKey(c: MatrixCell): string {
  return `${c.outer}-${c.inner}`;
}

function cellsEqual(a: MatrixCell, b: MatrixCell): boolean {
  return a.outer === b.outer && a.inner === b.inner;
}

/** Each row contains the same three outer shapes in a different order. */
function outerRowLatin(row: number, col: number, baseShift = 0): MatrixCell {
  const outer = SHAPES[(col + row + baseShift) % 3];
  return { outer, inner: 'circle' };
}


/** Row outer latin + column inner latin combined. */
function combinedLatin(
  row: number,
  col: number,
  outerShift = 0,
  innerShift = 0,
): MatrixCell {
  return {
    outer: SHAPES[(col + row + outerShift) % 3],
    inner: SHAPES[(row + col + innerShift) % 3],
  };
}

/** Outer shape fixed per column, inner cycles by row. */
function outerColInnerRow(row: number, col: number, innerShift = 0): MatrixCell {
  return {
    outer: SHAPES[col % 3],
    inner: SHAPES[(row + innerShift) % 3],
  };
}

/** Outer cycles by row, inner fixed per row. */
function outerRowInnerRow(row: number, col: number, outerShift = 0): MatrixCell {
  return {
    outer: SHAPES[(col + row + outerShift) % 3],
    inner: SHAPES[row % 3],
  };
}

function buildGrid(
  builder: (row: number, col: number) => MatrixCell,
  missingRow: number,
  missingCol: number,
): (MatrixCell | null)[][] {
  return Array.from({ length: 3 }, (_, row) =>
    Array.from({ length: 3 }, (_, col) =>
      row === missingRow && col === missingCol ? null : builder(row, col),
    ),
  );
}

function makeDistractors(correct: MatrixCell, builder: (row: number, col: number) => MatrixCell, missingRow: number, missingCol: number): MatrixCell[] {
  const used = new Set([cellKey(correct)]);
  const candidates: MatrixCell[] = [];

  // Nearby cells that violate one rule
  const wrongOuters: MatrixCell[] = SHAPES.flatMap((outer) =>
    SHAPES.map((inner) => ({ outer, inner })),
  );

  for (const c of wrongOuters) {
    if (cellsEqual(c, correct)) continue;
    const key = cellKey(c);
    if (used.has(key)) continue;
    candidates.push(c);
    used.add(key);
    if (candidates.length >= 8) break;
  }

  // Prefer distractors that differ in one attribute from correct
  candidates.sort((a, b) => {
    const aDiff = (a.outer !== correct.outer ? 1 : 0) + (a.inner !== correct.inner ? 1 : 0);
    const bDiff = (b.outer !== correct.outer ? 1 : 0) + (b.inner !== correct.inner ? 1 : 0);
    return aDiff - bDiff;
  });

  const distractors = candidates.slice(0, 3);

  // Fill from builder neighbors if needed
  while (distractors.length < 3) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (r === missingRow && c === missingCol) continue;
        const alt = builder(r, c);
        if (!cellsEqual(alt, correct) && !used.has(cellKey(alt))) {
          distractors.push(alt);
          used.add(cellKey(alt));
          if (distractors.length >= 3) break;
        }
      }
      if (distractors.length >= 3) break;
    }
    break;
  }

  const options = [...distractors.slice(0, 3), correct];
  // Shuffle options deterministically by question id would be bad - use fixed order with correct at varied indices
  return options;
}

interface QuestionSpec {
  id: number;
  category: QuestionCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  missingRow: number;
  missingCol: number;
  builder: (row: number, col: number) => MatrixCell;
  rule: string;
  correctIndex: number;
}

function finalize(spec: QuestionSpec): VisualQuestion {
  const correct = spec.builder(spec.missingRow, spec.missingCol);
  const grid = buildGrid(spec.builder, spec.missingRow, spec.missingCol);
  const distractors = makeDistractors(correct, spec.builder, spec.missingRow, spec.missingCol);

  const options: MatrixCell[] = [];
  const indices = [0, 1, 2, 3];
  // Place correct at specified index
  let dIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === spec.correctIndex) {
      options.push(correct);
    } else {
      options.push(distractors[dIdx++]);
    }
  }

  return {
    id: spec.id,
    category: spec.category,
    grid,
    missingRow: spec.missingRow,
    missingCol: spec.missingCol,
    options,
    correctIndex: spec.correctIndex,
    difficulty: spec.difficulty,
    rule: spec.rule,
  };
}

const SPECS: QuestionSpec[] = [
  // Warm-up: outer row latin, inner constant (difficulty 1-2)
  {
    id: 1,
    category: 'pattern',
    difficulty: 1,
    missingRow: 2,
    missingCol: 2,
    builder: (r, c) => ({ ...outerRowLatin(r, c, 0), inner: 'circle' }),
    rule: 'Each row contains circle, square, and triangle as outer shapes',
    correctIndex: 2,
  },
  {
    id: 2,
    category: 'spatial',
    difficulty: 1,
    missingRow: 1,
    missingCol: 2,
    builder: (r, c) => ({ outer: 'square', inner: SHAPES[(r + c) % 3] }),
    rule: 'Each column contains the same three inner shapes',
    correctIndex: 1,
  },
  {
    id: 3,
    category: 'pattern',
    difficulty: 2,
    missingRow: 0,
    missingCol: 2,
    builder: (r, c) => outerRowLatin(r, c, 1),
    rule: 'Outer shapes cycle through each row',
    correctIndex: 0,
  },
  {
    id: 4,
    category: 'spatial',
    difficulty: 2,
    missingRow: 2,
    missingCol: 0,
    builder: (r, c) => ({ outer: SHAPES[c % 3], inner: SHAPES[(r + 1) % 3] }),
    rule: 'Outer shape is fixed per column; inner shape cycles by row',
    correctIndex: 3,
  },
  {
    id: 5,
    category: 'pattern',
    difficulty: 2,
    missingRow: 1,
    missingCol: 1,
    builder: (r, c) => combinedLatin(r, c, 0, 2),
    rule: 'Both outer and inner shapes follow diagonal progressions',
    correctIndex: 2,
  },
  // Middle difficulty (3)
  {
    id: 6,
    category: 'pattern',
    difficulty: 3,
    missingRow: 2,
    missingCol: 1,
    builder: (r, c) => combinedLatin(r, c, 1, 0),
    rule: 'Row-wise outer permutations with column-wise inner permutations',
    correctIndex: 1,
  },
  {
    id: 7,
    category: 'spatial',
    difficulty: 3,
    missingRow: 0,
    missingCol: 1,
    builder: (r, c) => outerColInnerRow(r, c, 0),
    rule: 'Outer shape determined by column; inner cycles down each column',
    correctIndex: 3,
  },
  {
    id: 8,
    category: 'logic',
    difficulty: 3,
    missingRow: 1,
    missingCol: 0,
    builder: (r, c) => outerRowInnerRow(r, c, 2),
    rule: 'Outer permutes across rows; inner shape is constant within each row',
    correctIndex: 0,
  },
  {
    id: 9,
    category: 'pattern',
    difficulty: 3,
    missingRow: 2,
    missingCol: 2,
    builder: (r, c) => ({
      outer: SHAPES[(r + c) % 3],
      inner: SHAPES[(r - c + 3) % 3],
    }),
    rule: 'Outer sum of indices mod 3; inner difference mod 3',
    correctIndex: 2,
  },
  {
    id: 10,
    category: 'spatial',
    difficulty: 3,
    missingRow: 0,
    missingCol: 0,
    builder: (r, c) => combinedLatin(r, c, 2, 1),
    rule: 'Dual latin-square pattern on outer and inner shapes',
    correctIndex: 1,
  },
  {
    id: 11,
    category: 'pattern',
    difficulty: 3,
    missingRow: 1,
    missingCol: 2,
    builder: (r, c) => ({ outer: SHAPES[(2 - r + c) % 3], inner: SHAPES[(r + c + 1) % 3] }),
    rule: 'Outer shapes reverse-cycle by row; inner follows forward diagonal',
    correctIndex: 3,
  },
  {
    id: 12,
    category: 'logic',
    difficulty: 3,
    missingRow: 2,
    missingCol: 0,
    builder: (r, c) => outerColInnerRow(r, c, 1),
    rule: 'Column determines outer; inner shifts one step per row',
    correctIndex: 0,
  },
  // Harder (4)
  {
    id: 13,
    category: 'pattern',
    difficulty: 4,
    missingRow: 0,
    missingCol: 2,
    builder: (r, c) => combinedLatin(r, c, 1, 2),
    rule: 'Offset latin squares with different phase shifts',
    correctIndex: 2,
  },
  {
    id: 14,
    category: 'spatial',
    difficulty: 4,
    missingRow: 2,
    missingCol: 1,
    builder: (r, c) => ({
      outer: SHAPES[(c - r + 3) % 3],
      inner: SHAPES[(r + 2 * c) % 3],
    }),
    rule: 'Anti-diagonal outer rule; inner weighted by column index',
    correctIndex: 1,
  },
  {
    id: 15,
    category: 'logic',
    difficulty: 4,
    missingRow: 1,
    missingCol: 1,
    builder: (r, c) => ({
      outer: SHAPES[(r + 2 * c) % 3],
      inner: SHAPES[(2 * r - c + 3) % 3],
    }),
    rule: 'Outer weighted by column; inner weighted by row with inversion',
    correctIndex: 3,
  },
  {
    id: 16,
    category: 'pattern',
    difficulty: 4,
    missingRow: 2,
    missingCol: 2,
    builder: (r, c) => combinedLatin(r, c, 2, 2),
    rule: 'Synchronized double latin square with phase offset 2',
    correctIndex: 0,
  },
  {
    id: 17,
    category: 'spatial',
    difficulty: 4,
    missingRow: 0,
    missingCol: 1,
    builder: (r, c) => ({
      outer: SHAPES[(r * 2 + c) % 3],
      inner: SHAPES[(c * 2 + r + 1) % 3],
    }),
    rule: 'Outer doubles row index; inner doubles column index',
    correctIndex: 2,
  },
  {
    id: 18,
    category: 'logic',
    difficulty: 4,
    missingRow: 1,
    missingCol: 2,
    builder: (r, c) => outerRowInnerRow(r, c, 1),
    rule: 'Outer latin per row with row-locked inner shape',
    correctIndex: 1,
  },
  {
    id: 19,
    category: 'pattern',
    difficulty: 4,
    missingRow: 2,
    missingCol: 0,
    builder: (r, c) => ({
      outer: SHAPES[(r + c + 1) % 3],
      inner: SHAPES[(r + 2 * c + 2) % 3],
    }),
    rule: 'Shifted sum outer; inner combines row and doubled column',
    correctIndex: 3,
  },
  {
    id: 20,
    category: 'spatial',
    difficulty: 4,
    missingRow: 0,
    missingCol: 0,
    builder: (r, c) => outerColInnerRow(r, c, 2),
    rule: 'Column-locked outer with staggered inner progression',
    correctIndex: 2,
  },
  // Hardest (5)
  {
    id: 21,
    category: 'logic',
    difficulty: 5,
    missingRow: 2,
    missingCol: 2,
    builder: (r, c) => ({
      outer: SHAPES[(r + 2 * c + 1) % 3],
      inner: SHAPES[(2 * r + c + 2) % 3],
    }),
    rule: 'Outer: row + 2×col; inner: 2×row + col with offsets',
    correctIndex: 1,
  },
  {
    id: 22,
    category: 'pattern',
    difficulty: 5,
    missingRow: 1,
    missingCol: 0,
    builder: (r, c) => ({
      outer: SHAPES[(2 * r - c + 3) % 3],
      inner: SHAPES[(r + c + 2) % 3],
    }),
    rule: 'Outer anti-weighted diagonal; inner forward diagonal with shift',
    correctIndex: 0,
  },
  {
    id: 23,
    category: 'spatial',
    difficulty: 5,
    missingRow: 0,
    missingCol: 2,
    builder: (r, c) => combinedLatin(r, c, 0, 1),
    rule: 'Full dual permutation matrix with inner phase lag',
    correctIndex: 3,
  },
  {
    id: 24,
    category: 'logic',
    difficulty: 5,
    missingRow: 2,
    missingCol: 1,
    builder: (r, c) => ({
      outer: SHAPES[(c + 2 * r + 2) % 3],
      inner: SHAPES[(r + 2 * c + 1) % 3],
    }),
    rule: 'Cross-weighted outer and inner with dual offsets',
    correctIndex: 2,
  },
  {
    id: 25,
    category: 'pattern',
    difficulty: 5,
    missingRow: 1,
    missingCol: 1,
    builder: (r, c) => ({
      outer: SHAPES[(r * c + r + c + 1) % 3],
      inner: SHAPES[(r * c + 2) % 3],
    }),
    rule: 'Non-linear index product governs both outer and inner shapes',
    correctIndex: 1,
  },
];

export const visualQuestions: VisualQuestion[] = SPECS.map(finalize);
