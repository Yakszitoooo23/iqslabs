export type Corner = 'tl' | 'tr' | 'br' | 'bl';
export type ShapeType = 'circle' | 'square' | 'triangle';

export type PatternType =
  | 'nested'
  | 'corner_mark'
  | 'orientation'
  | 'filled_position'
  | 'block_config'
  | 'line_density'
  | 'grid_density'
  | 'count_progression';

/** Visual cell descriptor, rendered as black SVG on white. */
export type PatternCellData =
  | { kind: 'nested'; outer: ShapeType; inner: ShapeType }
  | { kind: 'corner_marks'; markCorner: Corner }
  | { kind: 'bird'; facing: 'left' | 'right' | 'up' | 'down' }
  | { kind: 'fill_position'; shape: 'square' | 'quarter'; corner: Corner }
  | { kind: 'blocks'; cells: number[][] }
  | { kind: 'lines'; variant: 'diverge' | 'converge' | 'parallel' | 'dense' }
  | { kind: 'grid_density'; size: 3 | 4; filled: number; rotation?: 0 | 90 | 180 | 270 }
  | { kind: 'count'; dots: number };

export type VisualMemoryShape = 'circle' | 'square' | 'triangle' | 'star';

export type PersonalityDimension =
  | 'learning_style_practical'
  | 'thinking_style_deliberate'
  | 'pattern_self_perception'
  | 'speed_self_perception'
  | 'self_awareness_value'
  | 'sharpness_importance'
  | 'improvement_goal';
