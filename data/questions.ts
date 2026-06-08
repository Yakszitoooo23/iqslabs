import { testSteps, type TestStep } from './testStructure';

export type { TestStep } from './testStructure';

export const TEST_CONFIG = {
  iq: {
    totalTimeSeconds: 25 * 60,
    steps: testSteps,
    name: 'IQ Assessment',
  },
};
