'use client';

import { useActionState } from 'react';
import { createProductAction } from '@/app/admin/products/actions';
import { IDLE_STATE } from '@/app/admin/_lib/action-state';
import { NAV_CATEGORIES } from '@/config/categoriesConfig';
import { FormFeedback } from './FormFeedback';
import { SubmitButton } from './SubmitButton';

const LABEL = 'mb-1 block text-xs font-bold uppercase text-slate-700';
const INPUT = 'w-full rounded-lg border px-3 py-2 text-sm focus:border-brand focus:outline-none';
const SPEC_INPUT = 'w-full rounded border px-3 py-1.5 text-xs';

export function ProductForm() {
  const [state, formAction] = useActionState(createProductAction, IDLE_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className={LABEL}>Nombre del Producto *</label>
        <input id="title" type="text" name="title" required minLength={3} maxLength={120} placeholder="Ej: Soldadora Inversora MIG Lion 250" className={INPUT} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="price" className={LABEL}>Precio (Bs) *</label>
          <input id="price" type="number" step="0.01" min="0" name="price" required placeholder="4500" className={INPUT} />
        </div>
        <div>
          <label htmlFor="offerPrice" className={LABEL}>Precio oferta</label>
          <input id="offerPrice" type="number" step="0.01" min="0" name="offerPrice" placeholder="Opcional" className={INPUT} />
        </div>
      </div>

      <div>
        <label htmlFor="sku" className={LABEL}>Código / SKU</label>
        <input id="sku" type="text" name="sku" maxLength={40} placeholder="Código S125" className={INPUT} />
      </div>

      <div>
        <label htmlFor="categorySlug" className={LABEL}>Subcategoría del Catálogo *</label>
        <select id="categorySlug" name="categorySlug" required className={`${INPUT} bg-white`}>
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
      </div>

      <div>
        <label htmlFor="description" className={LABEL}>Descripción</label>
        <textarea id="description" name="description" rows={4} maxLength={2000} placeholder="Características, usos y beneficios del equipo." className={INPUT} />
      </div>

      <div>
        <label htmlFor="imageFiles" className={LABEL}>Imágenes del Producto</label>
        <input
          id="imageFiles"
          type="file"
          name="imageFiles"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="w-full cursor-pointer rounded-lg border p-2 text-xs text-slate-500"
        />
        <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
          Ideal: 1200×900 px (4:3), fondo blanco y el producto centrado. Hasta 8 fotos de 10 MB; se convierten solas a WebP liviano.
        </p>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
        <input type="checkbox" name="isFeatured" className="h-4 w-4 accent-teal-600" />
        Mostrar como producto destacado en el inicio
      </label>

      <div className="border-t pt-2">
        <span className="mb-2 block text-xs font-bold text-brand">⚙️ Atributos Técnicos (Opcionales)</span>
        <div className="space-y-2">
          <input type="text" name="maxAmperage" maxLength={80} placeholder="Amperaje Máx (ej: 500 AMP)" className={SPEC_INPUT} />
          <input type="text" name="workCycle" maxLength={80} placeholder="Ciclo de Trabajo (ej: 500A - 60%)" className={SPEC_INPUT} />
          <input type="text" name="powerSupply" maxLength={80} placeholder="Alimentación (ej: Trifásica)" className={SPEC_INPUT} />
          <input type="text" name="weldingProcess" maxLength={80} placeholder="Proceso (ej: MIG / TIG / MMA)" className={SPEC_INPUT} />
          <input type="text" name="presentation" maxLength={80} placeholder="Presentación (ej: Rollo 15 Kg)" className={SPEC_INPUT} />
          <input type="text" name="dimensions" maxLength={80} placeholder="Medidas (ej: 115x99 mm)" className={SPEC_INPUT} />
        </div>
      </div>

      <FormFeedback state={state} />
      <SubmitButton>Guardar Producto</SubmitButton>
    </form>
  );
}
