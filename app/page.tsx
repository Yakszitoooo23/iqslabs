import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-heading">
          Discover Your <span className="text-accent">Cognitive Profile</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          A 30-question visual matrix assessment measuring pattern recognition,
          logical reasoning, and spatial intelligence. Get your IQ score and full report.
        </p>
        <div className="pt-6">
          <Link
            href="/quiz"
            className="inline-block bg-accent hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition"
          >
            Start the Test →
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            Takes about 25 minutes · Free to take · Pay only to unlock your detailed report
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-16">
          {[
            { title: '30 Visual Questions', desc: 'Raven-style matrix pattern assessment' },
            { title: 'Detailed Report', desc: 'IQ score, percentile, strengths & weaknesses' },
            { title: 'Brain Training', desc: 'Daily games to sharpen your cognition' },
          ].map((f) => (
            <div key={f.title} className="bg-subtle rounded-lg p-6 border border-divider">
              <h3 className="font-semibold text-navy mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
