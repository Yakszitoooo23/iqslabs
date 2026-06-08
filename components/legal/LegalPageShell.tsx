import Link from 'next/link';
import { LEGAL_LAST_UPDATED } from '@/lib/legal';

interface LegalPageShellProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
      <p className="text-sm text-slate-500 mb-2">
        <Link href="/" className="text-blue-600 hover:underline">
          Home
        </Link>
      </p>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{title}</h1>
      <p className="text-sm text-slate-500 mt-3 mb-10">Last updated: {LEGAL_LAST_UPDATED}</p>
      <article className="text-slate-700 leading-relaxed space-y-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-blue-600 [&_a]:hover:underline [&_p]:space-y-3">
        {children}
      </article>
    </main>
  );
}
