import Link from 'next/link';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { LEGAL_BRAND, SUPPORT_EMAIL } from '@/lib/legal';

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <section>
        <h2>1. Introduction</h2>
        <p>
          {LEGAL_BRAND} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. We
          operate from Denmark and act as the data controller for personal data processed through
          our website and services. This Privacy Policy explains what we collect, why we collect it,
          and your rights under the EU General Data Protection Regulation (GDPR) and applicable
          national law.
        </p>
      </section>

      <section>
        <h2>2. Data We Collect</h2>
        <h3>Account and contact data</h3>
        <ul>
          <li>Email address (account creation, login links, billing communications)</li>
        </ul>
        <h3>Assessment data</h3>
        <ul>
          <li>Quiz responses and scores used to generate your report</li>
          <li>Self-reported demographics and preferences collected during the test</li>
          <li>Time taken and related performance metrics</li>
          <li>AI-generated interpretation text associated with your results</li>
        </ul>
        <h3>Payment data</h3>
        <ul>
          <li>
            Payment card and billing details are processed by Stripe. We do not store full card
            numbers on our servers.
          </li>
          <li>Stripe customer ID and subscription status stored in our database</li>
        </ul>
        <h3>Usage data</h3>
        <ul>
          <li>Pages visited, timestamps, and basic technical logs</li>
          <li>Cookie and local storage preferences (see Section 9)</li>
        </ul>
      </section>

      <section>
        <h2>3. Why We Collect It (Legal Basis)</h2>
        <ul>
          <li>
            <strong>Contract performance (Art. 6(1)(b) GDPR):</strong> to deliver assessments,
            reports, account access, and subscription billing
          </li>
          <li>
            <strong>Legitimate interests (Art. 6(1)(f) GDPR):</strong> fraud prevention, service
            improvement, security monitoring, and analytics
          </li>
          <li>
            <strong>Consent (Art. 6(1)(a) GDPR):</strong> where required, e.g. non-essential cookies
            or optional marketing (if offered in future)
          </li>
          <li>
            <strong>Legal obligation (Art. 6(1)(c) GDPR):</strong> tax, accounting, and regulatory
            requirements
          </li>
        </ul>
      </section>

      <section>
        <h2>4. How We Use Your Data</h2>
        <ul>
          <li>Generate personalized assessment results and dashboard content</li>
          <li>Send transactional emails (results, login links, billing notices)</li>
          <li>Process subscriptions and customer support requests</li>
          <li>Improve reliability, security, and product quality</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2>5. Third-Party Processors</h2>
        <p>We use trusted providers who process data on our behalf:</p>
        <ul>
          <li>
            <strong>Stripe</strong> (payments):{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
              stripe.com/privacy
            </a>
          </li>
          <li>
            <strong>Supabase</strong> (database and authentication):{' '}
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
              supabase.com/privacy
            </a>
          </li>
          <li>
            <strong>Resend</strong> (transactional email):{' '}
            <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              resend.com/legal/privacy-policy
            </a>
          </li>
          <li>
            <strong>OpenAI</strong> (AI interpretation):{' '}
            <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">
              openai.com/policies/privacy-policy
            </a>
            . Quiz response summaries sent via API are processed according to OpenAI&apos;s API data
            usage policies for business customers.
          </li>
          <li>
            <strong>Vercel</strong> (hosting):{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              vercel.com/legal/privacy-policy
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Data Sharing</h2>
        <p>
          We do not sell your personal data. We share data only with processors listed above, as
          necessary to operate the Service, or when required by law, court order, or to protect
          rights and safety.
        </p>
      </section>

      <section>
        <h2>7. Data Retention</h2>
        <ul>
          <li>
            Active subscribers: data retained while the account remains active and as needed for
            billing and support
          </li>
          <li>
            Canceled accounts: personal data deleted or anonymized within 30 days of account
            closure, except where longer retention is required by law (e.g. invoices)
          </li>
          <li>Server logs: typically retained for up to 90 days for security purposes</li>
        </ul>
      </section>

      <section>
        <h2>8. Your GDPR Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Request erasure (&quot;right to be forgotten&quot;)</li>
          <li>Restrict or object to certain processing</li>
          <li>Data portability</li>
          <li>Withdraw consent where processing is consent-based</li>
          <li>
            Lodge a complaint with the Danish Data Protection Agency (Datatilsynet) at{' '}
            <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer">
              datatilsynet.dk
            </a>
          </li>
        </ul>
        <p>
          To exercise your rights, email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We respond within one month,
          subject to applicable extensions for complex requests.
        </p>
      </section>

      <section>
        <h2>9. Cookies</h2>
        <p>We use:</p>
        <ul>
          <li>
            <strong>Essential cookies / storage:</strong> authentication session, cookie consent
            preference, and quiz progress during your session
          </li>
          <li>
            <strong>Analytics cookies:</strong> optional usage analytics to improve the Service
            (only after you choose &quot;Accept all&quot; in our cookie banner)
          </li>
        </ul>
        <p>
          We do not use advertising or third-party tracking cookies for ad targeting. You can
          change your browser settings to block cookies, though some features may not work.
        </p>
      </section>

      <section>
        <h2>10. International Data Transfers</h2>
        <p>
          Some processors (including OpenAI, Stripe, Supabase, and Vercel) may process data in the
          United States or other countries outside the European Economic Area. Where required, we
          rely on appropriate safeguards such as Standard Contractual Clauses approved by the
          European Commission and processor contractual commitments.
        </p>
      </section>

      <section>
        <h2>11. Children&apos;s Privacy</h2>
        <p>
          The Service is intended for adults. We do not knowingly collect personal data from
          children under 16. If you believe a child has provided data, contact us and we will
          delete it promptly.
        </p>
      </section>

      <section>
        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at
          the top will change when we do. Material changes may also be communicated by email or
          in-app notice where appropriate.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          Privacy questions and data protection requests:{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </p>
        <p>
          Our data protection contact can be reached at the same address. {LEGAL_BRAND}, operating
          from Denmark, EU.
        </p>
      </section>
    </LegalPageShell>
  );
}
