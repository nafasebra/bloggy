import { avatarUploadOptions } from './avatar-upload.config';

describe('avatarUploadOptions', () => {
  const fileFilter = avatarUploadOptions.fileFilter as (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
  ) => void;

  it('accepts allowed image mime types', () => {
    const cb = jest.fn();

    fileFilter(
      {} as Express.Request,
      { mimetype: 'image/png' } as Express.Multer.File,
      cb
    );

    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('rejects unsupported mime types', () => {
    const cb = jest.fn();

    fileFilter(
      {} as Express.Request,
      { mimetype: 'application/pdf' } as Express.Multer.File,
      cb
    );

    expect(cb).toHaveBeenCalledWith(expect.any(Error), false);
  });

  it('limits upload size to 5MB', () => {
    expect(avatarUploadOptions.limits).toEqual({ fileSize: 5 * 1024 * 1024 });
  });
});
