import { useState, useEffect } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { ThemeToggle } from '@repo/ui/theme-toggle';
import { useAuth } from '@/contexts/auth-provider';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const stored = window.localStorage.getItem('dashboard-theme');
    let initial: 'light' | 'dark';

    if (stored === 'light' || stored === 'dark') {
      initial = stored;
    } else {
      const isDark = document.documentElement.classList.contains('dark');
      initial = isDark ? 'dark' : 'light';
    }

    setTheme(initial);
    if (initial === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleToggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (next === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      window.localStorage.setItem('dashboard-theme', next);
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-card shadow-sm px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight">Bloggy Dashboard</h1>
        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[140px]">
              {user.name || user.username}
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <ThemeToggle theme={theme} onToggle={handleToggle} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isLoggingOut}
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isLoggingOut ? 'Signing out...' : 'Log out'}
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
