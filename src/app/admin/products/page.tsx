import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { ConfirmSubmitButton } from '@/components/admin/ConfirmSubmitButton';
import { ProductForm } from '@/components/admin/ProductForm';
import { PriceTag } from '@/components/products/PriceTag';
import { manageProducts } from '@/infrastructure/container';
import { cn } from '@/lib/cn';
import { getPrimaryImage } from '@/lib/product-specs';
import { deleteProductAction, toggleFeaturedAction, togglePublishedAction } from './actions';

export const metadata: Metadata = { title: 'Productos' };

const LINK_BUTTON = 'text-xs font-semibold text-slate-600 underline hover:text-slate-900';

async function ProductListSection() {
  // Datos en vivo de la BD: se resuelven en cada petición, no durante el build.
  await connection();
  const products = await manageProducts.listAll();

  if (products.length === 0) {
    return <p className="py-12 text-center text-sm text-slate-400">No hay productos guardados. Crea uno desde el formulario.</p>;
  }

  return (
    <ul className="space-y-4">
      {products.map((product) => (
        <li key={product.id} className="flex flex-col gap-4 rounded-xl border bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className={cn('relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white', !product.isPublished && 'opacity-50')}>
              <Image src={getPrimaryImage(product)} alt="" fill sizes="64px" className="object-contain" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{product.title}</h3>
              <p className="text-xs text-slate-500">
                {product.category.name}
                {product.sku && ` | SKU: ${product.sku}`}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <PriceTag price={product.price} offerPrice={product.offerPrice} className="text-xs" />
                {!product.isPublished && <span className="rounded bg-slate-700 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Oculto</span>}
                {product.isFeatured && <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-900">Destacado</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <form action={togglePublishedAction.bind(null, product.id)}>
              <button type="submit" className={LINK_BUTTON}>{product.isPublished ? 'Ocultar' : 'Publicar'}</button>
            </form>
            <form action={toggleFeaturedAction.bind(null, product.id)}>
              <button type="submit" className={LINK_BUTTON}>{product.isFeatured ? 'Quitar destacado' : 'Destacar'}</button>
            </form>
            <form action={deleteProductAction.bind(null, product.id)}>
              <ConfirmSubmitButton
                message={`¿Eliminar “${product.title}”? Se borrarán también sus fotos.`}
                className="rounded bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700"
              >
                Eliminar
              </ConfirmSubmitButton>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AdminProductsPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-slate-900">Gestión del Catálogo de Productos</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 border-b pb-2 text-lg font-bold text-slate-900">📦 Agregar Nuevo Producto</h2>
          <ProductForm />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 border-b pb-2 text-lg font-bold text-slate-900">📋 Productos Registrados</h2>
          <Suspense fallback={<p className="py-12 text-center text-sm text-slate-400">Cargando listado de productos...</p>}>
            <ProductListSection />
          </Suspense>
        </section>
      </div>
    </>
  );
}
