/** Positions are normalized from 0 (left/top) to 1 (right/bottom). */
export function getAvatarCrop(
  width: number,
  height: number,
  zoom: number,
  x: number,
  y: number
) {
  const size = Math.min(width, height) / Math.max(1, Math.min(3, zoom));
  return {
    x: (width - size) * Math.max(0, Math.min(1, x)),
    y: (height - size) * Math.max(0, Math.min(1, y)),
    size,
  };
}

export async function exportAvatarCrop(
  canvas: HTMLCanvasElement,
  name: string
): Promise<File> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error('Could not crop this photo.')),
      'image/png'
    );
  });
  return new File(
    [blob],
    `${name.replace(/\.[^.]+$/, '') || 'avatar'}-cropped.png`,
    { type: 'image/png' }
  );
}
