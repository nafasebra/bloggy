import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { AvatarStorage } from './avatar-storage';

@Injectable()
export class MinioAvatarStorage extends AvatarStorage {
  private readonly client: Client;
  private readonly bucket: string;
  private ready?: Promise<void>;
  private readonly logger = new Logger(MinioAvatarStorage.name);

  constructor(config: ConfigService) {
    super();
    const endpoint = new URL(config.getOrThrow<string>('MINIO_ENDPOINT'));
    if (
      !['http:', 'https:'].includes(endpoint.protocol) ||
      endpoint.pathname !== '/' ||
      endpoint.username ||
      endpoint.password ||
      endpoint.search ||
      endpoint.hash
    ) {
      throw new Error(
        'MINIO_ENDPOINT must be an HTTP(S) origin without credentials or a path'
      );
    }
    this.bucket = config.get<string>('MINIO_BUCKET', 'profile-photos');
    this.client = new Client({
      endPoint: endpoint.hostname,
      port: Number(
        endpoint.port || (endpoint.protocol === 'https:' ? 443 : 80)
      ),
      useSSL: endpoint.protocol === 'https:',
      accessKey: config.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: config.getOrThrow<string>('MINIO_SECRET_KEY'),
      region: config.get<string>('MINIO_REGION', 'us-east-1'),
    });
  }

  private async ensureBucket() {
    this.ready ??= (async () => {
      if (!(await this.client.bucketExists(this.bucket))) {
        try {
          await this.client.makeBucket(this.bucket);
        } catch (error) {
          // Another backend replica may have created it concurrently.
          if ((error as { code?: string }).code !== 'BucketAlreadyOwnedByYou')
            throw error;
        }
      }
    })().catch((error: unknown) => {
      this.ready = undefined;
      throw error;
    });
    await this.ready;
  }

  async put(key: string, data: Buffer, contentType: string): Promise<void> {
    try {
      await this.ensureBucket();
      await this.client.putObject(this.bucket, key, data, data.length, {
        'Content-Type': contentType,
      });
    } catch {
      this.logger.error('Could not upload profile photo to MinIO');
      throw new ServiceUnavailableException(
        'Photo storage is temporarily unavailable'
      );
    }
  }

  async get(key: string) {
    try {
      return await this.client.getObject(this.bucket, key);
    } catch (error) {
      if (
        ['NoSuchKey', 'NoSuchBucket', 'NotFound'].includes(
          (error as { code?: string }).code || ''
        )
      ) {
        throw new NotFoundException('Profile photo not found');
      }
      throw new ServiceUnavailableException(
        'Photo storage is temporarily unavailable'
      );
    }
  }

  async remove(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }
}
