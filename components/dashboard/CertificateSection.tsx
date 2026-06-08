'use client';

import { useCallback, useMemo, useState } from 'react';
import type { LocalTestResult } from '@/lib/localResults';
import { topPercentFromPercentile } from '@/lib/bellCurve';
import {
  buildShareText,
  downloadBlob,
  generateCertificatePDF,
  generateReportPDF,
  shareUrls,
} from '@/lib/certificate';
import { buildReferralLink } from '@/lib/referral';
import { getSupabase } from '@/lib/supabase';

interface CertificateSectionProps {
  result: LocalTestResult;
  referralCode: string;
  userId?: string;
  initialName?: string;
}

function CertificatePreview({
  name,
  score,
  category,
  percentile,
  blurred,
}: {
  name: string;
  score: number;
  category: string;
  percentile: number;
  blurred: boolean;
}) {
  const topPercent = topPercentFromPercentile(percentile);

  return (
    <div
      className={`relative rounded-xl border-2 border-blue-200 bg-white p-6 shadow-[0_0_24px_rgba(37,99,235,0.15)] transition ${
        blurred ? 'blur-sm select-none pointer-events-none' : ''
      }`}
    >
      <div className="border border-blue-100 rounded-lg p-5 text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-slate-500">Certificate of Assessment</p>
        <p className="font-serif text-lg text-slate-800">{name || 'Your Name'}</p>
        <p className="text-4xl font-bold text-blue-600 tabular-nums">{score}</p>
        <p className="text-sm text-slate-600">
          {category} · Top {topPercent}%
        </p>
      </div>
    </div>
  );
}

function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return <span aria-hidden>{children}</span>;
}

export function CertificateSection({
  result,
  referralCode,
  userId,
  initialName = '',
}: CertificateSectionProps) {
  const [name, setName] = useState(initialName);
  const [revealed, setRevealed] = useState(Boolean(initialName));
  const [downloading, setDownloading] = useState<'cert' | 'report' | null>(null);

  const referralLink = buildReferralLink(referralCode);
  const shareText = useMemo(
    () => buildShareText(result.scaled_score, result.percentile, referralLink),
    [result.scaled_score, result.percentile, referralLink],
  );
  const urls = useMemo(() => shareUrls(referralLink, shareText), [referralLink, shareText]);

  const persistName = useCallback(
    async (fullName: string) => {
      if (!userId) return;
      try {
        await getSupabase()
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', userId);
      } catch {
        // Non-blocking, PDF still works client-side
      }
    },
    [userId],
  );

  const handleReveal = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setRevealed(true);
    void persistName(trimmed);
  }, [name, persistName]);

  const handleDownloadCertificate = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setDownloading('cert');
    try {
      const blob = await generateCertificatePDF(
        trimmed,
        result.scaled_score,
        result.percentile,
        result.category,
      );
      downloadBlob(blob, `${trimmed.replace(/\s+/g, '-')}-iq-certificate.pdf`);
    } finally {
      setDownloading(null);
    }
  }, [name, result]);

  const handleDownloadReport = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setDownloading('report');
    try {
      const blob = await generateReportPDF(trimmed, result);
      downloadBlob(blob, `${trimmed.replace(/\s+/g, '-')}-cognitive-report.pdf`);
    } finally {
      setDownloading(null);
    }
  }, [name, result]);

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      {/* Left, certificate generator */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 text-center mb-6">Your IQ Certificate</h2>

        <div className="relative mb-6">
          <CertificatePreview
            name={revealed ? name.trim() : '████████'}
            score={result.scaled_score}
            category={result.category}
            percentile={result.percentile}
            blurred={!revealed}
          />
          {!revealed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <p className="font-semibold text-slate-900 mb-1">Your certificate is ready</p>
              <p className="text-sm text-slate-600">
                Enter your name to personalize and reveal your IQ certificate
              </p>
            </div>
          )}
        </div>

        {!revealed ? (
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleReveal}
              disabled={!name.trim()}
              className="w-full py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold text-lg transition"
            >
              Reveal Certificate
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleDownloadCertificate}
              disabled={downloading !== null}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition"
            >
              {downloading === 'cert' ? 'Generating…' : 'Download Certificate (PDF)'}
            </button>
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={downloading !== null}
              className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-700 hover:bg-blue-50 disabled:opacity-50 font-semibold transition"
            >
              {downloading === 'report' ? 'Generating…' : 'Download Report (PDF)'}
            </button>
          </div>
        )}
      </div>

      {/* Right, share */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 text-center mb-6">Share Your Certificate</h2>

        <div className="flex justify-center gap-3 mb-6">
          <a
            href={urls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0A66C2] text-white hover:opacity-90 transition"
            aria-label="Share on LinkedIn"
          >
            <SocialIcon label="LinkedIn">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </SocialIcon>
          </a>
          <a
            href={urls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white hover:opacity-90 transition"
            aria-label="Share on X"
          >
            <SocialIcon label="X">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialIcon>
          </a>
          <a
            href={urls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] text-white hover:opacity-90 transition"
            aria-label="Share on Facebook"
          >
            <SocialIcon label="Facebook">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </SocialIcon>
          </a>
        </div>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-slate-200" />
          <span className="px-3 text-sm text-slate-500">or</span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadCertificate}
            disabled={!revealed || downloading !== null}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 font-medium transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12m0 0l4-4m-4 4L8 11M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            Certificate
          </button>
          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={!revealed || downloading !== null}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 font-medium transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12m0 0l4-4m-4 4L8 11M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            Report
          </button>
        </div>
      </div>
    </section>
  );
}
