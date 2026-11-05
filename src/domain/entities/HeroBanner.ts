export interface HeroBanner {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBannerDTO = Omit<HeroBanner, 'id' | 'createdAt' | 'updatedAt'>;