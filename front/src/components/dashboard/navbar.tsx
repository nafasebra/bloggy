'use client';

import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, User } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 ml-0 lg:ml-0">
          <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white ml-12 lg:ml-0">
            Bloggy Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
            )}
          </button>
          <button
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="User profile"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
