import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { FeatureFlagsModule } from '../src/feature-flags/feature-flags.module';
import { FeatureFlagsService } from '../src/feature-flags/feature-flags.service';

describe('Public feature flags (HTTP)', () => {
  let app: INestApplication;
  const getPublicFlags = jest.fn();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [FeatureFlagsModule],
    })
      .overrideProvider(FeatureFlagsService)
      .useValue({ getPublicFlags })
      .compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('exposes only the public evaluation without requiring login', async () => {
    getPublicFlags.mockResolvedValue({
      flags: { 'test-feature': true },
      source: 'flipt',
    });
    await request(app.getHttpServer() as App)
      .get('/feature-flags')
      .expect(200)
      .expect('Cache-Control', 'no-store')
      .expect({ flags: { 'test-feature': true }, source: 'flipt' });
  });

  it('serves an off fallback without making the application unavailable', async () => {
    getPublicFlags.mockResolvedValue({
      flags: { 'test-feature': false },
      source: 'fallback',
    });
    await request(app.getHttpServer() as App)
      .get('/feature-flags')
      .expect(200)
      .expect({ flags: { 'test-feature': false }, source: 'fallback' });
  });
});
