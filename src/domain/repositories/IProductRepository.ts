import { Product } from '../entities/Product';

export interface IProductRepository {
  getFeaturedProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
}