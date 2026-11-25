import type { CreateBannerDTO, HeroBanner } from '@/domain/entities/HeroBanner';
import type { CreateProductDTO, Product } from '@/domain/entities/Product';
import { ValidationError } from '@/domain/errors';
import type { IBannerRepository } from '@/domain/repositories/IBannerRepository';
import type { IProductWriter } from '@/domain/repositories/IProductRepository';
import type { IStorageService, StoredImage } from '@/domain/services/IStorageService';

/** Almacenamiento falso: registra lo guardado/borrado y permite simular imágenes inválidas o pequeñas. */
export class FakeStorage implements IStorageService {
  saved: string[] = [];
  deleted: string[] = [];
  width = 1920;
  rejectNames = new Set<string>();
  private counter = 0;

  async saveImage(file: File): Promise<StoredImage> {
    if (this.rejectNames.has(file.name)) throw new ValidationError(`"${file.name}" no es una imagen válida.`);
    const url = `/uploads/fake-${++this.counter}.webp`;
    this.saved.push(url);
    return { url, width: this.width, height: Math.round(this.width / 2.7), bytes: 1000 };
  }

  async deleteFile(url: string): Promise<void> {
    this.deleted.push(url);
  }
}

export class InMemoryProductRepository implements IProductWriter {
  items: Product[] = [];
  failOnCreate = false;
  private id = 0;

  async listAll() {
    return this.items;
  }
  async getById(id: string) {
    return this.items.find((p) => p.id === id) ?? null;
  }
  async slugExists(slug: string) {
    return this.items.some((p) => p.slug === slug);
  }
  async create(data: CreateProductDTO): Promise<Product> {
    if (this.failOnCreate) throw new Error('db down');
    const product: Product = { ...data, id: `p${++this.id}`, stock: 10, isPublished: true, createdAt: new Date() };
    this.items.push(product);
    return product;
  }
  async delete(id: string) {
    const found = this.items.find((p) => p.id === id) ?? null;
    this.items = this.items.filter((p) => p.id !== id);
    return found;
  }
  async setPublished(id: string, value: boolean) {
    const p = this.items.find((x) => x.id === id);
    if (p) p.isPublished = value;
  }
  async setFeatured(id: string, value: boolean) {
    const p = this.items.find((x) => x.id === id);
    if (p) p.isFeatured = value;
  }
}

export class InMemoryBannerRepository implements IBannerRepository {
  items: HeroBanner[] = [];
  private id = 0;

  async getAll() {
    return this.items;
  }
  async getActive() {
    return this.items.filter((b) => b.isActive);
  }
  async getById(id: string) {
    return this.items.find((b) => b.id === id) ?? null;
  }
  async getNextOrder() {
    return this.items.length === 0 ? 0 : Math.max(...this.items.map((b) => b.order)) + 1;
  }
  async create(data: CreateBannerDTO): Promise<HeroBanner> {
    const banner: HeroBanner = { ...data, id: `b${++this.id}`, createdAt: new Date(), updatedAt: new Date() };
    this.items.push(banner);
    return banner;
  }
  async delete(id: string) {
    this.items = this.items.filter((b) => b.id !== id);
  }
  async setActive(id: string, isActive: boolean) {
    const b = this.items.find((x) => x.id === id);
    if (b) b.isActive = isActive;
  }
}

export const fakeFile = (name = 'foto.jpg', size = 10) => new File([new Uint8Array(size)], name, { type: 'image/jpeg' });
