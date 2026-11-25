import type { Metadata } from 'next';
import { QuoteCart } from '@/components/quote/QuoteCart';

export const metadata: Metadata = {
  title: 'Mi cotización',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <section className="mx-auto min-h-[60vh] max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">Mi cotización B2B</h1>
      <p className="mb-8 mt-1 text-sm text-slate-600">
        Revisa los equipos, ajusta cantidades y envíanos la lista por WhatsApp para recibir tu cotización formal.
      </p>
      <QuoteCart />
    </section>
  );
}
