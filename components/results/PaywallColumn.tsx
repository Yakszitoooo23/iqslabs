'use client';

import Link from 'next/link';
import { useState } from 'react';
import { resultsCopy } from '@/lib/copy';

export type PaymentMethodChoice = 'paypal' | 'google_pay' | 'card';

interface PaywallColumnProps {
  email: string;
  onEmailChange: (email: string) => void;
  onCheckout: (method: PaymentMethodChoice) => void;
  loading: boolean;
  loadingMethod: PaymentMethodChoice | null;
}

export function PaywallColumn({
  email,
  onEmailChange,
  onCheckout,
  loading,
  loadingMethod,
}: PaywallColumnProps) {
  const [euConsent, setEuConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const hasEmail = email.trim().length > 0;
  const canPay = hasEmail && euConsent && !loading;

  function handlePay(method: PaymentMethodChoice) {
    if (!hasEmail) return;
    if (!euConsent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    onCheckout(method);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A]">{resultsCopy.headline}</h1>

      <ul className="space-y-3">
        {resultsCopy.benefits.map((benefit) => (
          <li key={benefit} className="flex gap-3 text-[#1E293B]">
            <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
            <span className="text-sm md:text-base leading-relaxed">{benefit}</span>
          </li>
        ))}
      </ul>

      <input
        type="email"
        required
        placeholder={resultsCopy.emailPlaceholder}
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="w-full px-5 py-4 rounded-xl border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
      />

      <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <span className="text-2xl flex-shrink-0" aria-hidden>
          🎁
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0F172A] text-sm">
            Discount code {resultsCopy.discountCode} applied
          </p>
          <p className="text-slate-600 text-sm">{resultsCopy.discountLabel}</p>
        </div>
        <span className="flex-shrink-0 bg-[#1E3A8A] text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {resultsCopy.discountBadge}
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-slate-600 font-medium">{resultsCopy.totalLabel}</span>
        <div className="flex items-baseline gap-3">
          <span className="text-slate-400 line-through text-lg">{resultsCopy.originalPrice}</span>
          <span className="text-3xl font-bold text-[#0F172A]">{resultsCopy.trialPrice}</span>
        </div>
      </div>

      <label
        className={`flex gap-3 items-start rounded-xl border p-4 cursor-pointer transition ${
          consentError && !euConsent
            ? 'border-red-300 bg-red-50'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
        }`}
      >
        <input
          type="checkbox"
          checked={euConsent}
          onChange={(e) => {
            setEuConsent(e.target.checked);
            if (e.target.checked) setConsentError(false);
          }}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
        />
        <span className="text-xs text-slate-600 leading-relaxed">
          I understand that by accessing my results immediately, I waive my 14-day right of
          withdrawal under EU Consumer Rights Directive Article 16(m). I agree to the{' '}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 hover:underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {consentError && !euConsent && (
        <p className="text-xs text-red-600 -mt-4">
          Please confirm the checkbox above before continuing to payment.
        </p>
      )}

      <div className="space-y-3">
        <PayPalButton
          disabled={!canPay}
          loading={loadingMethod === 'paypal'}
          onClick={() => handlePay('paypal')}
        />
        <GooglePayButton
          disabled={!canPay}
          loading={loadingMethod === 'google_pay'}
          onClick={() => handlePay('google_pay')}
        />
        <CardPayButton
          disabled={!canPay}
          loading={loadingMethod === 'card'}
          onClick={() => handlePay('card')}
        />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">{resultsCopy.legalNotice}</p>
    </div>
  );
}

function PayPalButton({
  disabled,
  loading,
  onClick,
}: {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[#003087] bg-[#FFC439] hover:bg-[#f5ba2e] disabled:opacity-50 transition"
    >
      {loading ? (
        'Redirecting...'
      ) : (
        <>
          <span className="italic font-bold text-[#003087]">Pay</span>
          <span className="italic font-bold text-[#009CDE]">Pal</span>
        </>
      )}
    </button>
  );
}

function GooglePayButton({
  disabled,
  loading,
  onClick,
}: {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-white bg-black hover:bg-gray-900 disabled:opacity-50 transition"
    >
      {loading ? (
        'Redirecting...'
      ) : (
        <>
          <GooglePayMark />
          <span>Google Pay</span>
        </>
      )}
    </button>
  );
}

function GooglePayMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.6 3.5-5.1 3.5-3.1 0-5.6-2.5-5.6-5.6S8.9 5.1 12 5.1c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.9 2.8 14.7 2 12 2 6.9 2 2.7 6.2 2.7 11.3S6.9 20.6 12 20.6c3.5 0 5.8-2.2 5.8-5.3 0-.4 0-.7-.1-1.1H12z"
      />
    </svg>
  );
}

function CardPayButton({
  disabled,
  loading,
  onClick,
}: {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white bg-[#0F766E] hover:bg-[#0d655e] disabled:opacity-50 transition"
    >
      {loading ? (
        'Redirecting...'
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {resultsCopy.payButtons.card}
        </>
      )}
    </button>
  );
}
