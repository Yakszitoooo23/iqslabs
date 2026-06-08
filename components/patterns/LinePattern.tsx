import { PATTERN_STROKE, PATTERN_STROKE_WIDTH, SvgFrame } from './shared';

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
        const spread =
          variant === 'diverge' ? offset * 1.4 : variant === 'converge' ? offset * 0.5 : offset;
        const endX =
          variant === 'converge'
            ? cx + offset * 0.2
            : variant === 'diverge'
              ? cx + offset * 1.8
              : cx + offset;
        return (
          <line
            key={i}
            x1={cx + spread}
            y1={size * 0.18}
            x2={endX}
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
