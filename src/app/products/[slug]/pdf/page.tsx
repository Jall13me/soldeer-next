import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PriceTag } from '@/components/products/PriceTag';
import { PRIMARY_BRANCH } from '@/config/branches';
import { siteConfig } from '@/config/site';
import { browseCatalog } from '@/infrastructure/container';
import { getPrimaryImage, getSpecRows } from '@/lib/product-specs';
import PrintButton from './PrintButton';

export const metadata: Metadata = {
  title: 'Ficha técnica',
  robots: { index: false, follow: false },
};

async function ProductSheet({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await browseCatalog.detail(slug);
  if (!product) notFound();

  const specs = getSpecRows(product);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:border-none print:shadow-none">
      <header className="mb-6 flex items-center justify-between border-b pb-6">
        <div>
          <Image src="/brand/soldeer-logo.webp" alt={siteConfig.legalName} width={640} height={175} className="h-14 w-auto" />
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>
            <strong>Ficha Técnica Oficial B2B</strong>
          </p>
          <p>Santa Cruz de la Sierra, Bolivia</p>
        </div>
      </header>

      <div className="mb-8 grid grid-cols-2 items-center gap-8">
        <div className="relative h-64 overflow-hidden rounded-xl border bg-white">
          <Image
            src={getPrimaryImage(product)}
            alt={product.title}
            fill
            sizes="360px"
            loading="eager"
            className="object-contain p-2"
          />
        </div>
        <div>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{product.category.name}</span>
          <h1 className="mt-3 text-2xl font-extrabold text-slate-900">{product.title}</h1>
          {product.sku && (
            <p className="mt-1 text-xs text-slate-500">
              SKU / Código: <span className="font-mono font-bold text-slate-800">{product.sku}</span>
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
            <PriceTag price={product.price} offerPrice={product.offerPrice} className="text-xl font-black" />
            <span className="text-xs font-normal text-slate-400">Sujeto a cotización empresarial</span>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-2 border-b pb-1 text-sm font-bold text-slate-900">Descripción General</h2>
        <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">
          {product.description ?? 'Equipo certificado para máxima exigencia en la industria metalmecánica y de construcción en Bolivia.'}
        </p>
      </section>

      {specs.length > 0 && (
        <section className="mb-8 rounded-xl border bg-slate-50 p-6">
          <h2 className="mb-4 border-b pb-2 text-sm font-bold text-slate-900">⚙️ Especificaciones Técnicas de Ingeniería</h2>
          <dl className="grid grid-cols-2 gap-4 text-xs">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="block text-slate-400">{spec.label}</dt>
                <dd className="font-bold text-slate-800">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <footer className="border-t pt-4 text-center text-[10px] text-slate-500">
        <p>
          📍 {PRIMARY_BRANCH.address} | 📞 Teléfono: {siteConfig.phone}
        </p>
      </footer>

      <div className="mt-8 text-center print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}

export default function ProductPdfPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="min-h-screen bg-white p-8 print:p-0">
      <Suspense fallback={<div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl bg-slate-100" aria-hidden="true" />}>
        <ProductSheet params={params} />
      </Suspense>
    </div>
  );
}
