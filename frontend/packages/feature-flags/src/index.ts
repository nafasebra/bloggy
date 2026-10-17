import type { AxiosInstance } from 'axios';

export const defaultFlags = { 'test-feature': false } as const;
export type FeatureFlagKey = keyof typeof defaultFlags;
export type FeatureFlags = Record<FeatureFlagKey, boolean>;

/** Reads only the public evaluations exposed by Bloggy, never Flipt management. */
export async function getFeatureFlags(
  client: AxiosInstance
): Promise<FeatureFlags> {
  const { data } = await client.get<{ flags?: Record<string, unknown> }>(
    '/feature-flags'
  );
  if (typeof data?.flags?.['test-feature'] !== 'boolean') {
    throw new Error('Invalid feature flag response');
  }
  return { 'test-feature': data.flags['test-feature'] };
}
