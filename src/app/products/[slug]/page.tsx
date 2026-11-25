import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AddToQuoteButton } from '@/components/products/AddToQuoteButton';
import { PriceTag } from '@/components/products/PriceTag';
import { ProductGallery } from '@/components/products/ProductGallery';
import { PRIMARY_BRANCH } from '@/config/branches';
import { siteConfig } from '@/config/site';
import { browseCatalog } from '@/infrastructure/container';
import { getPrimaryImage, getSpecRows } from '@/lib/product-specs';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await browseCatalog.detail(slug);
  if (!product) return { title: 'Producto no encontrado' };

  const description = product.description?.slice(0, 160) ?? `${product.title} - ${product.category.name} en Soldeer Bolivia.`;
  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.title, description, images: product.images.slice(0, 1) },
  };
}

async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await browseCatalog.detail(slug);
  if (!product) notFound();

  const specs = getSpecRows(product);
  const absolute = (src: string) => new URL(src, siteConfig.url).toString();
  const unitPrice = product.offerPrice ?? product.price;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.sku ?? undefined,
    description: product.description ?? undefined,
    category: product.category.name,
    image: product.images.map(absolute),
    ...(unitPrice > 0 && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BOB',
        price: unitPrice,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: absolute(`/products/${product.slug}`),
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <div className="flex items-center justify-between bg-slate-900 px-6 py-2 text-xs text-white">
        <span>📍 {PRIMARY_BRANCH.address}</span>
        <Link href={`/catalog?category=${product.category.slug}`} className="font-semibold text-brand-light hover:underline">
          ← Volver al catálogo
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <ProductGallery key={product.id} images={product.images} title={product.title} />

          <div>
            <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
              {product.category.name}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">{product.title}</h1>
            {product.sku && (
              <p className="mt-1 text-sm text-slate-500">
                Código / SKU: <span className="font-mono font-bold text-slate-800">{product.sku}</span>
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <PriceTag price={product.price} offerPrice={product.offerPrice} className="text-3xl font-black" />
              <span className="text-xs font-normal text-slate-400">Sujeto a cotización empresarial</span>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {product.description ?? 'Producto certificado para exigencia industrial pesada en Bolivia.'}
            </p>

            {specs.length > 0 && (
              <div className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h2 className="border-b pb-2 text-sm font-bold text-slate-900">⚙️ Especificaciones Técnicas</h2>
                <dl className="grid grid-cols-2 gap-4 text-xs">
                  {specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="block text-slate-400">{spec.label}</dt>
                      <dd className="text-sm font-bold text-slate-800">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
              <AddToQuoteButton
                product={{ slug: product.slug, title: product.title, sku: product.sku, image: getPrimaryImage(product) }}
              />
              <Link
                href={`/products/${product.slug}/pdf`}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800"
              >
                📥 Descargar Ficha PDF
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

async function Connection() {
  await connection();
  return null;
}

export default function ProductDetailPage({ params }: { params: Params }) {
  return (
    <>
      <Suspense fallback={<div className="mx-auto h-[600px] max-w-7xl animate-pulse px-6 py-12" aria-hidden="true" />}>
        <ProductDetail params={params} />
      </Suspense>
      {/* Marca la ruta como dinámica para que generateMetadata (que lee params) no rompa el prerender */}
      <Suspense>
        <Connection />
      </Suspense>
    </>
  );
}
