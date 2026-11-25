/** Define cómo se redimensiona/optimiza cada tipo de imagen. */
export type ImageProfile = 'banner' | 'product';

export interface StoredImage {
  /** URL pública (ej. /uploads/abc.webp). */
  url: string;
  width: number;
  height: number;
  bytes: number;
}

export interface IStorageService {
  /** Valida que sea una imagen real, la optimiza (WebP) y la guarda. Lanza ValidationError si no sirve. */
  saveImage(file: File, profile: ImageProfile): Promise<StoredImage>;
  deleteFile(fileUrl: string): Promise<void>;
}
