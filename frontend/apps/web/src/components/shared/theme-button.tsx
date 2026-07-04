'use client';

import { ThemeToggle } from '@repo/ui/theme-toggle';
import { useTheme } from '@wrksz/themes/client';

export default function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () =>
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  return (
    <ThemeToggle
      theme={resolvedTheme as 'light' | 'dark'}
      onToggle={toggleTheme}
    />
  );
}
