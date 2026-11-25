'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children, pendingLabel = 'Guardando…' }: { children: React.ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-bold text-white shadow transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
