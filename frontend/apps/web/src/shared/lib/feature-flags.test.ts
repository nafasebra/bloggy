import { describe, expect, it } from 'vitest';
import axios from 'axios';
import { defaultFlags, getFeatureFlags } from '@repo/feature-flags';

function clientWith(data: unknown) {
  return axios.create({
    adapter: async (config) => ({
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }),
  });
}

describe('feature flag client', () => {
  it('defaults to off', () => {
    expect(defaultFlags['test-feature']).toBe(false);
  });

  it('reads only allowlisted boolean evaluations', async () => {
    expect(
      await getFeatureFlags(
        clientWith({ flags: { 'test-feature': true, privateFlag: true } })
      )
    ).toEqual({ 'test-feature': true });
    expect(
      await getFeatureFlags(clientWith({ flags: { 'test-feature': false } }))
    ).toEqual({ 'test-feature': false });
  });

  it('rejects malformed responses so the hook can use safe defaults', async () => {
    await expect(
      getFeatureFlags(clientWith({ flags: { 'test-feature': 'true' } }))
    ).rejects.toThrow('Invalid feature flag response');
  });
});
