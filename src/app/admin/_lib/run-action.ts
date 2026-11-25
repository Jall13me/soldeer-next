import 'server-only';
import { revalidatePath } from 'next/cache';
import { ValidationError } from '@/domain/errors';
import { requireAdmin } from '@/lib/require-admin';
import type { ActionState } from './action-state';

interface ActionSuccess {
  message: string;
  warnings?: string[];
}

/**
 * Envoltorio común de las acciones con formulario: verifica sesión, ejecuta,
 * traduce errores de validación a mensajes y refresca la tienda.
 */
export async function runAdminAction(task: () => Promise<ActionSuccess>): Promise<ActionState> {
  try {
    await requireAdmin();
    const { message, warnings = [] } = await task();
    revalidateStorefront();
    return { status: 'success', message, warnings };
  } catch (error) {
    if (error instanceof ValidationError) return { status: 'error', message: error.message };
    console.error('[admin] acción fallida:', error);
    return { status: 'error', message: 'Ocurrió un error inesperado. Intenta de nuevo.' };
  }
}

/** Acciones sin formulario (eliminar, ocultar...): si algo falla, lo maneja el error boundary. */
export async function runAdminCommand(task: () => Promise<void>): Promise<void> {
  await requireAdmin();
  await task();
  revalidateStorefront();
}

function revalidateStorefront() {
  revalidatePath('/', 'layout');
}
