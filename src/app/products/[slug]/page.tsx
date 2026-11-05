import { PrismaProductRepository } from '@/infrastructure/repositories/PrismaProductRepository';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/products/ProductGallery';

const productRepository = new PrismaProductRepository();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await productRepository.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      
      {/* Migas de pan / Header superior */}
      <div className="bg-slate-900 text-white text-xs py-2 px-6 flex justify-between items-center">
        <span>📍 Av. 3er Anillo Interno, Santa Cruz de la Sierra, Bolivia</span>
        <Link href="/" className="text-[#14b8a6] font-semibold hover:underline">← Volver al Inicio</Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Galería Interactiva con Zoom por Cursor */}
          <ProductGallery images={product.images} title={product.title} />

          {/* Información y Especificaciones Técnicas */}
          <div>
            <span className="bg-[#0d9488]/10 text-[#0d9488] font-bold text-xs px-3 py-1 rounded-full border border-[#0d9488]/30">
              {product.categoryName}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4">
              {product.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Código / SKU: <span className="font-mono font-bold text-slate-800">{product.sku}</span></p>

            <div className="mt-6 text-3xl font-black text-slate-900">
              Bs. {product.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">Sujeto a cotización empresarial</span>
            </div>

            <p className="text-slate-600 text-sm mt-4 leading-relaxed">
              {product.description || 'Producto certificado para exigencia industrial pesada en Bolivia.'}
            </p>

            {/* Ficha Técnica Dinámica */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b pb-2">⚙️ Especificaciones Técnicas</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                
                {product.maxAmperage && (
                  <div><span className="text-slate-400 block">Amperaje Máximo</span><strong className="text-slate-800 text-sm">{product.maxAmperage}</strong></div>
                )}
                {product.workCycle && (
                  <div><span className="text-slate-400 block">Ciclo de Trabajo</span><strong className="text-slate-800 text-sm">{product.workCycle}</strong></div>
                )}
                {product.powerSupply && (
                  <div><span className="text-slate-400 block">Alimentación</span><strong className="text-slate-800 text-sm">{product.powerSupply}</strong></div>
                )}
                {product.weldingProcess && (
                  <div><span className="text-slate-400 block">Proceso</span><strong className="text-slate-800 text-sm">{product.weldingProcess}</strong></div>
                )}
                {product.presentation && (
                  <div><span className="text-slate-400 block">Presentación / Peso</span><strong className="text-slate-800 text-sm">{product.presentation}</strong></div>
                )}
                {product.dimensions && (
                  <div><span className="text-slate-400 block">Medidas</span><strong className="text-slate-800 text-sm">{product.dimensions}</strong></div>
                )}

              </div>
            </div>

            {/* Botones de Acción: Cotización y Descarga PDF */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2">
                📋 Solicitar Cotización B2B
              </button>
              <Link
                href={`/products/${product.slug}/pdf`}
                target="_blank"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                📥 Descargar Ficha PDF
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}