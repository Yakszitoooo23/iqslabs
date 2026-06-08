import type { PatternType } from '@/data/patternTypes';
import type { TestStep } from '@/data/testStructure';
import { isScoredStep, stepKey } from '@/data/testStructure';
import { loadMetrics } from '@/lib/quizMetrics';

/** Dashboard cognitive performance dimensions (NOT Likert personality). */
export const COGNITIVE_DIMENSIONS = [
  { key: 'memory', name: 'Memory' },
  { key: 'speed', name: 'Speed' },
  { key: 'logic', name: 'Logic' },
  { key: 'spatial', name: 'Spatial Recognition' },
  { key: 'pattern', name: 'Pattern Recognition' },
] as const;

export type CognitiveDimensionKey = (typeof COGNITIVE_DIMENSIONS)[number]['key'];

export const DEFAULT_UNTESTED_SCORE = 50;
export const POPULATION_AVG_RESPONSE_SECONDS = 18;

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  memory: 'Memory',
  speed: 'Speed',
  logic: 'Logic',
  spatial: 'Spatial Recognition',
  pattern: 'Pattern Recognition',
};

export interface DimensionScore {
  key: CognitiveDimensionKey;
  name: string;
  /** 0-100; defaults to 50 when dimension was not directly tested */
  score: number;
  correct: number;
  total: number;
  tested: boolean;
}

export interface ScoreDescriptor {
  label: string;
  colorClass: string;
}

export function getScoreDescriptor(score: number): ScoreDescriptor {
  if (score >= 80) return { label: 'Strong', colorClass: 'text-emerald-600 font-medium' };
  if (score >= 60) return { label: 'Above Average', colorClass: 'text-blue-600 font-medium' };
  if (score >= 40) return { label: 'Average', colorClass: 'text-slate-600 font-medium' };
  return { label: 'Developing', colorClass: 'text-amber-600 font-medium' };
}

export const STRENGTH_EXPLANATIONS: Record<string, string> = {
  Memory: 'You retain and recall information reliably under test conditions.',
  Speed: 'You process questions quickly relative to typical test takers.',
  Logic: 'You construct and follow logical chains naturally.',
  'Spatial Recognition': 'You mentally manipulate shapes and orientations effectively.',
  'Pattern Recognition': 'You quickly identify visual rules and structural relationships.',
};

export const GROWTH_EXPLANATIONS: Record<string, string> = {
  Memory: 'Memory sequence games strengthen recall and working memory over time.',
  Speed: 'Reaction-time training builds faster processing under pressure.',
  Logic: 'Logic puzzles compound improvement in reasoning chains.',
  'Spatial Recognition': 'Visual pattern practice builds spatial skill measurably.',
  'Pattern Recognition': 'Pattern matrix drills sharpen rule detection and structure.',
};

const SPATIAL_PATTERN_TYPES: PatternType[] = [
  'orientation',
  'filled_position',
  'block_config',
];

export function isSpatialPatternType(patternType: PatternType): boolean {
  return SPATIAL_PATTERN_TYPES.includes(patternType);
}

