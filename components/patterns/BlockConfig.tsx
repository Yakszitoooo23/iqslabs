import { PATTERN_STROKE, SvgFrame } from './shared';

export function BlockConfig({ cells, size = 72 }: { cells: number[][]; size?: number }) {
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
