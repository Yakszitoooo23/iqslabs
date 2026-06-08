'use client';

import { TestStep } from '@/data/testStructure';
import { DemographicStep } from './DemographicStep';
import { GoalSelectStep } from './GoalSelectStep';
import { LikertStep } from './LikertStep';
import { LogicTextStep } from './LogicTextStep';
import { MemoryDisplayStep } from './MemoryDisplayStep';
import { MemoryRecallStep } from './MemoryRecallStep';
import { PatternMatrixStep } from './PatternMatrixStep';
import { VisualMemoryStep } from './VisualMemoryStep';

interface TestStepRendererProps {
  step: TestStep;
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onContinue: () => void;
  onMemoryDisplayComplete: () => void;
}

export function TestStepRenderer({
  step,
  selectedIndex,
  onSelect,
  onContinue,
  onMemoryDisplayComplete,
}: TestStepRendererProps) {
  if (step.type === 'memory_display') {
    return (
      <MemoryDisplayStep
        sequence={step.sequence}
        displayMs={step.displayMs}
        onComplete={onMemoryDisplayComplete}
      />
    );
  }

  if (step.type === 'memory_recall') {
    return (
      <MemoryRecallStep
        question={step.question}
        options={step.options}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onContinue={onContinue}
      />
    );
  }

  if (step.type === 'logic_text') {
    return (
      <LogicTextStep
        question={step.question}
        options={step.options}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onContinue={onContinue}
      />
    );
  }

  if (step.type === 'likert') {
    return (
      <LikertStep
        statement={step.statement}
        labels={step.labels}
        prompt={step.prompt}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onContinue={onContinue}
      />
    );
  }

  if (step.type === 'demographic') {
    return (
      <DemographicStep
        question={step.question}
        options={step.options}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onContinue={onContinue}
      />
    );
  }

  if (step.type === 'visual_memory') {
    return (
      <VisualMemoryStep
        displaySeconds={step.displaySeconds}
        gridContents={step.gridContents}
        askedPosition={step.askedPosition}
        options={step.options}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onContinue={onContinue}
      />
    );
  }

  if (step.type === 'pattern_matrix') {
    return (
      <PatternMatrixStep
        grid={step.grid}
        options={step.options}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onContinue={onContinue}
      />
    );
  }

  if (step.type === 'goal_select') {
    return (
      <GoalSelectStep
        question={step.question}
        options={step.options}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onContinue={onContinue}
      />
    );
  }

  return null;
}
