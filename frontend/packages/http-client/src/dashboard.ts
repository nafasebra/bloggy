import { createHttpClient } from './client';

const env = (
  import.meta as ImportMeta & {
    env: { DEV: boolean; VITE_API_URL?: string };
  }
).env;

/** Shared dashboard singleton; Vite supplies the application's environment. */
const http = createHttpClient({
  baseURL: env.DEV ? '/api' : env.VITE_API_URL || 'http://localhost:3030',
});

export default http;
