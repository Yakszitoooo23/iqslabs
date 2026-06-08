'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Interstitial } from '@/components/Interstitial';
import { TEST_CONFIG } from '@/data/questions';
import { requiresAnswer, stepKey } from '@/data/testStructure';
import { generateHypeMessage, type HypeMessage } from '@/lib/hypeMessages';
import {
  clearMetrics,
  getMetricsSnapshot,
  INTERSTITIAL_AFTER_STEP_ID,
  markQuestionShown,
  recordStepCompleted,
  type HypePosition,
} from '@/lib/quizMetrics';
import {
  completeSession,
  createEmptySession,
  loadSession,
  recordAnswer,
  recordMemorySequence,
  saveSession,
  type QuizSessionData,
} from '@/lib/quizSession';
import { QuizHeader } from './QuizHeader';
import { QuizSocialProof } from './QuizSocialProof';
import { TestStepRenderer } from './TestStepRenderer';

const STEPS = TEST_CONFIG.iq.steps;
const TOTAL_SECONDS = TEST_CONFIG.iq.totalTimeSeconds;

export function QuizEngine() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [session, setSession] = useState<QuizSessionData>(() => createEmptySession());
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_SECONDS);
  const [timerPaused, setTimerPaused] = useState(false);
  const [activeInterstitial, setActiveInterstitial] = useState<HypePosition | null>(null);
  const [hypeContent, setHypeContent] = useState<HypeMessage | null>(null);

  useEffect(() => {
    const existing = loadSession();
    if (existing) setSession(existing);
    else {
      clearMetrics();
      saveSession(createEmptySession());
    }
  }, []);

  useEffect(() => {
    if (timerPaused || secondsRemaining <= 0) return;
    const tick = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [secondsRemaining, timerPaused]);

  const step = STEPS[stepIndex];
  const isLast = stepIndex >= STEPS.length - 1;

  useEffect(() => {
    if (activeInterstitial || !step) return;
    markQuestionShown(stepKey(step.id));
  }, [stepIndex, activeInterstitial, step?.id]);

  const finishTest = useCallback(
    (finalSession: QuizSessionData) => {
      completeSession(finalSession);
      router.push('/analyzing');
    },
    [router],
  );

  const advanceToNextStep = useCallback(() => {
    if (isLast) {
      setSession((s) => {
        finishTest(s);
        return s;
      });
      return;
    }
    setStepIndex((i) => i + 1);
  }, [finishTest, isLast]);

  const maybeShowInterstitial = useCallback(
    (stepId: number) => {
      const position = INTERSTITIAL_AFTER_STEP_ID[stepId];
      if (!position) {
        advanceToNextStep();
        return;
      }
      const metrics = getMetricsSnapshot();
      setHypeContent(generateHypeMessage(position, metrics));
      setActiveInterstitial(position);
      setTimerPaused(true);
    },
    [advanceToNextStep],
  );

  const handleContinue = useCallback(() => {
    if (!step) return;

    if (requiresAnswer(step)) {
      const key = stepKey(step.id);
      const answerIndex =
        step.type === 'likert'
          ? session.likertAnswers[key]
          : step.type === 'goal_select'
            ? session.goalAnswers[key]
            : step.type === 'demographic'
              ? session.demographicAnswers[key]
              : session.stepAnswers[key];
      if (answerIndex === undefined) return;
      recordStepCompleted(step, answerIndex);
    }

    maybeShowInterstitial(step.id);
  }, [step, session, maybeShowInterstitial]);

  const handleInterstitialContinue = useCallback(() => {
    if (activeInterstitial === 'final') {
      setActiveInterstitial(null);
      setHypeContent(null);
      setTimerPaused(false);
      setSession((s) => {
        finishTest(s);
        return s;
      });
      return;
    }
    setActiveInterstitial(null);
    setHypeContent(null);
    setTimerPaused(false);
    setStepIndex((i) => i + 1);
  }, [activeInterstitial, finishTest]);

  const handleMemoryDisplayComplete = useCallback(() => {
    if (step?.type !== 'memory_display') return;
    setSession((s) => recordMemorySequence(s, step));
    recordStepCompleted(step);
    setStepIndex((i) => i + 1);
  }, [step]);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (!step || !requiresAnswer(step)) return;
      const key = stepKey(step.id);
      const isLikert = step.type === 'likert';
      const isGoal = step.type === 'goal_select';
      const isDemographic = step.type === 'demographic';
      setSession((s) =>
        recordAnswer(s, key, optionIndex, { isLikert, isGoal, isDemographic }),
      );
    },
    [step],
  );

  const progressStepNumber = useMemo(() => {
    if (activeInterstitial && step) return step.id;
    return step?.id ?? stepIndex + 1;
  }, [activeInterstitial, step, stepIndex]);

  if (!step && !activeInterstitial) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">No test steps configured.</p>
      </main>
    );
  }

  if (activeInterstitial && hypeContent) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 max-w-6xl mx-auto px-6 py-10 md:py-14 w-full">
          <QuizHeader
            stepNumber={progressStepNumber}
            totalSteps={STEPS.length}
            secondsRemaining={secondsRemaining}
            paused={timerPaused}
          />
          <Interstitial
            headline={hypeContent.headline}
            subtitle={hypeContent.subtitle}
            illustration={hypeContent.illustration}
            format={hypeContent.format}
            buttonText={activeInterstitial === 'final' ? 'Reveal My Results' : 'Continue'}
            onContinue={handleInterstitialContinue}
          />
        </div>
        <QuizSocialProof />
      </main>
    );
  }

  if (!step) return null;

  const key = stepKey(step.id);
  const selectedIndex =
    step.type === 'likert'
      ? session.likertAnswers[key]
      : step.type === 'goal_select'
        ? session.goalAnswers[key]
        : step.type === 'demographic'
          ? session.demographicAnswers[key]
          : session.stepAnswers[key];

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto px-6 py-10 md:py-14 w-full">
        <QuizHeader
          stepNumber={progressStepNumber}
          totalSteps={STEPS.length}
          secondsRemaining={secondsRemaining}
          paused={timerPaused}
        />
        <TestStepRenderer
          step={step}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onContinue={handleContinue}
          onMemoryDisplayComplete={handleMemoryDisplayComplete}
        />
      </div>
      <QuizSocialProof />
    </main>
  );
}
