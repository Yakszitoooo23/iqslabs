import { testSteps, LIKERT_LABELS, stepKey, type TestStep } from '@/data/testStructure';
import type { PersonalityDimension } from '@/data/patternTypes';
import { TEST_CONFIG } from '@/data/questions';
import {
  buildCategoryScoresFromSteps,
  computeDimensionScores,
  computeStrengthsAndGrowthAreas,
  type DimensionScore,
  type DimensionScoreOptions,
} from '@/lib/dimensionScores';

export type CognitiveProfile = Partial<Record<PersonalityDimension, number>>;

export { CATEGORY_DISPLAY_NAMES } from '@/lib/dimensionScores';
export type { DimensionScore } from '@/lib/dimensionScores';

export const PERSONALITY_LABELS: Record<PersonalityDimension, string> = {
  learning_style_practical: 'Hands-on learning',
  thinking_style_deliberate: 'Deliberate thinking',
  pattern_self_perception: 'Pattern awareness',
  speed_self_perception: 'Speed under pressure',
  self_awareness_value: 'Self-awareness value',
  sharpness_importance: 'Mental sharpness importance',
  improvement_goal: 'Improvement goal',
};

export interface MultiPhaseScoreResult {
  rawScore: number;
  maxPossible: number;
  scaledScore: number;
  percentile: number;
  category: string;
  strengths: string[];
  weaknesses: string[];
  dimensionScores: DimensionScore[];
  cognitiveProfile: CognitiveProfile;
  profileLabels: Record<string, string>;
  improvementGoal: string | null;
  demographics: { age_range: string };
  totalQuestionsScored: number;
}

export interface QuizSessionAnswers {
  stepAnswers: Record<string, number>;
  likertAnswers: Record<string, number>;
  goalAnswers?: Record<string, number>;
  demographicAnswers?: Record<string, number>;
}

function stepDifficulty(step: TestStep): number {
  if (step.type === 'pattern_matrix') return step.difficulty;
  if (step.type === 'logic_text') return step.difficulty;
  if (step.type === 'memory_recall') return 3;
  if (step.type === 'visual_memory') return 4;
  return 0;
}

function isCorrect(step: TestStep, answerIndex: number | undefined): boolean {
  if (answerIndex === undefined) return false;
  if (
    step.type === 'memory_recall' ||
    step.type === 'visual_memory' ||
    step.type === 'logic_text' ||
    step.type === 'pattern_matrix'
  ) {
    return answerIndex === step.correctIndex;
  }
  return false;
}

function likertToScore(index: number): number {
  return Math.round(((4 - index) / 4) * 100);
}

export function scoreMultiPhaseTest(
  steps: TestStep[] = TEST_CONFIG.iq.steps,
  session: QuizSessionAnswers,
  dimensionOptions?: DimensionScoreOptions,
): MultiPhaseScoreResult {
  let rawScore = 0;
  let maxPossible = 0;
  let totalQuestionsScored = 0;
  const profile: CognitiveProfile = {};
  const profileSums: Partial<Record<PersonalityDimension, number>> = {};
  const profileCounts: Partial<Record<PersonalityDimension, number>> = {};
  let improvementGoal: string | null = null;
  let ageRange = '';

  for (const step of steps) {
    if (step.type === 'likert') {
      const ans = session.likertAnswers[stepKey(step.id)];
      if (ans !== undefined) {
        profileSums[step.dimension] = (profileSums[step.dimension] ?? 0) + likertToScore(ans);
        profileCounts[step.dimension] = (profileCounts[step.dimension] ?? 0) + 1;
      }
      continue;
    }

    if (step.type === 'demographic') {
      const ans = session.demographicAnswers?.[stepKey(step.id)];
      if (ans !== undefined && step.options[ans]) {
        if (step.dimension === 'age_range') {
          ageRange = step.options[ans];
        }
      }
      continue;
    }

    if (step.type === 'goal_select') {
      const ans = session.goalAnswers?.[stepKey(step.id)];
      if (ans !== undefined && step.options[ans]) {
        improvementGoal = step.options[ans];
      }
      continue;
    }

    if (
      step.type !== 'memory_recall' &&
      step.type !== 'visual_memory' &&
      step.type !== 'logic_text' &&
      step.type !== 'pattern_matrix'
    ) {
      continue;
    }

    const weight = stepDifficulty(step);
    maxPossible += weight;

    const userAnswer = session.stepAnswers[stepKey(step.id)];
    if (userAnswer !== undefined) {
      totalQuestionsScored += 1;
      if (isCorrect(step, userAnswer)) {
        rawScore += weight;
      }
    }
  }

  const categoryScores = buildCategoryScoresFromSteps(steps, session.stepAnswers);

  (Object.keys(profileSums) as PersonalityDimension[]).forEach((dim) => {
    const count = profileCounts[dim] ?? 0;
    if (count > 0) {
      profile[dim] = Math.round((profileSums[dim] ?? 0) / count);
    }
  });

  const percentCorrect = maxPossible > 0 ? rawScore / maxPossible : 0;
  const scaledScore = Math.round(70 + percentCorrect * 80);
  const percentile = iqPercentile(scaledScore);

  let category = 'Average';
  if (scaledScore < 85) category = 'Below Average';
  else if (scaledScore < 100) category = 'Low Average';
  else if (scaledScore < 115) category = 'Average';
  else if (scaledScore < 130) category = 'Above Average';
  else if (scaledScore < 145) category = 'High';
  else category = 'Exceptional';

  const { strengths, weaknesses } = computeStrengthsAndGrowthAreas(categoryScores);
  const dimensionScores = computeDimensionScores(
    steps,
    session.stepAnswers,
    dimensionOptions,
  );

  const profileLabels: Record<string, string> = {};
  (Object.keys(profile) as PersonalityDimension[]).forEach((k) => {
    profileLabels[k] = PERSONALITY_LABELS[k] ?? k;
  });

  return {
    rawScore,
    maxPossible,
    scaledScore,
    percentile,
    category,
    strengths,
    weaknesses,
    dimensionScores,
    cognitiveProfile: profile,
    profileLabels,
    improvementGoal,
    demographics: { age_range: ageRange },
    totalQuestionsScored,
  };
}

function iqPercentile(iq: number): number {
  const z = (iq - 100) / 15;
  const cdf = 0.5 * (1 + erf(z / Math.sqrt(2)));
  return Math.round(cdf * 1000) / 10;
}

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export interface ScorableQuestion {
  id: number;
  category: string;
  correctIndex: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface ScoreResult {
  rawScore: number;
  maxPossible: number;
  scaledScore: number;
  percentile: number;
  category: string;
  strengths: string[];
  weaknesses: string[];
}

export function scoreIQTest(
  questions: ScorableQuestion[],
  answers: Record<number, number>,
): ScoreResult {
  const { cognitiveProfile: _p, profileLabels: _l, improvementGoal: _g, dimensionScores: _d, ...rest } =
    scoreMultiPhaseTest(
      questions.map((q) => ({
        id: q.id,
        type: 'pattern_matrix' as const,
        patternType: 'nested' as const,
        grid: [],
        options: [],
        correctIndex: q.correctIndex,
        difficulty: q.difficulty,
      })),
      {
        stepAnswers: Object.fromEntries(
          Object.entries(answers).map(([k, v]) => [String(k), v]),
        ),
        likertAnswers: {},
      },
    );
  return rest;
}

export { LIKERT_LABELS, testSteps };
