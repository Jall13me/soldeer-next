import { PRIMARY_BRANCH } from './branches';

/**
 * Datos del negocio en un solo lugar. Cambia aquí (o por variables de entorno)
 * y se actualizan Navbar, Footer, home, PDF, SEO y el botón de WhatsApp.
 * Las sucursales viven en `branches.ts`.
 */
export const siteConfig = {
  name: 'Soldeer',
  legalName: 'SOLDEER - Estructuras, Comercio y Servicios',
  tagline: 'Estructuras, Comercio y Servicios',
  description:
    'Portal B2B de maquinaria de soldadura, alambres, torchas y consumibles industriales en Santa Cruz, Bolivia.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  /** Contacto principal = sucursal central. */
  phone: PRIMARY_BRANCH.phone,
  address: PRIMARY_BRANCH.address,
  /** Formato internacional sin "+": 591 + número. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? `591${PRIMARY_BRANCH.phone}`,
} as const;
