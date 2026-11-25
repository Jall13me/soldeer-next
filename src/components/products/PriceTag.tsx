import { formatBs } from '@/lib/format';
import { cn } from '@/lib/cn';

interface PriceTagProps {
  price: number;
  offerPrice?: number | null;
  /** Clases de tamaño para el precio principal. */
  className?: string;
}

/** Precio con oferta tachada. Si el precio es 0, invita a cotizar en vez de mostrar "Bs. 0". */
export function PriceTag({ price, offerPrice, className }: PriceTagProps) {
  if (price <= 0) {
    return <span className={cn('font-extrabold text-slate-900', className)}>Consultar precio</span>;
  }

  if (offerPrice && offerPrice < price) {
    return (
      <span className="flex items-baseline gap-2">
        <span className={cn('font-extrabold text-brand-dark', className)}>{formatBs(offerPrice)}</span>
        <s className="text-xs font-normal text-slate-400">{formatBs(price)}</s>
      </span>
    );
  }

  return <span className={cn('font-extrabold text-slate-900', className)}>{formatBs(price)}</span>;
}
