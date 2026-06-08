import { CognitiveProfile } from '@/lib/scoring';
import { PERSONALITY_LABELS } from '@/lib/scoring';
import type { PersonalityDimension } from '@/data/patternTypes';

const RADAR_DIMENSIONS: PersonalityDimension[] = [
  'learning_style_practical',
  'thinking_style_deliberate',
  'pattern_self_perception',
  'speed_self_perception',
  'self_awareness_value',
];

export function CognitiveProfileRadar({
  profile,
  size = 220,
  className = '',
}: {
  profile: CognitiveProfile;
  size?: number;
  className?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.32;
  const n = RADAR_DIMENSIONS.length;

  const valueFor = (key: PersonalityDimension) => profile[key] ?? 50;

  const pointAt = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / 100) * maxR;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const dataPoints = RADAR_DIMENSIONS.map((key, i) => pointAt(i, valueFor(key)));
  const polygon = dataPoints.map(([x, y]) => `${x},${y}`).join(' ');

  const shortLabel = (key: PersonalityDimension) => {
    const full = PERSONALITY_LABELS[key] ?? key;
    return full.split(' ')[0];
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden>
      {[0.25, 0.5, 0.75, 1].map((scale) => {
        const ring = RADAR_DIMENSIONS.map((_, i) => {
          const [x, y] = pointAt(i, scale * 100);
          return `${x},${y}`;
        }).join(' ');
        return (
          <polygon
            key={scale}
            points={ring}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="1"
          />
        );
      })}
      {RADAR_DIMENSIONS.map((key, i) => {
        const [x, y] = pointAt(i, 100);
        const [lx, ly] = pointAt(i, 118);
        return (
          <g key={key}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="#E2E8F0" strokeWidth="1" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#64748B"
              fontSize="8"
            >
              {shortLabel(key)}
            </text>
          </g>
        );
      })}
      <polygon points={polygon} fill="#2563EB33" stroke="#2563EB" strokeWidth="2" />
    </svg>
  );
}
