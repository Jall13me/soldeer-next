import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import sharp from 'sharp';
import { ValidationError } from '@/domain/errors';
import { LocalStorageService } from '@/infrastructure/services/LocalStorageService';

let dir: string;
const service = new LocalStorageService();

const makeImage = async (width: number, height: number, format: 'jpeg' | 'png' = 'jpeg') => {
  // Ruido aleatorio: una imagen realista que comprime como una foto, no como un color plano.
  const raw = Buffer.alloc(width * height * 3);
  for (let i = 0; i < raw.length; i++) raw[i] = (i * 31 + ((i * 7919) % 251)) & 255;
  const buffer = await sharp(raw, { raw: { width, height, channels: 3 } })[format]().toBuffer();
  return new File([new Uint8Array(buffer)], `foto.${format}`, { type: `image/${format}` });
};

describe('LocalStorageService (sharp)', () => {
  before(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'soldeer-'));
    process.env.UPLOAD_DIR = dir;
  });
  after(async () => {
    delete process.env.UPLOAD_DIR;
    await rm(dir, { recursive: true, force: true });
  });

  it('convierte a WebP, limita el ancho del banner a 1920 px y reduce el peso', async () => {
    const file = await makeImage(3000, 1000);
    const stored = await service.saveImage(file, 'banner');

    assert.match(stored.url, /^\/uploads\/[0-9a-f-]{36}\.webp$/);
    assert.equal(stored.width, 1920);
    assert.ok(stored.bytes < file.size, `WebP (${stored.bytes}) debe pesar menos que el original (${file.size})`);

    const onDisk = await sharp(await readFile(path.join(dir, path.basename(stored.url)))).metadata();
    assert.equal(onDisk.format, 'webp');
    assert.equal(onDisk.width, 1920);
  });

  it('limita productos a 1600 px y NO agranda imágenes pequeñas', async () => {
    const big = await service.saveImage(await makeImage(4000, 3000), 'product');
    assert.equal(big.width, 1600);
    assert.equal(big.height, 1200);

    const small = await service.saveImage(await makeImage(851, 312, 'png'), 'banner');
    assert.equal(small.width, 851, 'no debe ampliar (se vería borrosa)');
  });

  it('rechaza archivos que no son imágenes aunque el nombre/tipo digan lo contrario', async () => {
    const fake = new File([new TextEncoder().encode('esto no es una imagen')], 'virus.png', { type: 'image/png' });
    await assert.rejects(service.saveImage(fake, 'product'), ValidationError);
  });

  it('rechaza SVG (riesgo de XSS) y archivos demasiado pesados', async () => {
    const svg = new File(['<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>alert(1)</script></svg>'], 'x.svg', {
      type: 'image/svg+xml',
    });
    await assert.rejects(service.saveImage(svg, 'product'), ValidationError);

    const huge = { size: 11 * 1024 * 1024, name: 'enorme.jpg', arrayBuffer: async () => new ArrayBuffer(0) } as unknown as File;
    await assert.rejects(service.saveImage(huge, 'product'), /más de 10 MB/);
  });

  it('deleteFile borra el archivo y es seguro ante rutas maliciosas', async () => {
    const stored = await service.saveImage(await makeImage(800, 600), 'product');
    const filePath = path.join(dir, path.basename(stored.url));
    assert.ok(existsSync(filePath));

    await service.deleteFile('/uploads/../../etc/passwd'); // no debe lanzar ni borrar nada fuera
    await service.deleteFile('https://externo.com/x.webp'); // ignora URLs externas
    assert.ok(existsSync(filePath));

    await service.deleteFile(stored.url);
    assert.equal(existsSync(filePath), false);
  });
});
