import type { INestApplication } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

const swaggerCsp = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https://validator.swagger.io'],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", 'https:', 'data:'],
  },
});

const apiCsp = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'none'"],
    frameAncestors: ["'none'"],
    baseUri: ["'none'"],
    formAction: ["'none'"],
  },
});

function isSwaggerPath(path: string): boolean {
  return path === '/api' || path.startsWith('/api/');
}

export function configureSecurityHeaders(app: INestApplication): void {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (isSwaggerPath(req.path)) {
      return swaggerCsp(req, res, next);
    }
    return apiCsp(req, res, next);
  });
}
