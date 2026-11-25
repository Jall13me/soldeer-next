import type { NextConfig } from 'next';

const UPLOAD_BODY_LIMIT = '60mb'; // hasta 8 fotos de 10 MB (el valor por defecto de Next es 1 MB)

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
    serverActions: { bodySizeLimit: UPLOAD_BODY_LIMIT },
    // El proxy (auth del admin) bufferiza el cuerpo de la petición: sin esto cortaría subidas > 10 MB.
    proxyClientMaxBodySize: UPLOAD_BODY_LIMIT,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
