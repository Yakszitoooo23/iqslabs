import type { ReactNode } from 'react';

export const PATTERN_STROKE = '#000000';
export const PATTERN_STROKE_WIDTH = 1.75;

interface SvgFrameProps {
  size?: number;
  children: ReactNode;
  className?: string;
}

export function SvgFrame({ size = 72, children, className = '' }: SvgFrameProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}
