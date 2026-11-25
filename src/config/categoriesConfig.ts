export interface SubcategoryConfig {
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryGroupConfig {
  title: string;
  slug: string;
  subcategories: SubcategoryConfig[];
}

export const NAV_CATEGORIES: CategoryGroupConfig[] = [
  {
    title: 'Máquinas de Soldar y Corte',
    slug: 'maquinas',
    subcategories: [
      { name: 'Soldadoras MIG / MAG', slug: 'mig-mag', description: 'Equipos sinérgicos y de proceso múltiple' },
      { name: 'Soldadoras TIG (AC/DC / Pulsado)', slug: 'tig', description: 'Alta frecuencia para aluminio y acero inoxidable' },
      { name: 'Soldadoras MMA (Electrodo Revestido)', slug: 'mma', description: 'Inversoras portátiles para taller y campo' },
      { name: 'Cortadoras de Plasma', slug: 'corte-plasma', description: 'Corte limpio de metales y alta precisión' },
      { name: 'Soldadoras Láser 3 en 1', slug: 'laser', description: 'Tecnología de fibra de última generación' },
    ],
  },
  {
    title: 'Torchas y Accesorios',
    slug: 'torchas',
    subcategories: [
      { name: 'Torchas MIG / MAG', slug: 'torchas-mig', description: 'Sujeción ergonómica y alto amperaje' },
      { name: 'Torchas TIG', slug: 'torchas-tig', description: 'Conector flexible y refrigeración por agua/aire' },
      { name: 'Torchas Plasma', slug: 'torchas-plasma', description: 'Consumibles de larga duración' },
      { name: 'Máscaras Fotosensibles', slug: 'mascaras', description: 'Cascos de protección con filtro DIN' },
    ],
  },
  {
    title: 'Consumibles y Materiales',
    slug: 'consumibles',
    subcategories: [
      { name: 'Alambres de Soldadura', slug: 'alambres', description: 'Sólidos, tubulares, acero al carbono e inox' },
      { name: 'Electrodos Revestidos', slug: 'electrodos', description: 'E6010, E7018, inoxidable y fundición' },
      { name: 'Tungstenos y Varillas TIG', slug: 'tungstenos', description: 'Varillas ER70S-6 y electrodos de tungsteno' },
      { name: 'Repuestos de Torchas', slug: 'repuestos', description: 'Toberas, difusores, aisladores y mordazas' },
    ],
  },
];

/** Accesos circulares del home. Cada slug puede ser de un grupo o de una subcategoría. */
export const HOME_SHORTCUTS: { title: string; slug: string }[] = [
  { title: 'Torchas', slug: 'torchas' },
  { title: 'Consumibles para Soldadura', slug: 'consumibles' },
  { title: 'Corte por Plasma Manual', slug: 'corte-plasma' },
  { title: 'Elementos de Protección Personal', slug: 'mascaras' },
  { title: 'Máquinas para Soldar', slug: 'maquinas' },
];

export interface ResolvedCategory {
  kind: 'group' | 'subcategory';
  slug: string;
  title: string;
  description: string;
  /** Slugs de subcategoría (las que realmente guardan los productos) que cubre este filtro. */
  subcategorySlugs: string[];
}

/**
 * Resuelve un slug de la URL (`/catalog?category=...`) que puede ser un grupo
 * ("maquinas" → todas sus subcategorías) o una subcategoría ("mig-mag").
 */
export function resolveCategory(slug: string): ResolvedCategory | null {
  const group = NAV_CATEGORIES.find((g) => g.slug === slug);
  if (group) {
    return {
      kind: 'group',
      slug: group.slug,
      title: group.title,
      description: group.subcategories.map((s) => s.name).join(' · '),
      subcategorySlugs: group.subcategories.map((s) => s.slug),
    };
  }

  for (const g of NAV_CATEGORIES) {
    const sub = g.subcategories.find((s) => s.slug === slug);
    if (sub) {
      return {
        kind: 'subcategory',
        slug: sub.slug,
        title: sub.name,
        description: sub.description ?? g.title,
        subcategorySlugs: [sub.slug],
      };
    }
  }
  return null;
}

/** Devuelve la subcategoría (con su nombre oficial) o null si el slug no existe. */
export function findSubcategory(slug: string): SubcategoryConfig | null {
  for (const g of NAV_CATEGORIES) {
    const sub = g.subcategories.find((s) => s.slug === slug);
    if (sub) return sub;
  }
  return null;
}
