import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { Menu, X, LayoutDashboard, FileText, PlusCircle, Users } from 'lucide-react';
import { Button } from '@repo/ui/button';

const items = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Posts', href: '/posts', icon: FileText },
  { title: 'Create Post', href: '/posts/create', icon: PlusCircle },
  { title: 'Users', href: '/users', icon: Users },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-card border-border shadow-md"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>
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
      >
        <div className="flex h-16 items-center border-b border-border px-6">
          <h2 className="text-lg font-semibold text-foreground">Admin</h2>
        </div>
        <nav className="flex-1 space-y-0.5 p-4 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
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
