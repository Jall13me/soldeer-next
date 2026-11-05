import { createProductAction, deleteProductAction } from './actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { NAV_CATEGORIES } from '@/config/categoriesConfig';
import { Suspense } from 'react';

// Componente interno para listar los productos (permite usar Suspense en Next.js 16)
async function ProductListSection() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        No hay productos guardados. Crea uno desde el formulario.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((p) => (
        <div key={p.id} className="flex items-center justify-between p-4 border rounded-xl bg-slate-50 gap-4">
          <div className="flex items-center space-x-4">
            <img src={p.images[0] || '/uploads/default-product.jpg'} alt="" className="w-16 h-16 object-cover rounded-lg border bg-white" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
              <p className="text-xs text-slate-500">{p.category?.name || 'Industrial'} | SKU: {p.sku}</p>
              <span className="font-extrabold text-[#0d9488] text-xs">Bs. {Number(p.price).toLocaleString()}</span>
            </div>
          </div>

          <form action={deleteProductAction.bind(null, p.id)}>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded text-xs transition">
              Eliminar
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Nav Admin */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <span className="text-[#0d9488] font-bold text-xs uppercase tracking-wider">Panel Admin Soldeer</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Gestión del Catálogo de Productos</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="bg-[#0d9488] text-white font-bold px-4 py-2 rounded-lg text-xs transition">
              ← Ver Tienda
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario con Selectores Desplegables contra Errores de Tipeo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">📦 Agregar Nuevo Producto</h2>
            
            <form action={createProductAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre del Producto *</label>
                <input type="text" name="title" required placeholder="Ej: Soldadora Inversora MIG Lion 250" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0d9488]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Precio (Bs) *</label>
                  <input type="number" step="0.01" name="price" required placeholder="4500" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0d9488]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Código / SKU</label>
                  <input type="text" name="sku" placeholder="Código S125" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0d9488]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subcategoría del Catálogo *</label>
                <select name="categorySlug" required className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0d9488] bg-white">
                  {NAV_CATEGORIES.map((group) => (
                    <optgroup key={group.slug} label={group.title}>
                      {group.subcategories.map((sub) => (
                        <option key={sub.slug} value={sub.slug}>
                          {sub.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Selecciona la subcategoría exacta para vincularla al menú.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Imágenes del Producto (Múltiples)</label>
                <input type="file" name="imageFiles" accept="image/*" multiple required className="w-full text-xs text-slate-500 border rounded-lg p-2 cursor-pointer" />
              </div>

              <div className="pt-2 border-t">
                <span className="text-xs font-bold text-[#0d9488] block mb-2">⚙️ Atributos Técnicos (Opcionales)</span>
                
                <div className="space-y-2">
                  <input type="text" name="maxAmperage" placeholder="Amperaje Máx (ej: 500 AMP)" className="w-full px-3 py-1.5 border rounded text-xs" />
                  <input type="text" name="workCycle" placeholder="Ciclo de Trabajo (ej: 500A - 60%)" className="w-full px-3 py-1.5 border rounded text-xs" />
                  <input type="text" name="powerSupply" placeholder="Alimentación (ej: Trifásica)" className="w-full px-3 py-1.5 border rounded text-xs" />
                  <input type="text" name="weldingProcess" placeholder="Proceso (ej: MIG / TIG / MMA)" className="w-full px-3 py-1.5 border rounded text-xs" />
                  <input type="text" name="presentation" placeholder="Presentación (ej: Rollo 15 Kg)" className="w-full px-3 py-1.5 border rounded text-xs" />
                  <input type="text" name="dimensions" placeholder="Medidas (ej: 115x99 mm)" className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold py-2.5 rounded-lg text-sm shadow transition">
                Guardar Producto
              </button>
            </form>
          </div>

          {/* Lista de Productos envuelta en Suspense (Compatible con Next.js 16 y cacheComponents) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">📋 Productos Registrados</h2>

            <Suspense fallback={<div className="text-center py-12 text-slate-400 text-sm">Cargando listado de productos...</div>}>
              <ProductListSection />
            </Suspense>
          </div>

        </div>
      </div>
    </div>
  );
}