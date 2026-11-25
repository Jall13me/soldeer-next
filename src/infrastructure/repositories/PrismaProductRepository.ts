import 'server-only';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { IProductRepository, ProductListFilter } from '@/domain/repositories/IProductRepository';
import type { CreateProductDTO, Product } from '@/domain/entities/Product';

type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

/** Mapea la fila de la BD al contrato del dominio. Ya NO se inventan especificaciones. */
function toDomain(p: ProductWithCategory): Product {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    offerPrice: p.offerPrice === null ? null : Number(p.offerPrice),
    sku: p.sku,
    stock: p.stock,
    images: p.images,
    isPublished: p.isPublished,
    isFeatured: p.isFeatured,
    category: { name: p.category.name, slug: p.category.slug },
    maxAmperage: p.maxAmperage,
    workCycle: p.workCycle,
    powerSupply: p.powerSupply,
    weldingProcess: p.weldingProcess,
    presentation: p.presentation,
    dimensions: p.dimensions,
    createdAt: p.createdAt,
  };
}

const include = { category: true } satisfies Prisma.ProductInclude;

export class PrismaProductRepository implements IProductRepository {
  async getFeatured(limit: number): Promise<Product[]> {
    const featured = await prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      include,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    if (featured.length > 0) return featured.map(toDomain);

    // Mientras no marques ninguno como destacado, se muestran los más recientes.
    const latest = await prisma.product.findMany({
      where: { isPublished: true },
      include,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return latest.map(toDomain);
  }

  async listPublished(filter: ProductListFilter = {}): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = { isPublished: true };

    if (filter.categorySlugs && filter.categorySlugs.length > 0) {
      where.category = { slug: { in: filter.categorySlugs } };
    }

    const search = filter.search?.trim();
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const rows = await prisma.product.findMany({ where, include, orderBy: { createdAt: 'desc' } });
    return rows.map(toDomain);
  }

  async listAll(): Promise<Product[]> {
    const rows = await prisma.product.findMany({ include, orderBy: { createdAt: 'desc' } });
    return rows.map(toDomain);
  }

  async getPublishedBySlug(slug: string): Promise<Product | null> {
    const row = await prisma.product.findFirst({ where: { slug, isPublished: true }, include });
    return row ? toDomain(row) : null;
  }

  async getById(id: string): Promise<Product | null> {
    const row = await prisma.product.findUnique({ where: { id }, include });
    return row ? toDomain(row) : null;
  }

  async slugExists(slug: string): Promise<boolean> {
    return (await prisma.product.count({ where: { slug } })) > 0;
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const { category, ...rest } = data;
    const row = await prisma.product.create({
      data: {
        ...rest,
        // Crea la categoría si no existe (por slug) o la reutiliza: una sola operación.
        category: {
          connectOrCreate: {
            where: { slug: category.slug },
            create: { name: category.name, slug: category.slug },
          },
        },
      },
      include,
    });
    return toDomain(row);
  }

  async delete(id: string): Promise<Product | null> {
    const existing = await prisma.product.findUnique({ where: { id }, include });
    if (!existing) return null;
    await prisma.product.delete({ where: { id } });
    return toDomain(existing);
  }

  async setPublished(id: string, isPublished: boolean): Promise<void> {
    await prisma.product.update({ where: { id }, data: { isPublished } });
  }

  async setFeatured(id: string, isFeatured: boolean): Promise<void> {
    await prisma.product.update({ where: { id }, data: { isFeatured } });
  }
}
