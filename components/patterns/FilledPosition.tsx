import { Corner } from '@/data/patternTypes';
import { PATTERN_STROKE, PATTERN_STROKE_WIDTH, SvgFrame } from './shared';

export function FilledPosition({
  shape,
  corner,
  size = 72,
}: {
  shape: 'square' | 'quarter';
  corner: Corner;
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
