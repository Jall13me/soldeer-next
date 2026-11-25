# Soldeer — Portal B2B de soldadura industrial

Next.js 16 · React 19 · Prisma + PostgreSQL · Tailwind 4 · Clean Architecture

## Arranque rápido

```bash
cp .env.example .env          # edita contraseñas y credenciales del admin
docker compose up -d          # PostgreSQL (127.0.0.1:8090)
npm install                   # también genera el cliente de Prisma
npm run db:push               # crea/actualiza las tablas
npm run dev                   # http://localhost:3000
```

Admin: `/admin/products` y `/admin/banners` (pide `ADMIN_USER` / `ADMIN_PASSWORD`).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` / `build` / `start` | Desarrollo, compilación y producción |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run lint` | ESLint |
| `npm test` | Pruebas de casos de uso, almacenamiento (sharp), auth y utilidades |
| `npm run db:push` / `db:studio` | Sincronizar esquema / explorar datos |

## Arquitectura

```
src/
  domain/          Entidades, errores e INTERFACES (repositorios, storage). Sin dependencias externas.
  application/     Casos de uso: BrowseCatalog, ManageProducts, ManageBanners (reglas de negocio).
  infrastructure/  Prisma, sharp/disco y container.ts (único lugar que conecta implementaciones).
  app/             Rutas de Next (presentación): páginas finas + Server Actions.
  components/      UI. config/ datos del negocio. lib/ utilidades puras.
tests/             node:test + repositorios/almacenamiento falsos (sin BD).
```

Regla de dependencias: `app/components → application → domain ← infrastructure`.
Para cambiar el almacenamiento (S3, Cloudinary) basta una nueva clase que implemente
`IStorageService` y cambiar una línea en `infrastructure/container.ts`.

## Imágenes

El admin acepta JPG/PNG/WebP/AVIF (máx. 10 MB c/u), valida el contenido real y las
convierte a **WebP** (banner ≤1920 px, producto ≤1600 px). Se guardan en `UPLOAD_DIR`
(por defecto `./storage/uploads`, fuera de `public/`) y se sirven por `/uploads/*`.
En producción monta esa carpeta como volumen persistente.

Medidas ideales: banner **1920×700**, producto **1200×900 (4:3, fondo blanco)**, logo SVG/WebP.
