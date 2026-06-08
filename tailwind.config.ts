import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1E3A8A',
        accent: '#2563EB',
        body: '#1E293B',
        heading: '#0F172A',
        subtle: '#F8FAFC',
        divider: '#CBD5E1',
      },
    },
  },
  plugins: [],
};
export default config;
