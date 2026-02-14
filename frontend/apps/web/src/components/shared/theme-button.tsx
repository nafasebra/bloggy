'use client';

import { ThemeToggle } from '@repo/ui/theme-toggle';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return <ThemeToggle theme={theme} onToggle={toggleTheme} />;
}
