import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/domain/entities/Product';
import { getPrimaryImage } from '@/lib/product-specs';
import { PriceTag } from './PriceTag';

interface ProductCardProps {
  product: Product;
  /** Pasa true en las primeras tarjetas visibles para cargarlas antes. */
  eager?: boolean;
}

export function ProductCard({ product, eager = false }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand hover:shadow-xl"
    >
      <div>
        {/* 4:3 con object-contain: la máquina nunca se recorta */}
        <div className="relative aspect-[4/3] overflow-hidden border-b border-slate-100 bg-white">
          <Image
            src={getPrimaryImage(product)}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 384px, (min-width: 768px) 33vw, 100vw"
            loading={eager ? 'eager' : 'lazy'}
            className="object-contain p-3 transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            {product.category.name}
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-brand">{product.title}</h3>
          <p className="mt-2 line-clamp-2 text-xs text-slate-500">
            {product.description ?? 'Equipo certificado para máxima exigencia industrial.'}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 p-6 pt-4">
        <PriceTag price={product.price} offerPrice={product.offerPrice} className="text-base" />
        <span className="text-xs font-bold text-brand transition-transform group-hover:translate-x-1">Ver ficha técnica →</span>
      </div>
    </Link>
  );
}
