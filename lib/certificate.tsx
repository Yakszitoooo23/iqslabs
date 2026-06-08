import { pdf } from '@react-pdf/renderer';
import { BRAND } from '@/lib/copy';
import type { LocalTestResult } from '@/lib/localResults';
import { CertificateDocument } from '@/lib/pdf/CertificateDocument';
import { ReportDocument } from '@/lib/pdf/ReportDocument';

export function generateVerificationId(name: string, score: number): string {
  const input = `${name}-${score}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36).toUpperCase().slice(0, 8);
}

export async function generateCertificatePDF(
  name: string,
  score: number,
  percentile: number,
  classification: string,
  date: Date = new Date(),
): Promise<Blob> {
  const verificationId = generateVerificationId(name, score);
  return pdf(
    <CertificateDocument
      name={name}
      score={score}
      percentile={percentile}
      classification={classification}
      date={date}
      brand={BRAND}
      verificationId={verificationId}
    />,
  ).toBlob();
}

export async function generateReportPDF(
  name: string,
  result: LocalTestResult,
  date: Date = new Date(),
): Promise<Blob> {
  const verificationId = generateVerificationId(name, result.scaled_score);
  return pdf(
    <ReportDocument
      name={name}
      score={result.scaled_score}
      percentile={result.percentile}
      classification={result.category}
      rawScore={result.raw_score}
      dimensionScores={result.dimensionScores}
      strengths={result.strengths}
      weaknesses={result.weaknesses}
      interpretation={result.ai_interpretation}
      date={date}
      brand={BRAND}
      verificationId={verificationId}
    />,
  ).toBlob();
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function buildShareText(
  score: number,
  percentile: number,
  referralLink: string,
): string {
  const topPercent = Math.max(1, Math.round(100 - percentile));
  return `I just took the ${BRAND} cognitive assessment. My IQ is ${score}, placing me in the top ${topPercent}%. Try the test yourself: ${referralLink}`;
}

export function shareUrls(referralLink: string, shareText: string) {
  const encodedUrl = encodeURIComponent(referralLink);
  const encodedText = encodeURIComponent(shareText);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
}
