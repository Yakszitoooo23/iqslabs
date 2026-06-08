import Link from 'next/link';
import { LEGAL_BRAND, SUPPORT_EMAIL } from '@/lib/legal';

const FAQ = [
  {
    q: 'How do I cancel my subscription?',
    a: 'Open your dashboard and click Manage Subscription to open the Stripe billing portal, or email us at support@iqslabs.com. Cancellation takes effect at the end of your current billing period.',
  },
  {
    q: 'How do I retake the test?',
    a: 'Each account includes one completed IQ assessment. If you need a retake under special circumstances, contact us and we will review your request.',
  },
  {
    q: "Why didn't I get my results email?",
    a: 'Check your spam or promotions folder first. If it is still missing, email us with the address you used at checkout and we will help you access your dashboard.',
  },
  {
    q: 'How do I get a refund?',
    a: 'See our Refund Policy for details, or email us with subject "Refund Request".',
  },
  {
    q: 'Is this test scientifically validated?',
    a: 'Our assessment draws on Raven-style matrix reasoning and Cattell-Horn-Carroll (CHC) theory frameworks. It is not a medical or clinical diagnostic tool and should not be used for healthcare decisions.',
  },
] as const;

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
      <section className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Get in touch
        </h1>
        <p className="text-slate-600 mt-4 text-lg">We typically respond within 48 hours.</p>
        <p className="mt-8 text-xl md:text-2xl font-semibold text-slate-900 break-all">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Email us
        </a>
      </section>

      <section className="border-t border-slate-200 pt-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Common questions</h2>
        <dl className="space-y-8">
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-slate-900 mb-2">{item.q}</dt>
              <dd className="text-slate-700 leading-relaxed">
                {item.q === 'How do I get a refund?' ? (
                  <>
                    See our{' '}
                    <Link href="/refund" className="text-blue-600 hover:underline">
                      Refund Policy
                    </Link>{' '}
                    for details, or email us with subject &quot;Refund Request&quot;.
                  </>
                ) : item.q === 'How do I cancel my subscription?' ? (
                  <>
                    Open your dashboard and click Manage Subscription to open the Stripe billing
                    portal, or email us at{' '}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 hover:underline">
                      {SUPPORT_EMAIL}
                    </a>
                    . Cancellation takes effect at the end of your current billing period.
                  </>
                ) : (
                  item.a
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-sm text-slate-500 mt-12 text-center">
        {LEGAL_BRAND} · Operating in Denmark, EU
      </p>
    </main>
  );
}
