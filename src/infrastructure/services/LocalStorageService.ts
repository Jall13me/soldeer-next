import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp, { type OutputInfo } from 'sharp';
import { ValidationError } from '@/domain/errors';
import type { IStorageService, ImageProfile, StoredImage } from '@/domain/services/IStorageService';
import { SAFE_FILENAME, UPLOAD_URL_PREFIX, getLegacyUploadDir, getUploadDir } from './uploadPaths';

const PROFILES: Record<ImageProfile, { maxWidth: number; maxHeight: number }> = {
  // Hero a pantalla completa: 1920 px de ancho cubre monitores Full HD.
  banner: { maxWidth: 1920, maxHeight: 1080 },
  // Fotos de producto: 1600 px permiten zoom sin pesar de más.
  product: { maxWidth: 1600, maxHeight: 1600 },
};

const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif']);
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) > 0 ? Number(process.env.MAX_UPLOAD_MB) : 10;

export class LocalStorageService implements IStorageService {
  async saveImage(file: File, profile: ImageProfile): Promise<StoredImage> {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      throw new ValidationError(`"${file.name}" pesa más de ${MAX_UPLOAD_MB} MB.`);
    }

    const input = Buffer.from(await file.arrayBuffer());
    const { maxWidth, maxHeight } = PROFILES[profile];

    let output: { data: Buffer; info: OutputInfo };
    try {
      const pipeline = sharp(input, { limitInputPixels: 80_000_000 });
      // Se valida el contenido real (no el `file.type`, que lo controla el cliente).
      const meta = await pipeline.metadata();
      if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) {
        throw new ValidationError(`"${file.name}" no es JPG, PNG, WebP o AVIF.`);
      }

      output = await pipeline
        .rotate() // respeta la orientación EXIF de las fotos de celular
        .resize({ width: maxWidth, height: maxHeight, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer({ resolveWithObject: true });
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new ValidationError(`"${file.name}" no se pudo leer como imagen.`);
    }

    const uploadDir = getUploadDir();
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${randomUUID()}.webp`;
    await writeFile(path.join(uploadDir, fileName), output.data);

    return {
      url: `${UPLOAD_URL_PREFIX}${fileName}`,
      width: output.info.width,
      height: output.info.height,
      bytes: output.data.length,
    };
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl.startsWith(UPLOAD_URL_PREFIX)) return;
    const fileName = path.basename(fileUrl);
    if (!SAFE_FILENAME.test(fileName)) return;

    // Borra de la carpeta nueva y de la antigua (public/uploads); si no existe, se ignora.
    for (const dir of [getUploadDir(), getLegacyUploadDir()]) {
      try {
        await unlink(path.join(dir, fileName));
      } catch {
        /* archivo ya inexistente */
      }
    }
  }
}
