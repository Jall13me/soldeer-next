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