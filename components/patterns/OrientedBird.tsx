import { PATTERN_STROKE, PATTERN_STROKE_WIDTH, SvgFrame } from './shared';

export function OrientedBird({
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
        <polygon
          points={body}
          fill="white"
          stroke={PATTERN_STROKE}
          strokeWidth={PATTERN_STROKE_WIDTH}
        />
        <polygon
          points={wing}
          fill="white"
          stroke={PATTERN_STROKE}
          strokeWidth={PATTERN_STROKE_WIDTH}
        />
        <circle cx={cx + 8 * scale} cy={cy - 2 * scale} r={2} fill={PATTERN_STROKE} />
      </g>
    </SvgFrame>
  );
}
