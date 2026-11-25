import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { BannerForm } from '@/components/admin/BannerForm';
import { ConfirmSubmitButton } from '@/components/admin/ConfirmSubmitButton';
import { manageBanners } from '@/infrastructure/container';
import { cn } from '@/lib/cn';
import { deleteBannerAction, toggleBannerAction } from './actions';

export const metadata: Metadata = { title: 'Banners' };

async function BannerGallery() {
  // Datos en vivo de la BD: se resuelven en cada petición, no durante el build.
  await connection();
  const banners = await manageBanners.listAll();

  if (banners.length === 0) {
    return <p className="py-12 text-center text-sm text-slate-400">Aún no hay banners. Sube imágenes desde el panel de la izquierda.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {banners.map((banner) => (
        <div key={banner.id} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
          <div>
            <div className="relative mb-3 h-36 w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-200">
              <Image src={banner.imageUrl} alt={banner.title ?? 'Banner Soldeer'} fill sizes="(min-width: 640px) 320px, 100vw" className="object-cover" />
              <span
                className={cn(
                  'absolute right-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase shadow',
                  banner.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200',
                )}
              >
                {banner.isActive ? 'Activo' : 'Oculto'}
              </span>
            </div>
            <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{banner.title ?? 'Sin título'}</h3>
            <p className="line-clamp-1 text-xs text-slate-500">{banner.subtitle ?? 'Sin descripción'}</p>
            {banner.linkUrl && <p className="line-clamp-1 text-[10px] text-brand">→ {banner.linkUrl}</p>}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-2">
            <form action={toggleBannerAction.bind(null, banner.id)}>
              <button type="submit" className="text-xs font-semibold text-slate-600 underline hover:text-slate-900">
                {banner.isActive ? 'Ocultar' : 'Mostrar'}
              </button>
            </form>
            <form action={deleteBannerAction.bind(null, banner.id)}>
              <ConfirmSubmitButton
                message="¿Eliminar este banner y su imagen?"
                className="rounded bg-red-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-700"
              >
                Eliminar
              </ConfirmSubmitButton>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminBannersPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-slate-900">Gestión de Banners del Inicio</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 border-b pb-2 text-lg font-bold text-slate-900">📁 Subir imágenes</h2>
          <BannerForm />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 border-b pb-2 text-lg font-bold text-slate-900">🖼️ Banners del carrusel</h2>
          <Suspense fallback={<p className="py-12 text-center text-sm text-slate-400">Cargando banners...</p>}>
            <BannerGallery />
          </Suspense>
        </section>
      </div>
    </>
  );
}
