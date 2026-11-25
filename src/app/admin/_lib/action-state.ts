/** Resultado que las Server Actions devuelven a los formularios (useActionState). */
export type ActionState =
  | { status: 'idle' }
  | { status: 'success'; message: string; warnings: string[] }
  | { status: 'error'; message: string };

export const IDLE_STATE: ActionState = { status: 'idle' };
