import {
  Injectable,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: MetricsService) {}

  use(request: Request, response: Response, next: NextFunction) {
    const start = process.hrtime.bigint();
    response.once('finish', () => {
      // Route templates prevent IDs, queries, or unknown paths from creating unbounded series.
      const route =
        typeof request.route?.path === 'string'
          ? request.route.path
          : 'unmatched';
      this.metrics.observe(
        request.method,
        route,
        response.statusCode,
        Number(process.hrtime.bigint() - start) / 1e9
      );
    });
    next();
  }
}

@Module({ providers: [MetricsService], exports: [MetricsService] })
export class MetricsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes('*');
  }
}
