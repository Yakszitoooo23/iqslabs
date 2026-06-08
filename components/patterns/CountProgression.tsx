import { PATTERN_STROKE, SvgFrame } from './shared';

/** Dots arranged in a row, count increases or decreases by position. */
export function CountProgression({ dots, size = 72 }: { dots: number; size?: number }) {
  const pad = size * 0.12;
  const inner = size - pad * 2;
  const gap = inner / Math.max(dots, 1);
  const r = Math.min(gap * 0.35, size * 0.1);

  return (
    <SvgFrame size={size}>
      <rect
        x={pad}
        y={pad}
        width={inner}
        height={inner}
        fill="white"
        stroke={PATTERN_STROKE}
        strokeWidth={1.75}
      />
      {Array.from({ length: dots }, (_, i) => (
        <circle
          key={i}
          cx={pad + gap * (i + 0.5)}
          cy={size / 2}
          r={r}
          fill={PATTERN_STROKE}
        />
      ))}
    </SvgFrame>
  );
}
