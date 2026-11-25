import { CreateProductDTO, Product } from '../entities/Product';

export interface ProductListFilter {
  /** Slugs de subcategoría a incluir. Vacío/undefined = todas. */
  categorySlugs?: string[];
  /** Búsqueda por título, SKU o descripción. */
  search?: string;
}

/** Consultas de solo lectura (lo único que necesita el catálogo público). */
export interface IProductReader {
  getFeatured(limit: number): Promise<Product[]>;
  listPublished(filter?: ProductListFilter): Promise<Product[]>;
  getPublishedBySlug(slug: string): Promise<Product | null>;
}

/** Operaciones de administración (Interface Segregation: el catálogo no las ve). */
export interface IProductWriter {
  listAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  slugExists(slug: string): Promise<boolean>;
  create(data: CreateProductDTO): Promise<Product>;
  /** Devuelve el producto eliminado (para poder borrar sus fotos) o null si no existía. */
  delete(id: string): Promise<Product | null>;
  setPublished(id: string, isPublished: boolean): Promise<void>;
  setFeatured(id: string, isFeatured: boolean): Promise<void>;
}

export interface IProductRepository extends IProductReader, IProductWriter {}
