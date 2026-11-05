import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { IStorageService } from '@/domain/services/IStorageService';

export class LocalStorageService implements IStorageService {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  async uploadFile(file: File): Promise<string> {
    // Asegurar que exista el directorio public/uploads
    await mkdir(this.uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    // Evitar colisiones de nombres con timestamp y sanitized filename
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    await writeFile(filePath, buffer);

    // Retorna la ruta accesible desde la web
    return `/uploads/${uniqueName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl.startsWith('/uploads/')) return;
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, fileName);
      await unlink(filePath);
    } catch {
      // Si el archivo físico ya no existe, ignorar el error
    }
  }
}