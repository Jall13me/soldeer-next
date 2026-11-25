import { CreateBannerDTO, HeroBanner } from '../entities/HeroBanner';

export interface IBannerRepository {
  getAll(): Promise<HeroBanner[]>;
  getActive(): Promise<HeroBanner[]>;
  getById(id: string): Promise<HeroBanner | null>;
  getNextOrder(): Promise<number>;
  create(data: CreateBannerDTO): Promise<HeroBanner>;
  delete(id: string): Promise<void>;
  setActive(id: string, isActive: boolean): Promise<void>;
}
