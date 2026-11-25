import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** false durante SSR/hidratación y true ya en el navegador (evita parpadeos con datos de localStorage). */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
