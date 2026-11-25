'use client';

import { useState } from 'react';
import type { Branch } from '@/config/branches';
import { cn } from '@/lib/cn';

export function BranchSelector({ branches }: { branches: readonly Branch[] }) {
  const [selectedId, setSelectedId] = useState(branches[0]?.id);
  const selected = branches.find((branch) => branch.id === selectedId) ?? branches[0];

  if (!selected) return null;

  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-10 text-center">
        <span className="rounded-full border border-teal-100 bg-teal-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
          Atención Presencial
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Nuestras Sucursales</h2>
        <p className="mt-1 text-sm text-slate-600">
          Selecciona una sucursal para visualizar su ubicación exacta, dirección y líneas de contacto.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3" role="group" aria-label="Sucursales">
          {branches.map((branch) => (
            <button
              key={branch.id}
              type="button"
              onClick={() => setSelectedId(branch.id)}
              aria-pressed={branch.id === selected.id}
              className={cn(
                'flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold shadow-sm transition',
                branch.id === selected.id
                  ? 'scale-105 bg-brand text-white shadow-md'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand',
              )}
            >
              <span aria-hidden="true">📍</span> {branch.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-3 md:p-12">
        <div>
          <span className="rounded-md border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand">
            Sucursal Activa
          </span>
          <h3 className="mt-3 text-2xl font-black text-slate-900">{selected.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Visítanos para recibir asesoramiento técnico personalizado, demostraciones de equipos y entrega inmediata de consumibles industriales.
          </p>
          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-700">
            <p className="flex items-start gap-2">
              <span className="font-bold text-brand">📍 Dirección:</span>
              <span>{selected.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold text-brand">📞 Teléfono:</span>
              <a href={`tel:+591${selected.phone}`} className="hover:underline">
                {selected.phone}
              </a>
            </p>
          </div>
        </div>

        <div className="h-80 overflow-hidden rounded-2xl border border-slate-200 shadow-inner md:col-span-2">
          <iframe
            key={selected.id}
            title={`Mapa: ${selected.name}`}
            src={selected.mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
