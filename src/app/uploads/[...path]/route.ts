import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SAFE_FILENAME, getLegacyUploadDir, getUploadDir } from '@/infrastructure/services/uploadPaths';

const MIME_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.avif': 'image/avif',
};

const notFound = () => new Response('Not found', { status: 404 });

/**
 * Sirve las imágenes subidas desde una carpeta FUERA de /public.
 * Next solo sirve desde /public lo que existía al compilar, así que las subidas
 * del admin nunca aparecían en producción. Este handler lo resuelve.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  if (segments.length !== 1) return notFound();

  const fileName = segments[0];
  const contentType = MIME_TYPES[path.extname(fileName).toLowerCase()];
  if (!SAFE_FILENAME.test(fileName) || fileName.includes('..') || !contentType) return notFound();

  const candidates = [
    { dir: getUploadDir(), immutable: true },
    // Subidas antiguas (public/uploads): el nombre podría reutilizarse, caché corta.
    { dir: getLegacyUploadDir(), immutable: false },
  ];

  for (const { dir, immutable } of candidates) {
    try {
      const file = await readFile(path.join(dir, fileName));
      return new Response(new Uint8Array(file), {
        headers: {
          'Content-Type': contentType,
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
        },
      });
    } catch {
      /* probar la siguiente carpeta */
    }
  }
  return notFound();
}
