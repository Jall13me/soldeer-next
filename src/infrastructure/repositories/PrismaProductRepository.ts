import { prisma } from '@/lib/prisma';
import { IProductRepository } from '@/domain/repositories/IProductRepository';
import { Product } from '@/domain/entities/Product';

export class PrismaProductRepository implements IProductRepository {
  async getFeaturedProducts(): Promise<Product[]> {
    const dbProducts = await prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    // Mapeo dinámico al contrato de dominio manejando posibles nulos
    return dbProducts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      sku: p.sku || 'N/A', // <-- Solución al error: fallback si es null
      categoryName: p.category.name,
      images: p.images.length > 0 ? p.images : ['/uploads/default-machine.jpg'],
      maxAmperage: p.maxAmperage || 'N/D',
      workCycle: p.workCycle || 'N/D',
      powerSupply: p.powerSupply || 'N/D',
      weldingProcess: p.weldingProcess || 'N/D',
      isFeatured: true,
    }));
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!p) return null;

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      sku: p.sku || 'N/A', // <-- Solución al error: fallback si es null
      categoryName: p.category.name,
      images: p.images.length > 0 ? p.images : ['/uploads/default-machine.jpg'],
      maxAmperage: p.maxAmperage || 'N/D',
      workCycle: p.workCycle || 'N/D',
      powerSupply: p.powerSupply || 'N/D',
      weldingProcess: p.weldingProcess || 'N/D',
      isFeatured: true,
    };
  }
}