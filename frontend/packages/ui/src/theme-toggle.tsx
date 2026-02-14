'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

export type ThemeValue = 'light' | 'dark';

export interface ThemeToggleProps {
  theme?: ThemeValue;
  onToggle?: () => void;
  className?: string;
  'aria-label'?: string;
}

export function ThemeToggle({
  theme = 'light',
  onToggle,
  className,
  'aria-label': ariaLabel = 'Toggle theme',
}: ThemeToggleProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      className={cn(className)}
      aria-label={ariaLabel}
    >
      {theme === 'light' ? (
        <Moon className="size-4" aria-hidden />
      ) : (
        <Sun className="size-4" aria-hidden />
      )}
    </Button>
  );
}
