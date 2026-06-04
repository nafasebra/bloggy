import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

export const AVATAR_UPLOAD_DIR = join(process.cwd(), 'uploads', 'avatars');

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

export function ensureAvatarUploadDir() {
  if (!existsSync(AVATAR_UPLOAD_DIR)) {
    mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
  }
}

export const avatarUploadOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      ensureAvatarUploadDir();
      cb(null, AVATAR_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const userId = req.params.id;
      const ext = extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `${userId}-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
  ) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'), false);
      return;
    }
    cb(null, true);
  },
};
