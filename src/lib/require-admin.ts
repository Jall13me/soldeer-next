import 'server-only';
import { headers } from 'next/headers';
import { verifyAdminAuth } from '@/lib/auth';

/**
 * Defensa en profundidad: las Server Actions son endpoints públicos, así que
 * cada acción del admin vuelve a verificar la sesión además del proxy.
 */
export async function requireAdmin(): Promise<void> {
  const h = await headers();
  if (verifyAdminAuth(h.get('authorization')) !== 'ok') {
    throw new Error('No autorizado');
  }
}
