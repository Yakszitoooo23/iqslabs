import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { RefCapture } from '@/components/RefCapture';

export const metadata: Metadata = {
  title: 'IQ Test: Discover Your Cognitive Profile',
  description: 'Take a 30-question visual matrix IQ assessment and get your full cognitive report.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-body min-h-screen flex flex-col pb-24">
        <Suspense fallback={null}>
          <RefCapture />
        </Suspense>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
