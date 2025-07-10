import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from '../config/database.config';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri || '', {
      ...databaseConfig,
    }),
  ],
})
export class DatabaseModule {}
