'use client'

import { useState } from 'react';
import Link from 'next/link';
import { NAV_CATEGORIES } from '@/config/categoriesConfig';

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white text-slate-900 sticky top-0 z-50 shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* Logotipo Oficial con Fondo Blanco Integrado y Blend Mode */}
        <Link href="/" className="flex items-center group py-2">
          <img
            src="/uploads/soldeer-logo.png"
            alt="Soldeer - Estructuras, Comercio y Servicios"
            className="h-14 md:h-16 w-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Links de Navegación Principal (Más grandes: 2x - 3x) */}
        <nav className="hidden lg:flex items-center space-x-10 font-bold text-lg md:text-xl text-slate-800">
          <Link href="/" className="hover:text-[#0d9488] transition py-2">
            Inicio
          </Link>

          {/* Menú Desplegable de Productos / Catálogo */}
          <div
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown('productos')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-2 hover:text-[#0d9488] transition font-bold focus:outline-none">
              <span>Productos</span>
              <svg className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'productos' ? 'rotate-180 text-[#0d9488]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mega Dropdown Panel Estilo Industrial */}
            {activeDropdown === 'productos' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 grid grid-cols-3 gap-6 z-50 animate-fadeIn">
                {NAV_CATEGORIES.map((group) => (
                  <div key={group.slug} className="space-y-3">
                    <h3 className="text-[#0d9488] font-black text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                      {group.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {group.subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/catalog?category=${sub.slug}`}
                            className="block group/item p-2.5 rounded-lg hover:bg-teal-50/60 transition"
                          >
                            <div className="text-sm font-bold text-slate-800 group-hover/item:text-[#0d9488]">
                              {sub.name}
                            </div>
                            {sub.description && (
                              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-normal">
                                {sub.description}
                              </div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className="hover:text-[#0d9488] transition py-2">
            Acerca de Soldeer
          </Link>

          <Link href="/#ubicacion" className="hover:text-[#0d9488] transition py-2">
            Sucursal / Mapa
          </Link>
        </nav>

        {/* Acciones Rápidas */}
        <div className="flex items-center space-x-4">
          <Link
            href="/cart"
            className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-6 py-3 rounded-xl font-extrabold text-sm transition shadow-md flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            📋 Cotización B2B
          </Link>
        </div>

      </div>
    </header>
  );
}