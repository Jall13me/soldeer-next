import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HOME_SHORTCUTS, NAV_CATEGORIES, findSubcategory, resolveCategory } from '@/config/categoriesConfig';
import type { Product } from '@/domain/entities/Product';
import { verifyAdminAuth } from '@/lib/auth';
import { formatBs } from '@/lib/format';
import { buildQuoteMessage, buildWhatsAppUrl } from '@/lib/quote-message';
import { getPrimaryImage, getSpecRows, PLACEHOLDER_IMAGE } from '@/lib/product-specs';
import { slugify } from '@/lib/slug';

describe('categorías', () => {
  it('todos los accesos del home resuelven a una categoría real (bug: /catalog?category=maquinas salía vacío)', () => {
    for (const shortcut of HOME_SHORTCUTS) {
      const resolved = resolveCategory(shortcut.slug);
      assert.ok(resolved, `${shortcut.slug} debe existir`);
      assert.ok(resolved.subcategorySlugs.length > 0);
    }
  });

  it('un grupo abarca todas sus subcategorías y una subcategoría solo la suya', () => {
    const group = resolveCategory('maquinas');
    assert.equal(group?.kind, 'group');
    assert.deepEqual(group?.subcategorySlugs, NAV_CATEGORIES[0].subcategories.map((s) => s.slug));
    assert.deepEqual(resolveCategory('mig-mag')?.subcategorySlugs, ['mig-mag']);
    assert.equal(resolveCategory('inventada'), null);
    assert.equal(findSubcategory('maquinas'), null, 'un grupo no es una subcategoría guardable');
  });

  it('no hay slugs duplicados entre grupos y subcategorías', () => {
    const all = NAV_CATEGORIES.flatMap((g) => [g.slug, ...g.subcategories.map((s) => s.slug)]);
    assert.equal(new Set(all).size, all.length);
  });
});

describe('utilidades', () => {
  it('slugify quita acentos y símbolos', () => {
    assert.equal(slugify('  Soldadora Láser 3 en 1 (¡Nueva!) '), 'soldadora-laser-3-en-1-nueva');
    assert.equal(slugify('***'), '');
  });

  it('formatBs es determinista (mismo resultado en servidor y navegador)', () => {
    assert.match(formatBs(4500), /^Bs\. 4[.\u00a0 ]?500$/);
    assert.equal(formatBs(0), 'Bs. 0');
  });

  it('getSpecRows solo devuelve lo que existe; sin fotos usa el placeholder', () => {
    const product = {
      maxAmperage: '500 AMP', workCycle: null, powerSupply: '', weldingProcess: null,
      presentation: null, dimensions: '115x99 mm', images: [],
    } as unknown as Product;
    assert.deepEqual(getSpecRows(product).map((r) => r.label), ['Amperaje máximo', 'Medidas']);
    assert.equal(getPrimaryImage(product), PLACEHOLDER_IMAGE);
  });
});

describe('cotización por WhatsApp', () => {
  const items = [
    { slug: 'mig-250', title: 'Soldadora MIG 250', sku: 'S125', image: '/a.webp', quantity: 2 },
    { slug: 'torcha', title: 'Torcha TIG', sku: null, image: '/b.webp', quantity: 1 },
  ];

  it('arma un mensaje legible con cantidades, SKU y enlaces', () => {
    const msg = buildQuoteMessage(items, { name: 'Juan Pérez', company: 'Metalmec SRL', notes: 'Entrega en Warnes' }, 'https://soldeer.bo');
    assert.match(msg, /• 2 x Soldadora MIG 250 \(SKU S125\)/);
    assert.match(msg, /https:\/\/soldeer\.bo\/products\/mig-250/);
    assert.match(msg, /• 1 x Torcha TIG\n/);
    assert.match(msg, /Contacto: Juan Pérez - Metalmec SRL/);
    assert.match(msg, /Notas: Entrega en Warnes/);
  });

  it('codifica la URL de WhatsApp correctamente', () => {
    const url = buildWhatsAppUrl('59175353583', 'Hola & gracias\n¿precio?');
    assert.equal(url, 'https://wa.me/59175353583?text=' + encodeURIComponent('Hola & gracias\n¿precio?'));
  });
});

describe('autenticación del admin (verifyAdminAuth)', () => {
  const basic = (user: string, pass: string) => `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
  const withEnv = (env: Record<string, string | undefined>, fn: () => void) => {
    const saved = { ...process.env };
    Object.assign(process.env, env);
    for (const [k, v] of Object.entries(env)) if (v === undefined) delete process.env[k];
    try { fn(); } finally { process.env = saved; }
  };

  it('acepta credenciales correctas y rechaza incorrectas o ausentes', () => {
    withEnv({ ADMIN_USER: 'admin', ADMIN_PASSWORD: 's3cret:con-dos-puntos', NODE_ENV: 'production' }, () => {
      assert.equal(verifyAdminAuth(basic('admin', 's3cret:con-dos-puntos')), 'ok');
      assert.equal(verifyAdminAuth(basic('admin', 'mala')), 'unauthorized');
      assert.equal(verifyAdminAuth(basic('otro', 's3cret:con-dos-puntos')), 'unauthorized');
      assert.equal(verifyAdminAuth(null), 'unauthorized');
      assert.equal(verifyAdminAuth('Bearer abc'), 'unauthorized');
      assert.equal(verifyAdminAuth('Basic %%%'), 'unauthorized');
    });
  });

  it('en producción sin variables el admin queda bloqueado (fail closed); en desarrollo pasa', () => {
    withEnv({ ADMIN_USER: undefined, ADMIN_PASSWORD: undefined, NODE_ENV: 'production' }, () => {
      assert.equal(verifyAdminAuth(null), 'misconfigured');
    });
    withEnv({ ADMIN_USER: undefined, ADMIN_PASSWORD: undefined, NODE_ENV: 'development' }, () => {
      assert.equal(verifyAdminAuth(null), 'ok');
    });
  });
});
