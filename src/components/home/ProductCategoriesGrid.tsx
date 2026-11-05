import Link from 'next/link';

interface CategoryShortcut {
  title: string;
  slug: string;
  imageUrl?: string;
}

const DEFAULT_CATEGORIES: CategoryShortcut[] = [
  { title: 'Torchas', slug: 'torchas' },
  { title: 'Consumibles para Soldadura', slug: 'consumibles' },
  { title: 'Corte por Plasma Manual', slug: 'corte-plasma' },
  { title: 'Elementos de Protección Personal', slug: 'mascaras' },
  { title: 'Máquinas para Soldar', slug: 'maquinas' },
];

export function ProductCategoriesGrid() {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado de Sección Estilo ESAB */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Líneas de Productos</h2>
          <p className="text-xs text-slate-500 mt-1">Explora nuestras categorías principales con acceso rápido</p>
          <div className="w-16 h-1 bg-[#0d9488] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Grilla de Iconos Circulares */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-center">
          {DEFAULT_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={`/catalog?category=${cat.slug}`}
              className="group flex flex-col items-center text-center space-y-3"
            >
              {/* Contenedor Circular */}
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-slate-50 border-2 border-slate-200 group-hover:border-[#0d9488] transition-all duration-300 shadow-sm group-hover:shadow-lg flex items-center justify-center overflow-hidden p-3 relative">
                
                {/* Fondo Interno Circular con Efecto Hover */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-extrabold text-xs uppercase tracking-wider group-hover:bg-[#0d9488]/10 group-hover:text-[#0d9488] transition-colors duration-300">
                  <span className="px-2 text-center line-clamp-2">{cat.title}</span>
                </div>

              </div>

              {/* Título de la Categoría */}
              <span className="font-bold text-slate-800 text-xs md:text-sm group-hover:text-[#0d9488] transition-colors">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}