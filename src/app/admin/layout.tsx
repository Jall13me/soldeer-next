import type { Metadata } from 'next';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: { default: 'Panel Admin', template: '%s | Admin Soldeer' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">Panel Admin Soldeer</span>
          <div className="mt-3">
            <AdminNav />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
