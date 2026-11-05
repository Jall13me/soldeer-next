import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      
      {/* Hero Institucional */}
      <section className="bg-slate-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="bg-[#0d9488] text-white text-xs font-bold uppercase px-3.5 py-1.5 rounded-full tracking-wider shadow">
            Trayectoria y Compromiso
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">
            Acerca de Soldeer
          </h1>
          <p className="text-slate-300 text-base md:text-lg mt-4 leading-relaxed">
            Especialistas en estructuras, comercio y servicios industriales para la minería, construcción y metalmecánica en Bolivia.
          </p>
        </div>
      </section>

      {/* Historia y Presentación */}
      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#0d9488] font-bold text-xs uppercase tracking-wider">Nuestra Historia</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Liderazgo e Innovación en Soldadura Industrial
            </h2>
            <p className="text-slate-600 text-sm mt-4 leading-relaxed">
              Soldeer nace con el firme propósito de proveer soluciones tecnológicas de alta gama en equipos de soldadura, consumibles certificados y soporte técnico especializado. Operamos desde Santa Cruz de la Sierra, conectando la industria nacional con los estándares globales más exigentes de productividad y seguridad.
            </p>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Nuestro compromiso es acompañar a cada taller, empresa constructora e industria pesada brindando equipos inversores, antorchas y asesoramiento técnico directo con stock inmediato.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="border-l-4 border-[#0d9488] pl-4">
              <h3 className="font-bold text-slate-900 text-base">📍 Ubicación Estratégica</h3>
              <p className="text-xs text-slate-600 mt-1">Av. 3er Anillo Interno entre Av. Beni y Alemana #420, Santa Cruz de la Sierra, Bolivia.</p>
            </div>
            <div className="border-l-4 border-[#0d9488] pl-4">
              <h3 className="font-bold text-slate-900 text-base">🛠️ Soporte Técnico In Situ</h3>
              <p className="text-xs text-slate-600 mt-1">Pruebas de equipos, mantenimiento especializado y disponibilidad de repuestos originales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center font-black text-xl mb-4">
              🎯
            </div>
            <h3 className="text-xl font-bold text-slate-900">Nuestra Misión</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Proveer equipos, insumos y servicios de soldadura de máxima calidad que impulsen la eficiencia operativa y la seguridad de nuestros clientes industriales en Bolivia, respaldados por un servicio técnico de excelencia.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center font-black text-xl mb-4">
              🚀
            </div>
            <h3 className="text-xl font-bold text-slate-900">Nuestra Visión</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Consolidarnos como el referente indiscutible en la distribución de tecnología de soldadura y estructuras metálicas a nivel nacional, reconocidos por la innovación, confiabilidad y el compromiso con el desarrollo industrial.
            </p>
          </div>

        </div>
      </section>

      {/* Valores Corporativos */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center">
        <span className="text-[#0d9488] font-bold text-xs uppercase tracking-wider">Pilares Fundamentales</span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Nuestros Valores</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
          
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-900 text-base mb-2">⭐ Calidad Certificada</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trabajamos exclusivamente con marcas y especificaciones de alto rendimiento para garantizar durabilidad en condiciones extremas.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-900 text-base mb-2">🤝 Asesoramiento Técnico</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acompañamos a nuestros clientes industriales con criterio de ingeniería para seleccionar la máquina o consumible ideal.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-900 text-base mb-2">⚡ Compromiso y Rapidez</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Entendemos la urgencia de la industria; garantizamos respuestas ágiles y cotizaciones formales inmediatas en Santa Cruz.
            </p>
          </div>

        </div>

        <div className="mt-12">
          <Link href="/" className="inline-block bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold px-8 py-3 rounded-xl text-sm shadow transition">
            ← Volver a la Tienda Principal
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-center text-xs border-t border-slate-800">
        <p className="text-white font-bold text-sm mb-1">SOLDEER - Estructuras, Comercio y Servicios</p>
        <p>© 2026 Soldeer Bolivia. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}