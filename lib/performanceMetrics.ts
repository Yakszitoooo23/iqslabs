import { POPULATION_AVG_RESPONSE_SECONDS } from '@/lib/dimensionScores';

export interface PerformanceMetricsData {
  avgResponseTimeSeconds: number;
  durationMinutes: number;
  durationSeconds: number;
  durationSubtitle: string;
  fasterThanPopulation: boolean;
}

export function computePerformanceMetrics(timeTakenSeconds: number): PerformanceMetricsData {
  const avgResponseTimeSeconds =
    timeTakenSeconds > 0
      ? Math.round((timeTakenSeconds / 30) * 10) / 10
      : POPULATION_AVG_RESPONSE_SECONDS;

  const durationMinutes = Math.floor(timeTakenSeconds / 60);
  const durationSeconds = timeTakenSeconds % 60;
  const fasterThanPopulation = avgResponseTimeSeconds < POPULATION_AVG_RESPONSE_SECONDS;
  const durationSubtitle =
    timeTakenSeconds > 0 && timeTakenSeconds < 15 * 60
      ? 'Test completed efficiently'
      : 'Thorough approach';

  return {
    avgResponseTimeSeconds,
    durationMinutes,
    durationSeconds,
    durationSubtitle,
    fasterThanPopulation,
  };
}

export { POPULATION_AVG_RESPONSE_SECONDS as POPULATION_AVG_SECONDS };
