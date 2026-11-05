import { prisma } from '@/lib/prisma';
import { IBannerRepository } from '@/domain/repositories/IBannerRepository';
import { HeroBanner, CreateBannerDTO } from '@/domain/entities/HeroBanner';

export class PrismaBannerRepository implements IBannerRepository {
  async getAll(): Promise<HeroBanner[]> {
    return await prisma.heroBanner.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async getActiveBanners(): Promise<HeroBanner[]> {
    return await prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async create(data: CreateBannerDTO): Promise<HeroBanner> {
    return await prisma.heroBanner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        order: data.order,
        isActive: data.isActive,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.heroBanner.delete({
      where: { id },
    });
  }

  async toggleStatus(id: string, isActive: boolean): Promise<HeroBanner> {
    return await prisma.heroBanner.update({
      where: { id },
      data: { isActive },
    });
  }
}