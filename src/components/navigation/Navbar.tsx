'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { NAV_CATEGORIES } from '@/config/categoriesConfig';
import { cn } from '@/lib/cn';
import { useQuote } from '@/lib/quote-store';

const LINK_CLASS = 'py-2 transition hover:text-brand';

export function Navbar() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useQuote();

  const closeAll = () => {
    setProductsOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-md print:hidden">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <Link href="/" onClick={closeAll} className="group flex items-center py-2" aria-label="Soldeer - Inicio">
          <Image
            src="/brand/soldeer-logo.webp"
            alt="Soldeer - Estructuras, Comercio y Servicios"
            width={640}
            height={175}
            preload
            className="h-14 w-auto object-contain transition-transform group-hover:scale-105 md:h-16"
          />
        </Link>

        {/* Navegación de escritorio */}
        <nav className="hidden items-center space-x-10 text-lg font-bold text-slate-800 lg:flex xl:text-xl" aria-label="Principal">
          <Link href="/" className={LINK_CLASS}>
            Inicio
          </Link>

          <div
            className="relative py-2"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
            onKeyDown={(event) => event.key === 'Escape' && setProductsOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setProductsOpen(false);
            }}
          >
            <button
              type="button"
              aria-expanded={productsOpen}
              aria-haspopup="true"
              onClick={() => setProductsOpen((open) => !open)}
              className="flex items-center gap-2 font-bold transition hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span>Productos</span>
              <svg
                className={cn('h-5 w-5 transition-transform duration-200', productsOpen && 'rotate-180 text-brand')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {productsOpen && (
              <div className="absolute left-1/2 top-full z-50 grid w-[900px] -translate-x-1/2 animate-fade-in grid-cols-3 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                {NAV_CATEGORIES.map((group) => (
                  <div key={group.slug} className="space-y-3">
                    <h3 className="border-b border-slate-100 pb-2 text-xs font-black uppercase tracking-wider text-brand">
                      <Link href={`/catalog?category=${group.slug}`} onClick={closeAll} className="hover:underline">
                        {group.title}
                      </Link>
                    </h3>
                    <ul className="space-y-2.5">
                      {group.subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/catalog?category=${sub.slug}`}
                            onClick={closeAll}
                            className="group/item block rounded-lg p-2.5 transition hover:bg-teal-50/60"
                          >
                            <div className="text-sm font-bold text-slate-800 group-hover/item:text-brand">{sub.name}</div>
                            {sub.description && (
                              <div className="mt-0.5 line-clamp-1 text-xs font-normal text-slate-400">{sub.description}</div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className={LINK_CLASS}>
            Acerca de Soldeer
          </Link>
          <Link href="/#ubicacion" className={LINK_CLASS}>
            Sucursales
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            onClick={closeAll}
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-dark sm:px-6"
          >
            <span aria-hidden="true">📋</span>
            <span className="hidden sm:inline">Cotización B2B</span>
            {count > 0 && (
              <span
                className="min-w-6 rounded-full bg-white px-1.5 py-0.5 text-center text-xs font-black text-brand"
                aria-label={`${count} productos en la cotización`}
              >
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2.5 lg:hidden"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil: antes en celular no había forma de navegar */}
      {mobileOpen && (
        <nav className="max-h-[calc(100vh-6rem)] animate-fade-in overflow-y-auto border-t border-slate-200 bg-white px-6 py-4 lg:hidden" aria-label="Móvil">
          <ul className="space-y-1 text-base font-bold text-slate-800">
            <li>
              <Link href="/" onClick={closeAll} className="block rounded-lg px-3 py-3 hover:bg-slate-50">
                Inicio
              </Link>
            </li>
            {NAV_CATEGORIES.map((group) => (
              <li key={group.slug}>
                <details className="group rounded-lg">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-3 hover:bg-slate-50">
                    {group.title}
                    <span className="text-brand transition-transform group-open:rotate-180" aria-hidden="true">
                      ▾
                    </span>
                  </summary>
                  <ul className="mb-2 ml-3 space-y-1 border-l-2 border-teal-100 pl-3 text-sm font-semibold">
                    <li>
                      <Link href={`/catalog?category=${group.slug}`} onClick={closeAll} className="block px-2 py-2 text-brand">
                        Ver todo
                      </Link>
                    </li>
                    {group.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link href={`/catalog?category=${sub.slug}`} onClick={closeAll} className="block px-2 py-2 hover:text-brand">
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
            <li>
              <Link href="/about" onClick={closeAll} className="block rounded-lg px-3 py-3 hover:bg-slate-50">
                Acerca de Soldeer
              </Link>
            </li>
            <li>
              <Link href="/#ubicacion" onClick={closeAll} className="block rounded-lg px-3 py-3 hover:bg-slate-50">
                Sucursales
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
