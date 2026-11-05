'use client'

import { useState } from 'react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapSrc: string;
}

const BRANCHES: Branch[] = [
  {
    id: 'central',
    name: 'Sucursal Central',
    address: 'Av. Beni / Zona Norte, Santa Cruz de la Sierra',
    phone: '75353583',
    mapSrc: 'https://maps.google.com/maps?q=-17.7598701,-63.1727335&z=17&output=embed'
  },
  {
    id: 'altosanpedro',
    name: 'Sucursal Alto San Pedro',
    address: 'Zona Alto San Pedro, Santa Cruz de la Sierra',
    phone: '75353583',
    mapSrc: 'https://maps.google.com/maps?q=-17.814023,-63.1863773&z=17&output=embed'
  },
  {
    id: 'cochabamba',
    name: 'Sucursal Cochabamba',
    address: 'Cochabamba, Bolivia',
    phone: '75353583',
    mapSrc: 'https://maps.google.com/maps?q=-17.392182,-66.2012549&z=17&output=embed'
  }
];

export function BranchSelector() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      
      {/* Cabecera y Botones Selectoras */}
      <div className="text-center mb-10">
        <span className="text-[#0d9488] font-bold text-xs uppercase tracking-wider bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-100">
          Atención Presencial
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Nuestras Sucursales</h2>
        <p className="text-slate-600 text-sm mt-1">Selecciona una sucursal para visualizar su ubicación exacta, dirección y líneas de contacto.</p>
        
        {/* Pestañas de Sucursales */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {BRANCHES.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setSelectedBranch(branch)}
              className={`px-6 py-3 rounded-xl font-bold text-xs transition shadow-sm flex items-center gap-2 ${
                selectedBranch.id === branch.id
                  ? 'bg-[#0d9488] text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0d9488] hover:text-[#0d9488]'
              }`}
            >
              <span>📍</span> {branch.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjeta Dinámica de la Sucursal Seleccionada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0d9488] bg-teal-50 px-3 py-1 rounded-md border border-teal-100">
            Sucursal Activa
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-3">{selectedBranch.name}</h3>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            Visítanos para recibir asesoramiento técnico personalizado, demostraciones de equipos y entrega inmediata de consumibles industriales.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-700 border-t pt-4 border-slate-100">
            <p className="flex items-start gap-2">
              <span className="font-bold text-[#0d9488]">📍 Dirección:</span> 
              <span>{selectedBranch.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold text-[#0d9488]">📞 Teléfono:</span> 
              <span>{selectedBranch.phone}</span>
            </p>
          </div>
        </div>

        {/* Mapa Dinámico con coordenadas exactas */}
        <div className="md:col-span-2 h-80 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
          <iframe
            key={selectedBranch.id}
            title={selectedBranch.name}
            src={selectedBranch.mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          ></iframe>
        </div>
      </div>

    </div>
  );
}