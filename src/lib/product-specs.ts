import type { Product } from '@/domain/entities/Product';

export const PLACEHOLDER_IMAGE = '/placeholder-product.svg';

/** Primera imagen del producto o el placeholder si todavía no tiene fotos. */
export function getPrimaryImage(product: Pick<Product, 'images'>): string {
  return product.images[0] ?? PLACEHOLDER_IMAGE;
}

/** Solo las especificaciones que el producto realmente tiene (nada inventado). */
export function getSpecRows(product: Product): { label: string; value: string }[] {
  const rows: [string, string | null][] = [
    ['Amperaje máximo', product.maxAmperage],
    ['Ciclo de trabajo', product.workCycle],
    ['Alimentación', product.powerSupply],
    ['Proceso', product.weldingProcess],
    ['Presentación / Peso', product.presentation],
    ['Medidas', product.dimensions],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1])).map(([label, value]) => ({ label, value }));
}
