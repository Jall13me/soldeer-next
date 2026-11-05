import { IBannerRepository } from '@/domain/repositories/IBannerRepository';
import { IStorageService } from '@/domain/services/IStorageService';

export class ManageBannersUseCase {
  constructor(
    private bannerRepository: IBannerRepository,
    private storageService: IStorageService
  ) {}

  async listAll() {
    return await this.bannerRepository.getAll();
  }

  async addMultipleBanners(files: File[], title?: string, subtitle?: string) {
    if (!files || files.length === 0) {
      throw new Error('Debe seleccionar al menos una imagen.');
    }

    const createdBanners = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      // 1. Guardar archivo en disco
      const imageUrl = await this.storageService.uploadFile(file);

      // 2. Crear registro en PostgreSQL vía Prisma
      const banner = await this.bannerRepository.create({
        title: title || file.name,
        subtitle: subtitle || null,
        imageUrl,
        linkUrl: null,
        order: 0,
        isActive: true,
      });

      createdBanners.push(banner);
    }

    return createdBanners;
  }

  async removeBanner(id: string, imageUrl: string) {
    // Eliminar archivo físico
    await this.storageService.deleteFile(imageUrl);
    // Eliminar de PostgreSQL
    await this.bannerRepository.delete(id);
  }

  async toggleActive(id: string, currentStatus: boolean) {
    return await this.bannerRepository.toggleStatus(id, !currentStatus);
  }
}