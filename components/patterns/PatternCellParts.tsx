import { ShapeType } from '@/data/patternTypes';
import { PATTERN_STROKE, PATTERN_STROKE_WIDTH, SvgFrame } from './shared';

function BasicShape({
  shape,
  cx,
  cy,
  r,
  fill = 'white',
}: {
  shape: ShapeType;
  cx: number;
  cy: number;
  r: number;
  fill?: string;
}) {
  const props = { fill, stroke: PATTERN_STROKE, strokeWidth: PATTERN_STROKE_WIDTH };

  if (shape === 'circle') {
    return <circle cx={cx} cy={cy} r={r} {...props} />;
  }
  if (shape === 'square') {
    return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} {...props} />;
  }
  const h = r * 1.15;
  const w = r * 1.05;
  return (
    <polygon
      points={`${cx},${cy - h} ${cx + w},${cy + h * 0.75} ${cx - w},${cy + h * 0.75}`}
      {...props}
      strokeLinejoin="round"
    />
  );
}

export function NestedPattern({
  outer,
  inner,
  size = 72,
}: {
  outer: ShapeType;
  inner: ShapeType;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  return (
    <SvgFrame size={size}>
      <BasicShape shape={outer} cx={cx} cy={cy} r={size * 0.34} />
      <BasicShape shape={inner} cx={cx} cy={cy} r={size * 0.14} />
    </SvgFrame>
  );
}

export function CornerMarksPattern({
  markCorner,
  size = 72,
}: {
  markCorner: 'tl' | 'tr' | 'br' | 'bl';
  size?: number;
}) {
  const pad = size * 0.14;
  const len = size * 0.18;
  const positions: Record<string, [number, number, number, number, number, number]> = {
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

export function FillPositionPattern({
  shape,
  corner,
  size = 72,
}: {
  shape: 'square' | 'quarter';
  corner: 'tl' | 'tr' | 'br' | 'bl';
  size?: number;
}) {
  const pad = size * 0.16;
  const inner = size - pad * 2;
  const half = inner / 2;
  const cornerMap = {
    tl: [pad, pad],
    tr: [pad + half, pad],
    br: [pad + half, pad + half],
    bl: [pad, pad + half],
  };
  const [x, y] = cornerMap[corner];

  return (
    <SvgFrame size={size}>
      <rect
        x={pad}
        y={pad}
        width={inner}
        height={inner}
        fill="white"
        stroke={PATTERN_STROKE}
        strokeWidth={PATTERN_STROKE_WIDTH}
      />
      {shape === 'square' ? (
        <rect x={x} y={y} width={half * 0.85} height={half * 0.85} fill={PATTERN_STROKE} />
      ) : (
        <path
          d={`M ${x} ${y} h ${half * 0.85} v ${half * 0.85} A ${half * 0.85} ${half * 0.85} 0 0 1 ${x} ${y} Z`}
          fill={PATTERN_STROKE}
        />
      )}
    </SvgFrame>
  );
}
