/** Lectura segura de FormData (en vez de `formData.get(...) as string` repetido en cada acción). */
export function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on';
}

export function files(formData: FormData, key: string): File[] {
  return formData.getAll(key).filter((value): value is File => value instanceof File && value.size > 0);
}

/** "4.500,50" o "4500.5" → número. Vacío → null. Texto inválido → NaN (lo rechaza el caso de uso). */
export function optionalNumber(formData: FormData, key: string): number | null {
  const raw = text(formData, key).trim();
  if (!raw) return null;
  return Number(raw.replace(/\s/g, '').replace(',', '.'));
}
