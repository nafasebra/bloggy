import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../../src/app.module';

export async function createE2eApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

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
  const schema = process.env.DATABASE_SCHEMA;
  if (!schema || !/^bloggy_e2e_[a-f0-9]{32}$/.test(schema))
    throw new Error('Refusing to clear a non-test schema');
  const source = app.get(DataSource);
  const tables = source.entityMetadatas.map(
    entity => '"' + schema + '"."' + entity.tableName + '"'
  );
  await source.query('TRUNCATE TABLE ' + tables.join(', ') + ' CASCADE');
}
