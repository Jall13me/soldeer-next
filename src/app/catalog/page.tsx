import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { NAV_CATEGORIES } from '@/config/categoriesConfig';

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category;

  let targetCategoryName = '';
  let categoryTitle = 'Catálogo General de Productos';
  let categoryDescription = 'Equipos de soldadura, torchas, consumibles y accesorios industriales en Bolivia.';

  if (categorySlug) {
    for (const group of NAV_CATEGORIES) {
      const sub = group.subcategories.find((s) => s.slug === categorySlug);
      if (sub) {
        targetCategoryName = sub.name;
        categoryTitle = sub.name;
        categoryDescription = sub.description || group.title;
        break;
      }
    }
  }

  // Consulta robusta: busca por coincidencia exacta o parcial en el nombre de la categoría o el slug
  const products = await prisma.product.findMany({
    where: categorySlug
      ? {
          OR: [
            {
              category: {
                name: {
                  equals: targetCategoryName,
                  mode: 'insensitive',
                },
              },
            },
            {
              category: {
                slug: {
                  contains: categorySlug,
                  mode: 'insensitive',
                },
              },
            },
          ],
        }
      : {},
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* Cabecera de Categoría */}
      <section className="bg-slate-900 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="bg-[#0d9488] text-white text-xs font-bold uppercase px-3.5 py-1.5 rounded-full tracking-wider shadow">
            Soldeer Industrial B2B
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 tracking-tight">
            {categoryTitle}
          </h1>
          <p className="text-slate-300 text-sm md:text-base mt-3">
            {categoryDescription}
          </p>
        </div>
      </section>

      {/* Listado de Productos */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Mostrando resultados ({products.length})
          </span>
          <Link href="/" className="text-xs font-bold text-[#0d9488] hover:underline">
            ← Volver al Inicio
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto my-12">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-lg font-bold text-slate-900">Sección en Actualización de Stock</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Pronto agregaremos los equipos y especificaciones técnicas para esta categoría. Si necesitas cotizar un modelo específico de manera urgente, contáctanos directamente.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/admin/products" className="bg-[#0d9488] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition">
                + Cargar Producto en Admin
              </Link>
              <Link href="/" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition">
                Ir al Inicio
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((prod) => (
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
                    {/* Corrección aplicada aquí: usando prod.category.name */}
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {prod.category?.name || 'Industrial'}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#0d9488] transition">{prod.title}</h3>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2">{prod.description || 'Equipo certificado para máxima exigencia industrial.'}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <span className="font-extrabold text-slate-900 text-base">Bs. {Number(prod.price).toLocaleString()}</span>
                  <span className="text-xs font-bold text-[#0d9488] group-hover:translate-x-1 transition-transform">Ver Ficha Técnica →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}