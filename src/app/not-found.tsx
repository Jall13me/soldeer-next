import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-5xl" aria-hidden="true">🔧</p>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">No encontramos esta página</h1>
      <p className="mt-2 text-sm text-slate-600">
        El producto o la sección que buscas ya no está disponible o el enlace cambió.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/catalog" className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">
          Ver catálogo
        </Link>
        <Link href="/" className="rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200">
          Ir al inicio
        </Link>
      </div>
    </section>
  );
}
