import { PATTERN_STROKE, PATTERN_STROKE_WIDTH, SvgFrame } from './shared';

export function BirdPattern({
  facing,
  size = 72,
}: {
  facing: 'left' | 'right' | 'up' | 'down';
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const scale = facing === 'up' || facing === 'down' ? 1 : 1;
  const body = `${cx},${cy - 8 * scale} ${cx + 14 * scale},${cy + 6 * scale} ${cx},${cy + 2 * scale} ${cx - 14 * scale},${cy + 6 * scale}`;
  const wing = `${cx - 6 * scale},${cy} ${cx + 10 * scale},${cy - 4 * scale} ${cx + 6 * scale},${cy + 4 * scale}`;

  const rotation =
    facing === 'right' ? 0 : facing === 'left' ? 180 : facing === 'up' ? -90 : 90;

  return (
    <SvgFrame size={size}>
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        <polygon points={body} fill="white" stroke={PATTERN_STROKE} strokeWidth={PATTERN_STROKE_WIDTH} />
        <polygon points={wing} fill="white" stroke={PATTERN_STROKE} strokeWidth={PATTERN_STROKE_WIDTH} />
        <circle cx={cx + 8 * scale} cy={cy - 2 * scale} r={2} fill={PATTERN_STROKE} />
      </g>
    </SvgFrame>
  );
}

export function BlockPattern({ cells, size = 72 }: { cells: number[][]; size?: number }) {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 1;
  const pad = size * 0.12;
  const cellW = (size - pad * 2) / cols;
  const cellH = (size - pad * 2) / rows;

  return (
    <SvgFrame size={size}>
      {cells.flatMap((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={pad + c * cellW + 1}
              y={pad + r * cellH + 1}
              width={cellW - 2}
              height={cellH - 2}
              fill={PATTERN_STROKE}
              stroke={PATTERN_STROKE}
              strokeWidth={1}
            />
          ) : null,
        ),
      )}
    </SvgFrame>
  );
}

export function LinePattern({
  variant,
  size = 72,
}: {
  variant: 'diverge' | 'converge' | 'parallel' | 'dense';
  size?: number;
}) {
  const cx = size / 2;
  const lines =
    variant === 'parallel'
      ? [-12, 0, 12]
      : variant === 'dense'
        ? [-16, -8, 0, 8, 16]
        : [-14, 0, 14];

  return (
    <SvgFrame size={size}>
      {lines.map((offset, i) => {
        const spread = variant === 'diverge' ? offset * 1.4 : variant === 'converge' ? offset * 0.5 : offset;
        return (
          <line
            key={i}
            x1={cx + spread}
            y1={size * 0.18}
            x2={cx + (variant === 'converge' ? offset * 0.2 : variant === 'diverge' ? offset * 1.8 : offset)}
            y2={size * 0.82}
            stroke={PATTERN_STROKE}
            strokeWidth={PATTERN_STROKE_WIDTH}
            strokeLinecap="round"
          />
        );
      })}
    </SvgFrame>
  );
}

export function GridPattern({
  gridSize,
  filled,
  rotation = 0,
  size = 72,
}: {
  gridSize: 3 | 4;
  filled: number;
  rotation?: 0 | 90 | 180 | 270;
  size?: number;
}) {
  const pad = size * 0.14;
  const inner = size - pad * 2;
  const step = inner / gridSize;
  const cx = size / 2;

  const dots: [number, number][] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (r * gridSize + c < filled) {
        dots.push([pad + c * step + step / 2, pad + r * step + step / 2]);
      }
    }
  }

  return (
    <SvgFrame size={size}>
      <g transform={`rotate(${rotation} ${cx} ${cx})`}>
        <rect
          x={pad}
          y={pad}
          width={inner}
          height={inner}
          fill="white"
          stroke={PATTERN_STROKE}
          strokeWidth={PATTERN_STROKE_WIDTH}
        />
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={step * 0.22} fill={PATTERN_STROKE} />
        ))}
      </g>
    </SvgFrame>
  );
}

export function DiamondPattern({ rings, size = 72 }: { rings: 1 | 2 | 3; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;

  return (
    <SvgFrame size={size}>
      {Array.from({ length: rings }, (_, i) => {
        const r = size * (0.12 + i * 0.1);
        return (
          <polygon
            key={i}
            points={`${cx},${cy - r * 2} ${cx + r * 1.4},${cy} ${cx},${cy + r * 2} ${cx - r * 1.4},${cy}`}
            fill={i === rings - 1 ? PATTERN_STROKE : 'white'}
            stroke={PATTERN_STROKE}
            strokeWidth={PATTERN_STROKE_WIDTH}
          />
        );
      })}
    </SvgFrame>
  );
}