function isStepCorrect(step: TestStep, answerIndex: number | undefined): boolean {
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

/** Map scored step to performance category for strengths/weaknesses. */
export function stepPerformanceCategory(step: TestStep): string | null {
  if (step.type === 'memory_recall' || step.type === 'visual_memory') return 'memory';
  if (step.type === 'logic_text') return 'logic';
  if (step.type === 'pattern_matrix') {
    return isSpatialPatternType(step.patternType) ? 'spatial' : 'pattern';
  }
  return null;
}

function resolveAvgResponseSeconds(options?: {
  avgResponseTimeSeconds?: number;
  timeTakenSeconds?: number;
}): number {
  if (options?.avgResponseTimeSeconds && options.avgResponseTimeSeconds > 0) {
    return options.avgResponseTimeSeconds;
  }
  if (options?.timeTakenSeconds && options.timeTakenSeconds > 0) {
    return options.timeTakenSeconds / 30;
  }
  if (typeof window !== 'undefined') {
    const metrics = loadMetrics();
    if (metrics.avgResponseTimeSeconds > 0) return metrics.avgResponseTimeSeconds;
  }
  return POPULATION_AVG_RESPONSE_SECONDS;
}

/** 8s → 100, 18s → 50, 28s → 0 */
export function computeSpeedScore(avgSeconds: number): number {
  const raw = 100 - ((avgSeconds - 8) / 20) * 100;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

function finalizeScore(correct: number, total: number): number {
  if (total <= 0) return DEFAULT_UNTESTED_SCORE;
  return Math.round((correct / total) * 100);
}

export interface DimensionScoreOptions {
  avgResponseTimeSeconds?: number;
  timeTakenSeconds?: number;
}

export function computeDimensionScores(
  steps: TestStep[],
  stepAnswers: Record<string, number>,
  options?: DimensionScoreOptions,
): DimensionScore[] {
  const tallies: Record<
    Exclude<CognitiveDimensionKey, 'speed'>,
    { correct: number; total: number }
  > = {
    memory: { correct: 0, total: 0 },
    logic: { correct: 0, total: 0 },
    spatial: { correct: 0, total: 0 },
    pattern: { correct: 0, total: 0 },
  };

  for (const step of steps) {
    if (!isScoredStep(step)) continue;
    const answer = stepAnswers[stepKey(step.id)];
    if (answer === undefined) continue;
    const correct = isStepCorrect(step, answer);

    if (step.type === 'memory_recall' || step.type === 'visual_memory') {
      tallies.memory.total += 1;
      if (correct) tallies.memory.correct += 1;
    } else if (step.type === 'logic_text') {
      tallies.logic.total += 1;
      if (correct) tallies.logic.correct += 1;
    } else if (step.type === 'pattern_matrix') {
      const bucket = isSpatialPatternType(step.patternType) ? 'spatial' : 'pattern';
      tallies[bucket].total += 1;
      if (correct) tallies[bucket].correct += 1;
    }
  }

  const avgSeconds = resolveAvgResponseSeconds(options);
  const speedScore = computeSpeedScore(avgSeconds);

  return COGNITIVE_DIMENSIONS.map(({ key, name }) => {
    if (key === 'speed') {
      return {
        key,
        name,
        score: speedScore,
        correct: 0,
        total: 0,
        tested: true,
      };
    }
    const { correct, total } = tallies[key];
    const tested = total > 0;
    return {
      key,
      name,
      correct,
      total,
      tested,
      score: finalizeScore(correct, total),
    };
  });
}

export function computeStrengthsAndGrowthAreas(
  categoryScores: Record<string, { correct: number; total: number }>,
): { strengths: string[]; weaknesses: string[] } {
  const withData = Object.entries(categoryScores)
    .filter(([, s]) => s.total > 0)
    .map(([cat, s]) => ({
      category: cat,
      rate: s.correct / s.total,
      displayName: CATEGORY_DISPLAY_NAMES[cat] ?? cat,
    }));

  if (withData.length === 0) {
    return { strengths: [], weaknesses: [] };
  }

  const allSameRate =
    withData.length > 1 && withData.every((c) => c.rate === withData[0].rate);

  let strengths: string[];
  let weaknesses: string[];

  if (allSameRate) {
    const sorted = [...withData].sort((a, b) =>
      a.displayName.localeCompare(b.displayName),
    );
    strengths = dedupeDisplayNames(sorted.slice(0, 2).map((c) => c.displayName));
    weaknesses = dedupeDisplayNames(sorted.slice(2, 4).map((c) => c.displayName)).filter(
      (w) => !strengths.includes(w),
    );
  } else {
    withData.sort((a, b) => b.rate - a.rate);
    const strengthItems = withData.filter((c) => c.rate > 0.5).slice(0, 2);
    strengths = dedupeDisplayNames(strengthItems.map((c) => c.displayName));
    const strengthCats = new Set(strengthItems.map((c) => c.category));
    const growthPool = withData.filter((c) => !strengthCats.has(c.category));
    weaknesses = dedupeDisplayNames(growthPool.slice(-2).map((c) => c.displayName));
  }

  weaknesses = weaknesses.filter((w) => !strengths.includes(w));

  const overlap = weaknesses.filter((w) => strengths.includes(w));
  if (overlap.length > 0) {
    console.warn('[scoring] Strength/growth overlap detected, removing from growth:', overlap);
    weaknesses = weaknesses.filter((w) => !overlap.includes(w));
  }

  return { strengths, weaknesses };
}

export function dedupeDisplayNames(names: string[]): string[] {
  return [...new Set(names)];
}

const RADAR_SHORT_LABELS: Record<CognitiveDimensionKey, string> = {
  memory: 'Memory',
  speed: 'Speed',
  logic: 'Logic',
  spatial: 'Spatial',
  pattern: 'Pattern',
};

export function dimensionToRadarData(dimensions: DimensionScore[]) {
  return dimensions.map((d) => ({
    dimension: RADAR_SHORT_LABELS[d.key] ?? d.name,
    fullName: d.name,
    score: d.score,
  }));
}

export function buildCategoryScoresFromSteps(
  steps: TestStep[],
  stepAnswers: Record<string, number>,
): Record<string, { correct: number; total: number }> {
  const categoryScores: Record<string, { correct: number; total: number }> = {};

  for (const step of steps) {
    if (!isScoredStep(step)) continue;
    const answer = stepAnswers[stepKey(step.id)];
    if (answer === undefined) continue;
    const cat = stepPerformanceCategory(step);
    if (!cat) continue;
    if (!categoryScores[cat]) categoryScores[cat] = { correct: 0, total: 0 };
    categoryScores[cat].total += 1;
    if (isStepCorrect(step, answer)) categoryScores[cat].correct += 1;
  }

  return categoryScores;
}
