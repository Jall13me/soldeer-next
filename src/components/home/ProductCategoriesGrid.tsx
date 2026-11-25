import Link from 'next/link';
import { HOME_SHORTCUTS } from '@/config/categoriesConfig';

export function ProductCategoriesGrid() {
  return (
    <section className="border-b border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">Líneas de Productos</h2>
          <p className="mt-1 text-xs text-slate-500">Explora nuestras categorías principales con acceso rápido</p>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-brand" />
        </div>

        <div className="grid grid-cols-2 items-center justify-center gap-8 sm:grid-cols-3 md:grid-cols-5">
          {HOME_SHORTCUTS.map((shortcut) => (
            <Link
              key={shortcut.slug}
              href={`/catalog?category=${shortcut.slug}`}
              className="group flex flex-col items-center space-y-3 text-center"
            >
              <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-50 p-3 shadow-sm transition-all duration-300 group-hover:border-brand group-hover:shadow-lg md:h-36 md:w-36">
                <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-b from-slate-100 to-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-700 transition-colors duration-300 group-hover:bg-brand/10 group-hover:text-brand">
                  <span className="line-clamp-2 px-2 text-center">{shortcut.title}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 transition-colors group-hover:text-brand md:text-sm">
                {shortcut.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
