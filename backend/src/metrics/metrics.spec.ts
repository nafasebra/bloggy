import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { MetricsModule } from './metrics.module';
import { MetricsService } from './metrics.service';

@Controller('items')
class ItemsController {
  @Get(':id')
  getItem() {
    return { ok: true };
  }
}

describe('HTTP metrics', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [MetricsModule],
      controllers: [ItemsController],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  it('groups IDs by route template and records status and duration', async () => {
    await request(app.getHttpServer())
      .get('/items/first?secret=hidden')
      .expect(200);
    await request(app.getHttpServer()).get('/items/second').expect(200);
    await request(app.getHttpServer()).get('/unknown-id').expect(404);
    const metrics = await app.get(MetricsService).registry.metrics();
    expect(metrics).toMatch(
      /bloggy_http_requests_total\{method="GET",route="\/items\/:id",status_code="200"\} 2/
    );
    expect(metrics).toContain('bloggy_http_request_duration_seconds_bucket');
    expect(metrics).toContain('route="unmatched",status_code="404"');
    expect(metrics).not.toMatch(/\/items\/(?:first|second)|hidden|unknown-id/);
  });
});
