import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { NAV_CATEGORIES } from '@/config/categoriesConfig';
import { siteConfig } from '@/config/site';
import { browseCatalog } from '@/infrastructure/container';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  title: 'Catálogo de productos',
  description: 'Máquinas de soldar, cortadoras de plasma, torchas y consumibles industriales en Bolivia.',
};

type SearchParams = Promise<{ category?: string | string[]; q?: string | string[] }>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

async function CatalogContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const categorySlug = first(params.category);
  const search = first(params.q)?.trim().slice(0, 80);

  const result = await browseCatalog.browse({ categorySlug, search });
  if (!result) notFound();

  const { category, products } = result;
  const activeGroup = category
    ? NAV_CATEGORIES.find((g) => g.slug === category.slug || g.subcategories.some((s) => s.slug === category.slug))
    : undefined;

  return (
    <>
      <section className="bg-slate-900 px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <span className="rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow">
            Soldeer Industrial B2B
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
            {category?.title ?? 'Catálogo General de Productos'}
          </h1>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            {category?.description ?? 'Equipos de soldadura, torchas, consumibles y accesorios industriales en Bolivia.'}
          </p>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Filtrar por línea" className="flex flex-wrap gap-2">
            <Link
              href="/catalog"
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-bold transition',
                !category ? 'border-brand bg-brand text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-brand',
              )}
            >
              Todos
            </Link>
            {NAV_CATEGORIES.map((group) => (
              <Link
                key={group.slug}
                href={`/catalog?category=${group.slug}`}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs font-bold transition',
                  activeGroup?.slug === group.slug
                    ? 'border-brand bg-brand text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand',
                )}
              >
                {group.title}
              </Link>
            ))}
          </nav>

          <form action="/catalog" method="get" role="search" className="flex gap-2">
            {category && <input type="hidden" name="category" value={category.slug} />}
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Buscar por nombre o SKU"
              aria-label="Buscar productos"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand focus:outline-none md:w-72"
            />
            <button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700">
              Buscar
            </button>
          </form>
        </div>

        <div className="mb-8 mt-6 flex items-center justify-between border-b pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {products.length} {products.length === 1 ? 'resultado' : 'resultados'}
            {search && ` para “${search}”`}
          </span>
          <Link href="/" className="text-xs font-bold text-brand hover:underline">
            ← Volver al Inicio
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mx-auto my-12 max-w-xl rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mb-3 text-4xl" aria-hidden="true">📦</div>
            <h2 className="text-lg font-bold text-slate-900">
              {search ? 'No encontramos coincidencias' : 'Sección en actualización de stock'}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {search
                ? 'Prueba con otra palabra o revisa el código SKU.'
                : 'Pronto agregaremos equipos para esta categoría. Si necesitas cotizar un modelo específico, contáctanos directamente.'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-brand-dark"
              >
                Consultar por WhatsApp
              </a>
              <Link href="/catalog" className="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200">
                Ver todo el catálogo
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} eager={index < 3} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Suspense fallback={<div className="h-64 animate-pulse bg-slate-900" aria-hidden="true" />}>
        <CatalogContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
