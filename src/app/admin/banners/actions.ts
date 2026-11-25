'use server';

import { manageBanners } from '@/infrastructure/container';
import type { ActionState } from '../_lib/action-state';
import { files, text } from '../_lib/form-data';
import { runAdminAction, runAdminCommand } from '../_lib/run-action';

export async function uploadBannersAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return runAdminAction(async () => {
    const { created, warnings } = await manageBanners.addMany({
      files: files(formData, 'imageFiles'),
      title: text(formData, 'title'),
      subtitle: text(formData, 'subtitle'),
      linkUrl: text(formData, 'linkUrl'),
    });
    return { message: `${created} ${created === 1 ? 'banner subido' : 'banners subidos'} y optimizados.`, warnings };
  });
}

export async function deleteBannerAction(id: string): Promise<void> {
  await runAdminCommand(() => manageBanners.remove(id));
}

export async function toggleBannerAction(id: string): Promise<void> {
  await runAdminCommand(() => manageBanners.toggleActive(id));
}
