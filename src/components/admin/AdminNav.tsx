'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const TABS = [
  { href: '/admin/products', label: '📦 Productos' },
  { href: '/admin/banners', label: '🖼️ Banners' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Administración" className="flex flex-wrap items-center gap-2">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={pathname.startsWith(tab.href) ? 'page' : undefined}
          className={cn(
            'rounded-lg px-4 py-2 text-xs font-bold transition',
            pathname.startsWith(tab.href) ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          {tab.label}
        </Link>
      ))}
      <Link href="/" className="rounded-lg px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900">
        ← Ver tienda
      </Link>
    </nav>
  );
}
