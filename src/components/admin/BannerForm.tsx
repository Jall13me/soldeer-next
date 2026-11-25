'use client';

import { useActionState } from 'react';
import { uploadBannersAction } from '@/app/admin/banners/actions';
import { IDLE_STATE } from '@/app/admin/_lib/action-state';
import { FormFeedback } from './FormFeedback';
import { SubmitButton } from './SubmitButton';

const LABEL = 'mb-1 block text-xs font-bold uppercase text-slate-700';
const INPUT = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none';

export function BannerForm() {
  const [state, formAction] = useActionState(uploadBannersAction, IDLE_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className={LABEL}>Título (opcional)</label>
        <input id="title" type="text" name="title" maxLength={120} placeholder="Ej: Instalaciones y Maquinarias" className={INPUT} />
      </div>

      <div>
        <label htmlFor="subtitle" className={LABEL}>Subtítulo / Descripción</label>
        <input id="subtitle" type="text" name="subtitle" maxLength={240} placeholder="Ej: Taller de soldadura y soporte in situ" className={INPUT} />
      </div>

      <div>
        <label htmlFor="linkUrl" className={LABEL}>Enlace del botón (opcional)</label>
        <input id="linkUrl" type="text" name="linkUrl" placeholder="/catalog?category=mig-mag" className={INPUT} />
        <span className="mt-1 block text-[10px] text-slate-400">Ruta interna (/catalog?...) o https://. Si lo dejas vacío, el botón va a la ubicación.</span>
      </div>

      <div>
        <label htmlFor="imageFiles" className={LABEL}>Seleccionar fotos *</label>
        <input
          id="imageFiles"
          type="file"
          name="imageFiles"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          required
          className="w-full cursor-pointer rounded-lg border border-slate-300 p-2 text-xs text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-brand hover:file:bg-brand/20"
        />
        <span className="mt-1 block text-[10px] leading-relaxed text-slate-400">
          💡 Ideal: 1920×700 px, JPG/PNG/WebP de hasta 10 MB. Deja libre el lado izquierdo (ahí va el texto). Se optimizan solas a WebP.
        </span>
      </div>

      <FormFeedback state={state} />
      <SubmitButton pendingLabel="Optimizando y subiendo…">📤 Subir banners</SubmitButton>
    </form>
  );
}
