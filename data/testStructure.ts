import type {
  PatternCellData,
  PatternType,
  PersonalityDimension,
  VisualMemoryShape,
} from './patternTypes';
import { getOrderedPatternMatrixSteps } from './patternQuestions';

export type { PatternCellData, PatternType, PersonalityDimension, VisualMemoryShape } from './patternTypes';

export type TestStep =
  | { id: number; type: 'memory_display'; sequence: string; displayMs: number }
  | {
      id: number;
      type: 'memory_recall';
      question: string;
      options: string[];
      correctIndex: number;
      referencesId: number;
    }
  | {
      id: number;
      type: 'logic_text';
      question: string;
      options: string[];
      correctIndex: number;
      difficulty: number;
    }
  | {
      id: number;
      type: 'likert';
      statement: string;
      dimension: PersonalityDimension;
      labels?: readonly string[];
      prompt?: string;
    }
  | {
      id: number;
      type: 'demographic';
      question: string;
      options: string[];
      dimension: string;
    }
  | {
      id: number;
      type: 'visual_memory';
      displaySeconds: number;
      gridContents: { position: number; shape: VisualMemoryShape }[];
      askedPosition: number;
      options: VisualMemoryShape[];
      correctIndex: number;
    }
  | {
      id: number;
      type: 'pattern_matrix';
      patternType: PatternType;
      grid: (PatternCellData | null)[][];
      options: PatternCellData[];
      correctIndex: number;
      difficulty: number;
    }
  | {
      id: number;
      type: 'goal_select';
      question: string;
      options: string[];
      dimension: 'improvement_goal';
    };

export const IMPORTANCE_LABELS = [
  'Extremely important',
  'Very important',
  'Moderately important',
  'Slightly important',
  'Not important',
] as const;

const PHASE_1: TestStep[] = [
  {
    id: 1,
    type: 'likert',
    statement: 'I often notice patterns or details that others miss',
    dimension: 'pattern_self_perception',
  },
  {
    id: 2,
    type: 'likert',
    statement: 'I prefer working through problems carefully rather than rushing to an answer',
    dimension: 'thinking_style_deliberate',
  },
  {
    id: 3,
    type: 'demographic',
    question: "What's your age range?",
    options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    dimension: 'age_range',
  },
];

const PHASE_2: TestStep[] = [
  {
    id: 4,
    type: 'memory_display',
    sequence: '4 9 2 6 1',
    displayMs: 3000,
  },
  {
    id: 5,
    type: 'memory_recall',
    question: 'What was the 3rd digit?',
    options: ['4', '9', '2', '6', '1'],
    correctIndex: 2,
    referencesId: 4,
  },
  {
    id: 6,
    type: 'visual_memory',
    displaySeconds: 3,
    gridContents: [
      { position: 0, shape: 'circle' },
      { position: 2, shape: 'square' },
      { position: 4, shape: 'triangle' },
      { position: 7, shape: 'star' },
    ],
    askedPosition: 2,
    options: ['circle', 'square', 'triangle', 'star'],
    correctIndex: 1,
  },
];

const PHASE_4: TestStep[] = [
  {
    id: 28,
    type: 'likert',
    statement:
      'Knowing my cognitive strengths and weaknesses would help me make better life decisions',
    dimension: 'self_awareness_value',
  },
  {
    id: 29,
    type: 'goal_select',
    question: 'Which area would you most like to improve?',
    options: [
      'Memory and recall',
      'Processing speed and reaction time',
      'Logical reasoning and problem-solving',
      'Pattern recognition',
      'Focus and concentration',
    ],
    dimension: 'improvement_goal',
  },
  {
    id: 30,
    type: 'likert',
    statement: 'How important is mental sharpness in your daily life?',
    dimension: 'sharpness_importance',
    labels: IMPORTANCE_LABELS,
    prompt: 'Select one:',
  },
];

/** Full 30-step assessment. */
export const FULL_TEST_STEPS: TestStep[] = [
  ...PHASE_1,
  ...PHASE_2,
  ...getOrderedPatternMatrixSteps(),
  ...PHASE_4,
];

/** 6-step pilot (one renderer per type). */
export const PILOT_TEST_STEPS: TestStep[] = [
  PHASE_1[0],
  PHASE_1[2],
  PHASE_2[0],
  PHASE_2[1],
  getOrderedPatternMatrixSteps()[0],
  PHASE_4[1],
];

export const testSteps: TestStep[] = FULL_TEST_STEPS;

export const LIKERT_LABELS = [
  'Strongly Agree',
  'Agree',
  'Neutral',
  'Disagree',
  'Strongly Disagree',
] as const;

export function stepKey(id: number): string {
  return String(id);
}

export function isScoredStep(step: TestStep): boolean {
  return (
    step.type === 'memory_recall' ||
    step.type === 'visual_memory' ||
    step.type === 'logic_text' ||
    step.type === 'pattern_matrix'
  );
}

export function requiresAnswer(step: TestStep): boolean {
  return (
    step.type === 'memory_recall' ||
    step.type === 'visual_memory' ||
    step.type === 'logic_text' ||
    step.type === 'likert' ||
    step.type === 'demographic' ||
    step.type === 'pattern_matrix' ||
    step.type === 'goal_select'
  );
}

export function isAutoAdvanceStep(step: TestStep): boolean {
  return step.type === 'memory_display';
}
