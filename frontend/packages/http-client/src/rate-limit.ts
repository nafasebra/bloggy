import type { AxiosError, AxiosInstance } from 'axios';

export const RATE_LIMIT_PATH = '/rate-limited';

let redirecting = false;

function redirectToRateLimitPage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (redirecting || window.location.pathname === RATE_LIMIT_PATH) {
    return;
  }

  redirecting = true;
  window.location.assign(RATE_LIMIT_PATH);
}

export function attachRateLimitInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 429) {
        redirectToRateLimitPage();
      }

      return Promise.reject(error);
    }
  );
}
