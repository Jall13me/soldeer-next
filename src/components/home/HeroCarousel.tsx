'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { HeroSlide } from '@/domain/entities/HeroBanner';
import { cn } from '@/lib/cn';

const DEFAULT_TITLE = 'Tecnología y Soldadura de Vanguardia';
const DEFAULT_SUBTITLE = 'Equipos de alto rendimiento y soporte técnico especializado en Bolivia.';
const AUTOPLAY_MS = 6000;

function SlideLink({ href }: { href: string }) {
  const className = 'rounded-xl bg-white px-7 py-3 font-bold text-slate-900 shadow-lg transition hover:bg-slate-100';
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        Ver más
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      Ver más
    </a>
  );
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const active = count > 0 ? index % count : 0;
  const current: HeroSlide | undefined = slides[active];

  useEffect(() => {
    if (count <= 1 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div
      className="relative h-[450px] w-full overflow-hidden bg-slate-950 shadow-inner md:h-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Novedades Soldeer"
    >
      {/* Todas las diapositivas montadas y con fundido: sin saltos ni parpadeo al cambiar */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== active}
          className={cn(
            'absolute inset-0 z-0 transition-opacity duration-700 ease-in-out',
            i === active ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title ?? 'Soldeer Banner Industrial'}
            fill
            sizes="100vw"
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className="object-cover opacity-50"
          />
        </div>
      ))}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-2xl text-white">
          <span className="rounded-full border border-brand-light/40 bg-brand px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow">
            Novedades Soldeer
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight drop-shadow-md md:text-6xl">
            {current?.title ?? DEFAULT_TITLE}
          </h1>
          <p className="mt-4 text-base font-medium text-slate-200 drop-shadow md:text-lg">
            {current?.subtitle ?? DEFAULT_SUBTITLE}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#catalogo" className="rounded-xl bg-brand px-7 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-dark">
              Explorar Catálogo
            </a>
            {current?.linkUrl ? (
              <SlideLink href={current.linkUrl} />
            ) : (
              <a href="#ubicacion" className="rounded-xl border-2 border-slate-300 px-7 py-3 font-bold text-white transition hover:bg-white/10">
                Ubicación de Tienda
              </a>
            )}
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Banner anterior"
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/30 p-3 text-white transition hover:bg-black/50 md:block"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Banner siguiente"
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/30 p-3 text-white transition hover:bg-black/50 md:block"
          >
            ›
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ir al banner ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === active ? 'h-2.5 w-8 bg-brand' : 'h-2.5 w-2.5 bg-white/50 hover:bg-white',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
