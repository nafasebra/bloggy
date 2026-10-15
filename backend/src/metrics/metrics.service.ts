import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createServer, Server } from 'node:http';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from '@prometheus-io/client';

@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
  readonly registry = new Registry();
  private server?: Server;
  private readonly requests = new Counter({
    name: 'bloggy_http_requests_total',
    help: 'Completed HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [this.registry],
  });
  private readonly duration = new Histogram({
    name: 'bloggy_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [this.registry],
  });

  async onModuleInit() {
    if (process.env.METRICS_ENABLED !== 'true') return;
    collectDefaultMetrics({ register: this.registry, prefix: 'bloggy_' });
    const port = Number(process.env.METRICS_PORT || 9464);
    if (!Number.isInteger(port) || port < 1 || port > 65535)
      throw new Error('METRICS_PORT must be a valid port');
    this.server = createServer((request, response) => {
      if (request.method !== 'GET' || request.url !== '/metrics') {
        response.writeHead(404).end();
        return;
      }
      this.registry
        .metrics()
        .then(body => {
          response.writeHead(200, {
            'Content-Type': this.registry.contentType,
          });
          response.end(body);
        })
        .catch(() => response.writeHead(500).end());
    });
    const server = this.server;
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(port, '0.0.0.0', resolve);
    });
  }

  observe(method: string, route: string, statusCode: number, seconds: number) {
    const labels = { method, route, status_code: String(statusCode) };
    this.requests.inc(labels);
    this.duration.observe(labels, seconds);
  }

  async onModuleDestroy() {
    const server = this.server;
    if (server?.listening)
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      );
    this.registry.clear();
  }
}
