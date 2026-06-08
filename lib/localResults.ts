import { TEST_CONFIG } from '@/data/questions';
import { computeDimensionScores } from '@/lib/dimensionScores';
import type { DimensionScore } from '@/lib/scoring';
import { computePerformanceMetrics, type PerformanceMetricsData } from '@/lib/performanceMetrics';

export interface LocalTestResult {
  scaled_score: number;
  percentile: number;
  raw_score: number;
  category: string;
  strengths: string[];
  weaknesses: string[];
  dimensionScores: DimensionScore[];
  time_taken_seconds: number;
  ai_interpretation: string | null;
  cognitiveProfile?: Record<string, number>;
  performanceMetrics: PerformanceMetricsData;
  stepAnswers?: Record<string, number>;
}

export function loadScoreResultFromSession() {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem('score_result');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function buildDimensionScoresFromAnswers(
  stepAnswers: Record<string, number>,
  timeTakenSeconds: number,
): DimensionScore[] {
  return computeDimensionScores(TEST_CONFIG.iq.steps, stepAnswers, {
    timeTakenSeconds,
  });
}

export function loadLocalTestResult(): LocalTestResult | null {
  const score = loadScoreResultFromSession();
  if (!score) return null;

  const stepAnswersRaw = sessionStorage.getItem('quiz_answers');
  let stepAnswers: Record<string, number> = {};
  try {
    if (stepAnswersRaw) stepAnswers = JSON.parse(stepAnswersRaw);
  } catch {
    stepAnswers = {};
  }

  const timeTaken = Number(sessionStorage.getItem('quiz_time') || 0);

  return {
    scaled_score: score.scaledScore,
    percentile: score.percentile,
    raw_score: score.rawScore,
    category: score.category,
    strengths: score.strengths ?? [],
    weaknesses: score.weaknesses ?? [],
    dimensionScores: buildDimensionScoresFromAnswers(stepAnswers, timeTaken),
    time_taken_seconds: timeTaken,
    ai_interpretation: sessionStorage.getItem('ai_interpretation'),
    cognitiveProfile: score.cognitiveProfile,
    stepAnswers,
    performanceMetrics: computePerformanceMetrics(timeTaken),
  };
}
