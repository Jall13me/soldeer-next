import 'server-only';
import { prisma } from '@/lib/prisma';
import type { IBannerRepository } from '@/domain/repositories/IBannerRepository';
import type { CreateBannerDTO, HeroBanner } from '@/domain/entities/HeroBanner';

export class PrismaBannerRepository implements IBannerRepository {
  getAll(): Promise<HeroBanner[]> {
    return prisma.heroBanner.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  }

  getActive(): Promise<HeroBanner[]> {
    return prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  getById(id: string): Promise<HeroBanner | null> {
    return prisma.heroBanner.findUnique({ where: { id } });
  }

  async getNextOrder(): Promise<number> {
    const last = await prisma.heroBanner.aggregate({ _max: { order: true } });
    return (last._max.order ?? -1) + 1;
  }

  create(data: CreateBannerDTO): Promise<HeroBanner> {
    return prisma.heroBanner.create({ data });
  }

  async delete(id: string): Promise<void> {
    await prisma.heroBanner.deleteMany({ where: { id } });
  }

  async setActive(id: string, isActive: boolean): Promise<void> {
    await prisma.heroBanner.update({ where: { id }, data: { isActive } });
  }
}
