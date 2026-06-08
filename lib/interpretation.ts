import type { CognitiveProfile } from '@/lib/scoring';
import { PERSONALITY_LABELS } from '@/lib/scoring';
import type { PersonalityDimension } from '@/data/patternTypes';

export interface AnalyzeInput {
  scaledScore: number;
  percentile: number;
  category: string;
  strengths: string[];
  weaknesses: string[];
  improvementGoal?: string | null;
  cognitiveProfile?: CognitiveProfile;
  demographics?: { age_range?: string };
}

export const INTERPRETATION_SYSTEM_PROMPT = `You are a cognitive psychologist analyzing IQ test results. You write personalized, professional interpretations of cognitive profiles.

STRICT RULES:
- Do NOT make medical or diagnostic claims
- Do NOT predict career success, academic outcomes, or life events
- Do NOT recommend specific careers, schools, or professional paths
- AVOID superlatives like 'genius' or 'exceptional intellect'
- AVOID pity language like 'struggles with' or 'poor at'
- AVOID patronizing age framing like "for someone your age" or "at your age"
- Reference the Cattell-Horn-Carroll (CHC) theory naturally
- Use neutral, professional, warm language
- Keep total output between 100-150 words. Write ONE paragraph only.
- This is a brief conclusion summarizing the patterns shown in the user's cognitive dimension scores, the user has already seen detailed score breakdowns, so you don't need to repeat numbers.
- Focus on what their pattern of strengths/weaknesses suggests about their thinking style, framed through CHC theory.
- End with one practical insight about how this profile might serve them.
- If an improvement goal is provided, weave it into the conclusion naturally.
- If age range is provided, tailor tone subtly: younger ranges (Under 18, 18-24, 25-34) get growth-oriented framing; mid ranges (35-44, 45-54) get balanced development framing; older ranges (55-64, 65+) emphasize leveraging existing strengths and targeted practice, never mention age directly.`;

function formatCategories(categories: string[]): string {
  if (categories.length === 0) return 'general cognitive processing';
  return categories.join(' and ');
}

function formatPersonality(profile?: CognitiveProfile): string {
  if (!profile || Object.keys(profile).length === 0) return 'Not provided';
  return (Object.entries(profile) as [PersonalityDimension, number][])
    .filter(([k]) => k !== 'improvement_goal')
    .map(([k, v]) => `${PERSONALITY_LABELS[k] ?? k}: ${v}/100`)
    .join('; ');
}

export function buildInterpretationUserPrompt(input: AnalyzeInput): string {
  const goalLine = input.improvementGoal
    ? `\nPrimary improvement goal (user-selected): ${input.improvementGoal}`
    : '';
  const ageLine = input.demographics?.age_range
    ? `\nAge range (for subtle tone calibration only, do NOT mention age explicitly): ${input.demographics.age_range}`
    : '';

  return `Write a personalized cognitive profile conclusion for this IQ test result.

IQ Score: ${input.scaledScore} (${input.category}, ${input.percentile}th percentile)
Relative Strengths: ${formatCategories(input.strengths)}
Growth Areas: ${formatCategories(input.weaknesses)}
Self-reported personality dimensions: ${formatPersonality(input.cognitiveProfile)}${goalLine}${ageLine}

Write exactly ONE paragraph (100-150 words). Do not repeat specific scores, the dashboard already shows them.`;
}

export function buildFallbackInterpretation(input: AnalyzeInput): string {
  const strengthsText = formatCategories(input.strengths);
  const growthText = formatCategories(input.weaknesses);
  const goalClause = input.improvementGoal
    ? ` You noted ${input.improvementGoal.toLowerCase()} as a priority, brief practice there can complement your strengths.`
    : '';

  const ageRange = input.demographics?.age_range ?? '';
  const isYounger = ['Under 18', '18-24', '25-34'].includes(ageRange);
  const isOlder = ['55-64', '65+'].includes(ageRange);
  const ageClause = isYounger
    ? ' Building varied cognitive habits now can compound meaningfully over time.'
    : isOlder
      ? ' Targeted practice that builds on your existing strengths tends to yield steady, practical gains.'
      : '';

  return `Within a Cattell-Horn-Carroll framing, your results suggest a thinking style that leans on ${strengthsText} when facing unfamiliar problems, while ${growthText} represent natural directions for continued development rather than fixed limits.${goalClause}${ageClause} One practical insight: pairing your strongest dimensions with short, varied practice in growth areas tends to produce balanced gains without abandoning what already works well for you.`;
}
