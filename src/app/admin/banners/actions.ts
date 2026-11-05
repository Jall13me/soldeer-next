'use server'

import { revalidatePath } from 'next/cache';
import { PrismaBannerRepository } from '@/infrastructure/repositories/PrismaBannerRepository';
import { LocalStorageService } from '@/infrastructure/services/LocalStorageService';
import { ManageBannersUseCase } from '@/application/use-cases/ManageBanners';

const bannerRepository = new PrismaBannerRepository();
const storageService = new LocalStorageService();
const manageBannersUseCase = new ManageBannersUseCase(bannerRepository, storageService);

export async function getBannersAction() {
  return await manageBannersUseCase.listAll();
}

export async function uploadBannersAction(formData: FormData) {
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;
  const files = formData.getAll('imageFiles') as File[];

  // Filtrar archivos válidos
  const validFiles = files.filter((f) => f.size > 0 && f.type.startsWith('image/'));

  if (validFiles.length > 0) {
    await manageBannersUseCase.addMultipleBanners(validFiles, title, subtitle);
  }

  revalidatePath('/admin/banners');
  revalidatePath('/');
}

export async function deleteBannerAction(id: string, imageUrl: string) {
  await manageBannersUseCase.removeBanner(id, imageUrl);
  revalidatePath('/admin/banners');
  revalidatePath('/');
}

export async function toggleBannerAction(id: string, currentStatus: boolean) {
  await manageBannersUseCase.toggleActive(id, currentStatus);
  revalidatePath('/admin/banners');
  revalidatePath('/');
}