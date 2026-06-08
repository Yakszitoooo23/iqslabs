import type { TestStep } from '@/data/testStructure';
import { isScoredStep, stepKey } from '@/data/testStructure';

export type HypePosition =
  | 'after_q3'
  | 'after_q6'
  | 'after_q12'
  | 'after_q18'
  | 'after_q24'
  | 'after_q27'
  | 'final';

export const INTERSTITIAL_AFTER_STEP_ID: Record<number, HypePosition> = {
  3: 'after_q3',
  6: 'after_q6',
  12: 'after_q12',
  18: 'after_q18',
  24: 'after_q24',
  27: 'after_q27',
  30: 'final',
};

export interface QuizMetrics {
  /** Steps completed (answered or auto-advanced). */
  questionsAnswered: number;
  scoredCorrect: number;
  scoredTotal: number;
  accuracy: number;
  streak: number;
  avgResponseTimeSeconds: number;
  matrixAvgResponseTimeSeconds: number;
  memoryRecallCorrect: boolean | null;
  visualMemoryCorrect: boolean | null;
  /** stepId → ms timestamp when step was shown */
  questionShownAt: Record<string, number>;
  /** stepId → response time in seconds */
  responseTimes: Record<string, number>;
  matrixResponseTimes: Record<string, number>;
}

const METRICS_KEY = 'quiz_metrics';

export function createEmptyMetrics(): QuizMetrics {
  return {
    questionsAnswered: 0,
    scoredCorrect: 0,
    scoredTotal: 0,
    accuracy: 0,
    streak: 0,
    avgResponseTimeSeconds: 0,
    matrixAvgResponseTimeSeconds: 0,
    memoryRecallCorrect: null,
    visualMemoryCorrect: null,
    questionShownAt: {},
    responseTimes: {},
    matrixResponseTimes: {},
  };
}

export function loadMetrics(): QuizMetrics {
  if (typeof window === 'undefined') return createEmptyMetrics();
  const raw = sessionStorage.getItem(METRICS_KEY);
  if (!raw) return createEmptyMetrics();
  try {
    return { ...createEmptyMetrics(), ...JSON.parse(raw) };
  } catch {
    return createEmptyMetrics();
  }
}

export function saveMetrics(metrics: QuizMetrics): void {
  sessionStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
}

export function clearMetrics(): void {
  sessionStorage.removeItem(METRICS_KEY);
}

export function markQuestionShown(stepId: string): void {
  const metrics = loadMetrics();
  if (metrics.questionShownAt[stepId]) return;
  metrics.questionShownAt[stepId] = Date.now();
  saveMetrics(metrics);
}

function recomputeAvgResponseTime(metrics: QuizMetrics): void {
  const times = Object.values(metrics.responseTimes);
  metrics.avgResponseTimeSeconds =
    times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;

  const matrixTimes = Object.values(metrics.matrixResponseTimes);
  metrics.matrixAvgResponseTimeSeconds =
    matrixTimes.length > 0 ? matrixTimes.reduce((a, b) => a + b, 0) / matrixTimes.length : 0;
}

function isCorrectAnswer(step: TestStep, answerIndex: number): boolean {
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

/** Call when user completes a step (Continue or auto-advance for memory display). */
export function recordStepCompleted(
  step: TestStep,
  answerIndex?: number,
): QuizMetrics {
  const metrics = loadMetrics();
  const key = stepKey(step.id);
  const shownAt = metrics.questionShownAt[key];

  if (shownAt) {
    const seconds = (Date.now() - shownAt) / 1000;
    metrics.responseTimes[key] = seconds;
    if (step.type === 'pattern_matrix') {
      metrics.matrixResponseTimes[key] = seconds;
    }
    recomputeAvgResponseTime(metrics);
  }

  metrics.questionsAnswered += 1;

  if (isScoredStep(step) && answerIndex !== undefined) {
    metrics.scoredTotal += 1;
    const correct = isCorrectAnswer(step, answerIndex);
    if (correct) {
      metrics.scoredCorrect += 1;
      metrics.streak += 1;
    } else {
      metrics.streak = 0;
    }
    metrics.accuracy =
      metrics.scoredTotal > 0 ? metrics.scoredCorrect / metrics.scoredTotal : 0;

    if (step.type === 'memory_recall') {
      metrics.memoryRecallCorrect = correct;
    }
    if (step.type === 'visual_memory') {
      metrics.visualMemoryCorrect = correct;
    }
  }

  saveMetrics(metrics);
  return metrics;
}

export function getMetricsSnapshot(): QuizMetrics {
  return loadMetrics();
}
