import { Injectable, Logger } from '@nestjs/common';

export interface FeatureFlagsResult {
  flags: { 'test-feature': boolean };
  source: 'flipt' | 'fallback';
}

@Injectable()
export class FeatureFlagsService {
  private readonly logger = new Logger(FeatureFlagsService.name);
  private cached?: { result: FeatureFlagsResult; expiresAt: number };
  private pending?: Promise<FeatureFlagsResult>;

  // Global demonstration flag only. Add authenticated evaluation context before
  // introducing per-user targeting; never accept trusted attributes from clients.
  getPublicFlags(): Promise<FeatureFlagsResult> {
    if (this.cached && this.cached.expiresAt > Date.now()) {
      return Promise.resolve(this.cached.result);
    }
    if (this.pending) return this.pending;
    this.pending = this.evaluate()
      .then(result => {
        this.cached = { result, expiresAt: Date.now() + 5000 };
        return result;
      })
      .finally(() => {
        this.pending = undefined;
      });
    return this.pending;
  }

  private async evaluate(): Promise<FeatureFlagsResult> {
    const fallback: FeatureFlagsResult = {
      flags: { 'test-feature': false },
      source: 'fallback',
    };
    if (!process.env.FLIPT_URL) return fallback;
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (process.env.FLIPT_TOKEN)
        headers.Authorization = `Bearer ${process.env.FLIPT_TOKEN}`;
      const response = await fetch(
        `${process.env.FLIPT_URL.replace(/\/+$/, '')}/evaluate/v1/boolean`,
        {
          method: 'POST',
          headers,
          signal: AbortSignal.timeout(1500),
          body: JSON.stringify({
            environmentKey: process.env.FLIPT_ENVIRONMENT || 'default',
            namespaceKey: process.env.FLIPT_NAMESPACE || 'default',
            flagKey: 'test-feature',
            entityId: 'bloggy-demo',
            context: {},
          }),
        }
      );
      if (!response.ok) throw new Error('Flag evaluation failed');
      const result = (await response.json()) as { enabled?: unknown };
      if (typeof result.enabled !== 'boolean')
        throw new Error('Invalid flag response');
      return { flags: { 'test-feature': result.enabled }, source: 'flipt' };
    } catch {
      this.logger.warn(
        'Flipt evaluation unavailable; using safe flag defaults.'
      );
      return fallback;
    }
  }
}
