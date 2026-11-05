import { PrismaProductRepository } from '@/infrastructure/repositories/PrismaProductRepository';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';

const productRepository = new PrismaProductRepository();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPdfPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await productRepository.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8 font-sans print:p-0">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 print:border-none p-8 rounded-2xl shadow-sm">
        
        {/* Header del Reporte PDF */}
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div>
            <div className="text-2xl font-black text-slate-900 flex items-center">
              <span className="text-[#0d9488] font-serif italic text-3xl mr-0.5">S</span>oldeer
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Estructuras, Comercio y Servicios</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p><strong>Ficha Técnica Oficial B2B</strong></p>
            <p>Santa Cruz de la Sierra, Bolivia</p>
          </div>
        </div>

        {/* Info del Producto */}
        <div className="grid grid-cols-2 gap-8 items-center mb-8">
          <div className="h-64 bg-slate-100 rounded-xl overflow-hidden border">
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="bg-[#0d9488]/10 text-[#0d9488] font-bold text-xs px-3 py-1 rounded-full">
              {product.categoryName}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-3">{product.title}</h1>
            <p className="text-xs text-slate-500 mt-1">SKU / Código: <span className="font-mono font-bold text-slate-800">{product.sku}</span></p>
            <div className="mt-4 text-xl font-black text-slate-900">
              Bs. {product.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">Sujeto a cotización empresarial</span>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-900 text-sm mb-2 border-b pb-1">Descripción General</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {product.description || 'Equipo certificado para máxima exigencia en la industria metalmecánica y de construcción en Bolivia.'}
          </p>
        </div>

        {/* Especificaciones Técnicas */}
        <div className="mb-8 bg-slate-50 border rounded-xl p-6">
          <h3 className="font-bold text-slate-900 text-sm mb-4 border-b pb-2">⚙️ Especificaciones Técnicas de Ingeniería</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            {product.maxAmperage && <div><span className="text-slate-400 block">Amperaje Máximo</span><strong className="text-slate-800">{product.maxAmperage}</strong></div>}
            {product.workCycle && <div><span className="text-slate-400 block">Ciclo de Trabajo</span><strong className="text-slate-800">{product.workCycle}</strong></div>}
            {product.powerSupply && <div><span className="text-slate-400 block">Alimentación</span><strong className="text-slate-800">{product.powerSupply}</strong></div>}
            {product.weldingProcess && <div><span className="text-slate-400 block">Proceso</span><strong className="text-slate-800">{product.weldingProcess}</strong></div>}
            {product.presentation && <div><span className="text-slate-400 block">Presentación</span><strong className="text-slate-800">{product.presentation}</strong></div>}
            {product.dimensions && <div><span className="text-slate-400 block">Medidas</span><strong className="text-slate-800">{product.dimensions}</strong></div>}
          </div>
        </div>

        {/* Pie de Página / Contacto */}
        <div className="border-t pt-4 text-center text-[10px] text-slate-500">
          <p>📍 Av. 3er Anillo Interno entre Av. Beni y Alemana #420 | 📞 Teléfono: 75353583 | Santa Cruz, Bolivia</p>
        </div>

        {/* Botón de Impresión / Guardar PDF (Oculto al imprimir) */}
        <div className="mt-8 text-center print:hidden">
          <PrintButton />
        </div>

      </div>
    </div>
  );
}