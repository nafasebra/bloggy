import {
  BadRequestException,
  FileTypeValidator,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { writeFile, unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';
import {
  AVATAR_UPLOAD_DIR,
  ensureAvatarUploadDir,
} from './avatar-upload.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.save(
      this.userRepository.create(dto)
    );
    delete (user as Partial<User>).password;
    return user;
  }
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ _id: id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    return this.userRepository.save(
      this.userRepository.merge(user, dto, { isNew: false })
    );
  }
  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete({ _id: id });
    return user;
  }

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<User> {
    const extensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    const extension = extensions[file.mimetype];
    if (
      !extension ||
      !file.buffer?.length ||
      file.buffer.length > 5 * 1024 * 1024 ||
      !(await new FileTypeValidator({ fileType: file.mimetype }).isValid(file))
    ) {
      throw new BadRequestException(
        'Upload a valid JPEG, PNG, GIF, or WebP image (max 5MB)'
      );
    }
    const user = await this.findOne(id);
    const previousAvatar = user.avatar;
    const filename = `${id}-${randomUUID()}${extension}`;
    const diskPath = join(AVATAR_UPLOAD_DIR, filename);
    ensureAvatarUploadDir();
    await writeFile(diskPath, file.buffer, { flag: 'wx' });
    let updated: User;
    try {
      updated = await this.update(id, {
        avatar: `/uploads/avatars/${filename}`,
      });
    } catch (error) {
      await unlink(diskPath).catch(() => undefined);
      throw error;
    }
    await this.deleteAvatarFile(id, previousAvatar);
    return updated;
  }

  async removeAvatar(id: string): Promise<User> {
    const user = await this.findOne(id);
    const previousAvatar = user.avatar;
    const updated = await this.update(id, { avatar: '' });
    await this.deleteAvatarFile(id, previousAvatar);
    return updated;
  }

  private async deleteAvatarFile(id: string, previousAvatar?: string) {
    // Only remove files in our avatar directory; never follow arbitrary paths.
    const prefix = '/uploads/avatars/';
    if (previousAvatar?.startsWith(prefix)) {
      const oldName = previousAvatar.slice(prefix.length);
      if (
        oldName.startsWith(`${id}-`) &&
        oldName === basename(oldName) &&
        !oldName.includes('\\')
      ) {
        await unlink(join(AVATAR_UPLOAD_DIR, oldName)).catch(
          (error: NodeJS.ErrnoException) => {
            if (error.code !== 'ENOENT')
              this.logger.warn('Could not remove the previous avatar');
          }
        );
      }
    }
  }
}
