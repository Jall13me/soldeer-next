'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/domain/entities/HeroBanner';

interface HeroCarouselProps {
  banners: HeroBanner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambiar de imagen automáticamente cada 5 segundos (Principio de Autonomía UI)
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="w-full bg-slate-900 text-white py-20 text-center">
        <h2 className="text-2xl font-bold">Bienvenido a Soldeer Industrial</h2>
        <p className="text-slate-400 text-sm mt-2">Sube imágenes en el panel de administración para mostrarlas en el carrusel.</p>
        <Link href="/admin/banners" className="mt-4 inline-block bg-[#0d9488] text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow">
          Ir a Administrar Banners
        </Link>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[450px] md:h-[520px] overflow-hidden bg-slate-950 shadow-inner">
      {/* Imagen de Fondo del Banner Activo */}
      <div className="absolute inset-0 z-0 transition-opacity duration-700 ease-in-out">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title || 'Soldeer Banner Industrial'}
          className="w-full h-full object-cover opacity-50 scale-105 transform transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
      </div>

      {/* Contenido Descriptivo del Banner */}
      <div className="relative max-w-7xl mx-auto h-full px-6 flex items-center z-10">
        <div className="max-w-2xl text-white">
          <span className="bg-[#0d9488] text-white font-bold text-xs uppercase px-3.5 py-1.5 rounded-full shadow border border-[#14b8a6]/40 tracking-wider">
            Novedades Soldeer
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-4 leading-tight tracking-tight drop-shadow-md">
            {currentBanner.title || 'Tecnología y Soldadura de Vanguardia'}
          </h1>
          <p className="text-slate-200 text-base md:text-lg mt-4 font-medium drop-shadow">
            {currentBanner.subtitle || 'Equipos de alto rendimiento y soporte técnico especializado en Bolivia.'}
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#catalogo" className="bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold px-7 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5">
              Explorar Catálogo
            </a>
            <a href="#ubicacion" className="border-2 border-slate-300 hover:bg-white/10 text-white font-bold px-7 py-3 rounded-xl transition">
              Ubicación de Tienda
            </a>
          </div>
        </div>
      </div>

      {/* Indicadores de Puntos de Navegación del Carrusel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-8 h-2.5 bg-[#0d9488]' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white'}`}
            aria-label={`Ir al banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}