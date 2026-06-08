export function getPerformanceRating(correct: number, total: number): string {
  if (correct <= 3) return 'Keep practicing';
  if (correct <= 6) return 'Good effort';
  if (correct <= 8) return 'Strong performance';
  return 'Excellent';
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickBalancedQuestions<T extends { difficulty: number }>(
  bank: T[],
  counts: { easy: number; medium: number; hard: number },
): T[] {
  const easy = bank.filter((q) => q.difficulty <= 2);
  const medium = bank.filter((q) => q.difficulty === 3);
  const hard = bank.filter((q) => q.difficulty >= 4);

  const pick = (pool: T[], n: number) => shuffle(pool).slice(0, n);

  const selected = [
    ...pick(easy, counts.easy),
    ...pick(medium, counts.medium),
    ...pick(hard, counts.hard),
  ];

  if (selected.length < counts.easy + counts.medium + counts.hard) {
    const used = new Set(selected);
    const rest = shuffle(bank.filter((q) => !used.has(q)));
    while (selected.length < counts.easy + counts.medium + counts.hard && rest.length) {
      selected.push(rest.pop()!);
    }
  }

  return shuffle(selected);
}

/** Brain teasers use difficulty 1=easy, 2=medium, 3=hard. */
export function pickBrainTeasers<T extends { difficulty: number }>(
  bank: T[],
  counts: { easy: number; medium: number; hard: number } = { easy: 3, medium: 4, hard: 3 },
): T[] {
  const easy = bank.filter((q) => q.difficulty === 1);
  const medium = bank.filter((q) => q.difficulty === 2);
  const hard = bank.filter((q) => q.difficulty === 3);
  const pick = (pool: T[], n: number) => shuffle(pool).slice(0, n);
  return shuffle([
    ...pick(easy, counts.easy),
    ...pick(medium, counts.medium),
    ...pick(hard, counts.hard),
  ]);
}
