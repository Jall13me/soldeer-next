'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { buildQuoteMessage, buildWhatsAppUrl } from '@/lib/quote-message';
import { quoteActions, useQuote } from '@/lib/quote-store';
import { useIsClient } from '@/lib/use-is-client';

export function QuoteCart() {
  const isClient = useIsClient();
  const { items, count } = useQuote();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');

  // El carrito vive en el navegador: mientras hidrata mostramos un esqueleto, no "vacío".
  if (!isClient) {
    return <div className="h-64 animate-pulse rounded-2xl bg-slate-100" aria-hidden="true" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-4xl" aria-hidden="true">📋</p>
        <h2 className="mt-3 text-lg font-bold text-slate-900">Tu cotización está vacía</h2>
        <p className="mt-2 text-sm text-slate-500">Agrega equipos desde su ficha técnica y envíanos la lista en un solo mensaje.</p>
        <Link href="/catalog" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">
          Explorar catálogo
        </Link>
      </div>
    );
  }

  const canSend = name.trim().length > 1;
  const whatsappUrl = buildWhatsAppUrl(
    siteConfig.whatsapp,
    buildQuoteMessage(items, { name, company, notes }, siteConfig.url),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <ul className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <li key={item.slug} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
              <Image src={item.image} alt="" fill sizes="80px" className="object-contain p-1" />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${item.slug}`} className="line-clamp-2 font-bold text-slate-900 hover:text-brand">
                {item.title}
              </Link>
              {item.sku && <p className="mt-0.5 text-xs text-slate-500">SKU {item.sku}</p>}
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">
                  <button
                    type="button"
                    onClick={() => quoteActions.setQuantity(item.slug, item.quantity - 1)}
                    aria-label={`Disminuir cantidad de ${item.title}`}
                    className="px-3 py-1 font-bold hover:bg-slate-100"
                  >
                    −
                  </button>
                  <span className="min-w-10 text-center text-sm font-bold" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => quoteActions.setQuantity(item.slug, item.quantity + 1)}
                    aria-label={`Aumentar cantidad de ${item.title}`}
                    className="px-3 py-1 font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => quoteActions.remove(item.slug)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900">
          Resumen ({count} {count === 1 ? 'unidad' : 'unidades'})
        </h2>

        <label className="block text-xs font-bold text-slate-600">
          Tu nombre *
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-xs font-bold text-slate-600">
          Empresa
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            autoComplete="organization"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-xs font-bold text-slate-600">
          Notas (opcional)
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            maxLength={500}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal focus:border-brand focus:outline-none"
          />
        </label>

        <a
          href={canSend ? whatsappUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canSend}
          className={
            canSend
              ? 'block rounded-xl bg-brand px-6 py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-brand-dark'
              : 'block cursor-not-allowed rounded-xl bg-slate-200 px-6 py-3.5 text-center text-sm font-bold text-slate-500'
          }
        >
          Enviar cotización por WhatsApp
        </a>
        {!canSend && <p className="text-xs text-slate-500">Escribe tu nombre para habilitar el envío.</p>}

        <button type="button" onClick={() => quoteActions.clear()} className="w-full text-xs font-semibold text-slate-500 hover:text-red-600">
          Vaciar cotización
        </button>
      </aside>
    </div>
  );
}
