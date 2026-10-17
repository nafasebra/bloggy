'use client';

import type { AxiosInstance } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { defaultFlags, getFeatureFlags, type FeatureFlagKey } from './index';

export function useFeatureFlag(
  key: FeatureFlagKey,
  client: AxiosInstance
): boolean {
  const { data, isError } = useQuery({
    queryKey: ['feature-flags', client.defaults.baseURL ?? ''],
    queryFn: () => getFeatureFlags(client),
    staleTime: 5000,
    refetchInterval: 15_000,
    retry: false,
  });
  // Fail closed during loading or transport errors, including a failed refetch.
  return isError ? defaultFlags[key] : (data?.[key] ?? defaultFlags[key]);
}

export function TestFeatureBanner({ client }: { client: AxiosInstance }) {
  const enabled = useFeatureFlag('test-feature', client);
  if (!enabled) return null;
  return (
    <aside
      role="status"
      className="border-b border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm text-blue-900"
    >
      The test feature is enabled.
    </aside>
  );
}
