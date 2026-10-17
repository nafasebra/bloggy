export const avatarFilters = [
  { key: 'none', label: 'Original' },
  { key: 'grayscale', label: 'Grayscale' },
  { key: 'sepia', label: 'Sepia' },
  { key: 'warm', label: 'Warm' },
  { key: 'cool', label: 'Cool' },
] as const;

export type AvatarFilter = (typeof avatarFilters)[number]['key'];

/** Applies a filter in place, preserving transparency. Always use fresh pixels. */
export function applyAvatarFilter(
  pixels: Uint8ClampedArray,
  filter: AvatarFilter
): void {
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]!;
    const g = pixels[i + 1]!;
    const b = pixels[i + 2]!;
    switch (filter) {
      case 'grayscale': {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
        break;
      }
      case 'sepia':
        pixels[i] = 0.393 * r + 0.769 * g + 0.189 * b;
        pixels[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
        pixels[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
        break;
      case 'warm':
        pixels[i] = r * 1.1;
        pixels[i + 2] = b * 0.9;
        break;
      case 'cool':
        pixels[i] = r * 0.9;
        pixels[i + 2] = b * 1.1;
        break;
    }
  }
}
