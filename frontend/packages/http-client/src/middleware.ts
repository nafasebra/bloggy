import type { AxiosInstance } from 'axios';

/** Installs interceptors and returns a function that removes them. */
export type HttpMiddleware = (client: AxiosInstance) => () => void;

export function applyHttpMiddleware(
  client: AxiosInstance,
  middlewares: readonly HttpMiddleware[]
): () => void {
  const cleanups: (() => void)[] = [];
  const dispose = () => {
    for (const cleanup of cleanups.splice(0).reverse()) cleanup();
  };
  try {
    for (const middleware of middlewares) cleanups.push(middleware(client));
  } catch (error) {
    dispose();
    throw error;
  }
  return dispose;
}
