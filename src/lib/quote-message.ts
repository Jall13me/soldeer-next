import type { QuoteItem } from './quote-store';

export interface QuoteCustomer {
  name: string;
  company?: string;
  notes?: string;
}

/** Texto que se envía por WhatsApp. Función pura: fácil de probar. */
export function buildQuoteMessage(items: readonly QuoteItem[], customer: QuoteCustomer, siteUrl: string): string {
  const lines = items.map((item) => {
    const sku = item.sku ? ` (SKU ${item.sku})` : '';
    return `• ${item.quantity} x ${item.title}${sku}\n  ${siteUrl}/products/${item.slug}`;
  });

  const who = [customer.name.trim(), customer.company?.trim()].filter(Boolean).join(' - ');

  return [
    'Hola Soldeer, quisiera una cotización de:',
    '',
    ...lines,
    '',
    who ? `Contacto: ${who}` : '',
    customer.notes?.trim() ? `Notas: ${customer.notes.trim()}` : '',
  ]
    .filter((line, index, all) => line !== '' || (index > 0 && all[index - 1] !== ''))
    .join('\n')
    .trim();
}

export function buildWhatsAppUrl(phoneInternational: string, message: string): string {
  return `https://wa.me/${phoneInternational}?text=${encodeURIComponent(message)}`;
}
