'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Posts',
    href: '/dashboard/posts',
  },
  {
    title: 'Create Post',
    href: '/dashboard/posts/create',
  },
  {
    title: 'Users',
    href: '/dashboard/users',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Admin Dashboard
        </h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
