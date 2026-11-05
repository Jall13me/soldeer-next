'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold px-6 py-3 rounded-xl text-xs shadow transition"
    >
      🖨️ Imprimir / Guardar Ficha en PDF
    </button>
  );
}