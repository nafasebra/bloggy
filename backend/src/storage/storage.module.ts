import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AvatarStorage } from './avatar-storage';
import { MinioAvatarStorage } from './minio-avatar-storage';
import { AvatarController } from './avatar.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AvatarController],
  providers: [{ provide: AvatarStorage, useClass: MinioAvatarStorage }],
  exports: [AvatarStorage],
})
export class StorageModule {}
