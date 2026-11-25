'use server';

import { manageProducts } from '@/infrastructure/container';
import type { ActionState } from '../_lib/action-state';
import { checkbox, files, optionalNumber, text } from '../_lib/form-data';
import { runAdminAction, runAdminCommand } from '../_lib/run-action';

export async function createProductAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return runAdminAction(async () => {
    const { product, warnings } = await manageProducts.create({
      title: text(formData, 'title'),
      description: text(formData, 'description'),
      price: optionalNumber(formData, 'price') ?? Number.NaN,
      offerPrice: optionalNumber(formData, 'offerPrice'),
      sku: text(formData, 'sku'),
      subcategorySlug: text(formData, 'categorySlug'),
      isFeatured: checkbox(formData, 'isFeatured'),
      maxAmperage: text(formData, 'maxAmperage'),
      workCycle: text(formData, 'workCycle'),
      powerSupply: text(formData, 'powerSupply'),
      weldingProcess: text(formData, 'weldingProcess'),
      presentation: text(formData, 'presentation'),
      dimensions: text(formData, 'dimensions'),
      files: files(formData, 'imageFiles'),
    });
    return { message: `“${product.title}” se guardó correctamente.`, warnings };
  });
}

export async function deleteProductAction(id: string): Promise<void> {
  await runAdminCommand(() => manageProducts.remove(id));
}

export async function togglePublishedAction(id: string): Promise<void> {
  await runAdminCommand(() => manageProducts.togglePublished(id));
}

export async function toggleFeaturedAction(id: string): Promise<void> {
  await runAdminCommand(() => manageProducts.toggleFeatured(id));
}
