'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-brand px-6 py-3 text-xs font-bold text-white shadow transition hover:bg-brand-dark"
    >
      🖨️ Imprimir / Guardar Ficha en PDF
    </button>
  );
}
