import { PATTERN_STROKE, PATTERN_STROKE_WIDTH, SvgFrame } from './shared';

export function GridDensity({
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
