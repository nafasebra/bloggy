import { describe, expect, it, vi } from 'vitest';
import { exportAvatarCrop, getAvatarCrop } from './crop-avatar';

describe('avatar cropping', () => {
  it('centers a square crop for landscape and portrait photos', () => {
    expect(getAvatarCrop(800, 400, 1, 0.5, 0.5)).toEqual({
      x: 200,
      y: 0,
      size: 400,
    });
    expect(getAvatarCrop(400, 800, 1, 0.5, 0.5)).toEqual({
      x: 0,
      y: 200,
      size: 400,
    });
  });

  it('zooms and repositions without going outside the source image', () => {
    expect(getAvatarCrop(800, 400, 2, 1, 1)).toEqual({
      x: 600,
      y: 200,
      size: 200,
    });
    expect(getAvatarCrop(400, 400, 0, -1, 2)).toEqual({
      x: 0,
      y: 0,
      size: 400,
    });
    expect(getAvatarCrop(600, 600, 10, 0.5, 0.5)).toEqual({
      x: 200,
      y: 200,
      size: 200,
    });
  });

  it('exports a PNG file accepted by the upload endpoint', async () => {
    const toBlob = vi.fn((callback: BlobCallback) =>
      callback(new Blob(['cropped'], { type: 'image/png' }))
    );
    const file = await exportAvatarCrop(
      { toBlob } as unknown as HTMLCanvasElement,
      'portrait.jpeg'
    );
    expect(file.name).toBe('portrait-cropped.png');
    expect(file.type).toBe('image/png');
    expect(await file.text()).toBe('cropped');
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
  });

  it('reports export failure instead of returning an empty file', async () => {
    const canvas = {
      toBlob: (callback: BlobCallback) => callback(null),
    } as HTMLCanvasElement;
    await expect(exportAvatarCrop(canvas, 'photo.png')).rejects.toThrow(
      'Could not crop'
    );
  });
});
