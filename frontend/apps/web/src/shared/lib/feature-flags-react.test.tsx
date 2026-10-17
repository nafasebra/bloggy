import { expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TestFeatureBanner } from '@repo/feature-flags/react';
import http from '@repo/http-client/web';

it.each([true, false, undefined])(
  'uses the app query provider and renders only enabled flags (%s)',
  (enabled) => {
    const queryClient = new QueryClient();
    if (enabled !== undefined) {
      queryClient.setQueryData(['feature-flags', http.defaults.baseURL ?? ''], {
        'test-feature': enabled,
      });
    }
    const html = renderToString(
      <QueryClientProvider client={queryClient}>
        <TestFeatureBanner client={http} />
      </QueryClientProvider>
    );
    if (enabled === true)
      expect(html).toContain('The test feature is enabled.');
    else expect(html).toBe('');
    queryClient.clear();
  }
);
