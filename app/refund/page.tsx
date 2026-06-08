import Link from 'next/link';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { LEGAL_BRAND, SUPPORT_EMAIL } from '@/lib/legal';

export default function RefundPage() {
  return (
    <LegalPageShell title="Refund Policy">
      <section>
        <h2>1. Trial Period</h2>
        <p>
          New subscribers pay USD $0.99 today for a 7-day trial with full access to {LEGAL_BRAND}{' '}
          results, dashboard features, and brain training content. You can cancel before the trial
          ends to avoid the USD $24.99 monthly charge. Cancel via Manage Subscription in your
          dashboard or by emailing {SUPPORT_EMAIL}.
        </p>
      </section>

      <section>
        <h2>2. Refunds for Subscription Charges</h2>
        <p>
          Within 14 days of any monthly charge, you may request a refund if you have not
          significantly used the Service after that charge.
        </p>
        <p>
          <strong>Significant use</strong> includes, after the charge in question: completing
          additional assessments, accessing premium training content beyond your initial report,
          downloading certificates, or extended daily use of member features. Refund requests are
          reviewed individually and approved at {LEGAL_BRAND}&apos;s discretion.
        </p>
        <p>
          Setup fees and trial charges are generally non-refundable once digital content has been
          delivered, except where mandatory consumer law requires otherwise.
        </p>
      </section>

      <section>
        <h2>3. How to Request a Refund</h2>
        <ol>
          <li>
            Email <a href={`mailto:${SUPPORT_EMAIL}?subject=Refund%20Request`}>{SUPPORT_EMAIL}</a>{' '}
            with the subject line &quot;Refund Request&quot;
          </li>
          <li>Include the email address on your account and the approximate date of the charge</li>
          <li>Briefly explain the reason for your request</li>
        </ol>
        <p>
          We aim to respond within 48 hours. Approved refunds are processed through Stripe within
          5-10 business days. Your bank may take additional time to post the credit.
        </p>
      </section>

      <section>
        <h2>4. EU Right of Withdrawal</h2>
        <p>
          EU consumers generally have 14 days to withdraw from distance contracts for digital
          services. However, when you purchase access to your full IQ test results, you receive
          immediate digital delivery.
        </p>
        <p>
          By checking the consent box at checkout on our{' '}
          <Link href="/results">results page</Link>, you expressly request immediate access and
          acknowledge that your right of withdrawal may be lost under Article 16(m) of the EU
          Consumer Rights Directive once digital content has been supplied.
        </p>
        <p>
          See also our <Link href="/terms">Terms of Service</Link> for full details.
        </p>
      </section>

      <section>
        <h2>5. Chargebacks</h2>
        <p>
          If you have a billing concern, please contact us before initiating a chargeback with your
          bank. We will work in good faith to resolve legitimate issues. Unauthorized or abusive
          chargebacks may result in account suspension and loss of access.
        </p>
      </section>

      <section>
        <h2>6. Contact</h2>
        <p>
          Refund questions:{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </p>
      </section>
    </LegalPageShell>
  );
}
