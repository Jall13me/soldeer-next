import { resolveCategory, type ResolvedCategory } from '@/config/categoriesConfig';
import type { Product } from '@/domain/entities/Product';
import type { IProductReader } from '@/domain/repositories/IProductRepository';

const FEATURED_LIMIT = 6;

export interface CatalogResult {
  /** null = catálogo general. */
  category: ResolvedCategory | null;
  products: Product[];
}

export class BrowseCatalogUseCase {
  constructor(private readonly products: IProductReader) {}

  featured(): Promise<Product[]> {
    return this.products.getFeatured(FEATURED_LIMIT);
  }

  detail(slug: string): Promise<Product | null> {
    return this.products.getPublishedBySlug(slug);
  }

  /** Devuelve null si el slug de categoría no existe (la página responde 404). */
  async browse(params: { categorySlug?: string; search?: string }): Promise<CatalogResult | null> {
    let category: ResolvedCategory | null = null;
    if (params.categorySlug) {
      category = resolveCategory(params.categorySlug);
      if (!category) return null;
    }

    const products = await this.products.listPublished({
      categorySlugs: category?.subcategorySlugs,
      search: params.search,
    });
    return { category, products };
  }
}
