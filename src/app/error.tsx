'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-5xl" aria-hidden="true">⚠️</p>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Algo salió mal</h1>
      <p className="mt-2 text-sm text-slate-600">
        No pudimos cargar esta sección. Intenta de nuevo; si el problema continúa, escríbenos por WhatsApp.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
      >
        Reintentar
      </button>
    </section>
  );
}
