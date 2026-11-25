import { ValidationError } from '@/domain/errors';
import type { HeroBanner, HeroSlide } from '@/domain/entities/HeroBanner';
import type { IBannerRepository } from '@/domain/repositories/IBannerRepository';
import type { IStorageService } from '@/domain/services/IStorageService';

const MIN_BANNER_WIDTH = 1600;
const MAX_FILES_PER_UPLOAD = 10;

export interface AddBannersInput {
  files: File[];
  title?: string;
  subtitle?: string;
  linkUrl?: string;
}

export interface AddBannersResult {
  created: number;
  /** Avisos no bloqueantes (ej. imagen muy pequeña) y archivos omitidos. */
  warnings: string[];
}

/** Solo rutas internas ("/catalog?...") o enlaces http(s). Evita "javascript:" y similares. */
export function normalizeLink(raw?: string): string | null {
  const value = raw?.trim();
  if (!value) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString();
  } catch {
    /* cae al error de abajo */
  }
  throw new ValidationError('El enlace debe empezar con "/" (ruta interna) o con https://');
}

export class ManageBannersUseCase {
  constructor(
    private readonly banners: IBannerRepository,
    private readonly storage: IStorageService,
  ) {}

  listAll(): Promise<HeroBanner[]> {
    return this.banners.getAll();
  }

  async listActiveSlides(): Promise<HeroSlide[]> {
    const rows = await this.banners.getActive();
    return rows.map(({ id, imageUrl, title, subtitle, linkUrl }) => ({ id, imageUrl, title, subtitle, linkUrl }));
  }

  async addMany(input: AddBannersInput): Promise<AddBannersResult> {
    const { files } = input;
    if (files.length === 0) throw new ValidationError('Selecciona al menos una imagen.');
    if (files.length > MAX_FILES_PER_UPLOAD) {
      throw new ValidationError(`Máximo ${MAX_FILES_PER_UPLOAD} imágenes por carga.`);
    }

    const title = input.title?.trim().slice(0, 120) || null;
    const subtitle = input.subtitle?.trim().slice(0, 240) || null;
    const linkUrl = normalizeLink(input.linkUrl);

    const warnings: string[] = [];
    let created = 0;
    let order = await this.banners.getNextOrder();

    for (const file of files) {
      try {
        const stored = await this.storage.saveImage(file, 'banner');
        if (stored.width < MIN_BANNER_WIDTH) {
          warnings.push(
            `"${file.name}" mide ${stored.width}×${stored.height}px: en pantallas grandes se verá borrosa (ideal ${1920}×700px).`,
          );
        }
        await this.banners.create({
          title,
          subtitle,
          imageUrl: stored.url,
          linkUrl,
          order: order++,
          isActive: true,
        });
        created++;
      } catch (error) {
        if (!(error instanceof ValidationError)) throw error;
        warnings.push(`Se omitió: ${error.message}`);
      }
    }

    if (created === 0) throw new ValidationError(warnings.join(' '));
    return { created, warnings };
  }

  async remove(id: string): Promise<void> {
    const banner = await this.banners.getById(id);
    if (!banner) return;
    await this.banners.delete(id);
    await this.storage.deleteFile(banner.imageUrl);
  }

  async toggleActive(id: string): Promise<void> {
    const banner = await this.banners.getById(id);
    if (!banner) return;
    await this.banners.setActive(id, !banner.isActive);
  }
}
