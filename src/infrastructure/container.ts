import 'server-only';
import { BrowseCatalogUseCase } from '@/application/use-cases/BrowseCatalog';
import { ManageBannersUseCase } from '@/application/use-cases/ManageBanners';
import { ManageProductsUseCase } from '@/application/use-cases/ManageProducts';
import { PrismaBannerRepository } from './repositories/PrismaBannerRepository';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { LocalStorageService } from './services/LocalStorageService';

/**
 * Composition root: el ÚNICO lugar donde se conectan implementaciones concretas.
 * Para pasar a S3/Cloudinary solo se cambia `storage` aquí.
 */
const productRepository = new PrismaProductRepository();
const bannerRepository = new PrismaBannerRepository();
const storage = new LocalStorageService();

export const browseCatalog = new BrowseCatalogUseCase(productRepository);
export const manageProducts = new ManageProductsUseCase(productRepository, storage);
export const manageBanners = new ManageBannersUseCase(bannerRepository, storage);
