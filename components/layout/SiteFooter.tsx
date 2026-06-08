import Link from 'next/link';
import { LEGAL_BRAND, SUPPORT_EMAIL } from '@/lib/legal';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="font-bold text-slate-900 mb-2">{LEGAL_BRAND}</p>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Cognitive assessment for self-discovery
            </p>
            <p className="text-xs text-slate-500">
              © {year} {LEGAL_BRAND}. All rights reserved.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 text-sm mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-blue-600 transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-slate-900 text-sm mb-3">Support</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition">
                  Contact
                </Link>
              </li>
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-blue-600 transition">
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-slate-900 text-sm mb-3">Business</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>{LEGAL_BRAND}</li>
              <li>Operating in Denmark, EU</li>
              {/* TODO: add registered business address when available for Stripe live mode */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
