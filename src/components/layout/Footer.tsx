import Link from 'next/link';
import { PRIMARY_BRANCH } from '@/config/branches';
import { NAV_CATEGORIES } from '@/config/categoriesConfig';
import { siteConfig } from '@/config/site';

/** Con Cache Components, `new Date()` debe ir cacheado para no bloquear el prerender. */
async function CurrentYear() {
  'use cache';
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-400 print:hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
        <div>
          <p className="text-sm font-bold text-white">{siteConfig.legalName}</p>
          <p className="mt-2">{PRIMARY_BRANCH.address}</p>
          <p className="mt-1">
            Tel:{' '}
            <a href={`tel:+591${siteConfig.phone}`} className="hover:text-white">
              {siteConfig.phone}
            </a>
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 font-bold text-white transition hover:bg-brand-dark"
          >
            Escribir por WhatsApp
          </a>
        </div>

        <nav aria-label="Catálogo">
          <p className="font-bold text-white">Catálogo</p>
          <ul className="mt-2 space-y-1.5">
            {NAV_CATEGORIES.map((group) => (
              <li key={group.slug}>
                <Link href={`/catalog?category=${group.slug}`} className="hover:text-white">
                  {group.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Empresa">
          <p className="font-bold text-white">Empresa</p>
          <ul className="mt-2 space-y-1.5">
            <li>
              <Link href="/about" className="hover:text-white">
                Acerca de Soldeer
              </Link>
            </li>
            <li>
              <Link href="/#ubicacion" className="hover:text-white">
                Sucursales
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Mi cotización
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className="mt-10 text-center text-slate-500">© <CurrentYear /> Soldeer Bolivia. Todos los derechos reservados.</p>
    </footer>
  );
}
