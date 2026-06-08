import type { TestStep } from '@/data/testStructure';
import { stepKey } from '@/data/testStructure';

export interface QuizSessionData {
  stepAnswers: Record<string, number>;
  likertAnswers: Record<string, number>;
  goalAnswers: Record<string, number>;
  demographicAnswers: Record<string, number>;
  memorySequences: Record<string, string>;
  startedAt: number;
  completedAt?: number;
}

const SESSION_KEY = 'quiz_session';

export function createEmptySession(): QuizSessionData {
  return {
    stepAnswers: {},
    likertAnswers: {},
    goalAnswers: {},
    demographicAnswers: {},
    memorySequences: {},
    startedAt: Date.now(),
  };
}

export function loadSession(): QuizSessionData | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as QuizSessionData;
    return {
      ...createEmptySession(),
      ...parsed,
      goalAnswers: parsed.goalAnswers ?? {},
      demographicAnswers: parsed.demographicAnswers ?? {},
    };
  } catch {
    return null;
  }
}

export function saveSession(session: QuizSessionData): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  sessionStorage.setItem('quiz_answers', JSON.stringify(session.stepAnswers));
  sessionStorage.setItem(
    'quiz_time',
    String(Math.round(((session.completedAt ?? Date.now()) - session.startedAt) / 1000)),
  );
}

export function recordMemorySequence(
  session: QuizSessionData,
  step: Extract<TestStep, { type: 'memory_display' }>,
): QuizSessionData {
  const key = stepKey(step.id);
  const next = {
    ...session,
    memorySequences: {
      ...session.memorySequences,
      [key]: step.sequence,
    },
  };
  saveSession(next);
  return next;
}

export function recordAnswer(
  session: QuizSessionData,
  stepId: string,
  optionIndex: number,
  flags: { isLikert?: boolean; isGoal?: boolean; isDemographic?: boolean },
): QuizSessionData {
  const next = flags.isLikert
    ? {
        ...session,
        likertAnswers: { ...session.likertAnswers, [stepId]: optionIndex },
      }
    : flags.isGoal
      ? {
          ...session,
          goalAnswers: { ...session.goalAnswers, [stepId]: optionIndex },
        }
      : flags.isDemographic
        ? {
            ...session,
            demographicAnswers: { ...session.demographicAnswers, [stepId]: optionIndex },
          }
        : {
            ...session,
            stepAnswers: { ...session.stepAnswers, [stepId]: optionIndex },
          };
  saveSession(next);
  return next;
}

export function completeSession(session: QuizSessionData): QuizSessionData {
  const next = { ...session, completedAt: Date.now() };
  saveSession(next);
  return next;
}
