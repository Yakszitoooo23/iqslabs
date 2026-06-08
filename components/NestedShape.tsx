export type ShapeType = 'circle' | 'square' | 'triangle';

const STROKE = '#1E3A8A';
const STROKE_WIDTH = 2;

interface NestedShapeProps {
  outer: ShapeType;
  inner: ShapeType;
  size?: number;
  className?: string;
}

function ShapePath({
  shape,
  cx,
  cy,
  radius,
  fill = 'white',
}: {
  shape: ShapeType;
  cx: number;
  cy: number;
  radius: number;
  fill?: string;
}) {
  if (shape === 'circle') {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fill}
        stroke={STROKE}
        strokeWidth={STROKE_WIDTH}
      />
    );
  }

  if (shape === 'square') {
    return (
      <rect
        x={cx - radius}
        y={cy - radius}
        width={radius * 2}
        height={radius * 2}
        fill={fill}
        stroke={STROKE}
        strokeWidth={STROKE_WIDTH}
      />
    );
  }

  const h = radius * 1.15;
  const w = radius * 1.1;
  return (
    <polygon
      points={`${cx},${cy - h} ${cx + w},${cy + h * 0.75} ${cx - w},${cy + h * 0.75}`}
      fill={fill}
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
    />
  );
}

export function NestedShape({ outer, inner, size = 72, className = '' }: NestedShapeProps) {
  const outerRadius = size * 0.38;
  const innerRadius = size * 0.16;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden
    >
      <ShapePath shape={outer} cx={cx} cy={cy} radius={outerRadius} />
      <ShapePath shape={inner} cx={cx} cy={cy} radius={innerRadius} />
    </svg>
  );
}

export function MissingCell({ size = 72, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center border-2 border-dashed border-navy bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-2xl font-bold text-navy">?</span>
    </div>
  );
}
