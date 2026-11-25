import { useSyncExternalStore } from 'react';

export interface QuoteItem {
  slug: string;
  title: string;
  sku: string | null;
  image: string;
  price: number; // <-- Añadido para calcular el total
  quantity: number;
}

const STORAGE_KEY = 'soldeer.quote.v1';
const MAX_QUANTITY = 999;
const EMPTY: readonly QuoteItem[] = Object.freeze([]);

let state: readonly QuoteItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function isQuoteItem(value: unknown): value is QuoteItem {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.slug === 'string' &&
    typeof v.title === 'string' &&
    typeof v.image === 'string' &&
    (v.sku === null || typeof v.sku === 'string') &&
    typeof v.price === 'number' &&
    typeof v.quantity === 'number'
  );
}

function load(): readonly QuoteItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isQuoteItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function commit(next: readonly QuoteItem[]) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* modo privado */
  }
  emit();
}

function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity) || 1));
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      state = load();
      emit();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): readonly QuoteItem[] {
  if (!hydrated) {
    hydrated = true;
    state = load();
  }
  return state;
}

function getServerSnapshot(): readonly QuoteItem[] {
  return EMPTY;
}

export const quoteActions = {
  add(item: Omit<QuoteItem, 'quantity'>, quantity = 1) {
    const current = getSnapshot();
    const existing = current.find((i) => i.slug === item.slug);
    if (existing) {
      commit(
        current.map((i) =>
          i.slug === item.slug ? { ...i, quantity: clampQuantity(i.quantity + quantity) } : i,
        ),
      );
    } else {
      commit([...current, { ...item, quantity: clampQuantity(quantity) }]);
    }
  },
  setQuantity(slug: string, quantity: number) {
    commit(getSnapshot().map((i) => (i.slug === slug ? { ...i, quantity: clampQuantity(quantity) } : i)));
  },
  remove(slug: string) {
    commit(getSnapshot().filter((i) => i.slug !== slug));
  },
  clear() {
    commit(EMPTY);
  },
};

export function useQuote() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = items.reduce((total, item) => total + item.quantity, 0);
  return { items, count };
}