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
  const stroke = { stroke: PATTERN_STROKE, strokeWidth: PATTERN_STROKE_WIDTH };
  if (shape === 'circle') {
    return <circle cx={cx} cy={cy} r={r} fill={fill} {...stroke} />;
  }
  if (shape === 'square') {
    return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={fill} {...stroke} />;
  }
  const h = r * 1.15;
  const w = r * 1.05;
  return (
    <polygon
      points={`${cx},${cy - h} ${cx + w},${cy + h * 0.75} ${cx - w},${cy + h * 0.75}`}
      fill={fill}
      {...stroke}
      strokeLinejoin="round"
    />
  );
}

export function NestedShape({
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
