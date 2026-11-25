import type { ActionState } from '@/app/admin/_lib/action-state';

/** Muestra el resultado de una acción: éxito, avisos (imagen pequeña...) o error. */
export function FormFeedback({ state }: { state: ActionState }) {
  if (state.status === 'idle') return null;

  if (state.status === 'error') {
    return (
      <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
        {state.message}
      </p>
    );
  }

  return (
    <div role="status" className="space-y-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
      <p className="font-semibold">✔ {state.message}</p>
      {state.warnings.map((warning) => (
        <p key={warning} className="text-amber-700">
          ⚠ {warning}
        </p>
      ))}
    </div>
  );
}
