import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { ManageBannersUseCase, normalizeLink } from '@/application/use-cases/ManageBanners';
import { ValidationError } from '@/domain/errors';
import { FakeStorage, InMemoryBannerRepository, fakeFile } from './helpers/fakes';

describe('ManageBannersUseCase', () => {
  let repo: InMemoryBannerRepository;
  let storage: FakeStorage;
  let useCase: ManageBannersUseCase;

  beforeEach(() => {
    repo = new InMemoryBannerRepository();
    storage = new FakeStorage();
    useCase = new ManageBannersUseCase(repo, storage);
  });

  it('crea banners en orden y SIN usar el nombre del archivo como título', async () => {
    const { created } = await useCase.addMany({ files: [fakeFile('612336352_n.png'), fakeFile('b.jpg')] });
    assert.equal(created, 2);
    assert.deepEqual(repo.items.map((b) => b.order), [0, 1]);
    assert.equal(repo.items[0].title, null);
  });

  it('continúa con las imágenes válidas y reporta las omitidas', async () => {
    storage.rejectNames.add('mala.pdf');
    const result = await useCase.addMany({ files: [fakeFile('ok.jpg'), fakeFile('mala.pdf')] });
    assert.equal(result.created, 1);
    assert.match(result.warnings.join(' '), /mala\.pdf/);
  });

  it('falla si ninguna imagen es válida', async () => {
    storage.rejectNames.add('x.pdf');
    await assert.rejects(useCase.addMany({ files: [fakeFile('x.pdf')] }), ValidationError);
  });

  it('avisa si el banner es más pequeño de lo recomendado', async () => {
    storage.width = 851;
    const { warnings } = await useCase.addMany({ files: [fakeFile('chico.png')] });
    assert.match(warnings[0], /851/);
  });

  it('eliminar borra el registro y su archivo; ocultar alterna el estado', async () => {
    await useCase.addMany({ files: [fakeFile('a.jpg')] });
    const banner = repo.items[0];

    await useCase.toggleActive(banner.id);
    assert.equal(repo.items[0].isActive, false);
    assert.equal((await useCase.listActiveSlides()).length, 0);

    await useCase.remove(banner.id);
    assert.equal(repo.items.length, 0);
    assert.deepEqual(storage.deleted, [banner.imageUrl]);
  });
});

describe('normalizeLink', () => {
  it('acepta rutas internas y http(s)', () => {
    assert.equal(normalizeLink('/catalog?category=mig-mag'), '/catalog?category=mig-mag');
    assert.equal(normalizeLink('https://soldeer.bo/promo'), 'https://soldeer.bo/promo');
    assert.equal(normalizeLink('   '), null);
    assert.equal(normalizeLink(undefined), null);
  });

  it('rechaza esquemas peligrosos y rutas ambiguas', () => {
    assert.throws(() => normalizeLink('javascript:alert(1)'), ValidationError);
    assert.throws(() => normalizeLink('//evil.com'), ValidationError);
    assert.throws(() => normalizeLink('catalogo'), ValidationError);
  });
});
