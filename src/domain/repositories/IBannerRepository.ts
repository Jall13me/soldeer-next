import { HeroBanner, CreateBannerDTO } from '../entities/HeroBanner';

export interface IBannerRepository {
  getAll(): Promise<HeroBanner[]>;
  getActiveBanners(): Promise<HeroBanner[]>;
  create(data: CreateBannerDTO): Promise<HeroBanner>;
  delete(id: string): Promise<void>;
  toggleStatus(id: string, isActive: boolean): Promise<HeroBanner>;
}