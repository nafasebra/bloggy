import { describe, expect, it } from 'vitest';
import { getReadTime } from '@repo/shared';
import { cn } from '@repo/ui/utils';

describe('getReadTime', () => {
  it('returns 1 minute for empty or whitespace-only text', () => {
    expect(getReadTime('')).toBe(1);
    expect(getReadTime('   ')).toBe(1);
  });

  it('returns 1 minute for up to 200 words', () => {
    const text = Array.from({ length: 200 }, () => 'word').join(' ');
    expect(getReadTime(text)).toBe(1);
  });

  it('returns 2 minutes for 201 words', () => {
    const text = Array.from({ length: 201 }, () => 'word').join(' ');
    expect(getReadTime(text)).toBe(2);
  });

  it('rounds up partial minutes', () => {
    expect(getReadTime('one two three')).toBe(1);
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('handles conditional classes', () => {
    const isHidden = false;
    expect(cn('base', isHidden && 'hidden', 'extra')).toBe('base extra');
  });
});
