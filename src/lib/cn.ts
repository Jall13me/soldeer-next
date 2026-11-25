/** Une clases de Tailwind ignorando valores vacíos: cn('a', cond && 'b'). */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
