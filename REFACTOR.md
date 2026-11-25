# Refactorización Soldeer — qué cambió y cómo aplicarlo

## Cómo aplicarlo (5 pasos)

1. Respalda tu proyecto y **extrae este ZIP encima** (no incluye tu `.env`, `node_modules` ni `public/uploads`).
2. Agrega a tu `.env` las variables nuevas de `.env.example` (`ADMIN_USER`, `ADMIN_PASSWORD`, `POSTGRES_PASSWORD`).
   `POSTGRES_PASSWORD` debe ser **la misma** que ya usa tu base actual.
3. `npm install` (nuevas dependencias: `sharp`, `server-only`, `tsx`; `@prisma/client` pasó a `dependencies`).
4. `npm run db:push` — agrega `updatedAt`, `isFeatured` y precisión decimal. No borra datos.
5. `npm run dev`. Tus fotos viejas de `public/uploads` siguen funcionando (la ruta `/uploads/*` las encuentra).

## Errores corregidos (de tu versión)

| Problema | Solución |
|---|---|
| `next build` fallaba: `HeroBanner.updatedAt` no existía en el esquema (4 errores TS) | Campo agregado al esquema |
| La descripción del producto **no se guardaba** (se perdió en tu último cambio) | Restaurada, con textarea en el formulario |
| La acción del admin escribía archivos directo en `public/` (sin validar, `Date.now()` + nombre original) | Todo pasa por `IStorageService` |
| Specs "N/D" guardadas como texto y mostradas en todos los productos | `null` en dominio; la ficha solo muestra lo que existe |
| `/catalog?category=maquinas` (accesos del home) salía vacío | `resolveCategory` entiende grupos y subcategorías |
| El filtro usaba `contains` sobre el slug (mezclaba categorías) | Filtro exacto `slug IN (...)` |
| Subidas en `public/uploads` no se sirven en producción | Carpeta `UPLOAD_DIR` + ruta `/uploads/*` con caché inmutable |
| Banners con el nombre del archivo como título (`612336352_...png`) | Título opcional real |
| `/cart` no existía; el botón de cotización no hacía nada | Carrito de cotización + envío por WhatsApp |
| No había menú en celular | Menú móvil con acordeón |
| `@prisma/client` en `devDependencies` | Movido a `dependencies`, `postinstall: prisma generate` |
| Al borrar producto/banner quedaban fotos huérfanas | Se borran con el registro |
| Footer solo en el home; texto "Sube imágenes en el admin" visible al público | Footer global; hero por defecto limpio |
| Mapa con coordenadas inventadas | Tu `BranchSelector` (3 sucursales) movido a `config/branches.ts` |

## Seguridad nueva

- `/admin` protegido con autenticación Basic (`proxy.ts`) **y** re-verificada dentro de cada Server Action.
  Sin `ADMIN_USER/ADMIN_PASSWORD` en producción el admin queda bloqueado (fail closed).
- Validación real de imágenes (contenido, no `file.type`), rechazo de SVG, límite de peso y de píxeles.
- `docker-compose`: sin contraseña escrita en el archivo y puerto solo en `127.0.0.1`.
- Enlaces de banners restringidos a `/ruta` o `https://`. Cabeceras de seguridad HTTP.

## Principios aplicados

- **S**: casos de uso con una responsabilidad; acciones del admin de ~10 líneas; `runAdminAction` centraliza permisos/errores.
- **O**: nuevos almacenamientos o repositorios sin tocar los casos de uso.
- **L**: los casos de uso funcionan igual con repositorios Prisma o en memoria (las pruebas lo demuestran).
- **I**: `IProductReader` (catálogo público) separado de `IProductWriter` (admin).
- **D**: casos de uso dependen de interfaces; `container.ts` es la única raíz de composición.
- Clean code: sin números/strings mágicos duplicados, `PriceTag`/`ProductCard` compartidos, tema Tailwind (`bg-brand`) en vez de `#0d9488` repetido ~80 veces.

## Notas que debes revisar

- **Dirección central**: en tu `BranchSelector` la sucursal central dice "Av. Beni / Zona Norte". La dirección anterior (3er Anillo Interno #420) ya no aparece en ningún lado; el footer, About y PDF usan `PRIMARY_BRANCH`. Edita `src/config/branches.ts` si quieres restaurarla.
- `layout.tsx` sigue usando `next/font/google` (Inter), como tenías.
- Pendiente recomendado: edición de productos, paginación del catálogo, `sitemap.xml`, y cachear el home con `'use cache'` + `updateTag` (requiere BD disponible en el build).
