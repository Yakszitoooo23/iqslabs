export const BRAND = 'IQSLabs';

export const analyzingCopy = {
  headlinePrefix: 'Calculating your',
  headlineAccent: 'IQ score...',
  subtitle:
    'Hang on while our AI reviews your answers against the 5 most important intelligence criteria...',
  dimensions: ['Memory', 'Speed', 'Reaction', 'Concentration', 'Logic'] as const,
  warning: {
    title: 'Warning',
    body:
      'You may be surprised by your results. The IQ report reveals hidden strengths and areas for development. A powerful tool for unlocking your potential.',
    privacy: 'Your results are confidential and for your eyes only.',
    button: 'I understand',
  },
};

export const resultsCopy = {
  headline: 'Get your IQ certificate now!',
  benefits: [
    'Get your exact IQ score',
    'Find out where you rank against the broader population',
    'Discover your cognitive strengths and weaknesses',
    'Get a 7-day trial for just $0.99. After the trial, $24.99/month, until you cancel.',
  ],
  discountCode: 'IQSLABS-85',
  discountLabel: "You're saving 85%",
  discountBadge: '-85%',
  originalPrice: '$5.99',
  trialPrice: '$0.99',
  totalLabel: 'Total:',
  emailPlaceholder: 'Enter your email',
  legalNotice:
    "By continuing, you agree that we'll charge $0.99 today and $24.99/month starting in 7 days. Cancel anytime from your account.",
  trustTitle: (brand: string) => `Why you can trust ${brand}:`,
  featuredTitle: (brand: string) => `${brand} has been featured in:`,
  averageIq: 117,
  countryFlags: ['🇺🇸', '🇬🇧', '🇩🇪', '🇫🇷', '🇨🇦', '🇦🇺', '🇯🇵'],
  trustItems: [
    {
      title: 'Scientifically-grounded IQ test',
      body: 'Our test is built on the matrix-reasoning method, the visual pattern format studied in cognitive research since 1936.',
    },
    {
      title: 'Comprehensive cognitive report',
      body: 'Your personal report is generated using the broadly accepted Cattell-Horn-Carroll (CHC) theory of cognitive abilities.',
    },
    {
      title: 'Your growth toolkit',
      body: 'Your report is just the beginning. Get access to brain training games, expert insights, and 15+ additional assessments to keep developing your mind.',
    },
  ],
  mediaLogos: [
    { name: 'BUSINESS INSIDER', className: 'font-serif font-bold tracking-tight' },
    { name: 'digitaltrends', className: 'font-sans lowercase tracking-wide' },
    { name: 'MSN', className: 'font-sans font-black tracking-widest' },
    { name: 'NEWSWEEK', className: 'font-serif font-bold uppercase' },
    { name: 'USA TODAY', className: 'font-sans font-bold' },
    { name: 'yahoo!finance', className: 'font-serif italic lowercase' },
  ],
  payButtons: {
    paypal: 'PayPal',
    googlePay: 'Google Pay',
    card: 'Pay with Card',
  },
  reviews: [
    {
      name: 'James M.',
      text: 'Smooth experience from start to finish. The report was really eye-opening.',
      timeAgo: '3 weeks ago',
    },
    {
      name: 'Sarah K.',
      text: 'Well-designed test. Worth it for the detailed cognitive breakdown alone.',
      timeAgo: '2 weeks ago',
    },
    {
      name: 'Michael T.',
      text: 'I was surprised by my results. The brain games and recommendations actually help.',
      timeAgo: 'last month',
    },
    {
      name: 'Emma L.',
      text: 'Professional report and clear insights into my strengths. Highly recommend.',
      timeAgo: '3 weeks ago',
    },
    {
      name: 'David R.',
      text: 'Quick checkout, instant access to my dashboard. Everything worked perfectly.',
      timeAgo: 'last month',
    },
  ],
};
