import { Corner } from '@/data/patternTypes';
import { PATTERN_STROKE, PATTERN_STROKE_WIDTH, SvgFrame } from './shared';

export function CornerMark({ markCorner, size = 72 }: { markCorner: Corner; size?: number }) {
  const pad = size * 0.14;
  const len = size * 0.18;
  const positions: Record<Corner, [number, number, number, number, number, number]> = {
    tl: [pad, pad + len, pad, pad, pad + len, pad],
    tr: [size - pad, pad + len, size - pad, pad, size - pad - len, pad],
    br: [size - pad, size - pad - len, size - pad, size - pad, size - pad - len, size - pad],
    bl: [pad, size - pad - len, pad, size - pad, pad + len, size - pad],
  };
  const [x1, y1, x2, y2, x3, y3] = positions[markCorner];

  return (
    <SvgFrame size={size}>
      <rect
        x={pad}
        y={pad}
        width={size - pad * 2}
        height={size - pad * 2}
        fill="white"
        stroke={PATTERN_STROKE}
        strokeWidth={PATTERN_STROKE_WIDTH}
      />
      <polyline
        points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
        fill="none"
        stroke={PATTERN_STROKE}
        strokeWidth={PATTERN_STROKE_WIDTH + 0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgFrame>
  );
}
