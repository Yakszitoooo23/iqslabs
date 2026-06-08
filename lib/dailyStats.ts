/** Date-seeded daily stat, consistent for all users on the same calendar day. */
function dailySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function seededUnit(seed: number, salt: number): number {
  return ((seed * salt + 49297) % 233280) / 233280;
}

export function getDailyTestsTaken(): number {
  return Math.floor(1100 + seededUnit(dailySeed(), 9301) * 1900);
}

/** Daily average IQ score shown during the test, date-seeded around 117. */
export function getDailyAverageScore(): number {
  const seed = dailySeed();
  return Math.floor(114 + seededUnit(seed, 6151) * 6);
}

export function formatTestsTaken(count: number): string {
  return count.toLocaleString('en-US');
}
