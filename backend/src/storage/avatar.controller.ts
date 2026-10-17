import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AVATAR_KEY_PATTERN, AvatarStorage } from './avatar-storage';

@ApiTags('Profile photos')
@Controller('uploads/avatars')
export class AvatarController {
  constructor(private readonly storage: AvatarStorage) {}

  @Get(':key')
  @Header('Cache-Control', 'public, max-age=86400')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  @ApiOperation({ summary: 'View a profile photo stored in MinIO' })
  async get(@Param('key') key: string) {
    if (!AVATAR_KEY_PATTERN.test(key))
      throw new NotFoundException('Profile photo not found');
    const types = {
      jpg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    return new StreamableFile(await this.storage.get(key), {
      type: types[key.split('.').pop()!] as string,
      disposition: 'inline',
    });
  }
}
