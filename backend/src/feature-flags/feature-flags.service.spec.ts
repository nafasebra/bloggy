import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
  const originalEnv = process.env;
  let fetchMock: jest.SpyInstance;
  let service: FeatureFlagsService;

  beforeEach(() => {
    process.env = { ...originalEnv, FLIPT_URL: 'http://flipt:8080' };
    delete process.env.FLIPT_TOKEN;
    fetchMock = jest.spyOn(global, 'fetch');
    service = new FeatureFlagsService();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('evaluates the allowlisted flag and coalesces concurrent requests', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ enabled: true }))
    );
    const [first, second] = await Promise.all([
      service.getPublicFlags(),
      service.getPublicFlags(),
    ]);
    expect(first).toEqual({ flags: { 'test-feature': true }, source: 'flipt' });
    expect(second).toEqual(first);
    await service.getPublicFlags();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://flipt:8080/evaluate/v1/boolean',
      expect.objectContaining({
        body: JSON.stringify({
          environmentKey: process.env.FLIPT_ENVIRONMENT || 'default',
          namespaceKey: process.env.FLIPT_NAMESPACE || 'default',
          flagKey: 'test-feature',
          entityId: 'bloggy-demo',
          context: {},
        }),
      })
    );
  });

  it('preserves a deliberate off evaluation', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ enabled: false }))
    );
    expect(await service.getPublicFlags()).toEqual({
      flags: { 'test-feature': false },
      source: 'flipt',
    });
  });

  it.each([
    new Response('Unavailable', { status: 503 }),
    new Response('{}'),
    new Response('not json'),
  ])('fails closed for unsuccessful or malformed responses', async response => {
    fetchMock.mockResolvedValue(response);
    expect(await service.getPublicFlags()).toEqual({
      flags: { 'test-feature': false },
      source: 'fallback',
    });
  });

  it('fails closed for timeouts and retries after the fallback cache expires', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Timeout'));
    expect((await service.getPublicFlags()).source).toBe('fallback');
    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 6000);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ enabled: true }))
    );
    expect((await service.getPublicFlags()).flags['test-feature']).toBe(true);
  });

  it('does not call Flipt when the URL is empty', async () => {
    process.env.FLIPT_URL = '';
    expect((await service.getPublicFlags()).flags['test-feature']).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps authentication tokens in server-to-server requests', async () => {
    process.env.FLIPT_TOKEN = 'test-only-token';
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ enabled: true }))
    );
    const result = await service.getPublicFlags();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-only-token',
        },
      })
    );
    expect(JSON.stringify(result)).not.toContain('test-only-token');
  });
});
