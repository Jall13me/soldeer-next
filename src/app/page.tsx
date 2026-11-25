import { Suspense } from 'react';
import { connection } from 'next/server';
import { BranchSelector } from '@/components/home/BranchSelector';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ProductCategoriesGrid } from '@/components/home/ProductCategoriesGrid';
import { ProductCard } from '@/components/products/ProductCard';
import { BRANCHES } from '@/config/branches';
import { browseCatalog, manageBanners } from '@/infrastructure/container';

async function HeroSection() {
  // Datos en vivo de la BD: se resuelven en cada petición, no durante el build.
  await connection();
  const slides = await manageBanners.listActiveSlides();
  return <HeroCarousel slides={slides} />;
}

async function FeaturedProductsSection() {
  // Datos en vivo de la BD: se resuelven en cada petición, no durante el build.
  await connection();
  const products = await browseCatalog.featured();

  if (products.length === 0) {
    return (
      <p className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 py-16 text-center text-sm text-slate-500">
        Estamos actualizando nuestro catálogo. Pronto verás aquí los equipos destacados.
      </p>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} eager={index < 3} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section id="carrusel" className="w-full">
        <Suspense fallback={<div className="h-[450px] w-full animate-pulse bg-slate-900 md:h-[520px]" aria-hidden="true" />}>
          <HeroSection />
        </Suspense>
      </section>

      <ProductCategoriesGrid />

      <section id="catalogo" className="scroll-mt-28 py-20">
        <div className="mx-auto mb-12 max-w-7xl px-6 text-center">
          <span className="rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand">
            Maquinaria y Equipos Certificados
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Productos Destacados</h2>
          <p className="mt-1 text-sm text-slate-600">
            Haz clic en cualquier equipo para visualizar su ficha técnica completa e imágenes detalladas.
          </p>
        </div>

        <Suspense fallback={<p className="py-16 text-center text-sm text-slate-400">Cargando productos destacados...</p>}>
          <FeaturedProductsSection />
        </Suspense>
      </section>

      <section id="ubicacion" className="scroll-mt-28 border-t border-slate-200 bg-slate-50 py-20">
        <BranchSelector branches={BRANCHES} />
      </section>
    </>
  );
}
