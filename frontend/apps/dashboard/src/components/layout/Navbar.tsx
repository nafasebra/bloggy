import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { ThemeToggle } from '@repo/ui/theme-toggle';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const handleToggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-card shadow-sm px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight">Bloggy Dashboard</h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle theme={theme} onToggle={handleToggle} />
          <Button type="button" variant="ghost" size="icon" aria-label="User profile">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
