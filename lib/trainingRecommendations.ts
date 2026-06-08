import type { DimensionScore } from '@/lib/scoring';

export interface TrainingRecommendation {
  gameName: string;
  gameHref: string;
  gameDescription: string;
  reason: string;
  targetDimension: string;
}

const DIMENSION_TO_GAME: Record<
  string,
  { name: string; href: string; description: string }
> = {
  Memory: {
    name: 'Memory Sequence',
    href: '/games/memory',
    description: 'Memorize and repeat color sequences, length grows each round.',
  },
  Speed: {
    name: 'Reaction Time',
    href: '/games/reaction',
    description: 'Test your processing speed. Click when the box turns blue.',
  },
  Logic: {
    name: 'Brain Teaser',
    href: '/games/brain-teaser',
    description: '10 logic puzzles and riddles. Pure mental challenge.',
  },
  'Spatial Recognition': {
    name: 'IQ Practice',
    href: '/games/iq-practice',
    description: '10 visual pattern questions drawn from a practice question bank.',
  },
  'Pattern Recognition': {
    name: 'IQ Practice',
    href: '/games/iq-practice',
    description: '10 visual pattern questions drawn from a practice question bank.',
  },
};

export function getTrainingRecommendation(
  growthAreas: string[],
  dimensionScores: DimensionScore[],
): TrainingRecommendation {
  let target = growthAreas[0];

  if (!target) {
    const ranked = [...dimensionScores]
      .filter((d) => d.key !== 'speed' || d.tested)
      .sort((a, b) => a.score - b.score);
    target = ranked[0]?.name ?? 'Pattern Recognition';
  }

  const game =
    DIMENSION_TO_GAME[target] ?? DIMENSION_TO_GAME['Pattern Recognition'];

  return {
    gameName: game.name,
    gameHref: game.href,
    gameDescription: game.description,
    targetDimension: target,
    reason: 'Based on your assessment, this game targets your top growth area.',
  };
}
