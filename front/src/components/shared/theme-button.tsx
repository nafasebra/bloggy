import React from 'react';
import { Button } from '../ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="outline">
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  );
}

export default ThemeButton;
