import type { HypePosition } from './quizMetrics';

export type HypeIllustration =
  | 'climbing'
  | 'lightbulb'
  | 'brain'
  | 'rocket'
  | 'medal'
  | 'sparkles';

export type HypeFormat = 'motivation' | 'stat' | 'trait' | 'education' | 'curiosity';

export interface HypeMessage {
  headline: string;
  subtitle: string;
  illustration: HypeIllustration;
  format: HypeFormat;
}

export interface HypeMetricsInput {
  avgResponseTimeSeconds: number;
  matrixAvgResponseTimeSeconds: number;
  accuracy: number;
  streak: number;
  questionsAnswered: number;
  memoryRecallCorrect: boolean | null;
  visualMemoryCorrect: boolean | null;
}

function pickRandom<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- AFTER Q3, real test begins ------------------------------------------------

const AFTER_Q3_POOL: HypeMessage[] = [
  {
    illustration: 'climbing',
    format: 'motivation',
    headline: 'Now the real test begins',
    subtitle:
      'Thanks for sharing a bit about yourself. The next section measures your actual cognitive performance, memory, pattern recognition, and logical reasoning.',
  },
  {
    illustration: 'rocket',
    format: 'motivation',
    headline: "Let's see what your mind can do",
    subtitle:
      'The personal questions helped calibrate your profile. The performance section starts now. Give each question your best focus.',
  },
  {
    illustration: 'brain',
    format: 'motivation',
    headline: 'Your profile is taking shape',
    subtitle:
      'We now have your baseline preferences. The cognitive challenges ahead will reveal your actual thinking style and capability.',
  },
];

// --- AFTER Q6, memory section complete ---------------------------------------

function buildAfterQ6Pool(metrics: HypeMetricsInput): HypeMessage[] {
  const pool: HypeMessage[] = [];

  if (metrics.memoryRecallCorrect === true && metrics.visualMemoryCorrect === true) {
    pool.push({
      illustration: 'medal',
      format: 'stat',
      headline: 'Strong memory performance',
      subtitle:
        'Memory is a key dimension in the Cattell-Horn-Carroll model of intelligence. Your performance here places you in the top tier so far.',
    });
  }

  pool.push(
    {
      illustration: 'brain',
      format: 'trait',
      headline: 'Memory analysis complete',
      subtitle:
        'Memory tasks measure working memory and recall, two of the most studied cognitive abilities. Now we move to visual pattern recognition.',
    },
    {
      illustration: 'lightbulb',
      format: 'education',
      headline: 'Did you know?',
      subtitle:
        'Working memory capacity is one of the strongest predictors of overall cognitive ability. The pattern questions ahead will test how you process new visual information.',
    },
  );

  return pool;
}

// --- AFTER Q12, first matrix batch done --------------------------------------

function buildAfterQ12Pool(metrics: HypeMetricsInput): HypeMessage[] {
  const pool: HypeMessage[] = [];
  const matrixAvg = metrics.matrixAvgResponseTimeSeconds || metrics.avgResponseTimeSeconds;

  if (matrixAvg > 0 && matrixAvg < 15) {
    pool.push({
      illustration: 'rocket',
      format: 'stat',
      headline: "You're faster than 87% of test takers!",
      subtitle:
        'Processing speed correlates with overall cognitive efficiency. Your pace through the early patterns is impressive.',
    });
  }

  if (metrics.accuracy > 0.7) {
    pool.push({
      illustration: 'medal',
      format: 'stat',
      headline: "You're in the top 15% for accuracy",
      subtitle:
        'Careful, accurate problem-solving is the foundation of strong analytical reasoning. Keep this approach for the harder questions ahead.',
    });
  }

  if (metrics.streak >= 3) {
    pool.push({
      illustration: 'sparkles',
      format: 'stat',
      headline: 'On a streak, keep going!',
      subtitle:
        'Multiple correct answers in a row signal strong pattern locking. Your brain is in flow state.',
    });
  }

  pool.push({
    illustration: 'brain',
    format: 'trait',
    headline: 'Your pattern recognition is registering above average',
    subtitle:
      "Pattern recognition is one of the core dimensions in the CHC model. It's a strong predictor of creative problem-solving.",
  });

  return pool;
}

// --- AFTER Q18, mid matrices -------------------------------------------------

