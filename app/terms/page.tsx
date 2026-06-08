import Link from 'next/link';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { LEGAL_BRAND, LEGAL_DOMAIN, SUPPORT_EMAIL } from '@/lib/legal';

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <section>
        <h2>1. Introduction</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of the {LEGAL_BRAND} website at{' '}
          {LEGAL_DOMAIN} and related services (collectively, the &quot;Service&quot;). {LEGAL_BRAND}{' '}
          is operated from Denmark and provides online cognitive assessments, AI-generated
          interpretations, and brain training content to users worldwide, with particular attention
          to consumer protections applicable in the European Union.
        </p>
        <p>
          By accessing or using the Service, you enter into a binding agreement with {LEGAL_BRAND}.
          If you do not agree to these Terms, do not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Acceptance of Terms</h2>
        <p>
          By creating an account, completing a purchase, or otherwise using the Service, you
          confirm that you have read, understood, and agree to these Terms and our{' '}
          <Link href="/privacy">Privacy Policy</Link>. If you use the Service on behalf of an
          organization, you represent that you have authority to bind that organization.
        </p>
      </section>

      <section>
        <h2>3. Service Description</h2>
        <p>The Service includes, among other features:</p>
        <ul>
          <li>An online cognitive assessment based on visual matrix reasoning and related tasks</li>
          <li>Scored results, percentile estimates, and dimension-level feedback</li>
          <li>AI-generated written interpretations of your response patterns</li>
          <li>Access to brain training games and member dashboard content while subscribed</li>
        </ul>
        <p>
          Results are provided for self-reflection and general informational purposes. They are not
          a substitute for professional advice.
        </p>
      </section>

      <section>
        <h2>4. Account Registration</h2>
        <p>
          Accounts are created using magic-link email authentication. You must provide a valid
          email address and keep it secure. You are responsible for all activity under your account
          and for ensuring that only you access links sent to your email.
        </p>
        <p>
          Notify us immediately at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> if you suspect unauthorized access.
        </p>
      </section>

      <section>
        <h2>5. Subscription Terms</h2>
        <p>Paid access is offered on a subscription basis with the following terms:</p>
        <ul>
          <li>
            <strong>Setup fee:</strong> USD $0.99 is charged today when you subscribe at checkout.
          </li>
          <li>
            <strong>Trial period:</strong> You receive 7 days of full access starting at purchase.
          </li>
          <li>
            <strong>Recurring charge:</strong> After the trial, USD $24.99 is charged monthly until
            you cancel.
          </li>
          <li>
            <strong>Automatic renewal:</strong> Your subscription renews automatically each month
            unless canceled before the renewal date.
          </li>
          <li>
            <strong>Cancellation:</strong> You may cancel at any time via the Manage Subscription
            button in your dashboard (Stripe Customer Portal) or by emailing {SUPPORT_EMAIL}.
          </li>
        </ul>
        <p>
          Prices are shown in USD. Your card issuer may apply currency conversion or fees. Taxes may
          apply where required by law.
        </p>
      </section>

      <section>
        <h2>6. Cancellation</h2>
        <p>
          When you cancel, your subscription remains active until the end of the current billing
          period. You will not be charged again after cancellation takes effect. To cancel, open
          your dashboard, select Manage Subscription, and follow the Stripe billing portal steps, or
          contact {SUPPORT_EMAIL}.
        </p>
      </section>

      <section>
        <h2>7. Refund Policy</h2>
        <p>
          Refunds are handled according to our separate{' '}
          <Link href="/refund">Refund Policy</Link>, which is incorporated into these Terms by
          reference.
        </p>
      </section>

      <section>
        <h2>8. EU Right of Withdrawal</h2>
        <p>
          If you are a consumer in the European Union, you generally have 14 days to withdraw from
          distance contracts for digital services under the Consumer Rights Directive (CRD).
        </p>
        <p>
          However, if you request immediate access to your full test results and digital content
          after payment, you acknowledge that delivery begins immediately. By checking the consent
          box at checkout and accessing your results, you expressly request immediate performance
          and agree that your right of withdrawal may be lost under Article 16(m) of the CRD once
          digital content has been supplied.
        </p>
      </section>

      <section>
        <h2>9. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use automated tools, bots, or scrapers to access the Service</li>
          <li>Attempt to reverse engineer, copy, or redistribute test content or reports</li>
          <li>Share account access or resell results as a commercial service</li>
          <li>Interfere with security, billing, or infrastructure of the Service</li>
          <li>Use the Service for unlawful, harassing, or fraudulent purposes</li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these rules.
        </p>
      </section>

      <section>
        <h2>10. Intellectual Property</h2>
        <p>
          {LEGAL_BRAND} and its licensors own all rights in the Service, including test items,
          software, branding, AI prompt structures, and generated report formats. You receive a
          limited, personal, non-transferable license to use the Service and your own results for
          private, non-commercial purposes while your account is active.
        </p>
        <p>You may not copy, modify, or create derivative works from our proprietary content.</p>
      </section>

      <section>
        <h2>11. Disclaimer of Medical and Diagnostic Claims</h2>
        <p>
          <strong>
            {LEGAL_BRAND} is NOT a medical device, clinical instrument, or diagnostic service.
          </strong>{' '}
          The assessment does NOT diagnose any cognitive disorder, neurological condition, mental
          health condition, learning disability, or any other medical condition. It does NOT
          provide medical, psychological, psychiatric, or therapeutic advice.
        </p>
        <p>
          Scores and interpretations are for self-reflection, education, and entertainment only. Do
          not use results to make healthcare, employment, educational placement, or legal decisions.
          If you have concerns about your cognitive or mental health, consult a qualified
          healthcare professional.
        </p>
      </section>

      <section>
        <h2>12. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, {LEGAL_BRAND} and its operators shall
          not be liable for indirect, incidental, special, consequential, or punitive damages, or
          for loss of profits, data, or goodwill, arising from your use of the Service.
        </p>
        <p>
          Our total aggregate liability for any claim relating to the Service shall not exceed the
          greater of (a) the amount you paid to {LEGAL_BRAND} in the 12 months before the claim, or
          (b) USD $100, except where liability cannot be limited under mandatory consumer law in
          your country.
        </p>
        <p>
          The Service is provided &quot;as is&quot; without warranties of uninterrupted availability,
          error-free operation, or fitness for a particular purpose, except where such disclaimers
          are prohibited by law.
        </p>
      </section>

      <section>
        <h2>13. Modifications to Terms</h2>
        <p>
          We may update these Terms from time to time. Material changes will be posted on this page
          with an updated &quot;Last updated&quot; date. Continued use after changes take effect
          constitutes acceptance. If you disagree with updated Terms, you must stop using the
          Service and cancel your subscription.
        </p>
      </section>

      <section>
        <h2>14. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Denmark, without regard to conflict-of-law
          principles. If you are an EU consumer, you retain mandatory protections under the laws of
          your country of residence. Disputes may be brought before the courts of Denmark or, where
          applicable, before your local consumer dispute resolution bodies.
        </p>
      </section>

      <section>
        <h2>15. Contact</h2>
        <p>
          Questions about these Terms:{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </p>
      </section>
    </LegalPageShell>
  );
}
