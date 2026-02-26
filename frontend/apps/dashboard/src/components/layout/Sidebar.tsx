import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { Menu, X, LayoutDashboard, FileText, Users } from 'lucide-react';
import { Button } from '@repo/ui/button';

const items = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Posts', href: '/posts', icon: FileText },
  { title: 'Users', href: '/users', icon: Users },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile open button (hamburger) */}
      {!mobileOpen && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-card border-border shadow-md"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="w-6 h-6" />
        </Button>
      )}

      {/* Backdrop when sidebar is open on mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-300 shadow-lg lg:shadow-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-hidden={!mobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <h2 className="text-lg font-semibold text-foreground">Admin</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-0.5 p-4 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