function buildAfterQ18Pool(metrics: HypeMetricsInput): HypeMessage[] {
  const pool: HypeMessage[] = [];
  const matrixAvg = metrics.matrixAvgResponseTimeSeconds || metrics.avgResponseTimeSeconds;

  if (metrics.accuracy > 0.6) {
    pool.push({
      illustration: 'medal',
      format: 'stat',
      headline: 'Top 12% performance so far',
      subtitle:
        "You're handling the medium-difficulty questions well. The next set is harder, most users find these the most challenging.",
    });
  }

  if (matrixAvg > 0 && matrixAvg < 15) {
    pool.push({
      illustration: 'rocket',
      format: 'stat',
      headline: 'Your processing speed is in the top 10%',
      subtitle:
        'Speed and accuracy together are rare combinations. Stay focused, the hardest questions reveal the most about cognitive ability.',
    });
  }

  pool.push(
    {
      illustration: 'climbing',
      format: 'motivation',
      headline: "You're more than halfway through",
      subtitle:
        'The hardest questions are ahead. Users who push through this section often discover surprising insights about their cognitive strengths.',
    },
    {
      illustration: 'lightbulb',
      format: 'education',
      headline: 'Did you know?',
      subtitle:
        "Fluid intelligence, the ability to solve novel problems, is what the matrix questions specifically measure. It's considered the purest measure of cognitive capacity.",
    },
  );

  return pool;
}

// --- AFTER Q24, matrices nearly done -------------------------------------------

function buildAfterQ24Pool(metrics: HypeMetricsInput): HypeMessage[] {
  const pool: HypeMessage[] = [];

  if (metrics.accuracy > 0.6) {
    pool.push({
      illustration: 'medal',
      format: 'stat',
      headline: 'Top 8% performance on the difficult section',
      subtitle:
        'Most users find Q19-Q24 the hardest matrices. Your performance here suggests advanced fluid reasoning capacity.',
    });
  }

  pool.push(
    {
      illustration: 'rocket',
      format: 'motivation',
      headline: "You've made it through the toughest part",
      subtitle:
        'Just a few more pattern questions and then some final personal questions to complete your profile.',
    },
    {
      illustration: 'sparkles',
      format: 'curiosity',
      headline: 'Your cognitive profile is nearly complete',
      subtitle:
        'The final questions will help us tailor your personalized report and recommendations.',
    },
  );

  return pool;
}

// --- AFTER Q27, all matrices done --------------------------------------------

const AFTER_Q27_POOL: HypeMessage[] = [
  {
    illustration: 'climbing',
    format: 'motivation',
    headline: 'All cognitive challenges complete!',
    subtitle:
      'Just 3 quick questions left about your goals and preferences. These help us personalize your final report.',
  },
  {
    illustration: 'medal',
    format: 'motivation',
    headline: "You're in the top 9% of completers",
    subtitle:
      "Most users don't make it this far. The final questions help us tailor recommendations to your specific goals.",
  },
  {
    illustration: 'brain',
    format: 'curiosity',
    headline: 'Results coming up',
    subtitle:
      'After these last 3 questions, our AI will analyze everything and generate your personalized cognitive profile.',
  },
];

// --- FINAL, after Q30 --------------------------------------------------------

const FINAL_MESSAGE: HypeMessage = {
  illustration: 'sparkles',
  format: 'motivation',
  headline: 'Test complete!',
  subtitle:
    'Now our AI will analyze your responses across 5 cognitive dimensions to generate your personalized profile.',
};

export function generateHypeMessage(
  position: HypePosition,
  metrics: HypeMetricsInput,
): HypeMessage {
  switch (position) {
    case 'after_q3':
      return pickRandom(AFTER_Q3_POOL);
    case 'after_q6':
      return pickRandom(buildAfterQ6Pool(metrics));
    case 'after_q12':
      return pickRandom(buildAfterQ12Pool(metrics));
    case 'after_q18':
      return pickRandom(buildAfterQ18Pool(metrics));
    case 'after_q24':
      return pickRandom(buildAfterQ24Pool(metrics));
    case 'after_q27':
      return pickRandom(AFTER_Q27_POOL);
    case 'final':
      return FINAL_MESSAGE;
    default:
      return pickRandom(AFTER_Q3_POOL);
  }
}
