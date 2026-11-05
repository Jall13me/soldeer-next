export interface IStorageService {
  uploadFile(file: File): Promise<string>; // Devuelve la URL pública relativa /uploads/...
  deleteFile(fileUrl: string): Promise<void>;
}