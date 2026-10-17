import { expect, it } from 'vitest';
import { applyAvatarFilter } from './avatar-filters';

it('keeps original pixels and transparency unchanged', () => {
  const pixels = new Uint8ClampedArray([100, 150, 200, 80]);
  applyAvatarFilter(pixels, 'none');
  expect([...pixels]).toEqual([100, 150, 200, 80]);
});

it('converts RGB to grayscale while preserving alpha', () => {
  const pixels = new Uint8ClampedArray([100, 150, 200, 80]);
  applyAvatarFilter(pixels, 'grayscale');
  expect([...pixels]).toEqual([141, 141, 141, 80]);
});

it('applies sepia and clamps channels to the valid range', () => {
  const pixels = new Uint8ClampedArray([255, 255, 255, 255]);
  applyAvatarFilter(pixels, 'sepia');
  expect([...pixels]).toEqual([255, 255, 239, 255]);
});

it('adjusts warm and cool tones without modifying alpha or green', () => {
  const warm = new Uint8ClampedArray([100, 150, 200, 80]);
  const cool = new Uint8ClampedArray(warm);
  applyAvatarFilter(warm, 'warm');
  applyAvatarFilter(cool, 'cool');
  expect([...warm]).toEqual([110, 150, 180, 80]);
  expect([...cool]).toEqual([90, 150, 220, 80]);
});
