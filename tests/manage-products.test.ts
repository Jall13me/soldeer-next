import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { ManageProductsUseCase, type CreateProductInput } from '@/application/use-cases/ManageProducts';
import { ValidationError } from '@/domain/errors';
import { FakeStorage, InMemoryProductRepository, fakeFile } from './helpers/fakes';

const baseInput = (over: Partial<CreateProductInput> = {}): CreateProductInput => ({
  title: 'Soldadora MIG Lión 250',
  price: 4500,
  subcategorySlug: 'mig-mag',
  isFeatured: false,
  files: [fakeFile()],
  ...over,
});

describe('ManageProductsUseCase.create', () => {
  let repo: InMemoryProductRepository;
  let storage: FakeStorage;
  let useCase: ManageProductsUseCase;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    storage = new FakeStorage();
    useCase = new ManageProductsUseCase(repo, storage);
  });

  it('guarda la categoría correcta, la descripción y datos reales (bug de categorías y descripción perdida)', async () => {
    const { product } = await useCase.create(
      baseInput({ subcategorySlug: 'electrodos', description: '  Electrodo E7018  ', maxAmperage: '500 AMP', sku: ' S-1 ' }),
    );
    assert.equal(product.category.slug, 'electrodos');
    assert.equal(product.category.name, 'Electrodos Revestidos');
    assert.equal(product.description, 'Electrodo E7018');
    assert.equal(product.maxAmperage, '500 AMP');
    assert.equal(product.workCycle, null); // ya no se inventan especificaciones
    assert.equal(product.sku, 'S-1');
  });

  it('genera slugs limpios y únicos sin Date.now()', async () => {
    const a = await useCase.create(baseInput({ title: 'Máscara Fotosensible Ñandú' }));
    const b = await useCase.create(baseInput({ title: 'Máscara Fotosensible Ñandú' }));
    assert.equal(a.product.slug, 'mascara-fotosensible-nandu');
    assert.equal(b.product.slug, 'mascara-fotosensible-nandu-2');
  });

  it('permite crear sin fotos (se mostrará el placeholder)', async () => {
    const { product } = await useCase.create(baseInput({ files: [] }));
    assert.deepEqual(product.images, []);
  });

  it('rechaza subcategorías inexistentes, precios inválidos y ofertas mayores al precio', async () => {
    await assert.rejects(useCase.create(baseInput({ subcategorySlug: 'no-existe' })), ValidationError);
    await assert.rejects(useCase.create(baseInput({ price: Number.NaN })), ValidationError);
    await assert.rejects(useCase.create(baseInput({ price: -1 })), ValidationError);
    await assert.rejects(useCase.create(baseInput({ offerPrice: 5000 })), ValidationError);
    await assert.rejects(useCase.create(baseInput({ title: 'ab' })), ValidationError);
    assert.equal(repo.items.length, 0);
    assert.equal(storage.saved.length, 0, 'no debe guardar fotos si la validación falla antes');
  });

  it('avisa (sin bloquear) cuando una foto es muy pequeña', async () => {
    storage.width = 500;
    const { warnings } = await useCase.create(baseInput());
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /borrosa/);
  });

  it('limpia las fotos ya guardadas si una imagen posterior es inválida', async () => {
    storage.rejectNames.add('mala.txt');
    await assert.rejects(useCase.create(baseInput({ files: [fakeFile('ok.jpg'), fakeFile('mala.txt')] })), ValidationError);
    assert.deepEqual(storage.deleted, storage.saved);
    assert.equal(repo.items.length, 0);
  });

  it('limpia las fotos si falla la base de datos (antes quedaban huérfanas)', async () => {
    repo.failOnCreate = true;
    await assert.rejects(useCase.create(baseInput({ files: [fakeFile('a.jpg'), fakeFile('b.jpg')] })), /db down/);
    assert.equal(storage.deleted.length, 2);
  });
});

describe('ManageProductsUseCase: eliminar y alternar', () => {
  it('al eliminar un producto borra también sus fotos', async () => {
    const repo = new InMemoryProductRepository();
    const storage = new FakeStorage();
    const useCase = new ManageProductsUseCase(repo, storage);
    const { product } = await useCase.create(baseInput({ files: [fakeFile('a.jpg'), fakeFile('b.jpg')] }));

    await useCase.remove(product.id);

    assert.equal(repo.items.length, 0);
    assert.deepEqual(storage.deleted.sort(), [...product.images].sort());
  });

  it('alterna publicado y destacado', async () => {
    const repo = new InMemoryProductRepository();
    const useCase = new ManageProductsUseCase(repo, new FakeStorage());
    const { product } = await useCase.create(baseInput());

    await useCase.togglePublished(product.id);
    await useCase.toggleFeatured(product.id);
    assert.equal(repo.items[0].isPublished, false);
    assert.equal(repo.items[0].isFeatured, true);

    await useCase.togglePublished(product.id);
    assert.equal(repo.items[0].isPublished, true);
  });
});
