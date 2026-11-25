import { timingSafeEqual } from 'node:crypto';

export type AdminAuthResult = 'ok' | 'unauthorized' | 'misconfigured';

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  // Se comparan hashes de igual largo para no filtrar el tamaño de la clave.
  if (ba.length !== bb.length) {
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

/**
 * Valida el header `Authorization: Basic ...` contra ADMIN_USER / ADMIN_PASSWORD.
 * - En producción, si faltan las variables, el admin queda BLOQUEADO (fail closed).
 * - En desarrollo sin variables se permite el paso para no estorbar.
 */
export function verifyAdminAuth(authorizationHeader: string | null): AdminAuthResult {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return process.env.NODE_ENV === 'production' ? 'misconfigured' : 'ok';
  }

  if (!authorizationHeader?.startsWith('Basic ')) return 'unauthorized';

  let decoded = '';
  try {
    decoded = Buffer.from(authorizationHeader.slice(6), 'base64').toString('utf8');
  } catch {
    return 'unauthorized';
  }

  const separator = decoded.indexOf(':');
  if (separator === -1) return 'unauthorized';

  const okUser = safeEqual(decoded.slice(0, separator), user);
  const okPass = safeEqual(decoded.slice(separator + 1), password);
  return okUser && okPass ? 'ok' : 'unauthorized';
}
