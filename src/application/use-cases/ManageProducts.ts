import { findSubcategory } from '@/config/categoriesConfig';
import { ValidationError } from '@/domain/errors';
import type { Product } from '@/domain/entities/Product';
import type { IProductWriter } from '@/domain/repositories/IProductRepository';
import type { IStorageService } from '@/domain/services/IStorageService';
import { slugify } from '@/lib/slug';

const MIN_PRODUCT_WIDTH = 800;
const MAX_IMAGES = 8;
const MAX_PRICE = 99_999_999;

export interface CreateProductInput {
  title: string;
  description?: string;
  price: number;
  offerPrice?: number | null;
  sku?: string;
  subcategorySlug: string;
  isFeatured: boolean;
  maxAmperage?: string;
  workCycle?: string;
  powerSupply?: string;
  weldingProcess?: string;
  presentation?: string;
  dimensions?: string;
  files: File[];
}

export interface CreateProductResult {
  product: Product;
  warnings: string[];
}

const clean = (value: string | undefined, max: number) => value?.trim().slice(0, max) || null;

export class ManageProductsUseCase {
  constructor(
    private readonly products: IProductWriter,
    private readonly storage: IStorageService,
  ) {}

  listAll(): Promise<Product[]> {
    return this.products.listAll();
  }

  async create(input: CreateProductInput): Promise<CreateProductResult> {
    const title = input.title.trim();
    if (title.length < 3 || title.length > 120) {
      throw new ValidationError('El nombre debe tener entre 3 y 120 caracteres.');
    }
    if (!Number.isFinite(input.price) || input.price < 0 || input.price > MAX_PRICE) {
      throw new ValidationError('El precio no es válido.');
    }
    const offerPrice = input.offerPrice ?? null;
    if (offerPrice !== null && (!Number.isFinite(offerPrice) || offerPrice <= 0 || offerPrice >= input.price)) {
      throw new ValidationError('El precio de oferta debe ser mayor que 0 y menor que el precio normal.');
    }
    const subcategory = findSubcategory(input.subcategorySlug);
    if (!subcategory) throw new ValidationError('Selecciona una subcategoría válida.');
    if (input.files.length > MAX_IMAGES) throw new ValidationError(`Máximo ${MAX_IMAGES} imágenes por producto.`);

    // 1) Guardar imágenes (si una falla, se limpian las que ya se guardaron)
    const warnings: string[] = [];
    const imageUrls: string[] = [];
    try {
      for (const file of input.files) {
        const stored = await this.storage.saveImage(file, 'product');
        imageUrls.push(stored.url);
        if (stored.width < MIN_PRODUCT_WIDTH) {
          warnings.push(`"${file.name}" mide ${stored.width}×${stored.height}px: se verá borrosa al hacer zoom (ideal 1200×900px o más).`);
        }
      }

      // 2) Crear el producto con slug limpio y único
      const slug = await this.uniqueSlug(title);
      const product = await this.products.create({
        title,
        slug,
        description: clean(input.description, 2000),
        price: input.price,
        offerPrice,
        sku: clean(input.sku, 40),
        images: imageUrls,
        isFeatured: input.isFeatured,
        category: { name: subcategory.name, slug: input.subcategorySlug },
        maxAmperage: clean(input.maxAmperage, 80),
        workCycle: clean(input.workCycle, 80),
        powerSupply: clean(input.powerSupply, 80),
        weldingProcess: clean(input.weldingProcess, 80),
        presentation: clean(input.presentation, 80),
        dimensions: clean(input.dimensions, 80),
      });
      return { product, warnings };
    } catch (error) {
      await Promise.all(imageUrls.map((url) => this.storage.deleteFile(url)));
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.products.delete(id);
    if (!deleted) return;
    // Antes las fotos quedaban huérfanas en disco al borrar el producto.
    await Promise.all(deleted.images.map((url) => this.storage.deleteFile(url)));
  }

  async togglePublished(id: string): Promise<void> {
    const product = await this.products.getById(id);
    if (product) await this.products.setPublished(id, !product.isPublished);
  }

  async toggleFeatured(id: string): Promise<void> {
    const product = await this.products.getById(id);
    if (product) await this.products.setFeatured(id, !product.isFeatured);
  }

  private async uniqueSlug(title: string): Promise<string> {
    const base = slugify(title) || 'producto';
    for (let i = 1; i <= 50; i++) {
      const candidate = i === 1 ? base : `${base}-${i}`;
      if (!(await this.products.slugExists(candidate))) return candidate;
    }
    return `${base}-${Date.now()}`;
  }
}
