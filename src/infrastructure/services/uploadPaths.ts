import path from 'node:path';

/**
 * Dónde viven las imágenes subidas.
 * Por defecto ./storage/uploads (FUERA de /public, para que funcione en producción
 * con `next start` y se pueda montar como volumen persistente en Docker/VPS).
 * `legacyDir` conserva las subidas antiguas que estaban en public/uploads.
 */
export function getUploadDir(): string {
  return process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), 'storage', 'uploads');
}

export function getLegacyUploadDir(): string {
  return path.join(process.cwd(), 'public', 'uploads');
}

export const UPLOAD_URL_PREFIX = '/uploads/';
export const SAFE_FILENAME = /^[A-Za-z0-9._-]+$/;
