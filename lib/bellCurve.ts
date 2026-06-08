const MU = 100;
const SIGMA = 15;

/** Standard normal PDF with μ=100, σ=15. */
export function normalPDF(x: number, mu = MU, sigma = SIGMA): number {
  const coef = 1 / (sigma * Math.sqrt(2 * Math.PI));
  return coef * Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));
}

export interface BellCurvePoint {
  iq: number;
  density: number;
}

/** ~91 points from IQ 55-145, Y scaled to 0-100 probability density display. */
export function generateBellCurveData(): BellCurvePoint[] {
  const raw: BellCurvePoint[] = [];
  for (let iq = 55; iq <= 145; iq += 1) {
    raw.push({ iq, density: normalPDF(iq) });
  }
  const max = Math.max(...raw.map((p) => p.density));
  return raw.map((p) => ({
    iq: p.iq,
    density: Math.round((p.density / max) * 1000) / 10,
  }));
}

export function topPercentFromPercentile(percentile: number): number {
  return Math.max(1, Math.round(100 - percentile));
}
