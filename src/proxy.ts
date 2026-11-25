import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';

/** Protege /admin (páginas y Server Actions) con autenticación Basic. */
export function proxy(request: NextRequest) {
  const result = verifyAdminAuth(request.headers.get('authorization'));

  if (result === 'ok') return NextResponse.next();

  if (result === 'misconfigured') {
    return new NextResponse('Admin deshabilitado: define ADMIN_USER y ADMIN_PASSWORD en el servidor.', {
      status: 503,
    });
  }

  return new NextResponse('Autenticación requerida', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Soldeer Admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
