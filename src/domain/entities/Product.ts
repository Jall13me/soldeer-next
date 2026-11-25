export interface ProductCategory {
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  offerPrice: number | null;
  sku: string | null;
  stock: number;
  /** URLs públicas. Vacío si el producto aún no tiene fotos. */
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
  category: ProductCategory;

  // Atributos técnicos opcionales (solo se muestran si existen)
  maxAmperage: string | null;
  workCycle: string | null;
  powerSupply: string | null;
  weldingProcess: string | null;
  presentation: string | null;
  dimensions: string | null;

  createdAt: Date;
}

export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'category' | 'stock' | 'isPublished'> & {
  category: ProductCategory;
};
