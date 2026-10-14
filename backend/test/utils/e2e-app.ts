import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../../src/app.module';
import { createSqliteDataSource } from './sqlite-data-source';

export async function createE2eApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DataSource)
    .useFactory({ factory: createSqliteDataSource })
    .compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  await app.init();
  return app;
}

export async function closeE2eApp(app: INestApplication): Promise<void> {
  await app.close();
}

export async function clearDatabase(app: INestApplication): Promise<void> {
  const source = app.get(DataSource);
  if (source.options.type !== 'sqljs')
    throw new Error('Refusing to clear a non-SQLite test database');
  await source.synchronize(true);
}
