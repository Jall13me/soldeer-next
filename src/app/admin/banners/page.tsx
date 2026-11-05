import { getBannersAction, uploadBannersAction, deleteBannerAction, toggleBannerAction } from './actions';
import Link from 'next/link';

export default async function BannersAdminPage() {
  const banners = await getBannersAction();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Admin */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <span className="text-[#0d9488] font-bold text-xs uppercase tracking-wider">Panel de Administración Soldeer</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Gestión de Banners e Imágenes Locales</h1>
          </div>
          <Link href="/" className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-lg text-sm transition">
            ← Volver a la Tienda
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario para Subir un Conjunto de Imágenes desde la Máquina */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">📁 Subir Imágenes desde la PC</h2>
            
            <form action={uploadBannersAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título General (Opcional)</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ej: Instalaciones y Maquinarias"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0d9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtítulo / Descripción</label>
                <input
                  type="text"
                  name="subtitle"
                  placeholder="Ej: Taller de soldadura y soporte in situ"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0d9488]"
                />
              </div>

              {/* Selector Múltiple de Archivos */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Seleccionar Fotos de tu Equipo *</label>
                <input
                  type="file"
                  name="imageFiles"
                  accept="image/*"
                  multiple
                  required
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0d9488]/10 file:text-[#0d9488] hover:file:bg-[#0d9488]/20 border border-slate-300 rounded-lg p-2 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  💡 Puedes seleccionar 1 o varias imágenes a la vez (PNG, JPG, WEBP).
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold py-2.5 rounded-lg text-sm shadow transition flex items-center justify-center gap-2"
              >
                📤 Subir Conjunto de Imágenes
              </button>
            </form>
          </div>

          {/* Galería de Banners / Imágenes en Servidor */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">🖼️ Galería Activa ({banners.length})</h2>

            {banners.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No hay imágenes locales subidas aún. Selecciona archivos desde el panel de la izquierda.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="relative w-full h-36 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 mb-3">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title || 'Foto Soldeer'}
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow ${banner.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200'}`}>
                          {banner.isActive ? 'Activo' : 'Oculto'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{banner.title || 'Sin Título'}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{banner.subtitle || 'Sin descripción'}</p>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-200">
                      <form action={toggleBannerAction.bind(null, banner.id, banner.isActive)}>
                        <button
                          type="submit"
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                        >
                          {banner.isActive ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </form>

                      <form action={deleteBannerAction.bind(null, banner.id, banner.imageUrl)}>
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded text-xs transition"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}