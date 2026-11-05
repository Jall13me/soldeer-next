import Link from 'next/link';
import { Suspense } from 'react';
import { PrismaBannerRepository } from '@/infrastructure/repositories/PrismaBannerRepository';
import { PrismaProductRepository } from '@/infrastructure/repositories/PrismaProductRepository';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ProductCategoriesGrid } from '@/components/home/ProductCategoriesGrid';
import { BranchSelector } from '@/components/home/BranchSelector';

const bannerRepository = new PrismaBannerRepository();
const productRepository = new PrismaProductRepository();

async function HeroBannerSection() {
  const activeBanners = await bannerRepository.getActiveBanners();
  return <HeroCarousel banners={activeBanners} />;
}

async function FeaturedProductsSection() {
  const featuredProducts = await productRepository.getFeaturedProducts();

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm bg-slate-50 rounded-2xl border border-slate-200 max-w-4xl mx-auto">
        No hay productos registrados en la base de datos todavía. Agrégalos desde <Link href="/admin/products" className="text-[#0d9488] underline font-bold">/admin/products</Link>.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
      {featuredProducts.map((prod) => (
        <Link
          key={prod.id}
          href={`/products/${prod.slug}`}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0d9488] transition group flex flex-col justify-between"
        >
          <div>
            <div className="h-56 bg-slate-100 overflow-hidden relative">
              <img
                src={prod.images[0]}
                alt={prod.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {/* Usamos categoryName tal como lo define el dominio */}
              <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                {prod.categoryName || 'Industrial'}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#0d9488] transition">{prod.title}</h3>
              <p className="text-slate-500 text-xs mt-2 line-clamp-2">{prod.description || 'Equipo de soldadura de alto rendimiento industrial.'}</p>
            </div>
          </div>
          <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
            <span className="font-extrabold text-slate-900 text-base">Bs. {Number(prod.price).toLocaleString()}</span>
            <span className="text-xs font-bold text-[#0d9488] group-hover:translate-x-1 transition-transform">Ver Ficha Técnica →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      
      {/* 1. Hero Section con Carrusel */}
      <section id="carrusel" className="w-full">
        <Suspense fallback={<div className="w-full h-[450px] bg-slate-900 animate-pulse flex items-center justify-center text-slate-400 text-sm">Cargando carrusel corporativo...</div>}>
          <HeroBannerSection />
        </Suspense>
      </section>

      {/* 2. Líneas de Productos / Accesos Circulares (Estilo ESAB) */}
      <ProductCategoriesGrid />

      {/* 3. Catálogo de Productos Destacados */}
      <section id="catalogo" className="py-20">
        <div className="text-center mb-12 max-w-7xl mx-auto px-6">
          <span className="text-[#0d9488] font-bold text-xs uppercase tracking-widest bg-[#0d9488]/10 px-3.5 py-1 rounded-full border border-[#0d9488]/20">
            Maquinaria y Equipos Certificados
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Productos Destacados</h2>
          <p className="text-slate-600 text-sm mt-1">Haz clic en cualquier equipo para visualizar su ficha técnica completa e imágenes detalladas.</p>
        </div>

        <Suspense fallback={<div className="text-center py-16 text-slate-400 text-sm">Cargando productos destacados...</div>}>
          <FeaturedProductsSection />
        </Suspense>
      </section>

      {/* 4. Sección de Ubicación Dinámica con Selector de Sucursales */}
      <section id="ubicacion" className="py-20 bg-slate-50 border-t border-slate-200">
        <BranchSelector />
      </section>

      {/* 5. Footer Industrial */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-center text-xs border-t border-slate-800">
        <p className="text-white font-bold text-sm mb-1">SOLDEER - Estructuras, Comercio y Servicios</p>
        <p>Av. 3er Anillo Interno entre Av. Beni y Alemana #420 | Santa Cruz, Bolivia</p>
        <p className="mt-4 text-slate-500">© 2026 Soldeer. Desarrollado con Next.js, PostgreSQL y Clean Architecture.</p>
      </footer>
    </div>
  );
}