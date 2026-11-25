'use client';

import Link from 'next/link';
import { useState } from 'react';
import { quoteActions, type QuoteItem } from '@/lib/quote-store';

type QuoteProduct = Omit<QuoteItem, 'quantity'>;

export function AddToQuoteButton({ product }: { product: QuoteProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const changeQuantity = (next: number) => {
    setQuantity(Math.min(999, Math.max(1, Math.floor(next) || 1)));
    setAdded(false);
  };

  const handleAdd = () => {
    quoteActions.add(product, quantity);
    setAdded(true);
  };

  return (
    <div className="flex-1 space-y-3">
      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-300 bg-white">
          <button
            type="button"
            onClick={() => changeQuantity(quantity - 1)}
            aria-label="Disminuir cantidad"
            className="px-4 text-lg font-bold text-slate-600 transition hover:bg-slate-100"
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={999}
            value={quantity}
            onChange={(event) => changeQuantity(Number(event.target.value))}
            aria-label="Cantidad"
            className="w-16 border-x border-slate-200 text-center text-sm font-bold focus:outline-none"
          />
          <button
            type="button"
            onClick={() => changeQuantity(quantity + 1)}
            aria-label="Aumentar cantidad"
            className="px-4 text-lg font-bold text-slate-600 transition hover:bg-slate-100"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-brand-dark"
        >
          <span aria-hidden="true">📋</span> Agregar a la cotización
        </button>
      </div>

      <p role="status" className="min-h-5 text-xs font-semibold text-brand-dark">
        {added && (
          <>
            ✔ Agregado.{' '}
            <Link href="/cart" className="underline">
              Ver mi cotización
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
